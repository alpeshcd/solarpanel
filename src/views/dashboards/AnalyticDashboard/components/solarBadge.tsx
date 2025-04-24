import React from 'react';

const SolarLifecycleTracker = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-2xl font-semibold text-gray-800">Maharshi Textile</div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-green-600 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Normal
          </div>
          <div className="text-yellow-500 text-base">☀️ 40°C</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 items-center gap-12 mb-12">
        {/* Solar Panel */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-6 rounded-full shadow-lg">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path d="M2 6h20v2H2zM4 9h4v10H4zM10 9h4v10h-4zM16 9h4v10h-4z" fill="#3B82F6" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-700 mt-3">Solar Panel</div>
        </div>

        {/* Power Output */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-800 mb-2">101.4 kW</div>
          <div className="text-sm text-gray-500">Current Generation</div>
        </div>

        {/* Grid Side */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 p-6 rounded-full shadow-lg">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l4 20h-2l-1-5h-2l-1 5H8L12 2z" fill="#6B7280" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-700 mt-3">Grid</div>
        </div>
      </div>

      {/* Flow Arrows */}
      <div className="flex justify-center items-center mb-12">
        <div className="text-4xl text-gray-400 mx-8">➡️</div>
        <div className="text-xl font-medium text-gray-700">To House</div>
        <div className="text-4xl text-gray-400 mx-8">➡️</div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-10">
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <div className="text-gray-500 text-base mb-1">Yield Today (MWh)</div>
          <div className="text-4xl font-bold text-gray-800">3.9</div>
          <div className="text-sm text-gray-500 mt-1">Total: 380.4 MWh</div>
        </div>
        <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
          <div className="text-gray-500 text-base mb-1">Revenue Today (INR)</div>
          <div className="text-4xl font-bold text-gray-800">₹3,887.5</div>
          <div className="text-sm text-gray-500 mt-1">Total: ₹3,84,777.3</div>
        </div>
      </div>
    </div>
  );
};

export default SolarLifecycleTracker;
