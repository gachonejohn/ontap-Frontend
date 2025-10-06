import React, { useState } from "react";
import LeaveChartDistribution from "./charts/LeaveChartDistribution";

import AttendanceList from "../attendance/Attendance";
import AttendanceTrendsChart from "./charts/AttendaceTrends";
import {
  useGetAttendaceQuery,
  useGetAttendanceTrendsQuery,
} from "@store/services/attendance/attendanceService";

export default function MainLeaveAttendanceDashboardContent() {
  const { data, isLoading, error } = useGetAttendanceTrendsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: attendance,
    isLoading: aattendanceLoading,
    error: aattendanceError,
  } = useGetAttendaceQuery({}, { refetchOnMountOrArgChange: true });
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
      applied: "2025-12-01",
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
      applied: "2025-12-01",
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
      applied: "2025-12-01",
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
      applied: "2025-12-01",
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
      applied: "2025-12-01",
    },
  ]);
  console.log("data", data);
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
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave & Attendance
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage employee leave requests and attendance records.
          </div>
        </div>
        <button className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors">
          <img
            src="/images/new_download.png"
            alt="Export Report"
            className="h-5 w-5"
          />
          Export Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Pending Requests Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Pending Requests
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {leaveRequests.filter((req) => req.status === "Pending").length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-500 shadow-sm">
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
              <div className="text-sm text-gray-600 font-medium">
                Approved This Month
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                3
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-500 shadow-sm">
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
              <div className="text-sm text-gray-600 font-medium">
                Total Days Requested
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                36
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-purple-500 shadow-sm">
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
              <div className="text-sm text-gray-600 font-medium">
                Avg. Attendance
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {attendance?.average_attendance_percent ?? 0} %
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/average_attendance.png"
                alt="Average Attendance icon"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Today's Clock-ins & Todo's */}
      <AttendanceList />
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Attendance Trends */}
        <div className="">
          <AttendanceTrendsChart data={data} isLoading={isLoading} />;
        </div>

        {/* Leave Distribution */}
        <div className="">
          <LeaveChartDistribution leaveRequests={leaveRequests} />
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
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((request) => (
                  <tr key={request.id} className="border-b">
                    <td className="flex items-center gap-3 py-4">
                      <img
                        src={request.image}
                        alt={request.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">
                          {request.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {request.department}
                        </div>
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
                            onClick={() =>
                              handleStatusChange(request.id, "Approved")
                            }
                          >
                            <img
                              src="/images/approve.png"
                              alt="Approve"
                              className="w-4 h-4"
                            />
                            Accept
                          </button>

                          <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-500 hover:bg-red-50"
                            onClick={() =>
                              handleStatusChange(request.id, "Rejected")
                            }
                          >
                            <img
                              src="/images/reject.png"
                              alt="Reject"
                              className="w-4 h-4"
                            />
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, leaveRequests.length)} of{" "}
            {leaveRequests.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Previous
            </button>

            {Array.from(
              { length: Math.ceil(leaveRequests.length / itemsPerPage) },
              (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === pageNum
                        ? "bg-teal-500 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(leaveRequests.length / itemsPerPage)
                    ? prev + 1
                    : prev
                )
              }
              disabled={
                currentPage >= Math.ceil(leaveRequests.length / itemsPerPage)
              }
              className={`px-3 py-1 rounded-lg border border-gray-200 ${
                currentPage >= Math.ceil(leaveRequests.length / itemsPerPage)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
