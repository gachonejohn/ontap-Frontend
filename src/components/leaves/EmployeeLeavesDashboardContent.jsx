import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import ApplyLeave from "./ApplyLeave";
import ApplySpecialLeave from "./ApplySpecialLeave";
import LeaveDetailsModal from "./LeaveDetails";
import {
  useGetEmployeeLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
} from "@store/services/leaves/leaveService";
import { CustomDate } from "../../utils/dates";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import { PAGE_SIZE } from "@constants/constants";

const EmployeeLeavesDashboardContent = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isSpecialLeaveModalOpen, setIsSpecialLeaveModalOpen] = useState(false);
  const [isLeaveDetailsModalOpen, setIsLeaveDetailsModalOpen] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [activeTab, setActiveTab] = useState("leaveManagement");

  const [currentPage, setCurrentPage] = useState(1);
  const [allLeaveRequests, setAllLeaveRequests] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const {
    data: leaveBalancesData,
    isLoading: loadingBalances,
    isFetching: isFetchingBalances,
    error: balancesError,
  } = useGetEmployeeLeaveBalancesQuery();

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: leaveRequestsData,
    refetch,
    isFetching,
    isLoading: loadingLeaveRequests,
  } = useGetLeaveRequestsQuery(queryParams);

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

  const totalLeaveRequestsCount = leaveRequestsData?.count || allLeaveRequests.length;

  const handleOpenLeaveDetails = (leaveId) => {
    setSelectedLeaveId(leaveId);
    setIsLeaveDetailsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-teal-500';
      case 'approved':
        return 'bg-green-600';
      case 'declined':
      case 'rejected':
        return 'bg-red-600';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '/images/approveleave.png';
      case 'declined':
      case 'rejected':
        return '/images/declineleave.png';
      default:
        return null;
    }
  };

  const calculateProgressPercentage = (usedDays, allocatedDays) => {
    if (allocatedDays === 0) return 0;
    
    const percentage = (parseFloat(usedDays) / parseFloat(allocatedDays)) * 100;
    return Math.min(percentage, 100); 
  };

  const handleLeaveSuccess = () => {
    setCurrentPage(1);
    setAllLeaveRequests([]);
    setHasMore(true);
    refetch();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Leave Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave Management
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Track and apply for your leave
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          <div 
            className="flex justify-center items-center rounded-md w-40 h-12 bg-orange-400 cursor-pointer hover:bg-orange-500 transition-colors"
            onClick={() => setIsSpecialLeaveModalOpen(true)}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex justify-center items-center w-5 h-5">
                <img
                  width="20px"
                  height="20px"
                  src="/images/Addleave.png"
                  alt="Special Leave icon"
                />
              </div>
              <div className="text-sm text-white font-medium">
                Special Leave
              </div>
            </div>
          </div>
          <div
            className="flex justify-center items-center rounded-md w-40 h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
            onClick={() => setIsLeaveModalOpen(true)}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex justify-center items-center w-5 h-5">
                <img
                  width="20px"
                  height="20px"
                  src="/images/Addleave.png"
                  alt="Apply Leave icon"
                />
              </div>
              <div className="text-sm text-white font-medium">
                Apply for Leave
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards - Dynamic from Backend */}
      {loadingBalances ? (
        <div className="flex justify-center items-center py-12">
          <ContentSpinner />
        </div>
      ) : balancesError ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          Error loading leave balances
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full items-center">
          {leaveBalancesData?.results && leaveBalancesData.results.map((balance) => {
            const usedDays = parseFloat(balance.used_days) || 0;
            const remainingDays = parseFloat(balance.remaining_days) || 0;
            const allocatedDays = parseFloat(balance.allocated_days) || 0;
            const progressPercentage = calculateProgressPercentage(usedDays, allocatedDays);
            
            return (
              <div key={balance.id} className="flex flex-col justify-start items-start gap-4 p-4 rounded-xl min-h-[121px] shadow-sm bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex flex-row justify-between items-start w-full h-5">
                  <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    {balance.leave_type_name}
                  </div>
                  <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                    <div className="flex flex-row justify-center items-center gap-1 h-4">
                      <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-semibold">
                        {allocatedDays}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-1.5 w-full h-[53px]">
                  <div className="flex flex-row justify-between items-center w-full h-4">
                    <div className="font-inter text-xs whitespace-nowrap text-gray-600 text-opacity-100 leading-tight font-medium">
                      Used days
                    </div>
                    <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-medium">
                      {usedDays} days
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-teal-500 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full h-3.5">
                    <div className="font-inter text-xs whitespace-nowrap text-gray-600 text-opacity-100 leading-tight font-medium">
                      Remaining
                    </div>
                    <div className="font-inter text-xs whitespace-nowrap text-teal-500 text-opacity-100 leading-tight font-medium">
                      {remainingDays} days
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "leaveManagement" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("leaveManagement")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "leaveManagement" ? "font-semibold" : "font-medium"
            }`}
          >
            Leave Management
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "leaveBalance" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("leaveBalance")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "leaveBalance" ? "font-semibold" : "font-medium"
            }`}
          >
            Leave Policy
          </div>
        </div>
      </div>

      {activeTab === "leaveManagement" ? (
        /* Leave Management Content - My Leave Requests */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white overflow-hidden">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-row justify-between items-center gap-12 w-full">
              <div className="flex flex-row justify-start items-center gap-4">
                <div className="flex flex-col justify-start items-start gap-1.5">
                  <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    My Leave Requests
                  </div>
                  <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                    All your leave activities, neatly organized and up to date
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Leave Requests Content */}
          {isFetching && allLeaveRequests.length === 0 ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : allLeaveRequests && allLeaveRequests.length > 0 ? (
            <>
              <div className="flex flex-col justify-start items-center gap-5 p-4 w-full">
                <div className="grid grid-cols-2 gap-6 w-full">
                  {allLeaveRequests.map((request) => (
                    <div key={request.id} className="flex flex-col justify-start items-start rounded-xl border border-neutral-200 bg-white overflow-hidden">
                      <div className="flex flex-col justify-center items-center gap-4 p-6 w-full">
                        <div className="flex flex-row justify-between items-center w-full">
                          <div className="flex flex-row justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-blue-200 h-9 bg-blue-100">
                            <div className="font-inter text-xs whitespace-nowrap text-blue-800 text-opacity-100 leading-snug tracking-normal font-medium">
                              {request.leave_type_name || request.leave_policy_name || 'Leave'}
                            </div>
                          </div>
                          {request.status?.toLowerCase() !== 'pending' && (
                            <div 
                              className="gap-2 flex flex-row justify-center items-center w-9 h-8 rounded-md border border-neutral-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => handleOpenLeaveDetails(request.id)}
                            >
                              <img
                                width="18px"
                                height="18px"
                                src="/images/viewleave.png"
                                alt="View icon"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col justify-start items-start p-3 rounded-lg w-full bg-gray-50">
                          <div className="flex flex-row justify-start items-center gap-2 w-full">
                            <img
                              width="16px"
                              height="16px"
                              src="/images/leavecalendar.png"
                              alt="Calendar icon"
                            />
                            <div className="flex justify-between items-center w-full">
                              <div className="font-inter text-sm whitespace-nowrap text-gray-700 text-opacity-100 leading-5 tracking-normal font-normal">
                                {CustomDate(request.start_date)} - {CustomDate(request.end_date)}
                              </div>
                              <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-normal">
                                ({parseFloat(request.days) || 0} days)
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-1 w-full">
                          <div className="flex justify-start items-center w-full">
                            <div className="font-inter text-sm whitespace-nowrap text-gray-700 text-opacity-100 leading-5 tracking-normal font-medium">
                              Reason:
                            </div>
                          </div>
                          <div className="flex justify-start items-center w-full">
                            <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                              {request.reason || 'No reason provided'}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-start items-start gap-3 pt-4 border-t border-neutral-200 w-full">
                          <div className="flex justify-start items-center w-full">
                            <div className="font-inter text-xs whitespace-nowrap text-gray-500 text-opacity-100 leading-4 font-normal">
                              Submitted on {CustomDate(request.created_at)}
                            </div>
                          </div>
                          <div className={`flex justify-center items-center rounded-lg w-full h-8 ${getStatusColor(request.status)}`}>
                            <div className="flex flex-row justify-center items-center gap-1">
                              {getStatusIcon(request.status) && (
                                <div className="flex flex-col justify-center items-center h-4">
                                  <img
                                    width="13.5px"
                                    height="9.8px"
                                    src={getStatusIcon(request.status)}
                                    alt="Status icon"
                                  />
                                </div>
                              )}
                              <div className="font-inter text-sm whitespace-nowrap text-white text-opacity-100 leading-5 tracking-normal font-medium">
                                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1).toLowerCase()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infinite Scroll Observer Target */}
              <div 
                ref={observerTarget} 
                className="w-full h-10 flex items-center justify-center"
              >
                {isFetching && hasMore && (
                  <div className="text-sm text-gray-500 py-4">Loading more leave requests...</div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <NoDataFound message="No leave requests found. Start by applying for leave!" />
            </div>
          )}
        </div>
      ) : (
        /* Leave Balance Content - Leave Policy */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-row justify-start items-center gap-4">
              <div className="flex flex-col justify-start items-start gap-1.5">
                <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Leave Policy
                </div>
                <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  Review the company's official guidelines on leave entitlements and approvals.
                </div>
              </div>
            </div>
          </div>

          {loadingBalances ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : balancesError ? (
            <div className="bg-red-50 p-4 rounded-md text-red-800 text-center w-full">
              Error loading leave policies
            </div>
          ) : (
            <div className="flex flex-col justify-start items-start gap-4 p-4 w-full">
              {leaveBalancesData?.results && leaveBalancesData.results.map((balance, index) => {
                const bgColors = [
                  'bg-blue-50',
                  'bg-orange-50',
                  'bg-purple-50',
                  'bg-green-50',
                ];
                const textColors = [
                  'text-blue-900',
                  'text-yellow-800',
                  'text-purple-900',
                  'text-green-900',
                ];
                const borderColors = [
                  'border-blue-200',
                  'border-orange-200',
                  'border-purple-200',
                  'border-green-200',
                ];
                const labelColors = [
                  'text-blue-700',
                  'text-orange-700',
                  'text-purple-700',
                  'text-green-700',
                ];

                const colorIndex = index % bgColors.length;

                return (
                  <div 
                    key={balance.id}
                    className={`flex justify-start items-center p-3 rounded-lg w-full ${bgColors[colorIndex]} border ${borderColors[colorIndex]}`}
                  >
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                      <div className={`font-inter text-base whitespace-nowrap ${textColors[colorIndex]} text-opacity-100 leading-tight font-medium`}>
                        {balance.leave_type_name}
                      </div>
                      <div className={`font-inter text-xs whitespace-nowrap ${labelColors[colorIndex]} text-opacity-100 leading-snug tracking-normal font-medium`}>
                        Allocated: {balance.allocated_days} days | Used: {parseFloat(balance.used_days)} days | Remaining: {parseFloat(balance.remaining_days)} days
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Leave Modals */}
      <ApplyLeave
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={handleLeaveSuccess}
      />
      
      <ApplySpecialLeave
        isOpen={isSpecialLeaveModalOpen}
        onClose={() => setIsSpecialLeaveModalOpen(false)}
        onSuccess={handleLeaveSuccess}
      />

      <LeaveDetailsModal
        isOpen={isLeaveDetailsModalOpen}
        onClose={() => setIsLeaveDetailsModalOpen(false)}
        leaveId={selectedLeaveId}
      />
    </div>
  );
};

export default EmployeeLeavesDashboardContent;