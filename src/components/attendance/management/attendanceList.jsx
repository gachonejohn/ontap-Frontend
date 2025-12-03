import DataTable from '@components/common/DataTable';
import FilterSelect from '@components/common/FilterSelect';
import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { attendanceStatusOptions, PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import {
  useGetCompanyAttendaceListQuery,
  useGetGroupedAttendaceQuery,
} from '@store/services/attendance/attendanceService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { formatHoursWorked, YearMonthCustomDate } from '@utils/dates';
import { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { PiBuildingApartment } from 'react-icons/pi';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AttendanceList = () => {
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
      year: searchParams.get('year') || new Date().getFullYear(),
    },
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: ['search'],
  });

  const [expandedDept, setExpandedDept] = useState(null);
  const [deptAttendancePage, setDeptAttendancePage] = useState(1);
  const [allDeptAttendance, setAllDeptAttendance] = useState([]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const deptAttendanceParams = useMemo(
    () => ({
      page: deptAttendancePage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [deptAttendancePage, filters]
  );

  const { data, isLoading, error } = useGetGroupedAttendaceQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: companyAttendanceList,
    isLoading: companyAttendanceLoading,
    error: companyAttendanceError,
    isFetching: companyAttendanceFetching,
  } = useGetCompanyAttendaceListQuery(
    { id: expandedDept, ...deptAttendanceParams },
    { skip: !expandedDept }
  );

  const { data: departmentsData } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });

  const departmentsOptions =
    departmentsData?.map((item) => ({ value: item.id, label: item.name })) || [];

  useEffect(() => {
    setAllDeptAttendance([]);
    setDeptAttendancePage(1);
  }, [expandedDept, filters.search, filters.status, filters.date]);

  useEffect(() => {
    if (companyAttendanceList?.results) {
      setAllDeptAttendance((prev) => {
        if (deptAttendancePage === 1) {
          return companyAttendanceList.results;
        }

        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = companyAttendanceList.results.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [companyAttendanceList, deptAttendancePage]);

  const handleLoadMore = () => {
    if (companyAttendanceList && allDeptAttendance.length < companyAttendanceList.count) {
      setDeptAttendancePage((prev) => prev + 1);
    }
  };

  const handleLoadLess = () => {
    if (deptAttendancePage > 1) {
      setDeptAttendancePage((prev) => prev - 1);
      setAllDeptAttendance((prev) => prev.slice(0, -PAGE_SIZE));
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };

  const handleYearChange = (selectedOption) => {
    handleFilterChange({ year: selectedOption.value });
  };

  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  const toggleExpand = (deptId) => {
    setExpandedDept(expandedDept === deptId ? null : deptId);
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'employee',
      cell: (item) => (
        <span>
          {item.employee.user.first_name} {item.employee.user.last_name}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'date',
      cell: (item) => <span className="text-xs">{YearMonthCustomDate(item.date)}</span>,
    },
    {
      header: 'Clocked In',
      accessor: 'clock_in',
      cell: (item) => <span className="text-xs">{item.clock_in}</span>,
    },
    {
      header: 'Clocked Out',
      accessor: 'clock_out',
      cell: (item) => <span className="text-xs">{item.clock_out}</span>,
    },
    {
      header: 'Break (min)',
      accessor: 'total_break_minutes',
      cell: (item) => <span className="text-xs">{item.total_break_minutes}</span>,
    },
    {
      header: 'Hours Worked',
      accessor: 'hours_worked',
      cell: (item) => <span className="text-xs">{formatHoursWorked(item.hours_worked)}</span>,
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
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <button className="flex items-center space-x-2">
          <FiEye className="text-lg" />
        </button>
      ),
    },
  ];
const iconColorSchemes = [
  { bg: 'bg-orange-100', icon: 'text-orange-600' },
  { bg: 'bg-purple-100', icon: 'text-purple-600' },
  { bg: 'bg-amber-100', icon: 'text-amber-600' },
  { bg: 'bg-blue-100', icon: 'text-blue-600' },
  { bg: 'bg-green-100', icon: 'text-green-600' },
  { bg: 'bg-pink-100', icon: 'text-pink-600' },
];

// Function to get color scheme based on index
const getColorScheme = (index) => {
  return iconColorSchemes[index % iconColorSchemes.length];
};
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white border ">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div className="flex flex-col gap-1">
          <div className="text-lg text-neutral-900 font-semibold font-montserrat">Attendance</div>
          <div className="text-sm text-gray-600 mt-1">
            Manage and monitor employee attendance records
          </div>
        </div>

        <div className="flex gap-2">
          <FilterSelect
            options={departmentsOptions}
            value={
              departmentsOptions.find((option) => option.value === filters.department) || {
                value: '',
                label: 'All Departments',
              }
            }
            onChange={handleDepartmentChange}
            placeholder="All Departments"
            defaultLabel="All Departments"
          />
          <FilterSelect
            options={yearOptions}
            value={
              yearOptions.find((y) => y.value === parseInt(filters.year)) || {
                value: currentYear,
                label: currentYear.toString(),
              }
            }
            onChange={handleYearChange}
            placeholder="Select Year"
            defaultLabel={currentYear.toString()}
          />
        </div>
      </div>

      {/* Department List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          {error.data?.error || 'An error occurred while fetching data.'}
        </div>
      ) : data && data.results && data.results.length > 0 ? (
        <div className="px-2 flex flex-col py-5 gap-2">
         {data.results.map((dept, index) => {
    const colors = getColorScheme(index);
    
    return (
      <div key={dept.id} className="border rounded-lg overflow-hidden font-inter">
        {/* Department Row */}
        <div
          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => toggleExpand(dept.id)}
        >
          <div className="flex items-center gap-3">
            {/* Department Icon */}
            <div className={`${colors.bg} p-3 rounded-lg`}>
              <PiBuildingApartment className={`${colors.icon} text-xl`} />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="font-medium text-gray-800">{dept.name}</div>
              <div className="text-sm text-gray-500">{dept.total_staff} employees</div>
            </div>
          </div>
          
          <div className="flex gap-4 text-sm text-gray-700">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Total Staff</span>
              <span className="text-xs font-medium text-gray-600">{dept.total_staff}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Clocked In</span>
              <span className="text-xs font-medium text-gray-600">{dept.clocked_in}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Late</span>
              <span className="text-xs font-medium text-gray-600">{dept.late}</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Absent</span>
              <span className="text-xs font-medium text-gray-600">
                {dept.absent || dept.late}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">On Leave</span>
              <span className="text-xs font-medium text-gray-600">{dept.on_leave}</span>
            </div>
            <div>
              {expandedDept === dept.id ? (
                <FiChevronUp className="text-gray-500" />
              ) : (
                <FiChevronDown className="text-gray-500" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded Attendance Table */}
        {expandedDept === dept.id && (
          <div className="bg-gray-50 p-4">
            {companyAttendanceLoading && deptAttendancePage === 1 ? (
              <div className="mb-4 flex items-center justify-center py-4">
                <ContentSpinner />
              </div>
            ) : companyAttendanceList?.attendance_rate !== undefined ? (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {companyAttendanceList.attendance_rate.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${companyAttendanceList.attendance_rate}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="mb-4 h-6 bg-gray-200 animate-pulse rounded-md w-1/2"></div>
            )}
            <div className="flex flex-col gap-4 mt-4 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
              <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
                <div className="relative w-full md:w-auto md:min-w-[40%] border bg-white border-gray-300 flex items-center gap-2 text-gray-500 px-2 rounded-lg shadow-sm">
                  <GoSearch size={20} className="" />
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search..."
                    className="w-full md:w-auto md:min-w-[40%] bg-white text-gray-900 text-sm px-2 py-2 bg-transparent outline-none"
                  />
                </div>
                <FilterSelect
                  options={attendanceStatusOptions}
                  value={
                    attendanceStatusOptions.find(
                      (option) => option.value === filters.status
                    ) || {
                      value: '',
                      label: 'All Status',
                    }
                  }
                  onChange={handleStatusChange}
                  placeholder=""
                  defaultLabel="All Status"
                />
                <div className="flex flex-col">
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={filters.date}
                    onChange={handleFilterChange}
                    className="border border-gray-300 rounded-lg px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            {deptAttendancePage === 1 && companyAttendanceLoading ? (
              <ContentSpinner />
            ) : companyAttendanceError ? (
              <div className="text-red-500">Failed to load employees.</div>
            ) : allDeptAttendance.length > 0 ? (
              <>
                <DataTable
                  data={allDeptAttendance}
                  columns={columns}
                  isLoading={false}
                  error={null}
                />

                {/* Loading indicator for additional pages */}
                {companyAttendanceFetching && deptAttendancePage > 1 && (
                  <div className="flex justify-center py-4">
                    <ContentSpinner />
                  </div>
                )}

                {/* Load More/Load Less buttons */}
                <div className="flex justify-center items-center gap-4 py-4">
                  {deptAttendancePage > 1 && (
                    <button
                      onClick={handleLoadLess}
                      disabled={companyAttendanceFetching}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Load Less
                    </button>
                  )}

                  {allDeptAttendance.length < (companyAttendanceList?.count || 0) && (
                    <button
                      onClick={handleLoadMore}
                      disabled={companyAttendanceFetching}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Load More
                    </button>
                  )}
                </div>

                {/* Loaded count indicator */}
                {companyAttendanceList?.count && (
                  <div className="text-center text-sm text-gray-500 pb-3">
                    Showing {allDeptAttendance.length} of {companyAttendanceList.count}{' '}
                    records
                  </div>
                )}
              </>
            ) : (
              <NoDataFound message="No attendance records found for this department." />
            )}
          </div>
        )}
      </div>
    );
  })}
        </div>
      ) : (
        <NoDataFound message="No Attendance Records Found" />
      )}

      {/* Pagination for main department list */}
      {data?.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={data.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AttendanceList;
