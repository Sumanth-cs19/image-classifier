import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function Navbar({ darkMode, setDarkMode, showHome, setShowHome, onExport }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
      <div className="text-2xl font-bold">Smart Object Detector</div>
      <div className="flex items-center gap-4">
        <button onClick={() => setShowHome(true)}>Home</button>
        <button onClick={() => setShowHome(false)}>History</button>
        {/* <button onClick={onExport}>Export</button> */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
        </button>
      </div>
    </nav>
  );
}

