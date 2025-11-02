// src/components/cards/employeecard.jsx
import React, { useState } from "react";
import { useAppSelector } from "../../store/hooks";

export default function EmployeeCardContent() {
  const { user } = useAppSelector(state => state.auth);
  const [activeCardTab, setActiveCardTab] = useState('idCards');
  
  // Mock data - using user info where available
  const userFirstName = user?.user?.first_name || user?.first_name || "Victor";
  const userLastName = user?.user?.last_name || user?.last_name || "Smith";
  const userName = `${userFirstName} ${userLastName}`;
  const userEmail = user?.user?.email || user?.email || "victor.smith@company.com";
  const userPhone = user?.user?.phone_number || user?.phone_number || "+234 7099767789";
  const userPosition = user?.user?.position || user?.position || "Product Designer";
  const userDepartment = user?.department?.name || "Design & UX";
  const userProfilePicture = user?.user?.profile_picture || user?.profile_picture;

  // Sample ID Card
  const idCard = {
    id: 1,
    company: "OnTap Technologies",
    name: userName,
    position: userPosition,
    employeeId: "1003E84155",
    department: userDepartment,
    email: userEmail,
    phone: userPhone,
    accessLevel: "Standard",
    status: "Active",
    expiryDate: "03/09/2028",
    bgColor: "bg-teal-500",
    hoverBgColor: "hover:bg-teal-600",
    borderColor: "border-teal-300"
  };

  // Sample Business Card
  const businessCard = {
    id: 1,
    name: userName,
    position: userPosition,
    email: userEmail,
    phone: userPhone,
    scans: 245,
    connections: 18,
    lastActivity: "2 hours ago",
    status: "Active",
    bgColor: "bg-teal-500",
    borderColor: "border-teal-300"
  };

  const handleDownloadCard = () => {
    console.log("Download card functionality coming soon");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Cards Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            My Cards
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your digital business cards and track their performance.
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCard}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            <img src="/images/download.png" alt="Download" width="16" height="16" />
            <span className="text-sm font-medium">Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex flex-row justify-center items-center h-10 min-w-[50%] cursor-pointer border-r border-slate-100 ${
            activeCardTab === 'idCards' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
          }`}
          onClick={() => setActiveCardTab('idCards')}
        >
          <div className="flex flex-row justify-center items-center gap-1">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.6px"
                height="13.1px"
                src="/images/id.png"
                alt="ID Card icon"
              />
            </div>
            <div className={`text-xs text-neutral-900 tracking-wide ${
              activeCardTab === 'idCards' ? 'font-semibold' : 'font-medium'
            }`}>
              ID Cards
            </div>
          </div>
        </div>
        <div
          className={`flex flex-row justify-center items-center h-10 min-w-[50%] cursor-pointer ${
            activeCardTab === 'businessCards' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
          }`}
          onClick={() => setActiveCardTab('businessCards')}
        >
          <div className="flex flex-row justify-center items-center gap-1">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.6px"
                height="13.1px"
                src="/images/business.png"
                alt="Business Card icon"
              />
            </div>
            <div className={`text-xs text-neutral-900 tracking-wide ${
              activeCardTab === 'businessCards' ? 'font-semibold' : 'font-medium'
            }`}>
              Business Cards
            </div>
          </div>
        </div>
      </div>

      {/* ID Card Display */}
      {activeCardTab === 'idCards' && (
        <div className="flex justify-center items-center py-4">
          <div className="flex flex-col justify-center items-center rounded-xl w-full max-w-md shadow-lg bg-white p-6">
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              {/* Card Design */}
              <div className={`flex flex-col justify-start items-start gap-4 p-4 rounded-xl w-full min-h-[153px] ${idCard.bgColor} ${idCard.hoverBgColor} transition-colors duration-200`}>
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="text-base text-white font-bold">
                      {idCard.company}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      Employee ID
                    </div>
                  </div>
                  <div className="flex justify-center items-center rounded-md w-10 h-10 bg-white/40 hover:bg-white/60 transition-colors duration-200">
                    <img
                      width="28px"
                      height="28px"
                      src="/images/qrcode.png"
                      alt="QR Code icon"
                    />
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-3">
                  <div className="flex justify-center items-center rounded-full w-[60px] h-[60px] bg-white/30 overflow-hidden">
                    {userProfilePicture ? (
                      <img
                        src={userProfilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {userFirstName?.[0]}{userLastName?.[0]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col justify-start items-start gap-0.5">
                    <div className="text-sm text-white font-semibold">
                      {idCard.name}
                    </div>
                    <div className="text-xs text-white/80 font-medium">
                      {idCard.position}
                    </div>
                    <div className="text-xs text-white/80 font-medium">
                      ID: {idCard.employeeId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                  <div className="text-base text-neutral-900 font-semibold">
                    {idCard.name}
                  </div>
                  <div className="flex justify-center items-center rounded-lg px-3 py-1 bg-green-100">
                    <div className="text-xs text-green-800 font-medium">
                      {idCard.status}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img src="/images/Frame.png" alt="Department" width="14" height="14" />
                    <span>{idCard.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/images/email.png" alt="Email" width="14" height="14" />
                    <span>{idCard.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/images/phonee.png" alt="Phone" width="14" height="14" />
                    <span>{idCard.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/images/calendar2.png" alt="Expiry" width="14" height="14" />
                    <span>Expires: {idCard.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Card Display */}
      {activeCardTab === 'businessCards' && (
        <div className="flex justify-center items-center py-4">
          <div className="flex flex-col justify-center items-center rounded-xl w-full max-w-md shadow-lg bg-white p-6">
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              {/* Business Card Design */}
              <div className={`flex flex-col justify-start items-start gap-4 p-4 rounded-xl w-full min-h-[153px] ${businessCard.bgColor}`}>
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="text-base text-white font-bold">
                      {businessCard.name}
                    </div>
                    <div className="text-sm text-white/80 font-medium">
                      {businessCard.position}
                    </div>
                  </div>
                  <div className="flex justify-center items-center rounded-md w-10 h-10 bg-white/40">
                    <img
                      width="28px"
                      height="28px"
                      src="/images/qrcode.png"
                      alt="QR Code icon"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center gap-2 text-xs text-white">
                    <img src="/images/email.png" alt="Email" width="12" height="12" className="opacity-80" />
                    <span>{businessCard.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white">
                    <img src="/images/phonee.png" alt="Phone" width="12" height="12" className="opacity-80" />
                    <span>{businessCard.phone}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-2">
                  <div className="flex justify-center items-center rounded w-[70px] h-5 bg-white/30">
                    <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                      <div className="flex justify-center items-center h-3">
                        <img
                          width="12px"
                          height="9.8px"
                          src="/images/linkedin.png"
                          alt="LinkedIn icon"
                        />
                      </div>
                      <div className="text-[10px] text-white font-medium">
                        LinkedIn
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center rounded w-[70px] h-5 bg-white/30">
                    <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                      <div className="flex justify-center items-center h-3">
                        <img
                          width="12px"
                          height="9.8px"
                          src="/images/twitter.png"
                          alt="Twitter icon"
                        />
                      </div>
                      <div className="text-[10px] text-white font-medium">
                        Twitter
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Card Stats */}
              <div className="flex justify-center items-center rounded-lg w-full h-16 bg-gray-50">
                <div className="flex flex-row justify-between items-center w-full px-4">
                  <div className="flex flex-col justify-start items-center gap-0.5">
                    <div className="text-sm text-neutral-900 font-semibold">
                      {businessCard.scans}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Scans
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-0.5">
                    <div className="text-sm text-neutral-900 font-semibold">
                      {businessCard.connections}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Connections
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-0.5">
                    <img
                      width="24px"
                      height="24px"
                      src="/images/analytics.png"
                      alt="Analytics icon"
                    />
                    <div className="text-xs text-gray-500 font-medium">
                      Analytics
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Activity */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <img
                  width="16.3px"
                  height="16.3px"
                  src="/images/clock.png"
                  alt="Clock icon"
                />
                <span>Last activity: {businessCard.lastActivity}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}