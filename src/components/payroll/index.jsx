import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import StatCard from '@components/common/statsCard';

import FilterSelect from '@components/common/FilterSelect';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';

import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import {
  useGetPayrollMetricsQuery,
  useGetPayrollPeriodsQuery,
} from '@store/services/payroll/Payroll.Service';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import { useMemo } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { HiOutlineCash } from 'react-icons/hi';
import { MdGavel, MdOutlinePendingActions } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PayrollPeriods from './payrollperiods';
import GroupedPayslips from './payslips';
import { GeneratePayroll } from './processing/generate';
import StatutoryCard from './StatutoryCard';
import { CreateAdjustments } from './adjustments';
import Adjustments from './adjustments/AdjustmentsList';

export default function Payroll() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      period: searchParams.get('period') || '',
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

  const {
    data: metricsData,
    isLoading: loadingMetrics,
    error: loadingMetricsError,
    refetch: refetchMetrics,
  } = useGetPayrollMetricsQuery(queryParams, { refetchOnMountOrArgChange: true });

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: payrollperiodsData } = useGetPayrollPeriodsQuery(
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
  const payrollPeriodOptions =
    payrollperiodsData?.map((item) => ({
      value: item.id,
      label: `${item.period_label}`,
    })) || [];

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

  const statutoryDeductions = [
    {
      title: 'PAYE Total',
      amount: formatCurrencyWithSymbol(metricsData?.statutory_summary?.paye_total ?? 0),
      subtitle: 'Income tax',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
    {
      title: 'NSSF Total',
      amount: formatCurrencyWithSymbol(metricsData?.statutory_summary?.nssf_total ?? 0),
      subtitle: 'Employee + Employer',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      title: 'SHIF Total',
      amount: formatCurrencyWithSymbol(metricsData?.statutory_summary?.shif_total ?? 0),
      subtitle: 'Employee contribution',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      title: 'AHL Total',
      amount: formatCurrencyWithSymbol(metricsData?.statutory_summary?.ahl_total ?? 0),
      subtitle: 'Employee + Employer',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'processed':
        return 'bg-indigo-100 text-indigo-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const cards = metricsData
    ? [
        {
          title: 'Overall Payroll',
          value: formatCurrencyWithSymbol(metricsData.overall_payroll ?? 0),
          icon: FiDollarSign,
          iconColor: 'text-white',
          iconBgColor: 'bg-green-600',
          subtext: 'Total Earnings',
          subtextColor: 'text-gray-500',
        },
        {
          title: 'Total Deductions',
          value: formatCurrencyWithSymbol(metricsData.total_deductions ?? 0),
          icon: MdGavel,
          iconColor: 'text-white',
          iconBgColor: 'bg-primary',
          subtext: 'Total Deductions',
          subtextColor: 'text-gray-500',
        },
        {
          title: 'Overall Net Pay',
          value: formatCurrencyWithSymbol(metricsData.overall_net_pay ?? 0),
          icon: HiOutlineCash,
          iconColor: 'text-white',
          iconBgColor: 'bg-blue-600',
          subtext: 'Total Net Pay',
          subtextColor: 'text-gray-500',
        },
        {
          title: 'Pending Payroll',
          value: metricsData.pending_payroll ?? 0,
          icon: MdOutlinePendingActions,
          iconColor: 'text-white',
          iconBgColor: 'bg-yellow-600',
          subtext: 'Unprocessed Payrolls',
          subtextColor: 'text-gray-500',
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex justify-between items-center py-2">
        <div className="flex flex-col gap-1.5">
          <div className="text-2xl text-neutral-900 font-semibold">Payroll</div>
          <div className="text-lg text-gray-600 font-normal">
            Manage and monitor payroll operations
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-2">
          <div>
            <GeneratePayroll refetchData={refetchMetrics} />
          </div>
          <div>
            <CreateAdjustments refetchData={refetchMetrics} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div
          className="flex flex-col gap-2 
  lg:p-0 lg:flex-row md:flex-row md:items-center
   md:space-x-2 lg:items-center  lg:space-x-2"
        >
          <FilterSelect
            options={departmentsOptions}
            value={
              departmentsOptions.find((option) => option.value === filters.department) || {
                value: '',
                label: 'Select department',
              }
            }
            onChange={handleDepartmentChange}
            placeholder=""
            defaultLabel="Reset"
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
            defaultLabel="Reset"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loadingMetrics ? (
          <div className="col-span-4 text-center text-gray-500 py-6">
            <ContentSpinner />
          </div>
        ) : loadingMetricsError ? (
          <div className="col-span-4 text-center text-red-500 py-6">Error loading metrics.</div>
        ) : (
          cards.map((card, i) => <StatCard key={i} {...card} />)
        )}
      </div>

      <PayrollPeriods />

      {/* Statutory Deductions Summary Section */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <h2 className="text-gray-700 font-semibold text-lg mb-4">Statutory Deductions Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statutoryDeductions.map((deduction, index) => (
            <StatutoryCard key={index} {...deduction} />
          ))}
        </div>
      </div>

      <GroupedPayslips />
      <Adjustments />
    </div>
  );
}
