import React, { useState, useRef, useEffect } from 'react';
import ActionsDropdown from '../../dashboards/hr/components/ActionsDropdown';
import TaskCompletionChart from './charts/TaskCompletionChart';
import TrainingProgressChart from '../../dashboards/hr/components/TrainingProgressChart';
import { useAppSelector } from '../../store/hooks';
import EmployeeDashboardContent from '../employees/EmployeeContent';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import RecentEmployees from './RecentEmployees';

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAppSelector((state) => state.auth);
  const {
    data: employeesData,
    isLoading,
    error,
  } = useGetEmployeesQuery({}, { refetchOnMountOrArgChange: true });

  // Get dashboard permission
  const dashboardPermission = user?.role?.permissions?.find((p) => p.feature_code === 'dashboard');
  const canViewAll = dashboardPermission?.can_view_all;
  const canView = dashboardPermission?.can_view;

  const itemsPerPage = 4;

  // Employees data
  const employees = employeesData?.results || [];
  const totalCount = employeesData?.count || 0;

  // --- Hire calculations ---
  const getNewHiresThisMonth = () => {
    const now = new Date();
    return employees.filter((emp) => {
      const createdDate = new Date(emp.created_at);
      return (
        createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear()
      );
    }).length;
  };

  const getNewHiresLastMonth = () => {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

    return employees.filter((emp) => {
      const createdDate = new Date(emp.created_at);
      return createdDate.getMonth() === lastMonth && createdDate.getFullYear() === year;
    }).length;
  };

  const hiresThisMonth = getNewHiresThisMonth();
  const hiresLastMonth = getNewHiresLastMonth();
  const hiresDiff = hiresThisMonth - hiresLastMonth;

  // Dropdown logic
  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const taskCompletionData = [
    { department: 'Engineering', completion: 85 },
    { department: 'Design', completion: 35 },
    { department: 'Product', completion: 65 },
    { department: 'Marketing', completion: 25 },
    { department: 'Sales', completion: 75 },
    { department: 'HR', completion: 90 },
  ];

  const trainingData = [
    { label: 'Completed', value: 68, color: '#14b8a6' },
    { label: 'In Progress', value: 25, color: '#22d3ee' },
    { label: 'Not Started', value: 7, color: '#d1d5db' },
  ];

  const handleTrainingSegmentClick = (segment) => {
    alert(`Clicked: ${segment.label} - ${segment.value}%`);
  };

  const leaveRequests = [
    {
      name: 'Alex Kumar',
      days: '10 days',
      type: 'Annual Leave',
      date: 'Sep 08-15',
      reason: 'Holiday vacation',
    },
    {
      name: 'Maria Garcia',
      days: '3 days',
      type: 'Sick Leave',
      date: 'Sep 08-15',
      reason: 'Medical appointment',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {canViewAll ? (
        <>
          {/* Dashboard Header */}
          <div className="flex flex-col gap-1.5">
            <div className="text-lg text-neutral-900 font-semibold">Dashboard</div>
            <div className="text-sm text-gray-600 font-normal">
              Welcome back, Admin. Here is what's happening at your company.
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Card 1 - Total Employees */}
            <div
              className="flex flex-col justify-between p-4 rounded-xl h-[120px] 
             bg-white transition-transform duration-200 hover:-translate-y-1 shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Total Employees</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {employeesData?.count ?? 0}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    {hiresDiff >= 0 ? `+${hiresDiff}` : hiresDiff} vs last month
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-600 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/total_employees.png"
                    alt="Total Employees icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 - New Hires This Month */}
            <div
              className="flex flex-col justify-between p-4 rounded-xl h-[120px] 
             bg-white transition-transform duration-200 hover:-translate-y-1 shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">New Hires This Month</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {hiresThisMonth}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    {hiresDiff >= 0 ? `+${hiresDiff}` : hiresDiff} vs last month
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/total_employees.png"
                    alt="New Hires icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 - Pending Leave Requests (static for now) */}
            <div
              className="flex flex-col justify-between p-4 rounded-xl h-[120px] 
             bg-white transition-transform duration-200 hover:-translate-y-1 shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Pending Leave Requests</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">8</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+3 vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/pending_leave.png"
                    alt="Pending Leave icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 4 - Payroll Summary (static for now) */}
            <div
              className="flex flex-col justify-between p-4 rounded-xl h-[120px] 
             bg-white transition-transform duration-200 hover:-translate-y-1 shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Payroll Summary</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">$485k</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+2.5% vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/payroll_summary.png"
                    alt="Payroll Summary icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table + Leave Requests */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            <RecentEmployees />
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white w-full lg:w-[300px]">
              <div className="text-lg text-neutral-900 font-semibold">Leave Requests</div>
              {leaveRequests.map((req, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-900 font-medium">{req.name}</div>
                    <span className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                      {req.days}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">{req.type}</div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Dates:</span> {req.date}
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Reason:</span> {req.reason}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white text-xs hover:bg-green-600">
                      <img src="/images/approve.png" alt="Approve" className="w-4 h-4" />
                      Approve
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-red-400 text-red-500 text-xs hover:bg-red-50">
                      <img src="/images/reject.png" alt="Reject" className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold">
                Task Completion by Department
              </div>
              <TaskCompletionChart data={taskCompletionData} />
            </div>
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold">Training Progress</div>
              <div className="flex justify-center">
                <TrainingProgressChart
                  data={trainingData}
                  onSegmentClick={handleTrainingSegmentClick}
                />
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    <span>Completed</span>
                  </div>
                  <span>68%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                    <span>In Progress</span>
                  </div>
                  <span>25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  <span>Not Started</span>
                  <span>7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Announcements */}
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
              <div className="flex justify-between items-center">
                <div className="text-lg text-neutral-900 font-semibold">Recent Announcements</div>
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                  <img src="/images/icon_2.png" alt="Create New" className="w-4 h-4" />
                  Create New
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { title: 'Company Holiday: Labor Day Schedule', date: 'Aug 26, 2025' },
                  { title: 'Office Relocation Update', date: 'Aug 28, 2025' },
                  { title: 'New Remote Work Policy', date: 'Aug 28, 2025' },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="text-sm text-neutral-900 font-medium">{item.title}</div>
                    <div className="text-xs text-gray-600">{item.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Cards */}
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold">Digital Cards Management</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 font-medium text-gray-600">Employee</th>
                      <th className="py-3 px-4 font-medium text-gray-600">ID Card</th>
                      <th className="py-3 px-4 font-medium text-gray-600">Business Card</th>
                      <th className="py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">
                        <div className="text-sm text-neutral-900">Sarah Johnson</div>
                        <div className="text-xs text-gray-600">Engineering</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-black text-white text-xs">
                          Issued
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-black text-white text-xs">
                          Issued
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ActionsDropdown />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">
                        <div className="text-sm text-neutral-900">Michael Chen</div>
                        <div className="text-xs text-gray-600">Product</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-black text-white text-xs">
                          Issued
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 text-xs">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ActionsDropdown />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">
                        <div className="text-sm text-neutral-900">Victor Josh</div>
                        <div className="text-xs text-gray-600">Design</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-red-600 text-white text-xs">
                          Revoked
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-black text-white text-xs">
                          Issued
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <ActionsDropdown />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : canView ? (
        <EmployeeDashboardContent />
      ) : (
        <p className="text-gray-600">Nothing to show</p>
      )}
    </div>
  );
}
