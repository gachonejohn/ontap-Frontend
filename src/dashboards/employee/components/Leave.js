import React, { useState } from "react";
import LeaveModal from "./LeaveModal.js";
import ViewProfileModal from "./ViewProfileModal.js";

const Leave = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('leaveManagement');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLeaveSubmit = (formData) => {
    // Handle the form submission here
    console.log("Leave form submitted:", formData);
    // You would typically send this data to an API
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Leave Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave & Attendance
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your leave requests and track attendance
          </div>
        </div>
        <div
          className="flex justify-center items-center rounded-md w-[180px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
          onClick={() => setIsLeaveModalOpen(true)}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-center items-center w-5 h-5">
              <img
                width="15.4px"
                height="15.3px"
                src="/images/addtask.png"
                alt="Apply Leave icon"
              />
            </div>
            <div className="text-sm text-white font-medium">
              Apply for Leave
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 w-full items-center">
        {/* Today's Status with Sticker */}
        <div className="relative flex items-center p-4 rounded-xl h-[120px] shadow-lg text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
          {/* Sticker Image as Background */}
          <img
            src="/images/card1.png"
            alt="Sticker background"
            className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          />

          {/* Content */}
          <div className="flex flex-col justify-center h-full w-full relative z-10">
            {/* Status Text & Clock Icon */}
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col">
                <div className="text-sm font-medium">Today's Status</div>
                <div className="text-lg font-semibold">Clocked In: 9:05 AM</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-white shadow-md">
                <img
                  width="23"
                  height="23"
                  src="/images/clock.png"
                  alt="Clock Icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hours Today Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              Hours Today
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                width="20px"
                height="18px"
                src="/images/payday.png"
                alt="Payday icon"
              />
            </div>
          </div>
          <div className="text-lg text-neutral-900 font-semibold">
            6h 45m
          </div>
        </div>

        {/* Status Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">
              Status
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                width="20px"
                height="18px"
                src="/images/greenclock.png"
                alt="Status icon"
              />
            </div>
          </div>
          <div className="text-lg text-teal-500 font-semibold">
            Present
          </div>
        </div>

        {/* Clock Out Button */}
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center rounded-md w-[260px] h-[60px] bg-red-600 cursor-pointer hover:bg-red-700 transition-colors">
            <div className="font-inter text-sm min-w-[66px] whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-normal">
              Clock out
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'leaveManagement' ? 'bg-white' : ''}`}
          onClick={() => setActiveTab('leaveManagement')}
        >
          <div className={`text-xs text-neutral-900 ${activeTab === 'leaveManagement' ? 'font-semibold' : 'font-medium'}`}>
            Leave Management
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'leaveBalance' ? 'bg-white' : ''}`}
          onClick={() => setActiveTab('leaveBalance')}
        >
          <div className={`text-xs text-neutral-900 ${activeTab === 'leaveBalance' ? 'font-semibold' : 'font-medium'}`}>
            Leave Balance
          </div>
        </div>
      </div>

      {activeTab === 'leaveManagement' ? (
        /* Leave Requests Table */
        <div className="flex flex-col rounded-xl w-full shadow-sm bg-white overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-row justify-between items-center p-4 w-full h-20 border-b border-neutral-200">
            <div className="text-lg text-neutral-900 font-medium">
              My Leave Requests
            </div>
            <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[75px] h-11 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-1">
                <div className="flex justify-center items-center h-5">
                  <img
                    width="16.3px"
                    height="16.3px"
                    src="/images/filter.png"
                    alt="Filter icon"
                  />
                </div>
                <div className="text-xs text-neutral-900 font-semibold">
                  Filter
                </div>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Type</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Duration</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Days</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Status</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Applied On</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Approver</th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 - Annual Leave */}
                <tr className="border-b border-neutral-200">
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-blue-50 min-w-[90px]">
                      <div className="text-xs text-blue-900 font-medium">
                        Annual Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to 2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">
                      15
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-yellow-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/pending.png"
                            alt="Pending icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-yellow-800 font-medium">
                          Pending
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      HR
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-red-600 font-medium">
                          Cancel
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 2 - Sick Leave */}
                <tr className="border-b border-neutral-200">
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-orange-50 min-w-[90px]">
                      <div className="text-xs text-yellow-800 font-medium">
                        Sick Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to 2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">
                      2
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-green-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/approved.png"
                            alt="Approved icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-green-800 font-medium">
                          Approved
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      HR
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 3 - Personal Leave */}
                <tr>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-purple-50 min-w-[90px]">
                      <div className="text-xs text-purple-900 font-medium">
                        Personal Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to 2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">
                      2
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-red-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/denied.png"
                            alt="Denied icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-orange-800 font-medium">
                          Denied
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      HR
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leave Balance Content */
        <div className="flex flex-col justify-between items-center gap-6 w-full">
          {/* Leave Balance Cards */}
          <div className="flex flex-row justify-between items-center gap-3 w-full h-[123px]">
            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Annual Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      8/25
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">
                    Used
                  </div>
                  <div className="text-xs text-neutral-900 font-medium">
                    8 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '32%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    17 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Sick Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      3/10
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">
                    Used
                  </div>
                  <div className="text-xs text-neutral-900 font-medium">
                    3 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    7 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Personal Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 w-8 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      2/5
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">
                    Used
                  </div>
                  <div className="text-xs text-neutral-900 font-medium">
                    2 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    3 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Maternity Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      0/90
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">
                    Used
                  </div>
                  <div className="text-xs text-neutral-900 font-medium">
                    0 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    90 days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Policy Section */}
          <div className="flex flex-col justify-start items-start gap-6 h-[334px] w-full">
            <div className="flex flex-row justify-start items-center gap-4 py-4 h-14 w-full">
              <div className="text-lg text-neutral-900 font-medium">
                Leave Policy
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 h-64 w-full">
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-blue-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-blue-900 font-medium">
                    Annual leave
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    You are entitled to 25 days of annual leave per year. Unused leave
                    can be carried forward to the next year (maximum 5 days).
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-orange-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-yellow-800 font-medium">
                    Sick leave
                  </div>
                  <div className="text-xs text-orange-700 font-medium">
                    You can take up to 10 days of sick leave per year. Medical
                    certificate required for leaves longer than 2 consecutive days.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-purple-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-purple-900 font-medium">
                    Personal Leave
                  </div>
                  <div className="text-xs text-purple-700 font-medium">
                    You are entitled to 5 days of personal leave per year for urgent
                    personal matters that cannot be scheduled outside work hours.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
      />
    </div>
  );
};

export default Leave;