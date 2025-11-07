import FilterSelect from '@components/common/FilterSelect';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo } from 'react';
import { GoSearch } from 'react-icons/go';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { attendanceStatusOptions, PAGE_SIZE } from '../../constants/constants';
import { useFilters } from '../../hooks/useFIlters';
import { useGetAttendaceQuery } from '../../store/services/attendance/attendanceService';
import { formatClockTime, formatHoursWorked, YearMonthCustomDate } from '../../utils/dates';
import DataTable from '../common/DataTable';
import NoDataFound from '../common/NoData';
import Pagination from '../common/pagination';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import { AiOutlineClockCircle, AiOutlineCalendar } from "react-icons/ai";
import { useEffect } from 'react';

const AttendanceRecords = ({ onDataUpdate }) => {
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
  const { data, isLoading, error, refetch } = useGetAttendaceQuery(queryParams, {
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
        let profilePic = item?.employee?.user?.profile_picture;

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
                alt={`${item.employee.user.first_name} ${item.employee.user.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-[14px]">
                {item.employee.user.first_name} {item.employee.user.last_name}
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
      accessor: 'employee.department',
      cell: (item) => <span className="text-xs font-medium">{item?.employee?.department?.name ?? ''}</span>,

    },

    {
    header: 'Date',
    accessor: 'date',
    cell: (item) => (
      <span className="flex items-center gap-1 text-[12px]">
        <AiOutlineCalendar className="text-gray-500" />
        {YearMonthCustomDate(item.date)}
      </span>
    ),
},

    {
      header: 'Clock In',
      accessor: 'clock_in',
      cell: (item) => <span className="flex items-center gap-1 text-[12px] ">
        <AiOutlineClockCircle />
        {formatClockTime(item?.clock_in ?? '')}
        </span>,
    },
    {
      header: 'Clock Out',
      accessor: 'clock_out',
      cell: (item) => (
        <span className="flex items-center gap-1 text-[12px] ">
          <AiOutlineClockCircle />
          {formatClockTime(item?.clock_out ?? '')}
          </span>
      ),
    },

     {
      header: 'Hours',
      accessor: 'hours_worked',
      cell: (item) => (
        <span className="text-[12px] ">{formatHoursWorked(item?.hours_worked ?? '')}</span>
      ),
    },

    {
      header: 'Arrival',
      accessor: 'arrival_status',
      cell: (item) => {
        const isOnTime =
          item.arrival_status === 'On time' || item.arrival_difference?.includes('0 min');

        const textColor =
          item.arrival_status === 'Late'
            ? 'text-red-500'
            : item.arrival_status === 'Early'
              ? 'text-green-600'
              : 'text-gray-600';

        return (
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${textColor}`}>{item.arrival_status ?? '-'}</span>
            <span className="text-[12px] text-gray-500">
              {isOnTime ? 'On time' : (item.arrival_difference ?? '')}
            </span>
          </div>
        );
      },
    },

    {
      header: "Overtime",
      accessor: "overtime",
      cell: (item) => {
        if (item.departure_status === "Overtime") {
          return (
            <div className="flex flex-col">
              {/* <span className="text-xs font-medium text-blue-600">
            {item.departure_status}
          </span> */}
              <span className="text-[11px] text-gray-500">
                {item.departure_difference ?? ""}
              </span>
            </div>
          );
        }
        return <span className="text-xs text-gray-400">-</span>;
      },
    },

    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => {
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md font-normal 
          ${
            item.status === 'PRESENT'
              ? 'text-green-500  bg-green-100'
              : item.status === 'ABSENT'
                ? 'text-red-500  bg-red-100'
                : item.status === 'ON LEAVE'
                  ? 'text-orange-500  bg-orange-100'
                  : 'text-gray-500  bg-gray-100'
          }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full 
            ${
              item.status === 'PRESENT'
                ? 'bg-green-500'
                : item.status === 'ABSENT'
                  ? 'bg-red-500'
                  : item.status === 'ON LEAVE'
                    ? 'bg-orange-500'
                    : 'bg-gray-500'
            }`}
            ></span>
            {item.status}
          </span>
        );
      },
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
              options={attendanceStatusOptions}
              value={
                attendanceStatusOptions.find((option) => option.value === filters.status) || {
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
          <NoDataFound message="No Attendance Records Found" />
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

export default AttendanceRecords;
