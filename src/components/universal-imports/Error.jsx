import React from "react";

const Error = ({ error, onRetry }) => {
  return (
    <div
      className="bg-red-100 border-l-4 border-red-600 p-4 mb-6 rounded"
      role="alert"
    >
      <p className="font-bold text-red-800">Error</p>
      <p className="text-red-700">{error}</p>
      <button 
        onClick={onRetry}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Retry
      </button>
    </div>
  );
};

export default Error;