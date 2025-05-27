import PredictionHistory from './components/PredictionHistory';
import Navbar from './components/Navbar'; 
import UploadSection from './components/UploadSection';
import WebcamSection from './components/WebcamSection';
import React, { useRef, useState } from 'react';

function App() {
  const predictionHistoryRef = useRef();
  const [showHome, setShowHome] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleExport = () => {
    predictionHistoryRef.current?.exportToCSV?.();
  };

  return (
    <div className={darkMode ? 'dark bg-gray-900 min-h-screen overflow-y-auto' : 'bg-white min-h-screen overflow-y-auto'}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showHome={showHome}
        setShowHome={setShowHome}
        onExport={handleExport}
      />
      {showHome ? (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <UploadSection darkMode={darkMode} />
          <WebcamSection darkMode={darkMode} />
        </div>
      ) : (
        <div className="p-4">
          <PredictionHistory ref={predictionHistoryRef} />
        </div>
      )}
    </div>
  );
}

export default App;
