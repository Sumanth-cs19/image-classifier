import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const PredictionHistory = forwardRef((props, ref) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
    setHistory(storedHistory);
  }, []);

  const exportToCSV = () => {
    if (!history.length) return;

    const headers = ['Date', 'Type', 'Object', 'Confidence'];
    const rows = history.flatMap(entry =>
      entry.predictions.map(pred => [
        new Date(entry.date).toLocaleString(),
        entry.type,
        pred.class,
        (pred.score * 100).toFixed(2) + '%'
      ])
    );

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'prediction_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    localStorage.removeItem('predictionHistory');
    setHistory([]);
  };

  useImperativeHandle(ref, () => ({
    exportToCSV,
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Prediction History</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
          <button
            onClick={exportToCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to CSV
          </button>
          <button
            onClick={clearHistory}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Clear History
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="text-gray-500">No prediction history available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-200 dark:bg-gray-800 dark:text-white">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Object</th>
                <th className="px-4 py-2 border">Confidence</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) =>
                entry.predictions.map((pred, i) => (
                  <tr key={`${index}-${i}`} className="text-sm text-gray-800 dark:text-gray-200">
                    <td className="px-4 py-2 border">{new Date(entry.date).toLocaleString()}</td>
                    <td className="px-4 py-2 border capitalize">{entry.type}</td>
                    <td className="px-4 py-2 border">{pred.class}</td>
                    <td className="px-4 py-2 border">{(pred.score * 100).toFixed(2)}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default PredictionHistory;
