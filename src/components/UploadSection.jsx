import React, { useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Toast from './Toast';
import '@tensorflow/tfjs';

export default function UploadSection({ darkMode }) {
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef();
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImage(imgUrl);
      setPredictions([]);
      setToastMessage(null);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setPredictions([]);
    fileInputRef.current.value = '';
    setToastMessage(null);
  };

  const handleClassify = async () => {
    setLoading(true);
    const model = await cocoSsd.load();
    const img = imageRef.current;
    const results = await model.detect(img);

    setPredictions(results);

    if (results.length > 0) {
      const msg = `Detected: ${results[0].class} (${(results[0].score * 100).toFixed(0)}%)`;
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 2000);
    }

    const stored = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    localStorage.setItem('predictionHistory', JSON.stringify([
      ...stored,
      {
        type: 'upload',
        date: new Date().toISOString(),
        predictions: results
      }
    ]));

    setTimeout(() => setPredictions([]), 5000);
    setLoading(false);
  };

  return (
    <div className={`w-full max-w-xl mx-auto p-4 rounded-lg relative ${darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100'} shadow`}>
      {/* Toast at the top center */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <Toast message={toastMessage} />
        </div>
      )}

      <h2 className="font-bold text-xl mb-3 text-center">Upload Image</h2>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-sm text-gray-700 mb-3"
      />

      {image && (
        <div className="relative w-full flex justify-center">
          <img
            ref={imageRef}
            src={image}
            alt="Preview"
            className="max-h-72 w-full object-contain rounded"
            crossOrigin="anonymous"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {image && (
          <>
            <button
              onClick={handleClassify}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? 'Classifying...' : 'Classify'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
