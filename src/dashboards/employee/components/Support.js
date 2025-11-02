import React, { useState } from 'react';
import CreateTicketModal from './CreateTicketModal';
import ViewProfileModal from './ViewProfileModal.js';

const Support = () => {
  const [activeTab, setActiveTab] = useState('myTickets');
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const openCreateTicketModal = () => setIsCreateTicketModalOpen(true);
  const closeCreateTicketModal = () => setIsCreateTicketModalOpen(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Support Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">Help & Support</div>
          <div className="text-sm text-gray-600">Get help and support for your questions</div>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
          onClick={openCreateTicketModal}
        >
          <img width="18px" height="18px" src="/images/ticket.png" alt="Create Ticket" />
          <div className="text-sm text-white font-medium">Create Ticket</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 bg-slate-50 overflow-hidden">
        <div
          className={`flex-1 flex items-center justify-center h-10 cursor-pointer border-r border-slate-100 ${
            activeTab === 'myTickets' ? 'bg-white' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('myTickets')}
        >
          <div
            className={`text-xs text-neutral-900 tracking-wide ${
              activeTab === 'myTickets' ? 'font-semibold' : 'font-medium'
            }`}
          >
            My Tickets
          </div>
        </div>
        <div
          className={`flex-1 flex items-center justify-center h-10 cursor-pointer border-r border-slate-100 ${
            activeTab === 'resources' ? 'bg-white' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('resources')}
        >
          <div
            className={`text-xs text-neutral-900 tracking-wide ${
              activeTab === 'resources' ? 'font-semibold' : 'font-medium'
            }`}
          >
            Resources
          </div>
        </div>
        <div
          className={`flex-1 flex items-center justify-center h-10 cursor-pointer ${
            activeTab === 'contactInfo' ? 'bg-white' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab('contactInfo')}
        >
          <div
            className={`text-xs text-neutral-900 tracking-wide ${
              activeTab === 'contactInfo' ? 'font-semibold' : 'font-medium'
            }`}
          >
            Contact Info
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'myTickets' && (
        <div className="flex flex-col gap-4">
          <div className="text-lg text-neutral-900 font-medium">My Support Tickets</div>
          {/* Ticket 1 */}
          <div className="flex flex-col p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-900 font-semibold">
                  Request for additional vacation days
                </div>
                <div className="px-4 py-1 rounded-lg border border-neutral-200 text-xs text-gray-800 font-medium">
                  TICK-089
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-blue-100 text-[10px] text-blue-800 font-medium">
                  Open
                </span>
                <span className="px-2 py-1 rounded-md bg-yellow-100 text-[10px] text-yellow-800 font-medium">
                  Medium
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              Example ticket description goes here. Add more details if needed...
            </div>
            <div className="flex justify-between items-end text-xs text-gray-600 font-medium">
              <div className="flex flex-col gap-1">
                <div className="flex gap-8">
                  <div>Category: HR</div>
                  <div>Assigned to: HR Team</div>
                </div>
                <div>Created: Aug 26, 2025</div>
              </div>
              <div>Last update: Aug 9, 2024</div>
            </div>
          </div>
          {/* Ticket 2 */}
          <div className="flex flex-col p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-900 font-semibold">
                  Unable to access payslip portal
                </div>
                <div className="px-4 py-1 rounded-lg border border-neutral-200 text-xs text-gray-800 font-medium">
                  TICK-090
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-yellow-100 text-[10px] text-yellow-800 font-medium">
                  In Progress
                </span>
                <span className="px-2 py-1 rounded-md bg-red-100 text-[10px] test-red-800 font-medium">
                  High
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              Example ticket description goes here. Add more details if needed...
            </div>
            <div className="flex justify-between items-end text-xs text-gray-600 font-medium">
              <div className="flex flex-col gap-1">
                <div className="flex gap-8">
                  <div>Category: Technical</div>
                  <div>Assigned to: IT Support</div>
                </div>
                <div>Created: Aug 26, 2025</div>
              </div>
              <div>Last update: Aug 9, 2024</div>
            </div>
          </div>
          {/* Ticket 3 */}
          <div className="flex flex-col p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-900 font-semibold">
                  VPN access issue resolved
                </div>
                <div className="px-4 py-1 rounded-lg border border-neutral-200 text-xs text-gray-800 font-medium">
                  TICK-091
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 rounded-md bg-green-100 text-[10px] text-green-800 font-medium">
                  Resolved
                </span>
                <span className="px-2 py-1 rounded-md bg-green-100 text-[10px] text-green-800 font-medium">
                  Low
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3">
              Example ticket description goes here. Add more details if needed...
            </div>
            <div className="flex justify-between items-end text-xs text-gray-600 font-medium">
              <div className="flex flex-col gap-1">
                <div className="flex gap-8">
                  <div>Category: Technical</div>
                  <div>Assigned to: IT Support</div>
                </div>
                <div>Created: Aug 26, 2025</div>
              </div>
              <div>Last update: Aug 9, 2024</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Resource 1 */}
            <div className="flex items-center p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-teal-100">
                  <img
                    width="30px"
                    height="30px"
                    src="/images/resources.png"
                    alt="Resources icon"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-lg text-neutral-900 font-semibold">Employee Handbook</div>
                  <div className="text-xs text-gray-600">
                    Complete guide to company policies and procedures
                  </div>
                </div>
              </div>
            </div>
            {/* Resource 2 */}
            <div className="flex items-center p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-teal-100">
                  <img
                    width="30px"
                    height="30px"
                    src="/images/resources.png"
                    alt="Resources icon"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-lg text-neutral-900 font-semibold">HR Policies</div>
                  <div className="text-xs text-gray-600">
                    Human resources policies and guidelines
                  </div>
                </div>
              </div>
            </div>
            {/* Resource 3 */}
            <div className="flex items-center p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-teal-100">
                  <img
                    width="30px"
                    height="30px"
                    src="/images/resources.png"
                    alt="Resources icon"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-lg text-neutral-900 font-semibold">
                    Legal & Compliance Information
                  </div>
                  <div className="text-xs text-gray-600">
                    Complete guide to company policies and procedures
                  </div>
                </div>
              </div>
            </div>
            {/* Resource 4 */}
            <div className="flex items-center p-4 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full">
                <div className="flex justify-center items-center w-16 h-16 rounded-full bg-teal-100">
                  <img
                    width="30px"
                    height="30px"
                    src="/images/resources.png"
                    alt="Resources icon"
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="text-lg text-neutral-900 font-semibold">
                    Compensation & Benefits Information
                  </div>
                  <div className="text-xs text-gray-600">
                    Human resources policies and guidelines
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contactInfo' && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IT Support */}
            <div className="flex flex-col p-6 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold mb-4">IT Support</div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/email.png" alt="Email icon" />
                  <div className="text-sm text-gray-600">support@company.com</div>
                </div>
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/phone.png" alt="Phone icon" />
                  <div className="text-sm text-gray-600">+1 (555) 123-4567</div>
                </div>
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/calendar2.png" alt="Hours icon" />
                  <div className="text-sm text-gray-600">Mon-Fri, 9AM-6PM EST</div>
                </div>
              </div>
            </div>
            {/* HR Department */}
            <div className="flex flex-col p-6 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold mb-4">HR Department</div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/email.png" alt="Email icon" />
                  <div className="text-sm text-gray-600">hr@company.com</div>
                </div>
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/phone.png" alt="Phone icon" />
                  <div className="text-sm text-gray-600">+1 (555) 987-6543</div>
                </div>
                <div className="flex items-center gap-3">
                  <img width="20px" height="20px" src="/images/calendar2.png" alt="Hours icon" />
                  <div className="text-sm text-gray-600">Mon-Fri, 8AM-5PM EST</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateTicketModalOpen && (
        <CreateTicketModal isOpen={isCreateTicketModalOpen} onClose={closeCreateTicketModal} />
      )}
    </div>
  );
};

export default Support;
