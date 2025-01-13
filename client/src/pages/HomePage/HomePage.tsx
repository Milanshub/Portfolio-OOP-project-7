import React from 'react';

export const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="m-8 space-y-4 bg-gray-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-red-600">
          Welcome to My Portfolio
        </h1>
        <p className="text-lg text-red-600">
          React is working yes! 🚀
        </p>
      </div>
    </div>
  );
};