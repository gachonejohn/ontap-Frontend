import React from 'react';
import { useGetLeaveRequestsQuery } from '@store/services/leaves/leaveService';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { CustomDate } from '../../utils/dates';

const LeaveDetails = ({ isOpen, onClose, leaveId, isAdminView = false }) => {
  const { data: leaveRequestsData, isLoading, error } = useGetLeaveRequestsQuery(
    { page: 1, page_size: 100 },
    { refetchOnMountOrArgChange: true, skip: !isOpen } 
  );

  if (!isOpen) return null;

  // Find the specific leave request
  const leaveRequest = leaveRequestsData?.results?.find(request => request.id === leaveId);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white overflow-hidden">
          <div className="flex items-center justify-center p-12">
            <ContentSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error || !leaveRequest) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white overflow-hidden">
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="text-red-500 text-lg font-medium mb-2">
              Error Loading Leave Details
            </div>
            <div className="text-gray-500 text-sm">
              {error ? "Failed to load leave details" : "Leave request not found"}
            </div>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    if (!name) return "EE";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'border-green-200 bg-green-100 text-green-800';
      case 'REJECTED':
        return 'border-red-200 bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'border-yellow-200 bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING':
      default:
        return 'Pending';
    }
  };

  const getTypeStyles = (type) => {
    switch (type?.toLowerCase()) {
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

  const displayData = {
    employeeName: leaveRequest.employee_name || "Unknown Employee",
    position: "Employee", 
    leaveType: leaveRequest.leave_type_name || "Leave",
    status: leaveRequest.status || "PENDING",
    leavePeriod: `${CustomDate(leaveRequest.start_date)} - ${CustomDate(leaveRequest.end_date)}`,
    duration: `${parseFloat(leaveRequest.days) || 0} days`,
    submittedOn: CustomDate(leaveRequest.created_at),
    reason: leaveRequest.reason || "No reason provided",
    processedBy: leaveRequest.approved_by || "Not processed yet",
    processedOn: leaveRequest.status !== 'PENDING' ? CustomDate(leaveRequest.updated_at) : "Not processed yet",
    managerComments: leaveRequest.status !== 'PENDING' ? 
      `Leave request was ${leaveRequest.status.toLowerCase()}` : 
      "Waiting for approval",
    requestId: `LR-${String(leaveRequest.id).padStart(6, '0')}`,
    initials: getInitials(leaveRequest.employee_name),
    document: leaveRequest.document 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="flex flex-row justify-between items-start p-6 w-full bg-white">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-blue-100 overflow-hidden">
              <img
                width="20px"
                height="20px"
                src="/images/viewleave.png"
                alt="Leave Details Icon"
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-1 h-6">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                Leave Request Details
              </div>
              {isAdminView && (
                <div className="font-inter text-xs text-blue-600 font-medium">
                  Admin View
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-start items-end gap-2">
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 pt-0">
          <div className="flex flex-col justify-start items-start gap-6 w-full">
            {/* Employee Info */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex justify-between items-center gap-4">
                <div className="flex flex-row justify-center items-center rounded-full w-16 h-16 bg-indigo-100 overflow-hidden">
                  <div className="font-inter text-[18px] whitespace-nowrap text-indigo-700 text-opacity-100 leading-7 tracking-normal font-normal">
                    {displayData.initials}
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center">
                    <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold">
                      {displayData.employeeName}
                    </div>
                  </div>
                  <div className="flex justify-start items-center">
                    <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                      {displayData.position}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-start items-start gap-2">
                <div className={`flex flex-row justify-center items-center gap-1 py-0.5 px-2 rounded-lg border h-5 ${getTypeStyles(displayData.leaveType)}`}>
                  <div className="font-inter text-xs whitespace-nowrap leading-4 font-medium">
                    {displayData.leaveType}
                  </div>
                </div>
                <div className={`flex flex-row justify-center items-center gap-1 py-0.5 px-2 rounded-lg border h-5 ${getStatusColor(displayData.status)}`}>
                  <div className="font-inter text-xs whitespace-nowrap leading-4 font-medium">
                    {getStatusText(displayData.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-black/10"></div>

            {/* Leave Information */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex justify-start items-center w-full">
                <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold">
                  Leave Information
                </div>
              </div>
              <div className="flex justify-start items-start gap-4 w-full">
                {/* Leave Period */}
                <div className="flex flex-col justify-start items-start p-4 rounded-lg border border-green-200 bg-green-50 flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <img
                      className="mt-0.5"
                      width="16.5px"
                      height="16.5px"
                      src="/images/leavecalendar.png"
                      alt="Calendar Icon"
                    />
                    <div className="flex flex-col justify-start items-start gap-1 flex-1">
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                          Leave Period
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm text-gray-900 text-opacity-100 leading-6 tracking-normal font-medium">
                          {displayData.leavePeriod}
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-normal">
                          Duration: {displayData.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submitted On */}
                <div className="flex flex-col justify-start items-start p-4 rounded-lg border border-gray-200 bg-gray-50 flex-1">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5">
                      <path d="M15.8333 3.33334H4.16667C3.24619 3.33334 2.5 4.07954 2.5 5.00001V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V5.00001C17.5 4.07954 16.7538 3.33334 15.8333 3.33334Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.3333 1.66666V4.99999" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.66667 1.66666V4.99999" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 8.33334H17.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex flex-col justify-start items-start gap-1 flex-1">
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                          Submitted On
                        </div>
                      </div>
                      <div className="flex flex-col justify-center items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-medium">
                          {displayData.submittedOn}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason for Leave */}
              <div className="flex flex-col justify-start items-start p-4 rounded-lg border border-gray-200 bg-gray-50 w-full">
                <div className="flex justify-between items-start gap-3 w-full">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0">
                    <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 13.3333V10" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 6.66667H10.0083" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="flex flex-col justify-start items-start gap-1 flex-1">
                    <div className="flex justify-start items-center w-full">
                      <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                        Reason for Leave
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-full">
                      <div className="font-inter text-sm text-gray-900 text-opacity-100 leading-6 tracking-normal font-normal">
                        {displayData.reason}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Attachment - Show if document exists */}
              {displayData.document && (
                <div className="flex flex-col justify-start items-start p-4 rounded-lg border border-blue-200 bg-blue-50 w-full">
                  <div className="flex justify-between items-start gap-3 w-full">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5 flex-shrink-0">
                      <path d="M13 3H7C5.89543 3 5 3.89543 5 5V15C5 16.1046 5.89543 17 7 17H13C14.1046 17 15 16.1046 15 15V5C15 3.89543 14.1046 3 13 3Z" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 7H11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11H11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 13H11" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="flex flex-col justify-start items-start gap-1 flex-1">
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-blue-600 text-opacity-100 leading-5 tracking-normal font-normal">
                          Attached Document
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-full">
                        <a 
                          href={displayData.document} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-inter text-sm text-blue-700 text-opacity-100 leading-6 tracking-normal font-medium underline hover:text-blue-800"
                        >
                          View Document
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full h-px bg-black/10"></div>

            {/* Processing Details - Show different info based on role and status */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex justify-start items-center gap-2 w-full">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M16.6667 2.5L7.50001 11.6667L3.33334 7.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.3333 10V15.8333C18.3333 16.7538 17.5871 17.5 16.6667 17.5H3.33334C2.41286 17.5 1.66667 16.7538 1.66667 15.8333V2.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold">
                  {isAdminView ? 'Processing Details' : 'Request Status'}
                </div>
              </div>
              
              <div className={`flex flex-col justify-start items-start p-4 rounded-lg border w-full ${
                displayData.status === 'PENDING' 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : displayData.status === 'APPROVED'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                {isAdminView ? (
                  // Admin View - Show processing information
                  <>
                    <div className="flex justify-start items-start gap-4 w-full">
                      <div className="flex flex-col justify-start items-start gap-1 flex-1">
                        <div className="flex justify-start items-center w-full">
                          <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                            Processed By
                          </div>
                        </div>
                        <div className="flex justify-start items-center w-full">
                          <div className="font-inter text-sm text-gray-900 text-opacity-100 leading-6 tracking-normal font-medium">
                            {displayData.processedBy}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start gap-1 flex-1">
                        <div className="flex justify-start items-center w-full">
                          <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                            Processed On
                          </div>
                        </div>
                        <div className="flex justify-start items-center w-full">
                          <div className="font-inter text-sm text-gray-900 text-opacity-100 leading-6 tracking-normal font-medium">
                            {displayData.processedOn}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 pt-4 mt-4 border-t border-gray-200 w-full">
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                          Manager Comments
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-full">
                        <div className="font-inter text-sm text-gray-900 text-opacity-100 leading-6 tracking-normal font-normal">
                          {displayData.managerComments}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Employee View - Show status information
                  <div className="flex flex-col justify-start items-start gap-3 w-full">
                    <div className="flex justify-between items-center w-full">
                      <div className="font-inter text-sm text-gray-600">
                        Current Status:
                      </div>
                      <div className={`font-inter text-sm font-medium ${
                        displayData.status === 'APPROVED' ? 'text-green-700' :
                        displayData.status === 'REJECTED' ? 'text-red-700' : 'text-yellow-700'
                      }`}>
                        {getStatusText(displayData.status)}
                      </div>
                    </div>
                    
                    {displayData.status !== 'PENDING' && (
                      <>
                        <div className="flex justify-between items-center w-full">
                          <div className="font-inter text-sm text-gray-600">
                            Processed By:
                          </div>
                          <div className="font-inter text-sm text-gray-900 font-medium">
                            {displayData.processedBy}
                          </div>
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="font-inter text-sm text-gray-600">
                            Processed On:
                          </div>
                          <div className="font-inter text-sm text-gray-900 font-medium">
                            {displayData.processedOn}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <div className="flex flex-col justify-start items-start gap-1 pt-3 mt-3 border-t border-gray-200 w-full">
                      <div className="font-inter text-sm text-gray-600 mb-1">
                        Comments:
                      </div>
                      <div className="font-inter text-sm text-gray-900">
                        {displayData.managerComments}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col justify-start items-start pt-4 border-t border-neutral-200 w-full">
              <div className="flex justify-center items-center w-full">
                <div className="font-inter text-xs whitespace-nowrap text-gray-500 text-opacity-100 leading-4 font-normal">
                  Request ID: {displayData.requestId}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveDetails;