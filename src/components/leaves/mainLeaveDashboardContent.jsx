import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import {
  useGetLeaveRequestsQuery,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
} from "@store/services/leaves/leaveService";
import ActionModal from "../common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import { CustomDate } from "../../utils/dates";
import LeaveDetails from "./LeaveDetails";
import { PAGE_SIZE } from "@constants/constants";

export default function MainLeaveAttendanceDashboardContent() {
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("pendingLeaves");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [daysFilter, setDaysFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [isLeaveDetailsModalOpen, setIsLeaveDetailsModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setAllLeaveRequests([]);
      setHasMore(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    setAllLeaveRequests([]);
    setHasMore(true);
  }, [statusFilter, debouncedSearchTerm]);

  const statusMap = {
    "All": "All Status",
    "PENDING": "Pending",
    "APPROVED": "Approved",
    "DECLINED": "Declined",
    "REJECTED": "Rejected",
    "CANCELLED": "Cancelled"
  };

  const daysMap = {
    "All": "All Days",
    "1": "1 Day Ago",
    "3": "3 Days Ago",
    "7": "7 Days Ago",
    "10": "10 Days Ago",
    "14": "14 Days Ago",
    "21": "21 Days Ago",
    "30": "30 Days Ago",
    "60": "60 Days Ago",
    "90": "90 Days Ago"
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));
  const daysOptions = Object.entries(daysMap).map(([key, value]) => ({ key, value }));

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "All" ? statusFilter : undefined,
    }),
    [currentPage, debouncedSearchTerm, statusFilter]
  );

  const {
    data: leaveRequestsData,
    refetch: refetchLeaveRequests,
    isFetching,
  } = useGetLeaveRequestsQuery(queryParams);

  const [approveLeaveRequest] = useApproveLeaveRequestMutation();
  const [rejectLeaveRequest] = useRejectLeaveRequestMutation();

  useEffect(() => {
    if (leaveRequestsData?.results) {
      if (currentPage === 1) {
        setAllLeaveRequests(leaveRequestsData.results);
      } else {
        setAllLeaveRequests(prev => {
          const newRequests = leaveRequestsData.results.filter(
            newRequest => !prev.some(existingRequest => existingRequest.id === newRequest.id)
          );
          return [...prev, ...newRequests];
        });
      }
      
      setHasMore(leaveRequestsData.next !== null);
    }
  }, [leaveRequestsData, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetching]);

  const processLeaveRequests = (data) => {
    if (!data || data.length === 0) return [];
    
    return data.map(request => ({
      id: request.id,
      name: request.employee_name || "Unknown Employee",
      department: "", 
      initials: getInitials(request.employee_name),
      type: request.leave_type_name || request.leave_policy_name || "Leave",
      from: CustomDate(request.start_date),
      to: CustomDate(request.end_date),
      days: parseFloat(request.days) || 0,
      status: request.status || "PENDING",
      applied: CustomDate(request.created_at),
      reason: request.reason || "No reason provided",
      created_at: request.created_at,
      rawData: request 
    }));
  };

  const getInitials = (name) => {
    if (!name) return "EE";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const processedRequests = processLeaveRequests(allLeaveRequests);

  const filteredByDays = useMemo(() => {
    if (daysFilter === "All") return processedRequests;

    const today = new Date();
    const filterDays = parseInt(daysFilter);
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - filterDays);

    return processedRequests.filter(request => {
      if (!request.created_at) return false;
      const requestDate = new Date(request.created_at);
      return requestDate >= pastDate && requestDate <= today;
    });
  }, [processedRequests, daysFilter]);

  const pendingRequests = filteredByDays.filter(req => req.status === "PENDING");
  const approvedRequests = filteredByDays.filter(req => req.status === "APPROVED");
  const rejectedRequests = filteredByDays.filter(req => req.status === "REJECTED" || req.status === "DECLINED");

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setIsStatusDropdownOpen(false);
  };

  const handleDaysFilterChange = (days) => {
    setDaysFilter(days);
    setIsDaysDropdownOpen(false);
  };

  const handleViewDetails = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setIsLeaveDetailsModalOpen(true);
  };

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
      
      setCurrentPage(1);
      setAllLeaveRequests([]);
      setHasMore(true);
      await refetchLeaveRequests();
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast.error("Failed to update leave request. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (type, id) => {
    setSelectedItem(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmAction = async () => {
    if (modalType === "approve" && selectedItem) {
      await handleStatusChange(selectedItem, "APPROVED");
    } else if (modalType === "reject" && selectedItem) {
      await handleStatusChange(selectedItem, "REJECTED");
    }
    closeModal();
  };

  const getCurrentRequests = () => {
    switch (activeTab) {
      case "pendingLeaves":
        return pendingRequests;
      case "leaveRecords":
        return filteredByDays;
      default:
        return filteredByDays;
    }
  };

  const currentRequests = getCurrentRequests();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <div className="flex justify-between items-center mb-1 py-1">
        <div className="flex flex-col gap-1">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave Approvals
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage employee leave requests.
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Pending Requests Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Pending
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {pendingRequests.length}
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

        {/* Approved Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Approved
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {approvedRequests.length}
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

        {/* Rejected Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Rejected
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {rejectedRequests.length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-lg h-7 w-7 bg-red-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/Rejected.png"
                alt="Rejected icon"
              />
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Total
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {leaveRequestsData?.count || allLeaveRequests.length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-lg h-7 w-7 bg-blue-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/whiteleave.png"
                alt="Total Leave icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex flex-row justify-center items-center gap-2 p-2 rounded-lg border-r border-slate-100 h-10 cursor-pointer ${
            activeTab === "pendingLeaves" ? "bg-white" : ""
          } flex-1`}
          onClick={() => setActiveTab("pendingLeaves")}
        >
          <div className={`font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide ${
            activeTab === "pendingLeaves" ? "font-semibold" : "font-medium"
          }`}>
            Pending Leaves
          </div>
        </div>
        <div
          className={`flex flex-row justify-center items-center gap-2 p-2 h-8 cursor-pointer ${
            activeTab === "leaveRecords" ? "bg-white" : ""
          } flex-1`}
          onClick={() => setActiveTab("leaveRecords")}
        >
          <div className={`font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide ${
            activeTab === "leaveRecords" ? "font-semibold" : "font-medium"
          }`}>
            Leave Records
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col justify-center items-center rounded-xl w-full p-4 shadow-sm bg-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
          {/* Search Bar */}
          <div className="flex flex-row justify-start items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-sm bg-white flex-1 max-w-2xl">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.5px"
                height="16.5px"
                src="/images/search.png"
                alt="Search Icon"
              />
            </div>
            <input
              type="text"
              placeholder="Search by employee name or leave type..."
              className="font-inter text-xs w-full bg-transparent border-none outline-none text-gray-400 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-row justify-start items-center gap-2 flex-wrap">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <div 
                className="gap-2 flex flex-row justify-center items-center p-2 rounded-lg border border-neutral-200 h-11 bg-white min-w-[125px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <div className="flex flex-row justify-start items-center gap-1">
                  <div className="flex justify-center items-center h-5">
                    <img
                      width="16.3px"
                      height="16.3px"
                      src="/images/filter.png"
                      alt="Filter Icon"
                    />
                  </div>
                  <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-semibold">
                    {statusMap[statusFilter] || "All Status"}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center w-4 h-4">
                  <img
                    width="9.5px"
                    height="5.1px"
                    src="/images/dropdown.png"
                    alt="Dropdown Icon"
                  />
                </div>
              </div>

              {/* Status Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                  {statusOptions.map(({ key, value }) => (
                    <div
                      key={key}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                        statusFilter === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                      }`}
                      onClick={() => handleStatusFilterChange(key)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Days Filter Dropdown */}
            <div className="relative">
              <div 
                className="flex flex-row justify-center items-center rounded-lg border border-neutral-200 bg-gray-200 overflow-hidden cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
              >
                <div className="flex flex-row justify-center items-center gap-2 p-2 bg-white min-w-[108px]">
                  <div className="flex flex-row justify-start items-center gap-1 h-4">
                    <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-semibold">
                      {daysMap[daysFilter] || "All Days"}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center w-4 h-4">
                    <img
                      width="9.5px"
                      height="5.1px"
                      src="/images/dropdown.png"
                      alt="Dropdown Icon"
                    />
                  </div>
                </div>
              </div>

              {/* Days Dropdown Menu */}
              {isDaysDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
                  {daysOptions.map(({ key, value }) => (
                    <div
                      key={key}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                        daysFilter === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                      }`}
                      onClick={() => handleDaysFilterChange(key)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isFetching && allLeaveRequests.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <ContentSpinner />
        </div>
      ) : (
        <>
          {activeTab === "pendingLeaves" ? (
            /* Pending Leaves Tab Content */
            <div className="flex flex-col gap-6 w-full">
              {/* Leave Request Cards - Responsive Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                {currentRequests.map((request) => (
                  <LeaveRequestCard 
                    key={request.id} 
                    request={request} 
                    onStatusChange={handleStatusChange}
                    onOpenModal={openActionModal}
                    onViewDetails={handleViewDetails}
                    isLoading={actionLoading}
                  />
                ))}
              </div>

              {/* No Pending Requests Message */}
              {currentRequests.length === 0 && !isFetching && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-500 text-lg font-medium">
                    No pending leave requests
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    {searchTerm ? "Try adjusting your search terms" : "All leave requests have been processed"}
                  </div>
                </div>
              )}

              {/* Infinite Scroll Observer Target */}
              <div 
                ref={observerTarget} 
                className="w-full h-10 flex items-center justify-center"
              >
                {isFetching && hasMore && (
                  <div className="text-sm text-gray-500 py-4">Loading more leave requests...</div>
                )}
              </div>
            </div>
          ) : (
            /* Leave Records Tab Content */
            <div className="flex flex-col gap-6 w-full">
              {/* Leave Records Cards - Responsive Grid Layout */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                {currentRequests.map((request) => (
                  <LeaveRequestCard 
                    key={request.id} 
                    request={request} 
                    onStatusChange={handleStatusChange}
                    onOpenModal={openActionModal}
                    onViewDetails={handleViewDetails}
                    isLoading={actionLoading}
                  />
                ))}
              </div>

              {/* No Records Message */}
              {currentRequests.length === 0 && !isFetching && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-gray-500 text-lg font-medium">
                    No leave records found
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    {searchTerm ? "Try adjusting your search terms" : "No leave requests available"}
                  </div>
                </div>
              )}

              {/* Infinite Scroll Observer Target */}
              <div 
                ref={observerTarget} 
                className="w-full h-10 flex items-center justify-center"
              >
                {isFetching && hasMore && (
                  <div className="text-sm text-gray-500 py-4">Loading more leave requests...</div>
                )}
              </div>
            </div>
          )}
        </>
      )}

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
    </div>
  );
}

// Separate component for Leave Request Card
const LeaveRequestCard = ({ request, onStatusChange, onOpenModal, onViewDetails, isLoading }) => {
  const getTypeStyles = (type) => {
    switch (type.toLowerCase()) {
      case "vacation":
      case "annual leave":
        return "border-blue-200 bg-blue-100 text-blue-800";
      case "personal":
      case "personal leave":
        return "border-gray-200 bg-gray-100 text-slate-800";
      case "sick leave":
        return "border-purple-200 bg-purple-100 text-purple-800";
      default:
        return "border-blue-200 bg-blue-100 text-blue-800";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PENDING":
        return "border-orange-200 bg-orange-100 text-orange-800";
      case "APPROVED":
        return "border-green-200 bg-green-100 text-green-800";
      case "REJECTED":
      case "DECLINED":
        return "border-red-200 bg-red-100 text-red-800";
      default:
        return "border-orange-200 bg-orange-100 text-orange-800";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "APPROVED":
        return "Approved";
      case "REJECTED":
      case "DECLINED":
        return "Rejected";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col justify-start items-start rounded-xl border border-neutral-200 bg-white overflow-hidden w-full">
      <div className="flex flex-col justify-start items-start gap-4 p-6 w-full">
        {/* Employee Info Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
          <div className="flex justify-start items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-row justify-center items-center rounded-full w-12 h-12 bg-indigo-100 overflow-hidden flex-shrink-0">
              <div className="font-inter text-base whitespace-nowrap text-indigo-700 text-opacity-100 leading-6 tracking-normal font-normal">
                {request.initials}
              </div>
            </div>
            <div className="flex flex-col justify-start items-start min-w-0 flex-1">
              <div className="flex justify-start items-center w-full">
                <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold truncate">
                  {request.name}
                </div>
              </div>
              {request.department && (
                <div className="flex flex-col justify-center items-center w-full">
                  <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal truncate">
                    {request.department}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-start items-start gap-2 flex-shrink-0">
            <div className={`flex flex-row justify-center items-center gap-1 py-0.5 px-2 rounded-lg border h-5 ${getTypeStyles(request.type)}`}>
              <div className="font-inter text-xs whitespace-nowrap leading-4 font-medium">
                {request.type}
              </div>
            </div>
            <div className={`flex flex-row justify-center items-center gap-1 py-0.5 px-2 rounded-lg border h-5 ${getStatusStyles(request.status)}`}>
              <div className="font-inter text-xs whitespace-nowrap leading-4 font-medium">
                {formatStatus(request.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Period */}
        <div className="flex flex-col justify-start items-start p-3 rounded-lg w-full bg-gray-50">
          <div className="flex flex-row justify-start items-center gap-2 w-full">
            <img
              width="16px"
              height="16px"
              src="/images/calendar.png"
              alt="Calendar Icon"
              className="flex-shrink-0"
            />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 sm:gap-0">
              <div className="font-inter text-sm whitespace-nowrap text-gray-700 text-opacity-100 leading-5 tracking-normal font-normal">
                {request.from} - {request.to}
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-normal">
                ({request.days} days)
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col justify-start items-start gap-1 w-full">
          <div className="flex justify-start items-center w-full">
            <div className="font-inter text-sm whitespace-nowrap text-gray-700 text-opacity-100 leading-5 tracking-normal font-medium">
              Reason:
            </div>
          </div>
          <div className="flex justify-start items-center w-full">
            <div className="font-inter text-sm text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal break-words">
              {request.reason}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-start items-start gap-3 pt-4 border-t border-neutral-200 w-full">
          <div className="flex justify-start items-center w-full">
            <div className="font-inter text-xs whitespace-nowrap text-gray-500 text-opacity-100 leading-4 font-normal">
              Submitted on {request.applied}
            </div>
          </div>
          
          {/* Status and Actions */}
          {request.status === "PENDING" ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <button
                onClick={() => onOpenModal("approve", request.id)}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 rounded-lg h-8 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 transition-colors px-4"
              >
                <div className="flex flex-col justify-center items-center h-4">
                  <img
                    width="12px"
                    height="8.7px"
                    src="/images/approveleave.png"
                    alt="Approve Icon"
                  />
                </div>
                <div className="font-inter text-sm whitespace-nowrap text-white text-opacity-100 leading-5 tracking-normal font-medium">
                  {isLoading ? "Processing..." : "Approve"}
                </div>
              </button>
              <button
                onClick={() => onOpenModal("reject", request.id)}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 rounded-lg border border-red-200 h-8 bg-white hover:bg-red-50 disabled:bg-gray-100 transition-colors px-4"
              >
                <img
                  width="16px"
                  height="16px"
                  src="/images/reject.png"
                  alt="Reject Icon"
                />
                <div className="font-inter text-sm whitespace-nowrap text-red-600 text-opacity-100 leading-5 tracking-normal font-medium">
                  {isLoading ? "Processing..." : "Reject"}
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onViewDetails(request.id)}
              className="flex justify-center items-center rounded-lg border border-teal-500 w-full h-8 bg-white cursor-pointer hover:bg-teal-50 transition-colors"
            >
              <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-medium">
                View Details
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};