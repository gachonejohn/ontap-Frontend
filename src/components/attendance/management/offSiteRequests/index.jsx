import NoDataFound from '@components/common/NoData';
import { useMemo, useState } from 'react';
import { FiCalendar, FiCheck, FiClock, FiMapPin, FiX } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';

import { YearMonthCustomDate } from '@utils/dates';
import FilterSelect from '@components/common/FilterSelect';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { useGetOffsiteRequestsQuery, useUpdateOffSiteRequestMutation } from '@store/services/attendance/attendanceService';
import { toast } from 'react-toastify';
import ActionModal from '@components/common/Modals/ActionModal';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const timeRangeOptions = [
  { value: '', label: 'All Time' },
  { value: '1', label: '1 month ago' },
  { value: '3', label: '3 months ago' },
  { value: '6', label: '6 months ago' },
  { value: '12', label: '12 months ago' },
];

const OffOfficeRequests = () => {
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams] = useSearchParams();

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      status: searchParams.get('status') || '',
      time_range: searchParams.get('time_range') || '3',
      date: searchParams.get('date') || '',
      from_date: searchParams.get('from_date') || '',
      to_date: searchParams.get('to_date') || '',
    },
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const {
    data: offsiteData,
    isLoading: loadingData,
    error,
    refetch,
  } = useGetOffsiteRequestsQuery(queryParams, { refetchOnMountOrArgChange: true });

  const [updateOffSiteRequest, { isLoading: isUpdatingOffSiteRequest }] = useUpdateOffSiteRequestMutation();

  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const handleTimeRangeChange = (selectedOption) => {
    handleFilterChange({
      time_range: selectedOption ? selectedOption.value : '',
    });
  };

  const openApproveModal = (id) => {
    setSelectedItem(id);
    setModalType('approve');
    setIsModalOpen(true);
  };

  const openRejectModal = (id) => {
    setSelectedItem(id);
    setModalType('reject');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleApproveOffSiteRequest = async () => {
    if (!selectedItem) {
      toast.error('No offsite request selected');
      closeModal();
      return;
    }

    try {
      const res = await updateOffSiteRequest({
        id: selectedItem,
        action: 'approve'
      }).unwrap();
      const msg = res?.message || 'Offsite request approved successfully!';
      toast.success(msg);
      closeModal();
      await refetch();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error approving offsite request!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const handleRejectOffSiteRequest = async () => {
    if (!selectedItem) {
      toast.error('No offsite request selected');
      closeModal();
      return;
    }

    try {
      const res = await updateOffSiteRequest({
        id: selectedItem,
        action: 'reject'
      }).unwrap();
      const msg = res?.message || 'Offsite request rejected successfully!';
      toast.success(msg);
      closeModal();
      await refetch();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error rejecting offsite request!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-5 bg-white rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex p-6 flex-col md:flex-row md:items-center border-b md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Off-Site Requests Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve employee requests for off-site work activities
          </p>
        </div>

        {/* Filters */}
           <div className="flex flex-col sm:flex-row gap-3">
  {/* Status Filter - add flex-col and label for alignment */}
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
    <FilterSelect
      options={statusOptions}
      value={
        statusOptions.find((option) => option.value === filters.status) || statusOptions[0]
      }
      onChange={handleStatusChange}
      placeholder="All Status"
      defaultLabel="All Status"
    />
  </div>

  {/* Time Range Filter - add flex-col and label for alignment */}
  {/* <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-700 mb-1">Time Range</label>
    <FilterSelect
      options={timeRangeOptions}
      value={
        timeRangeOptions.find((option) => option.value === filters.time_range) ||
        timeRangeOptions[2]
      }
      onChange={handleTimeRangeChange}
      placeholder="3 months ago"
      defaultLabel="3 months ago"
    />
  </div> */}

  {/* From Date */}
  <div className="flex flex-col">
    <label htmlFor="from_date" className="text-xs font-medium text-gray-700 mb-1">
      From Date
    </label>
    <input
      id="from_date"
      type="date"
      name="from_date"
      value={filters.from_date}
      onChange={handleFilterChange}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
    />
  </div>

  {/* To Date */}
  <div className="flex flex-col">
    <label htmlFor="to_date" className="text-xs font-medium text-gray-700 mb-1">
      To Date
    </label>
    <input
      id="to_date"
      type="date"
      name="to_date"
      value={filters.to_date}
      onChange={handleFilterChange}
      className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
    />
  </div>
</div>
      </div>

      {loadingData ? (
        <div className="flex justify-center py-12">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-xl text-red-800 text-center">
          {'status' in error && error.data?.error
            ? error.data.error
            : 'An error occurred while fetching offsite requests.'}
        </div>
      ) : offsiteData && offsiteData.results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {offsiteData.results.map((request) => {
              const user = request.employee?.user;
              const position = request.employee?.position?.title || 'No Position';
              let profilePic = user?.profile_picture;

              if (profilePic && !profilePic.startsWith('http')) {
                profilePic = `${API_BASE_URL}${profilePic}`;
              }

              if (!profilePic) {
                profilePic = defaultProfile;
              }

              return (
                <div
                  key={request.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {profilePic !== defaultProfile ? (
                          <img
                            src={profilePic}
                            alt={`${user?.first_name} ${user?.last_name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = defaultProfile;
                            }}
                          />
                        ) : (
                          <span className="text-lg">
                            {getInitials(user?.first_name, user?.last_name)}
                          </span>
                        )}
                      </div>

                      {/* Name and Position */}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">{position}</p>
                      </div>
                    </div>

                    {/* Request Type Badge */}
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                      {request.request_type}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Location:</p>
                    <p className="text-sm text-gray-600">{request.location}</p>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Date:</p>
                      <p className="text-sm text-gray-900">{YearMonthCustomDate(request.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Time:</p>
                      <p className="text-sm text-gray-900">
                        {formatTime(request.start_time)} - {formatTime(request.end_time)}
                      </p>
                    </div>
                  </div>

                  {/* Purpose/Reason */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                    <p className="text-sm text-gray-600">{request.reason}</p>
                  </div>

                  {/* Submitted Date */}
                  <p className="text-xs text-gray-500 mb-4 pb-2 border-b">
                    Submitted on {YearMonthCustomDate(request.created_at)}
                  </p>

                  {/* Action Buttons */}
                  {request.status === 'PENDING' ? (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openApproveModal(request.id)}
                        className="flex-1 bg-teal-600 text-white py-2.5 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FiCheck className="w-5 h-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => openRejectModal(request.id)}
                        className="flex-1 bg-white border border-red-300 text-red-600 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FiX className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`text-center py-2.5 flex items-center justify-center space-x-2 rounded-lg font-medium ${
                        request.status === 'APPROVED'
                          ? 'bg-primary text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {request.status === 'APPROVED' ? (
                        <>
                          <FiCheck className="w-5 h-5" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <FiX className="w-5 h-5" />
                          <span>Declined</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {offsiteData.count > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-4">
              <Pagination
                currentPage={currentPage}
                totalItems={offsiteData.count}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12">
          <NoDataFound message="No offsite requests found" />
        </div>
      )}

      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        actionType={modalType === 'approve' ? 'submit' : 'delete'}
        onDelete={modalType === 'approve' ? handleApproveOffSiteRequest : handleRejectOffSiteRequest}
        isDeleting={isUpdatingOffSiteRequest}
        title={modalType === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
        confirmationMessage={
          modalType === 'approve'
            ? 'Are you sure you want to approve this offsite request?'
            : 'Are you sure you want to reject this offsite request?'
        }
        deleteMessage="This action will update your attendance records."
        actionText={modalType === 'approve' ? 'Approve' : 'Reject'}
      />
    </div>
  );
};

export default OffOfficeRequests;