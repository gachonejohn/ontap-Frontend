import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { YearMonthCustomDate } from '@utils/dates';
import { useMemo } from 'react';
import { FiCalendar, FiClock, FiEye, FiList, FiUser } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { useGetOnboardingListQuery } from '@store/services/staffcylce/onboardingService';
import { EmployeeCheckList } from './employeeOnboardChecklist';
import { OnboardEmployee } from './onboardEmployee';
const OnboardingList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      date: searchParams.get('date') || '',
      from_date: searchParams.get('from_date') || '',
      to_date: searchParams.get('to_date') || '',
      status: searchParams.get('status') || '',
    },
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: ['search'],
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
  const { data, isLoading, error, refetch } = useGetOnboardingListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log('data', data);

  const departmentsOptions =
    departmentsData?.map((item) => ({
      value: item.id,
      label: `${item?.name}`,
    })) || [];

  const handleDepartmentChange = (selectedOption) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };

  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };
  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;
  const handleViewDetails = (id) => navigate(`/dashboard/employees/${id}`);
  return (
    <>
      <div className="flex flex-col gap-4  rounded-xl  bg-white  border shadow-md ">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold">
              Employee Onboarding Tracking
            </div>
            <div className="text-sm text-gray-600 font-normal mt-3"></div>
          </div>

          <OnboardEmployee refetchData={refetch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in error && error.data?.error
              ? error.data.error
              : 'An error occurred while fetching data.'}
          </div>
        ) : data && data.results.length > 0 ? (
          <div className="space-y-4 p-4">
            {data?.results?.map((emp) => {
              let profilePic = emp?.user?.profile_picture;

              if (profilePic && !profilePic.startsWith('http')) {
                profilePic = `${API_BASE_URL}${profilePic}`;
              }

              if (!profilePic) {
                profilePic = defaultProfile;
              }
              return (
                <div
                  key={emp.id}
                  className="flex gap-4 border rounded-lg p-6 hover:shadow-md transition"
                >
                  <div className="w-14 h-13 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                    <img
                      src={profilePic}
                      alt={`${emp.user.first_name} ${emp.user.last_name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultProfile;
                      }}
                    />
                  </div>

                  <div className="w-full flex justify-between gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {emp.user.first_name} {emp.user.last_name}
                        </h3>
                        {emp.onboarding_progress_status &&
                          (() => {
                            const statusStyles = {
                              'On Track': 'bg-green-100 text-green-700',
                              Completed: 'bg-green-100 text-green-700',
                              Delayed: 'bg-red-100 text-red-700',
                              Pending: 'bg-yellow-100 text-yellow-700',
                              'In Progress': 'bg-purple-100 text-purple-700',
                              'Not Started': 'bg-gray-100 text-gray-700',
                            };

                            const badgeClass =
                              statusStyles[emp.onboarding_progress_status] ||
                              'bg-gray-100 text-gray-700';

                            return (
                              <span
                                className={`text-xs px-2.5 py-0.5 rounded font-medium ${badgeClass}`}
                              >
                                {emp.onboarding_progress_status}
                              </span>
                            );
                          })()}
                      </div>

                      <div className="flex items-center gap-8 mb-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4" />
                          <span>{emp?.position?.title ?? 'No Positiion Assigned'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiList className="w-4 h-4" />
                          <span>{emp?.department?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          <span>{emp.remaining_days} days remaining</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="flex items-center gap-8 mb-3 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>Start: {YearMonthCustomDate(emp.start_date_overall)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 mb-3 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <span>End: {YearMonthCustomDate(emp.estimated_due_date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-inter text-sm font-light">
                            Progress: {emp.completed_steps}/{emp.total_steps}
                          </span>
                          <span className="font-inter italic text-sm font-light">
                            {emp.progress}%
                          </span>
                        </div>

                        <div
                          className={`h-2 rounded-full overflow-hidden transition-colors ${
                            emp.onboarding_progress_status === 'On Track'
                              ? 'bg-green-100' // Light green for on track background
                              : emp.onboarding_progress_status === 'Delayed'
                                ? 'bg-yellow-100' // Light yellow for delayed background
                                : emp.onboarding_progress_status === 'Completed'
                                  ? 'bg-green-100'
                                  : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className={`h-full rounded-full transition-all ${
                              emp.onboarding_progress_status === 'Completed'
                                ? 'bg-green-600'
                                : emp.onboarding_progress_status === 'On Track'
                                  ? 'bg-green-500'
                                  : emp.onboarding_progress_status === 'In Progress'
                                    ? 'bg-purple-500'
                                    : emp.onboarding_progress_status === 'Pending'
                                      ? 'bg-yellow-500'
                                      : emp.onboarding_progress_status === 'Delayed'
                                        ? 'bg-red-500'
                                        : 'bg-gray-400'
                            }`}
                            style={{
                              width: `${emp.progress}%`,
                              transition: 'width 0.6s ease-in-out',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 gap-2 ">
                      <EmployeeCheckList id={emp.id} />
                      <button
                        onClick={() => handleViewDetails(emp.id)}
                        className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded hover:bg-gray-50 whitespace-nowrap"
                      >
                        <FiEye className="w-4 h-4" />
                        <span className="text-xs font-light">View Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoDataFound message="No employees on onboarding process" />
        )}

        {data && data?.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data?.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default OnboardingList;
