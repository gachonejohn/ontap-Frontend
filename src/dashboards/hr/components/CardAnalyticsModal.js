import React, { useState } from "react";

const CardAnalyticsModal = ({ isOpen, onClose, card }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!isOpen || !card) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">
            Card Analytics
          </h2>
          <button
    onClick={onClose}
    className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 4L4 12"
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4L12 12"
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden mb-6">
          <div 
            className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer border-r border-slate-100 ${activeTab === 'overview' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'}`}
            onClick={() => setActiveTab('overview')}
          >
            <div className="text-xs text-neutral-900 font-semibold tracking-wide">
              Overview
            </div>
          </div>
          <div 
            className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer border-r border-slate-100 ${activeTab === 'contacts' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'}`}
            onClick={() => setActiveTab('contacts')}
          >
            <div className="text-xs text-neutral-900 font-semibold tracking-wide">
              Contacts
            </div>
          </div>
          <div 
            className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer ${activeTab === 'engagements' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'}`}
            onClick={() => setActiveTab('engagements')}
          >
            <div className="text-xs text-neutral-900 font-semibold tracking-wide">
              Engagements
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6">
            {/* Stats Overview */}
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex justify-center items-center rounded-lg w-1/3 h-[70px] bg-green-400">
                <div className="flex flex-col justify-start items-center gap-0.5">
                  <div className="text-base text-white font-semibold">
                    {card?.scans || 245}
                  </div>
                  <div className="text-xs text-green-100 font-medium">
                    Total Scans
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center rounded-lg w-1/3 h-[70px] bg-blue-500">
                <div className="flex flex-col justify-start items-center gap-0.5">
                  <div className="text-base text-white font-semibold">
                    {card?.connections || 18}
                  </div>
                  <div className="text-xs text-green-100 font-medium">
                    Connections Made
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center rounded-lg w-1/3 h-[70px] bg-orange-500">
                <div className="flex flex-col justify-start items-center gap-0.5">
                  <div className="text-base text-white font-semibold">
                    60%
                  </div>
                  <div className="text-xs text-green-100 font-medium">
                    Conversion Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Scan Activity */}
            <div className="flex flex-col justify-center items-center rounded-xl w-full shadow bg-white p-6">
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div className="flex flex-row justify-center items-center gap-1">
                  <img
                    width="22px"
                    height="22px"
                    src="/images/analytics.png"
                    alt="Chart icon"
                  />
                  <div className="text-sm text-neutral-900 font-semibold">
                    Recent Scan Activity
                  </div>
                </div>

                {/* Connection List */}
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  {[
                    { name: "Michael Chen", title: "Startup.io • CEO", status: "Connected", date: "20/12/2024", avatar: "/images/profile1.png" },
                    { name: "Emily Rodriguez", title: "Design Studio • UX Designer", status: "Connected", date: "20/12/2024", avatar: "/images/profile2.png" },
                    { name: "James Wilson", title: "Wilson Consulting • Business Consultant", status: "Scanned Only", date: "20/12/2024", avatar: "/images/profile3.png" },
                    { name: "Lisa Park", title: "Media Group • Content Manager", status: "Connected", date: "20/12/2024", avatar: "/images/profile4.png" }
                  ].map((conn, idx) => (
                    <div key={idx} className="flex flex-col justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-row justify-center items-center gap-3">
                          <img
                            className="rounded-full w-11 h-11"
                            src={conn.avatar}
                            alt={conn.name}
                          />
                          <div className="flex flex-col justify-start items-start gap-0.5">
                            <div className="text-sm text-neutral-900 font-semibold">
                              {conn.name}
                            </div>
                            <div className="text-xs text-gray-600 font-normal">
                              {conn.title}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-start items-end gap-0.5">
                          <div className="text-sm text-neutral-900 font-semibold">
                            {conn.date}
                          </div>
                          <div className="text-xs text-gray-600 font-normal">
                            {conn.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'engagements' && (
          <div className="flex flex-col gap-6">
            {/* Engagement Insights */}
            <div className="flex flex-col justify-center items-center rounded-xl w-full shadow bg-white p-6">
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div className="flex flex-row justify-center items-center gap-1">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Engagement Insights
                  </div>
                </div>
                
                <div className="flex flex-row justify-between items-center gap-4 w-full">
                  {/* Device Types */}
                  <div className="flex flex-col justify-start items-start gap-3.5 w-1/2">
                    <div className="text-sm text-neutral-900 font-medium">
                      Device Types
                    </div>
                    <div className="flex flex-col justify-start items-start gap-3 w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="text-sm text-gray-600 font-medium">
                          iPhone
                        </div>
                        <div className="text-sm text-neutral-900 font-medium">
                          35
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="text-sm text-gray-600 font-medium">
                          Android
                        </div>
                        <div className="text-sm text-neutral-900 font-medium">
                          223
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="flex flex-col justify-start items-start gap-3.5 w-1/2">
                    <div className="text-sm text-neutral-900 font-medium">
                      Connection Status
                    </div>
                    <div className="flex flex-col justify-start items-start gap-3 w-full">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="text-sm text-gray-600 font-medium">
                          Connected
                        </div>
                        <div className="text-sm text-neutral-900 font-medium">
                          35
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="text-sm text-gray-600 font-medium">
                          Scanned Only
                        </div>
                        <div className="text-sm text-neutral-900 font-medium">
                          223
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Link Performance */}
            <div className="flex flex-col justify-center items-center rounded-xl w-full shadow bg-white p-6">
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div className="flex flex-row justify-center items-center gap-1">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Social Link Performance
                  </div>
                </div>

                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  {/* LinkedIn */}
                  <div className="flex flex-col justify-center items-center rounded-lg w-full p-4 bg-blue-50">
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-row justify-center items-center gap-3">
                        <img
                          width="36px"
                          height="36px"
                          src="/images/linkedin.png"
                          alt="LinkedIn icon"
                        />
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          <div className="text-base text-neutral-900 font-semibold">
                            LinkedIn
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            linkedin.com/in/victor-smith
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-end gap-0.5">
                        <div className="text-base text-blue-600 font-semibold">
                          56
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          Clicks
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="flex flex-col justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                    <div className="flex flex-row justify-between items-center w-full">
                      <div className="flex flex-row justify-center items-center gap-3">
                        <img
                          width="33px"
                          height="28.5px"
                          src="/images/twitter1.png"
                          alt="Twitter icon"
                        />
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          <div className="text-base text-neutral-900 font-semibold">
                            Twitter
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
                            @victor_design
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-end gap-0.5">
                        <div className="text-base text-neutral-900 font-semibold">
                          6
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          Clicks
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex flex-row justify-center items-center w-full mt-6">
          <button
            className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
            onClick={onClose}
          >
            <div className="text-base text-white font-normal">
              Close Analytics
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardAnalyticsModal;