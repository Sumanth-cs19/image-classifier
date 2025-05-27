import React, { useRef, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import Toast from './Toast';
import '@tensorflow/tfjs';

export default function WebcamSection({ darkMode }) {
  const videoRef = useRef();
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const startWebcam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setStreaming(true);
  };

  const stopWebcam = () => {
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setStreaming(false);
  };

  const handleClassify = async () => {
    setLoading(true);
    const model = await cocoSsd.load();
    const predictions = await model.detect(videoRef.current);
    
    setToastMessage(`Detected: ${predictions[0]?.class || 'unknown'} (${Math.round((predictions[0]?.score || 0) * 100)}%)`);
    setTimeout(() => setToastMessage(null), 2000);
    // Store to history
    const stored = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
    localStorage.setItem('predictionHistory', JSON.stringify([...stored, {
      type: 'webcam',
      date: new Date().toISOString(),
      predictions
    }]));

    // Format toast message
    if (predictions.length === 0) {
      setToast("No objects detected.");
    } else {
      const message = predictions
        .map(pred => `${pred.class} (${Math.round(pred.score * 100)}%)`)
        .join(', ');
      setToast(`Detected: ${message}`);
    }

    setTimeout(() => setToast(''), 4000);
    setLoading(false);
  };

  return (
    <div className={`p-4 rounded-lg relative ${darkMode ? 'bg-green-900 text-white' : 'bg-green-100'}`}>
      {toastMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <Toast message={toastMessage} />
        </div>
      )}
      <h2 className="font-bold text-xl mb-3 text-center">Webcam</h2>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded max-h-64"
          width="640"
          height="480"
        />
      </div>
      <div className="mt-4 flex gap-2">
        {!streaming ? (
          <button
            onClick={startWebcam}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Start Webcam
          </button>
        ) : (
          <>
            <button
              onClick={handleClassify}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? 'Classifying...' : 'Classify'}
            </button>
            <button
              onClick={stopWebcam}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Stop Webcam
            </button>
          </>
        )}
      </div>

      {/* {toast && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg z-50 text-sm">
          {toast}
        </div>
      )} */}
      {/* {toastMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50">
          <Toast message={toastMessage} />
        </div>
      )} */}
    </div>
  );
}
