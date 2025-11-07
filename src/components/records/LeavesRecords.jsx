import FilterSelect from '@components/common/FilterSelect';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { leavesStatusOptions, PAGE_SIZE } from '../../constants/constants';
import { useFilters } from '../../hooks/useFIlters';
import { useGetLeaveRequestsQuery } from '../../store/services/leaves/leaveService';
import { formatClockTime, formatHoursWorked, YearMonthCustomDate } from '../../utils/dates';
import DataTable from '../common/DataTable';
import NoDataFound from '../common/NoData';
import Pagination from '../common/pagination';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import { AiOutlineCalendar } from "react-icons/ai";
import { useEffect } from 'react';
const LeavesRecords = ({onDataUpdate}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      date: searchParams.get('date') || '',
      start_date: searchParams.get('start_date') || '',
      end_date: searchParams.get('end_date') || '',
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
  const { data, isLoading, error, refetch } = useGetLeaveRequestsQuery(queryParams, {
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
      label: `${item.name}`,
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
  const columns = [
    {
      header: 'Employee',
      accessor: 'employee',
      cell: (item) => {
        let profilePic = item?.user?.profile_picture;

        if (profilePic && !profilePic.startsWith('http')) {
          profilePic = `${API_BASE_URL}${profilePic}`;
        }

        if (!profilePic) {
          profilePic = defaultProfile;
        }
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
              <img
                src={profilePic}
                alt={`${item.user.first_name} ${item.user.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-[14px]">
                {item.user.first_name} {item.user.last_name}
              </span>
              {/* <span className="font-light text-[12px]">
                {' '}
                {item.employee?.department?.name ?? ''}
              </span> */}
            </div>
          </div>
        );
      },
    },

    {
      header: 'Department',
      accessor: 'department',
      cell: (item) => <span className="text-xs font-medium">{item?.department ?? ''}</span>,

    },

    {
        header: 'Leave Period',
        accessor: 'leave_period',
        cell: (item) => (
          <span className="text-[12px] ">
            {YearMonthCustomDate(item?.start_date ?? '')} - {YearMonthCustomDate(item?.end_date ?? '')}
          </span>
        ),

    },


    {
        header: 'Duration',
        accessor: 'days',
        cell: (item) => <span className="text-xs font-medium">{item?.days ?? ''} days</span>,
    },

    {
        header: 'Type',
        accessor: 'leave_type_name',
        cell: (item) => <span className="text-xs font-medium">{item?.leave_type_name ?? ''}</span>,

    },

    {
        header: 'Applied on',
        accessor: 'created_at',
        cell: (item) => (
          <span className="flex items-center gap-1 text-[12px]">
            <AiOutlineCalendar className="text-gray-500" />
            {YearMonthCustomDate(item.created_at)}
          </span>
        ),
    },

    {
        header: 'Status',
        accessor: 'status',
        cell: (item) => {
            return(
                <span
                    className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md font-normal 
                    ${
                    item.status === 'APPROVED'
                        ? 'text-green-500  bg-green-100'
                        : item.status === 'REJECTED'
                        ? 'text-purple-500  bg-purple-100'
                        :item.status === 'CANCELLED'
                        ? 'text-red-500  bg-red-100'
                        : item.status === 'PENDING'
                            ? 'text-orange-500  bg-orange-100'
                            : 'text-gray-500  bg-gray-100'
                    }`}
                    >
                    {item.status}
                </span>   
            );
        }
    },
  

  ];

  useEffect(() => {
  if (data && data.results) {
    onDataUpdate?.(data.results, filters);
  }
}, [data, filters]);

  return (
    <>
      <div className="flex flex-col gap-4  rounded-xl  bg-white  border shadow-md ">
        {/* <div className="flex justify-between items-center p-4">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold">Leaves Records</div>
            <div className="text-sm text-gray-600 font-normal mt-3">
              manage and review employee leave requests and statuses
            </div>
          </div>

          <div className="flex flex-row p-2 items-center gap-2">
            <div className="flex flex-col">
              <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                id="start_date"
                type="date"
                name="start_date"
                value={filters.start_date}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                id="end_date"
                type="date"
                name="end_date"
                value={filters.end_date}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div> */}
                <div className="flex flex-col gap-4  ">
                <div className="flex flex-col lg:flex-row md:flex-row items-start lg:items-center md:items-center justify-between p-2 gap-2">
                  <div className="flex flex-col lg:flex-row md:flex-row items-start lg:items-center md:items-center gap-2 w-full lg:w-auto">
                     <div className="relative w-full lg:w-auto border bg-white border-gray-300 lg:min-w-[200px] flex items-center text-gray-500 px-2 rounded-md shadow-sm">
                      <GoSearch size={20} className="" />
                      <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search... "
                        className="w-full bg-white text-gray-900 text-sm px-2 py-2 bg-transparent outline-none"
                      />
                    </div>
                    {/* <button
                      onClick={() => refetch()}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg w-full lg:w-auto border border-teal-500 text-teal-600 text-sm hover:bg-teal-50 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Live Updates
                    </button> */}
                    <FilterSelect
                      options={departmentsOptions}
                      value={
                        departmentsOptions.find((option) => option.value === filters.department) || {
                          value: '',
                          label: 'All Departments',
                        }
                      }
                      onChange={handleDepartmentChange}
                      placeholder=""
                      defaultLabel="All Departments"
                    />
                    <FilterSelect
                      options={leavesStatusOptions}
                      value={
                        leavesStatusOptions.find((option) => option.value === filters.status) || {
                          value: '',
                          label: 'All Status',
                        }
                      }
                      onChange={handleStatusChange}
                      placeholder=""
                      defaultLabel="All Status"
                    />
                   
                  </div>
                  <div className="flex flex-row items-end gap-2">
                    <div className="flex flex-col">
                      <label htmlFor="start_date" className="text-xs font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <input
                        id="start_date"
                        type="date"
                        name="start_date"
                        value={filters.start_date}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
        
                    <div className="flex flex-col">
                      <label htmlFor="end_date" className="text-xs font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <input
                        id="end_date"
                        type="date"
                        name="end_date"
                        value={filters.end_date}
                        onChange={handleFilterChange}
                        className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
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
          <div className="px-2">
            <DataTable
              data={data.results}
              columnBgColor="bg-gray-200"
              columns={columns}
              isLoading={isLoading}
              error={error}
              // stripedRows={true}
              // stripeColor="bg-slate-100"
            />
          </div>
        ) : (
          <NoDataFound message="No Leaves Records Found" />
        )}

        {data && data?.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};


export default LeavesRecords;
