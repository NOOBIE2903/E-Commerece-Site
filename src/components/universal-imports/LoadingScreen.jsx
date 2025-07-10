import React from "react";

const LoadingScreen = () => {
  return (
    <div className="px-10 py-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Our Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="rounded-lg shadow-md bg-white">
            <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg"></div>
            <div className="p-4 text-center">
              <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;