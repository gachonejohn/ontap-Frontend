import ButtonDropdown from '@components/common/ActionsPopover';
import NoDataFound from '@components/common/NoData';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo } from 'react';
import { FiEdit, FiUserMinus } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { employeeStatusOptions, PAGE_SIZE } from '../../constants/constants';
import { useFilters } from '../../hooks/useFIlters';
import { useGetEmployeesQuery } from '../../store/services/employees/employeesService';
import { YearMonthCustomDate } from '../../utils/dates';
import DataTable from '../common/DataTable';
import FilterSelect from '../common/FilterSelect';
import Pagination from '../common/pagination';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import EmployeeLayoutWrapper from './EmployeeLayoutWrapper';
import { CreateEmployee } from './NewEmployee';

const Employees = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
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

  const {
    data: employeesData,
    isLoading: loadingData,
    error,
    refetch,
  } = useGetEmployeesQuery(queryParams, { refetchOnMountOrArgChange: true });

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

  const handleViewDetails = (id) => navigate(`/dashboard/employees/${id}`);
  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const columns = [
    {
      header: 'Profile',
      accessor: 'user',
      cell: (item) => {
        let profilePic = item?.user?.profile_picture;

        if (profilePic && !profilePic.startsWith('http')) {
          profilePic = `${API_BASE_URL}${profilePic}`;
        }

        if (!profilePic) {
          profilePic = defaultProfile;
        }

        return (
          <div className="w-15 h-15 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
            <img
              src={profilePic}
              alt={`${item.user.first_name} ${item.user.last_name}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultProfile;
              }}
            />
          </div>
        );
      },
    },
    {
      header: 'Name',
      accessor: 'user',
      cell: (item) => (
        <span>
          {item.user.first_name} {item.user.last_name}
        </span>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      cell: (item) => <span className="text-xs font-medium">{item?.department?.name ?? ''}</span>,
    },
    {
      header: 'Position',
      accessor: 'position',
      cell: (item) => <span className="text-xs font-medium">{item?.position?.title ?? ''}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (item) => (
        <span
          className={`text-xs px-4 py-1 rounded-md font-medium border
        ${
          item.status === 'ACTIVE'
            ? 'bg-green-100 text-green-500 border-green-500'
            : item.status === 'INACTIVE'
              ? 'bg-red-100 text-red-500 border-red-500'
              : item.status === 'ON_LEAVE'
                ? 'bg-yellow-100 text-yellow-500 border-yellow-500'
                : item.status === 'SUSPENDED'
                  ? 'bg-gray-100 text-gray-500 border-gray-500'
                  : item.status === 'TERMINATED'
                    ? 'bg-gray-100 text-gray-500 border-gray-500'
                    : item.status === 'RESIGNED'
                      ? 'bg-gray-100 text-gray-500 border-gray-500'
                      : ''
        }
        `}
        >
          {item?.status ?? ''}
        </span>
      ),
    },
    {
      header: 'Date Started',
      accessor: 'latest_contract',
      cell: (item) => (
        <span className="text-xs font-medium">
          {YearMonthCustomDate(item?.latest_contract?.start_date ?? '')}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <ButtonDropdown>
          <button
            className="flex items-center space-x-2 "
            onClick={() => handleViewDetails(item.id)}
          >
            <FiEdit className="text-lg" />
            <span>View Records</span>
          </button>
          <button
            onClick={() => console.log('Disable', item.id)}
            className="flex items-center space-x-2"
          >
            <FiUserMinus className="text-lg" />
            <span className="text-red-600">Disable</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];

  const customActions = (
    <div>
      <CreateEmployee refetchData={refetch} />
    </div>
  );

  return (
    <EmployeeLayoutWrapper customActions={customActions}>
      {/* Filters */}
      <div className="flex flex-col border rounded-md gap-4 mt-5 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-between lg:items-center lg:justify-between">
        <div
          className="relative w-full md:w-auto border bg-white
         border-gray-300 md:min-w-[40%] flex items-center gap-2 text-gray-500 px-2
          rounded-lg shadow-sm"
        >
          <GoSearch size={20} className="" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by employee no ,first name, phone number"
            className="w-full bg-white text-gray-900 text-sm px-2 py-2 bg-transparent outline-none"
          />
        </div>

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
            options={employeeStatusOptions}
            value={
              employeeStatusOptions.find((option) => option.value === filters.status) || {
                value: '',
                label: 'All Status',
              }
            }
            onChange={handleStatusChange}
            placeholder=""
            defaultLabel="All Status"
          />
        </div>
      </div>

      {/* Employee Table */}
      <div className="rounded-xl shadow-sm bg-white overflow-hidden w-full">
        {/* Table Header */}
        <div className="flex flex-row justify-between items-center p-4 w-full h-14 border-b border-neutral-200">
          <div className="text-lg font-medium text-neutral-900 leading-tight whitespace-nowrap min-w-[225px]">
            Employee Management
          </div>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in error && error.data?.error
              ? error.data.error
              : 'An error occurred while fetching data.'}
          </div>
        ) : employeesData && employeesData.results.length > 0 ? (
          <DataTable
            data={employeesData.results}
            columns={columns}
            isLoading={loadingData}
            error={error}
            stripedRows={true}
            stripeColor="bg-slate-100"
          />
        ) : (
          <NoDataFound message="No Employees found" />
        )}

        {employeesData && employeesData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={employeesData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </EmployeeLayoutWrapper>
  );
};

export default Employees;
