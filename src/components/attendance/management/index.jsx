import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import StatCard from '@components/common/statsCard';
import {
  useGetAttendanceMetricsQuery,
  useGetCompanyAttendanceTrendsQuery,
} from '@store/services/attendance/attendanceService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FiDownload, FiUmbrella } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import FilterSelect from '@components/common/FilterSelect';
import { useFilters } from '@hooks/useFIlters';
import { FiUserCheck, FiUserX } from 'react-icons/fi';
import AttendanceList from './attendanceList';
import CompanyAttendanceTrendsChart from './attendanceTrendChart';
import OvertimeRequests from './overtimeRequests';
import OffOfficeRequests from './offSiteRequests';
export default function AttendanceManagement() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      year: searchParams.get('year') || '',
    },
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: ['search'],
  });

  const { data, isLoading, error } = useGetAttendanceMetricsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: attendanceTrend,
    isLoading: attendanceLoading,
    error: attendanceError,
  } = useGetCompanyAttendanceTrendsQuery(filters, { refetchOnMountOrArgChange: true });
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const departmentsOptions =
    departmentsData?.map((item) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = currentYear - i;
    return { value: year, label: year.toString() };
  });
  const handleYearChange = (selectedOption) => {
    handleFilterChange({
      year: selectedOption ? selectedOption.value : currentYear,
    });
  };
  const handleDepartmentChange = (selectedOption) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };

  const cards = data
    ? [
        {
          title: 'Employees Clocked In',
          value: data.employees_clocked_in ?? 0,
          icon: FiUserCheck,
          iconColor: 'text-white',
          iconBgColor: 'bg-green-600',
        },
        {
          title: 'Late Arrivals Today',
          value: data.late_arrivals_today ?? 0,
          icon: AiOutlineExclamationCircle,
          iconColor: 'text-white',
          iconBgColor: 'bg-orange-500',
        },
        {
          title: 'Absent Today',
          value: data.absent_today ?? 0,
          icon: FiUserX,
          iconColor: 'text-white',
          iconBgColor: 'bg-red-500',
        },
        {
          title: 'On Leave',
          value: data.on_leave ?? 0,
          icon: FiUmbrella,
          iconColor: 'text-white',
          iconBgColor: 'bg-blue-600',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex justify-between items-center  py-2">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">Attendance Management</div>
          <div className="text-sm text-gray-600 font-normal">
            Manage and monitor staff attendance records and reports.
          </div>
        </div>

        {/* <div className="flex gap-2">
          <button className="flex justify-center items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md text-sm">
            <FiDownload className="w-5 h-5" />
            <span>Export Records</span>
          </button>
        </div> */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {isLoading ? (
          <div className="col-span-4 text-center text-gray-500 py-6">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="col-span-4 text-center text-red-500 py-6">Error loading metrics.</div>
        ) : (
          cards.map((card, i) => <StatCard key={i} {...card} />)
        )}
      </div>

      <div
        className=" overflow-hidden max-w-full bg-white   
           min-h-[250px] h-full rounded-xl  border shadow-sm"
      >
        <div className="flex justify-between items-center border-b p-6  mb-4 gap-4">
          <h2 className="text-gray-700 font-semibold text-lg">Attendance Trends</h2>
          <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
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
              options={yearOptions}
              value={
                yearOptions.find((option) => option.value === parseInt(filters.year)) || {
                  value: currentYear,
                  label: currentYear.toString(),
                }
              }
              onChange={handleYearChange}
              placeholder=""
              defaultLabel={currentYear.toString()}
            />
          </div>
        </div>

        <CompanyAttendanceTrendsChart data={attendanceTrend} isLoading={attendanceLoading} />
      </div>
      <AttendanceList />
      <OvertimeRequests />
      <OffOfficeRequests />
    </div>
  );
}
