import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import Card from './Card';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetPayrollMetricsQuery } from '@store/services/payroll/Payroll.Service';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import { useMemo } from 'react';
import { FiDollarSign } from 'react-icons/fi';
import { HiOutlineCash } from 'react-icons/hi';
import { MdGavel, MdOutlinePendingActions } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Payslips from './payslips';

export default function PaySlip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      period: searchParams.get('period') || '',
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
  } = useGetPayrollMetricsQuery(queryParams, { refetchOnMountOrArgChange: true });

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
          <div className="text-2xl text-neutral-900 font-semibold">Payslips</div>
          <div className="text-lg text-gray-600 font-normal">
            View and download your salary statements
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {loadingMetrics ? (
          <div className="col-span-4 text-center text-gray-500 py-6">
            <ContentSpinner />
          </div>
        ) : loadingMetricsError ? (
          <div className="col-span-4 text-center text-red-500 py-6">Error loading metrics.</div>
        ) : (
          cards.map((card, i) => <Card key={i} {...card} />)
        )}
      </div> */}

      <Payslips />
    </div>
  );
}