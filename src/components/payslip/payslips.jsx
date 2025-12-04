import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { GoSearch } from 'react-icons/go';
import DataTable from '@components/common/DataTable';
import FilterSelect from '@components/common/FilterSelect';
import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { PAGE_SIZE, payrollStatusOptions,monthOptions } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetPayslipsQuery } from '@store/services/payslips/payslipService';
import { useGetPayrollPeriodsQuery } from '@store/services/payroll/Payroll.Service';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import PayslipDetailsModal from '@components/payroll/payslips/PayslipDetails';

const Payslips = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      period: searchParams.get('period') || '',
      status: searchParams.get('status') || '',
      year: searchParams.get('year') || '',
      month: searchParams.get('month') || '',
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

  const { data, isLoading, error } = useGetPayslipsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const { data: periodsData } = useGetPayrollPeriodsQuery({}, { refetchOnMountOrArgChange: true });

  const payrollPeriodOptions =
    periodsData?.map((item) => ({ value: item.id, label: item.period_label })) || [];
    console.log('Payroll Period Options:', payrollPeriodOptions);

  const handlePayrollPeriodChange = (selectedOption) => {
    handleFilterChange({
      period: selectedOption ? selectedOption.value : '',
    });
  };

  const handleMonthChange = (selectedOption) => {
  handleFilterChange({
    month: selectedOption ? selectedOption.value : '',
  });
};

  const handleYearChange = (selectedOption) => {
    handleFilterChange({
      year: selectedOption ? selectedOption.value : '',
    });
  };
const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));
  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const columns = [
    {
      header: 'Employee',
      accessor: 'employee',
      cell: (item) => (
        <span className="text-sm text-gray-700">
          {item.payroll_record.employee?.full_name || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Pay Period',
      accessor: 'period',
      cell: (item) => (
        <span className="text-sm text-gray-700">
          {item.payroll_record.period?.period_label || 'N/A'}
        </span>
      ),
    },
    {
      header: 'Gross Pay',
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
          -{formatCurrencyWithSymbol(item.total_deductions)}
        </span>
      ),
    },
    {
      header: 'Net Pay',
      accessor: 'net_salary',
      cell: (item) => (
        <span className="text-green-600 font-semibold">
          {formatCurrencyWithSymbol(item.net_salary)}
        </span>
      ),
    },
    {
      header: 'Overtime',
      accessor: 'overtime',
      cell: (item) => (
        <span className="text-green-600 font-semibold">
          {formatCurrencyWithSymbol(item.overtime)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
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
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusStyles(item.status)}`}
          >
            {item.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
         <>
          <PayslipDetailsModal payslip={item} />
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white border shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 border-b">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold font-montserrat">
              PaySlips History
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
         

          <div className="flex flex-col sm:flex-row gap-2">
            <FilterSelect
              options={yearOptions}
              value={
                yearOptions.find((option) => option.value === filters.year) || {
                  value: '',
                  label: 'Year',
                }
              }
              onChange={handleYearChange}
              placeholder="Year"
              defaultLabel="Reset"
            />
<FilterSelect
      options={monthOptions}
      value={
        monthOptions.find((option) => option.value === Number(filters.month)) || {
          value: '',
          label: 'Month',
        }
      }
      onChange={handleMonthChange}
      placeholder="Month"
      defaultLabel="Month"
    />
            <FilterSelect
              options={payrollStatusOptions}
              value={
                payrollStatusOptions.find((option) => option.value === filters.status) || {
                  value: '',
                  label: 'All Status',
                }
              }
              onChange={handleStatusChange}
              placeholder="All Status"
              defaultLabel="All Status"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {error.data?.error || 'An error occurred while fetching data.'}
          </div>
        ) : data && data.results && data.results.length > 0 ? (
          <>
            <DataTable data={data.results} columns={columns} isLoading={false} error={null} />
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalItems={data?.count || 0}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <NoDataFound message="No Payslips records found" />
        )}
      </div>
    </div>
  );
};

export default Payslips;