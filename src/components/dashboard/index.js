import React, { useState, useRef, useEffect } from 'react';
import { toast } from "react-toastify";
import ActionsDropdown from '../../dashboards/hr/components/ActionsDropdown';
import TaskCompletionChart from './charts/TaskCompletionChart';
import TrainingProgressChart from '../../dashboards/hr/components/TrainingProgressChart';
import { useAppSelector } from '../../store/hooks';
import EmployeeDashboardContent from '../employees/EmployeeContent';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { 
  useGetLeaveRequestsQuery, 
  useApproveLeaveRequestMutation, 
  useRejectLeaveRequestMutation 
} from '@store/services/leaves/leaveService';
import RecentEmployees from './RecentEmployees';
import { CustomDate } from '../../utils/dates';
import LeaveDetails from '../leaves/LeaveDetails';
import ActionModal from '../common/Modals/ActionModal';

export default function Dashboard() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Leave management states
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isLeaveDetailsModalOpen, setIsLeaveDetailsModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const { user } = useAppSelector((state) => state.auth);
  const {
    data: employeesData,
    isLoading: employeesLoading,
    error: employeesError,
  } = useGetEmployeesQuery({}, { refetchOnMountOrArgChange: true });

  // Fetch leave requests - get first page and take only 2 latest records
  const {
    data: leaveRequestsData,
    isLoading: leaveRequestsLoading,
    error: leaveRequestsError,
    refetch: refetchLeaveRequests
  } = useGetLeaveRequestsQuery({
    page: 1,
    ordering: '-created_at' // Order by most recent first
  });

  // Leave mutations
  const [approveLeaveRequest] = useApproveLeaveRequestMutation();
  const [rejectLeaveRequest] = useRejectLeaveRequestMutation();

  // Get dashboard permission
  const dashboardPermission = user?.role?.permissions?.find((p) => p.feature_code === 'dashboard');
  const canViewAll = dashboardPermission?.can_view_all;
  const canView = dashboardPermission?.can_view;

  const itemsPerPage = 4;

  // Employees data
  const employees = employeesData?.results || [];
  const totalCount = employeesData?.count || 0;

  // Leave requests data - take only first 2 records from the response
  const allLeaveRequests = leaveRequestsData?.results || [];
  const latestLeaveRequests = allLeaveRequests.slice(0, 2); // Take only first 2 records
  const totalLeaveRequestsCount = leaveRequestsData?.count || 0;

  // Count pending leave requests for the stats card (from all requests, not just the 2 displayed)
  const pendingLeaveRequestsCount = allLeaveRequests.filter(
    request => request.status === 'PENDING'
  ).length;

  // Process leave requests for display
  const processLeaveRequests = (data) => {
    if (!data || data.length === 0) return [];
    
    return data.map(request => ({
      id: request.id,
      name: request.employee_name || "Unknown Employee",
      days: `${parseFloat(request.days) || 0} days`,
      type: request.leave_type_name || request.leave_policy_name || "Leave",
      date: `${CustomDate(request.start_date)} - ${CustomDate(request.end_date)}`,
      reason: request.reason || "No reason provided",
      status: request.status || "PENDING",
      created_at: request.created_at,
      rawData: request
    }));
  };

  const processedLeaveRequests = processLeaveRequests(latestLeaveRequests);

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

  // Handle leave request status change
  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(true);
    try {
      if (newStatus === "APPROVED") {
        await approveLeaveRequest(id).unwrap();
        toast.success("Leave request approved successfully!");
      } else if (newStatus === "REJECTED") {
        await rejectLeaveRequest(id).unwrap();
        toast.success("Leave request rejected successfully!");
      }
      
      // Refetch leave requests to update the UI
      await refetchLeaveRequests();
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast.error("Failed to update leave request. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle view details
  const handleViewDetails = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setIsLeaveDetailsModalOpen(true);
  };

  // Open action modal
  const openActionModal = (type, id) => {
    setSelectedItem(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // Handle confirm action from modal
  const handleConfirmAction = async () => {
    if (modalType === "approve" && selectedItem) {
      await handleStatusChange(selectedItem, "APPROVED");
    } else if (modalType === "reject" && selectedItem) {
      await handleStatusChange(selectedItem, "REJECTED");
    }
    closeModal();
  };

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

  // Get status badge styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
      case 'DECLINED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
      case 'DECLINED':
        return 'Rejected';
      default:
        return status;
    }
  };

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

            {/* Card 3 - Pending Leave Requests (now dynamic) */}
            <div
              className="flex flex-col justify-between p-4 rounded-xl h-[120px] 
             bg-white transition-transform duration-200 hover:-translate-y-1 shadow-sm border hover:shadow-md"
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">Pending Leave Requests</div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {pendingLeaveRequestsCount}
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    {leaveRequestsLoading ? 'Loading...' : '+0 vs last month'}
                  </div>
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
            
            {/* Leave Requests Section */}
            <div className="flex flex-col gap-4 p-4 rounded-xl shadow-sm bg-white w-full lg:w-[300px]">
              <div className="flex justify-between items-center">
                <div className="text-lg text-neutral-900 font-semibold">Latest Leave Requests</div>
                {leaveRequestsLoading && (
                  <div className="text-xs text-gray-500">Loading...</div>
                )}
              </div>
              
              {leaveRequestsError ? (
                <div className="text-sm text-red-500 text-center py-4">
                  Failed to load leave requests
                </div>
              ) : processedLeaveRequests.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No leave requests found
                </div>
              ) : (
                processedLeaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex flex-col gap-3 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-neutral-900 font-medium">{req.name}</div>
                      <span className="px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700">
                        {req.days}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-600">{req.type}</div>
                      <span className={`px-2 py-1 rounded-md border text-xs ${getStatusStyles(req.status)}`}>
                        {formatStatus(req.status)}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Dates:</span> {req.date}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </div>
                    
                    {/* Show action buttons only for pending requests */}
                    {req.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openActionModal("approve", req.id)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md bg-green-500 text-white text-xs hover:bg-green-600 disabled:bg-green-300 transition-colors"
                        >
                          <img src="/images/approve.png" alt="Approve" className="w-4 h-4" />
                          {actionLoading ? 'Processing...' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => openActionModal("reject", req.id)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-md border border-red-400 text-red-500 text-xs hover:bg-red-50 disabled:bg-gray-100 transition-colors"
                        >
                          <img src="/images/reject.png" alt="Reject" className="w-4 h-4" />
                          {actionLoading ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                    )}
                    
                    {/* Show view details for non-pending requests */}
                    {req.status !== 'PENDING' && (
                      <button 
                        onClick={() => handleViewDetails(req.id)}
                        className="w-full py-1.5 rounded-md border border-gray-300 text-gray-600 text-xs hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                ))
              )}
              
              {/* Show message if there are more requests available */}
              {totalLeaveRequestsCount > 2 && (
                <div className="text-xs text-gray-500 text-center pt-2 border-t">
                  {totalLeaveRequestsCount - 2} more requests available in Leave section
                </div>
              )}
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

          {/* Action Modal */}
          <ActionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            actionType={modalType === "approve" ? "submit" : "delete"}
            onDelete={handleConfirmAction}
            isDeleting={actionLoading}
            title={
              modalType === "approve" ? "Approve Leave Request" : "Reject Leave Request"
            }
            confirmationMessage={
              modalType === "approve"
                ? "Are you sure you want to approve this leave request?"
                : "Are you sure you want to reject this leave request?"
            }
            deleteMessage="This action will update the employee's leave status."
            actionText={modalType === "approve" ? "Approve" : "Reject"}
          />

          {/* Leave Details Modal */}
          <LeaveDetails
            isOpen={isLeaveDetailsModalOpen}
            onClose={() => setIsLeaveDetailsModalOpen(false)}
            leaveId={selectedLeaveId}
            isAdminView={true}
          />
        </>
      ) : canView ? (
        <EmployeeDashboardContent />
      ) : (
        <p className="text-gray-600">Nothing to show</p>
      )}
    </div>
  );
}