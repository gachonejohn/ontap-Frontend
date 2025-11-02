import React, { useState, useRef, useEffect } from 'react';
import AddEmployeeModal from './AddEmployeeModal';
import ActionsDropdown from './ActionsDropdown';
import TaskCompletionChart from '../components/TaskCompletionChart';
import TrainingProgressChart from '../components/TrainingProgressChart';
import { useAppSelector } from '../../../store/hooks';

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAppSelector((state) => state.auth);
  console.log('user', user);
  // Get dashboard permission
  const dashboardPermission = user?.role?.permissions?.find((p) => p.feature_code === 'dashboard');
  console.log('dashboardPermission', dashboardPermission);
  const canViewAll = dashboardPermission?.can_view_all;
  const canView = dashboardPermission?.can_view;

  const itemsPerPage = 4;

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

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

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

  const employees = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'Senior Developer',
      department: 'Engineering',
      image: '/images/sarah.png',
    },
    {
      name: 'Michael Chen',
      email: 'michael.c@company.com',
      role: 'Marketing Lead',
      department: 'Engineering',
      image: '/images/michael.png',
    },
    {
      name: 'David Wilson',
      email: 'david.w@company.com',
      role: 'Product Manager',
      department: 'Product',
      image: '/images/david.png',
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.a@company.com',
      role: 'Senior Developer',
      department: 'Engineering',
      image: '/images/lisa.png',
    },
    {
      name: 'Michael Chen',
      email: 'michael.c@company.com',
      role: 'Marketing Lead',
      department: 'Engineering',
      image: '/images/michael.png',
    },
    {
      name: 'David Wilson',
      email: 'david.w@company.com',
      role: 'Product Manager',
      department: 'Product',
      image: '/images/david.png',
    },
  ];

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
            <div className="text-lg text-neutral-900 font-semibold">HR Dashboard</div>
            <div className="text-sm text-gray-600 font-normal">
              Welcome back, Admin. Here is what's happening at your company.
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {/* Card 1 */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Total Employees</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">25</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+12 vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/total_employees.png"
                    alt="Total Employees icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">New Hires This Month</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">8</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+3 vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/total_employees.png"
                    alt="New Hires icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Pending Leave Requests</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">8</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+3 vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/pending_leave.png"
                    alt="Pending Leave icon"
                  />
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Payroll Summary</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">$485k</div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">+2.5 vs last month</div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2l h-8 w-8 bg-blue-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/payroll_summary.png"
                    alt="Payroll Summary icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table + Leave Requests section */}
          <div className="flex flex-col lg:flex-row gap-6 w-full">
            {/* Employee Table */}
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white flex-1">
              <div className="flex justify-between items-center">
                <div className="text-lg text-neutral-900 font-semibold">Employee Management</div>
                <button
                  onClick={() => setShowAddEmployeeModal(true)}
                  className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
                >
                  <img src="/images/add_employees.png" alt="Add Employee" className="h-5 w-5" />
                  Add Employee
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-3 font-medium">Employee</th>
                      <th className="py-3 font-medium">Role</th>
                      <th className="py-3 font-medium">Department</th>
                      <th className="py-3 font-medium">Status</th>
                      <th className="py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((emp, index) => (
                        <tr key={index} className="border-b">
                          <td className="flex items-center gap-3 py-4">
                            <img
                              src={emp.image}
                              alt={emp.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-sm text-neutral-900 font-medium">{emp.name}</div>
                              <div className="text-xs text-gray-600">{emp.email}</div>
                            </div>
                          </td>
                          <td className="text-sm text-gray-600">{emp.role}</td>
                          <td className="text-sm text-gray-600">{emp.department}</td>
                          <td>
                            <span className="px-3 py-1 rounded-full bg-green-100 text-xs text-green-800 font-medium">
                              Active
                            </span>
                          </td>
                          <td>
                            <button className="text-gray-600 text-xl">⋯</button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, employees.length)} of {employees.length}{' '}
                  entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>

                  {Array.from(
                    { length: Math.ceil(employees.length / itemsPerPage) },
                    (_, index) => {
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
                    }
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev < Math.ceil(employees.length / itemsPerPage) ? prev + 1 : prev
                      )
                    }
                    disabled={currentPage >= Math.ceil(employees.length / itemsPerPage)}
                    className={`px-3 py-1 rounded-lg border border-gray-200 ${currentPage >= Math.ceil(employees.length / itemsPerPage) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Leave Requests */}
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
            {/* Task Completion Chart */}
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white">
              <div className="text-lg text-neutral-900 font-semibold">
                Task Completion by Department
              </div>
              <TaskCompletionChart data={taskCompletionData} />
            </div>

            {/* Training Progress Chart */}
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
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                    <span>Not Started</span>
                  </div>
                  <span>7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Recent Announcements */}
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

            {/* Digital Cards Management */}
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
        // Limited content for can_view
        <div>
          <h1 className="text-2xl font-semibold">HR Dashboard (Limited Access)</h1>
          <p className="text-gray-600">You have view-only access.</p>
          {/* Render only what you want for limited users */}
        </div>
      ) : (
        // No access
        <p className="text-gray-600">Nothing to show</p>
      )}
      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={showAddEmployeeModal}
        onClose={() => setShowAddEmployeeModal(false)}
      />
    </div>
  );
}
