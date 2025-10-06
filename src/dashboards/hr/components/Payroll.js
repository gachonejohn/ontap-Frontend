import React, { useState } from "react";
import PayrollDetailsModal from "../components/PayrollDetailsModal";
import AttendanceTrendsChart from "../components/AttendanceTrendsChart";
import LeaveChartDistribution from "../components/LeaveChartDistribution";

export default function Payroll() {
  const [activeActionId, setActiveActionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPayrollDetails, setShowPayrollDetails] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const itemsPerPage = 3;

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, type: "Annual Leave", status: "Pending", name: "John Doe" },
    { id: 2, type: "Sick Leave", status: "Approved", name: "Jane Smith" },
    { id: 3, type: "Personal Leave", status: "Rejected", name: "Alice Brown" },
  ]);

  const payrollData = [
    {
      id: 1,
      name: "Sarah Johnson",
      department: "Engineering",
      image: "/images/sarah.png",
      payPeriod: "December 2024",
      basicSalary: "$4,000",
      overtime: "$500",
      bonus: "$500",
      netpay: "$5,000",
      status: "Processed"
    },
    {
      id: 2,
      name: "Victor Josh",
      department: "Design",
      image: "/images/michael.png",
      payPeriod: "December 2024",
      basicSalary: "$3,800",
      overtime: "$600",
      bonus: "$300",
      netpay: "$4,700",
      status: "Pending"
    },
    {
      id: 3,
      name: "David Wilson",
      department: "Engineering",
      image: "/images/david.png",
      payPeriod: "December 2024",
      basicSalary: "$4,200",
      overtime: "$400",
      bonus: "$400",
      netpay: "$5,000",
      status: "Processed"
    },
    {
      id: 4,
      name: "Lisa Anderson",
      department: "Engineering",
      image: "/images/lisa.png",
      payPeriod: "December 2024",
      basicSalary: "$4,100",
      overtime: "$300",
      bonus: "$600",
      netpay: "$5,000",
      status: "Processed"
    },
  ];

  const attendanceData = {
    engineering: [75, 78, 76, 80, 85],
    design: [60, 65, 62, 64, 66],
    product: [50, 52, 55, 58, 60],
  };

  const toggleActionMenu = (id) => {
    setActiveActionId(activeActionId === id ? null : id);
  };

  const handleStatusChange = (id, status) => {
    setLeaveRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
    );
    setActiveActionId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">Payroll Management</div>
        <div className="text-sm text-gray-600 font-normal">
          Manage employee payroll, salaries and compensation.
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Payroll Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Payroll</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">$41,250</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-teal-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/total_payroll.png"
                alt="Total Payroll icon"
              />
            </div>
          </div>
        </div>

        {/* Pending Payrolls Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Pending Payrolls</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">3</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/pending_payroll.png"
                alt="Pending Payrolls icon"
              />
            </div>
          </div>
        </div>

        {/* Processed This Month Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Processed This Month</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">22</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/approved.png"
                alt="Processed icon"
              />
            </div>
          </div>
        </div>

        {/* Average Attendance Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Avg. Attendance</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">95%</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
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
          <h2 className="text-md font-semibold text-gray-800 mb-4">
            Monthly Payroll Trends
          </h2>
          <AttendanceTrendsChart dataPoints={attendanceData} />
        </div>

        {/* Leave Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="text-md font-semibold text-gray-800 mb-4">
            Department Payroll Distribution
          </h2>
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
            placeholder="Search payslips"
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

      {/* Payroll Table */}
      <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div className="text-lg text-neutral-900 font-semibold">
            Employee Payroll ({payrollData.length})
          </div>
          <button 
            onClick={() => {
              setSelectedPayroll(payrollData[0]);
              setShowPayrollDetails(true);
            }}
            className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
          >
            <img src="/images/new_download.png" alt="Export Report" className="h-5 w-5" />
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-3 font-medium">Employee</th>
                <th className="py-3 font-medium">Pay Period</th>
                <th className="py-3 font-medium">Basic Salary</th>
                <th className="py-3 font-medium">Overtime</th>
                <th className="py-3 font-medium">Bonus</th>
                <th className="py-3 font-medium">Netpay</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrollData
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="flex items-center gap-3 py-4">
                      <img
                        src={employee.image}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm text-neutral-900 font-medium">{employee.name}</div>
                        <div className="text-xs text-gray-600">{employee.department}</div>
                      </div>
                    </td>
                    <td className="text-sm text-gray-600">{employee.payPeriod}</td>
                    <td className="text-sm text-gray-600">{employee.basicSalary}</td>
                    <td className="text-sm text-gray-600">{employee.overtime}</td>
                    <td className="text-sm text-gray-600">{employee.bonus}</td>
                    <td className="text-sm text-gray-600">{employee.netpay}</td>
                    <td>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          employee.status === "Processed"
                            ? "bg-teal-100 text-teal-800"
                            : employee.status === "Pending"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="relative">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-gray-600"
                          onClick={() => toggleActionMenu(employee.id)}
                          aria-label={activeActionId === employee.id ? "Close actions menu" : "Open actions menu"}
                        >
                          <img
                            src="/images/eye_icon.png"
                            alt="View"
                            className="w-5 h-5"
                          />
                        </button>

                        {activeActionId === employee.id && (
                          <span
                            className="text-xs px-3 py-1 rounded-full bg-teal-500 text-white select-none"
                          >
                            Processed
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, payrollData.length)} of {payrollData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.ceil(payrollData.length / itemsPerPage) }, (_, index) => {
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
              onClick={() => setCurrentPage((prev) => prev < Math.ceil(payrollData.length / itemsPerPage) ? prev + 1 : prev)}
              disabled={currentPage >= Math.ceil(payrollData.length / itemsPerPage)}
              className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage >= Math.ceil(payrollData.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Payroll Details Modal */}
      {showPayrollDetails && (
        <PayrollDetailsModal
          payroll={selectedPayroll}
          onClose={() => setShowPayrollDetails(false)}
        />
      )}
    </div>
  );
}