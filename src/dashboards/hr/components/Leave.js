import React, { useState } from 'react';
import LeaveChartDistribution from '../components/LeaveChartDistribution';
import AttendanceTrendsChart from '../components/AttendanceTrendsChart';

export default function LeaveAttendance() {
  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      department: "Engineering",
      image: "/images/sarah.png",
      type: "Annual Leave",
      from: "2025-12-20",
      to: "2025-12-24",
      days: 5,
      status: "Pending",
      applied: "2025-12-01"
    },
    {
      id: 2,
      name: "Victor Josh",
      department: "Design",
      image: "/images/michael.png",
      type: "Personal Leave",
      from: "2025-12-20",
      to: "2025-12-24",
      days: 5,
      status: "Approved",
      applied: "2025-12-01"
    },
    {
      id: 3,
      name: "David Wilson",
      department: "Engineering",
      image: "/images/david.png",
      type: "Annual Leave",
      from: "2025-12-20",
      to: "2025-12-24",
      days: 5,
      status: "Pending",
      applied: "2025-12-01"
    },
    {
      id: 4,
      name: "Lisa Anderson",
      department: "Engineering",
      image: "/images/lisa.png",
      type: "Annual Leave",
      from: "2025-12-20",
      to: "2025-12-24",
      days: 5,
      status: "Rejected",
      applied: "2025-12-01"
    },
    {
      id: 5,
      name: "Victor Josh",
      department: "Design",
      image: "/images/michael.png",
      type: "Personal Leave",
      from: "2025-12-20",
      to: "2025-12-24",
      days: 5,
      status: "Approved",
      applied: "2025-12-01"
    },
  ]);

  const [activeActionId, setActiveActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const attendanceData = {
    engineering: [75, 78, 76, 80, 85],
    design: [60, 65, 62, 64, 66],
    product: [50, 52, 55, 58, 60],
  };

  const toggleActionMenu = (id) => {
    setActiveActionId(activeActionId === id ? null : id);
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`Changing status for ${id} to ${newStatus}`);
    setActiveActionId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">Leave & Attendance</div>
        <div className="text-sm text-gray-600 font-normal">
          Manage employee leave requests and attendance records.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Pending Requests Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Pending Requests</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">{leaveRequests.filter(req => req.status === "Pending").length}</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/pending_risk.png"
                alt="Pending Requests icon"
              />
            </div>
          </div>
        </div>

        {/* Approved This Month Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Approved This Month</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">3</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/approved.png"
                alt="Approved icon"
              />
            </div>
          </div>
        </div>

        {/* Total Days Requested Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Days Requested</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">36</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-purple-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/Total_days.png"
                alt="Total Days icon"
              />
            </div>
          </div>
        </div>

        {/* Average Attendance Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Avg. Attendance</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">92%</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/average_attendance.png"
                alt="Average Attendance icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trends */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Attendance Trends</h2>
          <AttendanceTrendsChart dataPoints={attendanceData} />
        </div>

        {/* Leave Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-md font-semibold text-gray-800 mb-4">Leave Type Distribution</h2>
          <div className="h-64">
            <LeaveChartDistribution leaveRequests={leaveRequests} />
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img
              width="16.5px"
              height="16.5px"
              src="/images/search.png"
              alt="Search icon"
            />
          </div>
          <input
            type="text"
            placeholder="Search leave requests"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
          />
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[120px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs text-neutral-900 font-semibold">
              All Status
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img
                width="9.5px"
                height="5.1px"
                src="/images/dropdown.png"
                alt="Dropdown icon"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[120px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs text-neutral-900 font-semibold">
              All Types
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img
                width="9.5px"
                height="5.1px"
                src="/images/dropdown.png"
                alt="Dropdown icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Table */}
      <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave Requests ({leaveRequests.length})
          </div>
          <button className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors">
            <img src="/images/new_download.png" alt="Export Report" className="h-5 w-5" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Leave Type</th>
                <th className="py-3 font-medium">Dates</th>
                <th className="py-3 font-medium">Days</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Applied</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="flex items-center gap-3 py-4">
                      <img
                        src={request.image}
                        alt={request.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">{request.name}</div>
                        <div className="text-xs text-gray-600">{request.department}</div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{request.type}</td>
                    <td className="text-sm text-gray-600">{`${request.from} - ${request.to}`}</td>
                    <td className="text-sm text-gray-600">{request.days}</td>
                    <td>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          request.status === "Pending"
                            ? "bg-gray-100 text-gray-800"
                            : request.status === "Approved"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">{request.applied}</td>
                    <td className="relative">
                      <button
                        className="text-gray-600 text-xl"
                        onClick={() => toggleActionMenu(request.id)}
                        aria-label="Open actions menu"
                      >
                        ⋯
                      </button>

                      {activeActionId === request.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-40">
                          <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              alert(`Viewing details for ${request.name}`);
                              setActiveActionId(null);
                            }}
                          >
                            <img
                              src="/images/eye_icon.png"
                              alt="View"
                              className="w-4 h-4"
                            />
                            View
                          </button>

                          <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-600"
                            onClick={() => handleStatusChange(request.id, "Approved")}
                          >
                            <img src="/images/approve.png" alt="Approve" className="w-4 h-4" />
                            Accept
                          </button>

                          <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-500 hover:bg-red-50"
                            onClick={() => handleStatusChange(request.id, "Rejected")}
                          >
                            <img src="/images/reject.png" alt="Reject" className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, leaveRequests.length)} of {leaveRequests.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.ceil(leaveRequests.length / itemsPerPage) }, (_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg ${currentPage === pageNum ? 'bg-teal-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage((prev) => prev < Math.ceil(leaveRequests.length / itemsPerPage) ? prev + 1 : prev)}
              disabled={currentPage >= Math.ceil(leaveRequests.length / itemsPerPage)}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage >= Math.ceil(leaveRequests.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Today's Clock-ins & Todos */}
      <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold">Today's Clock-ins & Todo's</div>
            <div className="text-sm text-gray-600 font-normal">
              View what employees are working on today (14 checked in)
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-teal-500 text-teal-600 text-sm hover:bg-teal-50 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
            Live Updates
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Department</th>
                <th className="py-3 font-medium">Today's Tasks</th>
                <th className="py-3 font-medium">Clock In</th>
                <th className="py-3 font-medium">Clock Out</th>
                <th className="py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                {
                  name: "Sarah Johnson",
                  status: "Checked",
                  type: "Remote",
                  color: "#3A86FF",
                  department: "Marketing",
                  tasks: ["Working on HR Dashboard"],
                  clockIn: "8:15 AM",
                  clockOut: "5:58 PM",
                  image: "/images/sarah.png"
                },
                {
                  name: "Nathanael Mumo",
                  status: "Pending",
                  type: "Hybrid",
                  color: "#e7b213",
                  department: "Marketing",
                  tasks: ["Blog and linked in update", "Ontap branding"],
                  clockIn: "8:15 AM",
                  clockOut: "⋯",
                  image: "/images/michael.png"
                },
                {
                  name: "Peter William",
                  status: "Pending",
                  type: "In-Office",
                  color: "#4fc560",
                  department: "Tech",
                  tasks: ["Blog and linked in update", "Ontap branding"],
                  clockIn: "8:15 AM",
                  clockOut: "⋯",
                  image: "/images/david.png"
                },
                {
                  name: "Lisa Anderson",
                  status: "Pending",
                  type: "In-Office",
                  color: "#4fc560",
                  department: "Human Resource",
                  tasks: ["Blog and linked in update", "Ontap branding"],
                  clockIn: "8:15 AM",
                  clockOut: "⋯",
                  image: "/images/lisa.png"
                },
              ].map((emp, index) => (
                <tr key={index} className="border-b">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.image}
                        alt={emp.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">{emp.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: emp.color }}
                          />
                          {emp.type}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-600">{emp.department}</td>
                  <td className="text-sm text-gray-600">
                    {emp.tasks.map((task, i) => (
                      <div key={i} className="mb-1 last:mb-0">
                        {i + 1}. {task}
                      </div>
                    ))}
                  </td>
                  <td className="text-sm text-gray-800">{emp.clockIn}</td>
                  <td className="text-sm text-gray-600">{emp.clockOut}</td>
                  <td>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        emp.status === "Checked"
                          ? "bg-teal-100 text-teal-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>Showing 4 to 25</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 rounded-lg bg-teal-500 text-white">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}