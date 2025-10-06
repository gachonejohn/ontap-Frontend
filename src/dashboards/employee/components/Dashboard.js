import React, { useState } from "react";
import LeaveModal from "./LeaveModal.js";
import LogTaskModal from "./LogTaskModal.js";
import ViewProfileModal from "./ViewProfileModal.js";
import DropdownAuthenticationModal from "./DropdownAuthenticationModal.js";

const Dashboard = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAmountVisible, setIsAmountVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [actualAmount, setActualAmount] = useState("$1,250.00");
  const [eyeIconPosition, setEyeIconPosition] = useState({ top: 0, right: 0 });

  const toggleAmountVisibility = () => {
    setIsAmountVisible((prev) => !prev);
  };

  const handleAuthentication = (enteredPassword) => {
    if (enteredPassword.length >= 5) {
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      setIsAmountVisible(true);
    } else {
      alert("Password must be at least 5 characters long. Please try again.");
    }
  };

  const handleViewAmountClick = (e) => {
    if (isAuthenticated) {
      toggleAmountVisibility();
    } else {
      const rect = e.target.getBoundingClientRect();
      setEyeIconPosition({
        top: rect.top,
        right: rect.right
      });
      setIsAuthModalOpen(true);
    }
  };

  const handleLeaveSubmit = (formData) => {
    console.log("Leave application submitted:", formData);
  };

  const handleLogTaskSubmit = (formData) => {
    console.log("New task submitted:", formData);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
                <div className="mt-2 text-lg font-semibold">Clocked In: 9:05 AM</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-white">
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

        {/* Next Payday Card */}
        <div className="flex items-center p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex flex-col justify-between w-full h-full">
            {/* Top Row: Title + Date + Payday Icon */}
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col gap-0.5">
                <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-medium">
                  Next Payday
                </div>
                <div className="font-inter text-xs text-gray-600 leading-snug tracking-normal font-normal">
                  August 26, 2025
                </div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-blue-100">
                <img
                  width="20px"
                  height="18px"
                  src="/images/payday.png"
                  alt="Payday icon"
                />
              </div>
            </div>

            {/* Bottom Row: Amount + View Button */}
            <div className="flex flex-row justify-between items-center w-full mt-2">
              <div className="font-inter text-lg text-neutral-900 leading-tight font-semibold">
                {isAmountVisible ? actualAmount : "*****"}
              </div>
              <div
                className="flex items-center justify-center h-4 cursor-pointer"
                onClick={handleViewAmountClick}
              >
                <img
                  width="20px"
                  height="20px"
                  src={isAmountVisible ? "/images/eye-slash.png" : "/images/eye.png"}
                  alt={isAmountVisible ? "Hide amount" : "Show amount"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ID Card - Teal Version */}
        <div className="relative flex flex-col justify-start items-start p-4 rounded-xl h-[120px] shadow-lg text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
          {/* Teal Background */}
          <div className="absolute inset-0 w-full h-full bg-teal-500 rounded-xl z-0"></div>

          {/* Content */}
          <div className="relative z-10 w-full h-full">
            {/* Top Section: Company & QR Code */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-xs font-bold">OnTap Technologies</div>
                <div className="text-[10px] text-teal-100 font-medium">Employee ID</div>
              </div>
              <div className="flex justify-center items-center rounded-md w-7 h-7 bg-white/40 hover:bg-white/60 transition-colors duration-200">
                <img
                  width="18px"
                  height="18px"
                  src="/images/qrcode.png"
                  alt="QR Code icon"
                />
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex flex-row justify-start items-center gap-2 mt-2">
              <img
                className="rounded-full border-2 border-emerald-300 overflow-hidden"
                src="/images/avatar.png"
                alt="Profile"
                width="35px"
                height="35px"
              />
              <div className="flex flex-col justify-start items-start gap-0.5">
                <div className="text-xs font-bold">Sarah Johnson</div>
                <div className="text-[10px] text-teal-100 font-medium">Product Designer</div>
                <div className="text-[10px] text-teal-100 font-medium">ID: 1003E84155</div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 right-3 flex justify-center items-center rounded-lg px-2 h-5 bg-white">
              <div className="text-[10px] text-teal-500 font-medium">Active</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 justify-center h-[120px] w-full">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] bg-teal-500 text-white text-sm font-normal hover:bg-teal-600 transition-colors"
          >
            Apply Leave
          </button>
          <button
            onClick={() => setIsLogTaskModalOpen(true)}
            className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] shadow-sm bg-white text-neutral-900 text-sm font-normal hover:bg-gray-100 transition-colors"
          >
            Log Task
          </button>
        </div>
      </div>

      {/* My Tasks Section */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-between items-center h-8">
          <div className="text-lg text-neutral-900 font-semibold">My Tasks</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* To Do Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/todo.png" alt="To Do icon" />
                <div className="text-base text-neutral-900 font-medium">To Do</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">3</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {/* Task 1 */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-neutral-900 font-medium">
                    Complete Q3 Performance Review
                  </div>
                  <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  Fill out the quarterly performance form and submit to HR
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                    <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                  </div>
                  <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-red-100">
                    <div className="text-[10.5px] text-pink-800 font-semibold">High</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                    <div className="text-[10px] text-gray-600 font-medium">Assigned by Mildred</div>
                  </div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-neutral-900 font-medium">Design Review for Ontap</div>
                  <img width="16.5" height="16.3" src="/images/greenflag.png" alt="Green flag" />
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  Review the new design mockups for the Ontap project
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                    <div className="text-[10px] text-gray-600 font-medium">Aug 28, 2025</div>
                  </div>
                  <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-green-100">
                    <div className="text-[10.5px] text-green-800 font-semibold">Medium</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                    <div className="text-[10px] text-gray-600 font-medium">Assigned by me</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/inprogress.png" alt="In Progress" />
                <div className="text-base text-neutral-900 font-medium">In Progress</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">2</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {/* Task 1 */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-neutral-900 font-medium">Update User Documentation</div>
                  <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  Update user guides for the new features released last week
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                    <div className="text-[10px] text-gray-600 font-medium">Sep 2, 2025</div>
                  </div>
                  <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-yellow-100">
                    <div className="text-[10.5px] text-yellow-800 font-semibold">Low</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                    <div className="text-[10px] text-gray-600 font-medium">Assigned by Thaddeus</div>
                  </div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-neutral-900 font-medium">Design Review for Ontap</div>
                  <img width="16.5" height="16.3" src="/images/greenflag.png" alt="Green flag" />
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  Review the new design mockups for the Ontap project
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                    <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                  </div>
                  <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-green-100">
                    <div className="text-[10.5px] text-green-800 font-semibold">High</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                    <div className="text-[10px] text-gray-600 font-medium">Assigned by me</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/completed.png" alt="Completed" />
                <div className="text-base text-neutral-900 font-medium">Completed</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">1</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {/* Task 1 */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="text-sm text-neutral-900 font-medium">Team Meeting Preparation</div>
                  <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  Prepare agenda and materials for the weekly team meeting
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                    <div className="text-[10px] text-gray-600 font-medium">Aug 25, 2025</div>
                  </div>
                  <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-blue-100">
                    <div className="text-[10.5px] text-blue-800 font-semibold">Normal</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-center gap-1">
                    <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                    <div className="text-[10px] text-gray-600 font-medium">Assigned by me</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements & Trainings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Announcements */}
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white">
          <div className="text-lg text-neutral-900 font-semibold">
            Announcements
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  Company Holiday: Labor Day Schedule
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 26, 2025
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  Office Relocation Update
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 28, 2025
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  New Remote Work Policy
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 28, 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trainings */}
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white">
          <div className="text-lg text-neutral-900 font-semibold">
            Trainings
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  Effective Communication Skills
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  65%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  Hands-on Manager
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  83%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  New Staff Onboarding
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  95%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
      />

      {/* Log Task Modal */}
      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleLogTaskSubmit}
      />

      {/* Dropdown Authentication Modal */}
      <DropdownAuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthentication}
        position={eyeIconPosition}
      />
    </div>
  );
};

export default Dashboard;