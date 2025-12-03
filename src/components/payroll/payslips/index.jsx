import DataTable from '@components/common/DataTable';
import FilterSelect from '@components/common/FilterSelect';
import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { attendanceStatusOptions, PAGE_SIZE, payrollStatusOptions } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import {
  useGetDepartmentPaySlipsQuery,
  useGetGroupedPayslipsQuery,
  useGetPayrollPeriodsQuery,
} from '@store/services/payroll/Payroll.Service';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import { useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiEye } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import { PiBuildingApartment } from 'react-icons/pi';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GroupedPayslips = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      period: searchParams.get('period') || '',
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

  const [expandedDept, setExpandedDept] = useState(null);
  const [deptPayslipsPage, setDeptPayslipsPage] = useState(1);
  const [allDeptPayslips, setAllDeptPayslips] = useState([]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const departmentPayslipsParams = useMemo(
    () => ({
      page: deptPayslipsPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [deptPayslipsPage, filters]
  );

  const { data, isLoading, error } = useGetGroupedPayslipsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('data', data);
  const {
    data: departmentPayslips,
    isLoading: loadingDepartmentPayslips,
    error: departmentPayslipsError,
    isFetching: departmentsPayslipsRefetching,
  } = useGetDepartmentPaySlipsQuery(
    { id: expandedDept, ...departmentPayslipsParams },
    { skip: !expandedDept }
  );

  const { data: departmentsData } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: periodsData } = useGetPayrollPeriodsQuery({}, { refetchOnMountOrArgChange: true });

  const departmentsOptions =
    departmentsData?.map((item) => ({ value: item.id, label: item.name })) || [];
  const payrollPeriodOptions =
    periodsData?.map((item) => ({ value: item.id, label: item.period_label })) || [];

  useEffect(() => {
    setAllDeptPayslips([]);
    setDeptPayslipsPage(1);
  }, [expandedDept, filters.search, filters.status, filters.date]);

  useEffect(() => {
    if (departmentPayslips?.results) {
      setAllDeptPayslips((prev) => {
        if (deptPayslipsPage === 1) {
          return departmentPayslips.results;
        }

        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = departmentPayslips.results.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [departmentPayslips, deptPayslipsPage]);

  const handleLoadMore = () => {
    if (departmentPayslips && allDeptPayslips.length < departmentPayslips.count) {
      setDeptPayslipsPage((prev) => prev + 1);
    }
  };

  const handleLoadLess = () => {
    if (deptPayslipsPage > 1) {
      setDeptPayslipsPage((prev) => prev - 1);
      setAllDeptPayslips((prev) => prev.slice(0, -PAGE_SIZE));
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };
  const handlePayrollPeriodChange = (selectedOption) => {
    handleFilterChange({
      period: selectedOption ? selectedOption.value : '',
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
      accessor: 'payroll_record.employee.full_name',
      cell: (item) => (
        <span className="font-medium text-gray-900">
          {item.payroll_record.employee.user.first_name}{' '}
          {item.payroll_record.employee.user.last_name}
        </span>
      ),
    },
    {
      header: 'Gross Salary',
      accessor: 'gross_salary',
      cell: (item) => (
        <span className="text-gray-900 font-medium">
          {formatCurrencyWithSymbol(item.gross_salary)}
        </span>
      ),
    },
    {
      header: 'Total Deductions',
      accessor: 'total_deductions',
      cell: (item) => (
        <span className="text-red-600 font-medium">
          {formatCurrencyWithSymbol(item.total_deductions)}
        </span>
      ),
    },
    {
      header: 'PAYE',
      accessor: 'paye_after_relief',
      cell: (item) => (
        <span className="text-red-600">{formatCurrencyWithSymbol(item.paye_after_relief)}</span>
      ),
    },
    {
      header: 'Net Salary',
      accessor: 'net_salary',
      cell: (item) => (
        <span className="text-green-600 font-semibold">
          {formatCurrencyWithSymbol(item.net_salary)}
        </span>
      ),
    },
   {
      header: "Status",
      accessor: "status",
      cell: (item) => {
        const getStatusStyles = (status) => {
          const styles = {
            PENDING: 'bg-yellow-100 text-yellow-700',
            PROCESSING: 'bg-blue-100 text-blue-700',
            PROCESSED: 'bg-purple-100 text-purple-700',
            APPROVED: 'bg-teal-100 text-teal-700',
            PAID: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700',
          };
          return styles[status] || 'bg-gray-100 text-gray-700';
        };

        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(item.status)}`}>
            {item.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <button
          onClick={() => navigate(`/payroll/${item.id}`)}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <FiEye className="w-4 h-4" />
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
          <div className="text-lg text-neutral-900 font-semibold font-montserrat">
            Company Payroll Details
          </div>
          <div className="text-sm text-gray-600 mt-1">Manage and monitor payroll records</div>
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
                      <div className="font-medium text-gray-800">{dept.department_name}</div>
                      <div className="text-sm text-gray-500">{dept.total_employees} employees</div>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-700">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-sm text-gray-500">Total Net Paid</span>
                      <span className="text-sm font-bold ">
                        {formatCurrencyWithSymbol(dept.total_net)}
                      </span>
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
                    <div className="flex flex-col gap-4 mt-4 lg:gap-0 md:gap-0 lg:flex-row md:flex-row md:items-center p-2 md:justify-end lg:items-center lg:justify-end">
                      <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
                        <div className="relative w-full md:w-auto md:min-w-[35%] border bg-white border-gray-300 flex items-center gap-2 text-gray-500 px-2 rounded-lg shadow-sm">
                          <GoSearch size={20} className="" />
                          <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search..."
                            className="w-full md:w-auto md:min-w-[35%] bg-white text-gray-900 text-sm px-2 py-2 bg-transparent outline-none"
                          />
                        </div>
                        <FilterSelect
                          options={payrollStatusOptions}
                          value={
                            payrollStatusOptions.find(
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
                        <FilterSelect
            options={payrollPeriodOptions}
            value={
              payrollPeriodOptions.find((option) => option.value === filters.period) || {
                value: '',
                label: 'Select Period',
              }
            }
            onChange={handlePayrollPeriodChange}
            placeholder="Select Period"
            defaultLabel="Select Period"
          />
                       
                      </div>
                    </div>

                    {deptPayslipsPage === 1 && loadingDepartmentPayslips ? (
                      <ContentSpinner />
                    ) : departmentPayslipsError ? (
                      <div className="text-red-500">Failed to load employees.</div>
                    ) : allDeptPayslips.length > 0 ? (
                      <>
                        <DataTable
                          data={allDeptPayslips}
                          columns={columns}
                          isLoading={false}
                          error={null}
                        />

                        {/* Loading indicator for additional pages */}
                        {departmentsPayslipsRefetching && deptPayslipsPage > 1 && (
                          <div className="flex justify-center py-4">
                            <ContentSpinner />
                          </div>
                        )}

                        {/* Load More/Load Less buttons */}
                        <div className="flex justify-center items-center gap-4 py-4">
                          {deptPayslipsPage > 1 && (
                            <button
                              onClick={handleLoadLess}
                              disabled={departmentsPayslipsRefetching}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Load Less
                            </button>
                          )}

                          {allDeptPayslips.length < (departmentPayslips?.count || 0) && (
                            <button
                              onClick={handleLoadMore}
                              disabled={departmentsPayslipsRefetching}
                              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              Load More
                            </button>
                          )}
                        </div>

                        {/* Loaded count indicator */}
                        {departmentPayslips?.count && (
                          <div className="text-center text-sm text-gray-500 pb-3">
                            Showing {allDeptPayslips.length} of {departmentPayslips.count} records
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

export default GroupedPayslips;
