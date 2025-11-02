import React, { useState } from 'react';

export default function Announcements() {
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);

  const announcements = [
    {
      id: 1,
      title: 'General Tech Meeting',
      priority: 'Medium',
      category: 'General',
      content:
        "We're excited to welcome five new team members in January! Please greet them warmly ...",
      author: 'Management Team',
      publishedDate: '2025-08-29',
      readCount: 142,
      totalEmployees: 156,
      readPercentage: 91,
    },
    {
      id: 2,
      title: 'Security System Maintenance',
      priority: 'High',
      category: 'General',
      content:
        "We're excited to welcome five new team members in January! Please greet them warmly during ...",
      author: 'Facilities Team',
      publishedDate: '2025-08-29',
      readCount: 142,
      totalEmployees: 156,
      readPercentage: 91,
    },
    {
      id: 3,
      title: 'General Tech Meeting',
      priority: 'Medium',
      category: 'General',
      content:
        "We're excited to welcome five new team members in January! Please greet them warmly ...",
      author: 'Management Team',
      publishedDate: '2025-08-29',
      readCount: 142,
      totalEmployees: 156,
      readPercentage: 91,
    },
    {
      id: 4,
      title: 'Security System Maintenance',
      priority: 'High',
      category: 'General',
      content:
        "We're excited to welcome five new team members in January! Please greet them warmly during ...",
      author: 'Facilities Team',
      publishedDate: '2025-08-29',
      readCount: 142,
      totalEmployees: 156,
      readPercentage: 91,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">Company Announcements</div>
        <div className="text-sm text-gray-600 font-normal">
          Stay updated with the latest company news and important information.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Announcements Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Announcements</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">24</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/total_announcements.png"
                alt="Total Announcements icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">This month</div>
        </div>

        {/* Important Updates Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Important Updates</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">3</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/important_updates.png"
                alt="Important Updates icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">This month</div>
        </div>

        {/* This Week Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">This Week</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">8</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-purple-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/Total_days.png"
                alt="This Week icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">New Announcements</div>
        </div>

        {/* Average Read Rate Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Avg. Read Rate</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">87%</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/read_rate.png"
                alt="Read Rate icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">This Week</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img width="16.5px" height="16.5px" src="/images/search.png" alt="Search icon" />
          </div>
          <input
            type="text"
            placeholder="Search announcement"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
          />
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[100px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs text-neutral-900 font-semibold">Filter</div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown icon" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Announcement Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNewEmployeeModal(true)}
          className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
        >
          <img src="/images/addtask.png" alt="Create Announcement" className="h-5 w-5" />
          Create Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="flex flex-col gap-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white"
          >
            <div className="flex justify-between items-start">
              {/* Title + Labels */}
              <div className="flex items-center gap-2">
                <div className="text-sm text-neutral-900 font-semibold">{announcement.title}</div>
                <div className="flex gap-2">
                  <div
                    className={`px-2 py-1 rounded-md ${
                      announcement.priority === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-medium ${
                        announcement.priority === 'High' ? 'text-amber-700' : 'text-yellow-800'
                      }`}
                    >
                      {announcement.priority}
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-gray-100">
                    <div className="text-[10px] text-gray-800 font-medium">
                      {announcement.category}
                    </div>
                  </div>
                </div>
              </div>
              {/* Read More */}
              <div className="px-4 py-1 rounded-lg border border-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                <div className="text-xs text-gray-800 font-medium">Read More</div>
              </div>
            </div>

            <div className="text-xs text-gray-600 font-normal line-clamp-2">
              {announcement.content}
            </div>

            <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
              <div>By: {announcement.author}</div>
              <div>Published: {announcement.publishedDate}</div>
              <div className="flex items-center gap-1">
                <img width="14px" height="14px" src="/images/readcount.png" alt="Read Count icon" />
                <span>
                  {announcement.readCount}/{announcement.totalEmployees} read (
                  {announcement.readPercentage}%)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowNewEmployeeModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            {/* Modal Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Announcement</h2>

            {/* Form Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="Enter announcement title..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Announcement Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter announcement content..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 text-sm">
                    <option>Select priority</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full border border-gray-300 rounded-lg p-3 text-sm">
                    <option>Select category</option>
                    <option>General</option>
                    <option>Important</option>
                    <option>Update</option>
                    <option>Event</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 pt-4">
                <button
                  onClick={() => setShowNewEmployeeModal(false)}
                  className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle announcement creation logic
                    setShowNewEmployeeModal(false);
                  }}
                  className="w-1/2 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-600"
                >
                  Publish Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
