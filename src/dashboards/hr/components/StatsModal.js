import React, { useState } from "react";

const StatsModal = ({ isOpen, onClose, name }) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        {/* Close X button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
          aria-label="Close modal"
        >
          &#x2715;
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-4">Card Analytics - {name}</h2>

        {/* Tabs */}
        <div className="flex mb-4 border border-gray-200 rounded-md overflow-hidden">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === "overview"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("engagement")}
            className={`flex-1 py-2 text-center text-sm font-medium ${
              activeTab === "engagement"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Engagement
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="flex justify-between space-x-3 mb-6">
            <div className="flex-1 rounded-md p-3 text-center" style={{backgroundColor:'#17ae9e'}}>
              <div className="text-white font-semibold text-xl">3</div>
              <div className="text-white text-xs mt-1">Avg. Daily</div>
            </div>
            <div className="flex-1  rounded-md p-3 text-center" style={{backgroundColor:'#3b79e9'}}>
              <div className="text-white font-semibold text-xl">45</div>
              <div className="text-white text-xs mt-1">Monthly Scans</div>
            </div>
            <div className="flex-1  rounded-md p-3 text-center" style={{backgroundColor:'#ee6c10'}}>
              <div className="text-white font-semibold text-xl">128</div>
              <div className="text-white text-xs mt-1">Total Scans</div>
            </div>
          </div>
        )}

        


{activeTab === "engagement" && (
  <div className="space-y-6">
    {/* Device Types & Connection Status */}
    <div className="bg-white shadow rounded-md p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Engagement Insights</h3>
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Device Types</h4>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>iPhone</span>
            <span className="font-bold">35</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Android</span>
            <span className="font-bold">223</span>
          </div>
        </div>
        <div className="w-1/2">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Connection Status</h4>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Connected</span>
            <span className="font-bold">35</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>Scanned Only</span>
            <span className="font-bold">223</span>
          </div>
        </div>
      </div>
    </div>

    {/* Social Link Performance */}
    <div className="bg-white shadow rounded-md p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Social Link Performance</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center bg-blue-50 rounded-md p-3">
          <div className="flex items-center space-x-3">
            <img src="/images/Linkedin_new.png" alt="LinkedIn" className="w-6 h-6" />
            <div>
              <div className="text-sm font-medium text-gray-900">LinkedIn</div>
              <div className="text-xs text-gray-600">linkedin.com/in/victor-smith</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-blue-600">56</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-100 rounded-md p-3">
          <div className="flex items-center space-x-3">
            <img src="/images/Twitter_new.png" alt="Twitter" className="w-6 h-6" />
            <div>
              <div className="text-sm font-medium text-gray-900">Twitter</div>
              <div className="text-xs text-gray-600">@victor_design</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-semibold text-gray-900">6</div>
            <div className="text-xs text-gray-500">Clicks</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


        {/* Divider */}
        <hr className="border-gray-200 mb-4" />

        {/* Close Button */}
        <div className="flex justify-end">
        <button
          onClick={onClose}
          className=" bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition"
        >
          Close 
        </button>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;

