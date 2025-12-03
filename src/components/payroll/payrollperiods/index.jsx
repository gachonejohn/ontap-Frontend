import ActionModal from '@components/common/Modals/ActionModal';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import FilterSelect from '@components/common/FilterSelect';
import { PAGE_SIZE, payrollStatusOptions } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import {
  useCancelPayrollMutation,
  useGetPayrollPeriodsQuery,
  usePayPayrollMutation,
  useApprovePayrollMutation,
  useProcessPayrollMutation,
} from '@store/services/payroll/Payroll.Service';

import { useMemo, useState } from 'react';
import { FiCalendar, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { RiRestartLine } from 'react-icons/ri';
import { HiOutlineCash } from 'react-icons/hi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PayrollPeriods() {
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchParams] = useSearchParams();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      period: searchParams.get('period') || '',
      year: searchParams.get('year') || new Date().getFullYear(),
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
    data: payrollPeriodsData,
    isLoading: payrollPeriodsLoading,
    error: payrollPeriodsError,
    refetch,
  } = useGetPayrollPeriodsQuery(queryParams, { refetchOnMountOrArgChange: true });

  const [processPayroll, { isLoading: isProcessingPayroll }] = useProcessPayrollMutation();
  const [approvePayroll, { isLoading: isApproving }] = useApprovePayrollMutation();
  const [payProll, { isLoading: isPaying }] = usePayPayrollMutation();
  const [cancelPayroll, { isLoading: isCancelling }] = useCancelPayrollMutation();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  const handleYearChange = (selectedOption) => {
    handleFilterChange({ year: selectedOption.value });
  };

  const handlePayrollPeriodStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const openProcessModal = (id) => {
    setSelectedItem(id);
    setModalType('process');
    setIsModalOpen(true);
  };

  const openApproveModal = (id) => {
    setSelectedItem(id);
    setModalType('approve');
    setIsModalOpen(true);
  };

  const openPayModal = (id) => {
    setSelectedItem(id);
    setModalType('pay');
    setIsModalOpen(true);
  };

  const openCancelModal = (id) => {
    setSelectedItem(id);
    setModalType('cancel');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleProcessPayroll = async () => {
    const payLoad={
        payroll_period_id:selectedItem
    }
    console.log("payload", payLoad)
    try {
      const res = await processPayroll(payLoad).unwrap();
      const msg = res?.message || 'Payroll moved to processing stage!';
      toast.success(msg);
      await refetch();
      closeModal();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error processing payroll!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const handleApprove = async () => {
       const payLoad={
        payroll_period_id:selectedItem
    }
    try {
      const res = await approvePayroll(payLoad).unwrap();
      const msg = res?.message || 'Payroll moved to approved stage!';
      toast.success(msg);
      await refetch();
      closeModal();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error approving payroll!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const handlePay = async () => {
     const payLoad={
        payroll_period_id:selectedItem
    }
    try {
      const res = await payProll(payLoad).unwrap();
      const msg = res?.message || 'Payroll moved to payment/disbursement stage!';
      toast.success(msg);
      await refetch();
      closeModal();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error disbursing payroll!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const handleCancel = async () => {
    const payLoad={
        payroll_period_id:selectedItem
    }
    try {
      const res = await cancelPayroll(payLoad).unwrap();
      const msg = res?.message || 'Payroll cancelled and rolled back to pending.';
      toast.success(msg);
      await refetch();
      closeModal();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error cancelling/rolling back payroll!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const getModalConfig = () => {
    switch (modalType) {
      case 'process':
        return {
          title: 'Process Payroll',
          message: 'Are you sure you want to process this payroll period?',
          subMessage: 'This will calculate all employee salaries and deductions.',
          actionType: 'process',
          onAction: handleProcessPayroll,
          isLoading: isProcessingPayroll,
        };
      case 'approve':
        return {
          title: 'Approve Payroll',
          message: 'Are you sure you want to approve this payroll period?',
          subMessage: 'This will mark the payroll as approved and ready for payment.',
          actionType: 'approve',
          onAction: handleApprove,
          isLoading: isApproving,
        };
      case 'pay':
        return {
          title: 'Pay Employees',
          message: 'Are you sure you want to initiate payment for this payroll period?',
          subMessage: 'This action will trigger the disbursement process.',
          actionType: 'pay',
          onAction: handlePay,
          isLoading: isPaying,
        };
      case 'cancel':
        return {
          title: 'Cancel Payroll',
          message: 'Are you sure you want to cancel this payroll period?',
          subMessage: 'This will roll back the payroll to pending status.',
          actionType: 'cancel',
          onAction: handleCancel,
          isLoading: isCancelling,
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
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

  return (
    <div className="flex flex-col gap-4 font-inter">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-gray-700 font-semibold text-lg mb-4">Payroll Periods</h2>
          <div className="flex flex-col gap-2 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-2">
            <FilterSelect
              options={yearOptions}
              value={
                yearOptions.find((y) => y.value === parseInt(filters.year)) || {
                  value: currentYear,
                  label: currentYear.toString(),
                }
              }
              onChange={handleYearChange}
              placeholder=""
              defaultLabel="Reset"
            />
            <FilterSelect
              options={payrollStatusOptions}
              value={
                payrollStatusOptions.find((option) => option.value === filters.status) || {
                  value: '',
                  label: 'status',
                }
              }
              onChange={handlePayrollPeriodStatusChange}
              placeholder="Select status"
              defaultLabel="Reset"
            />
          </div>
        </div>

        {payrollPeriodsLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : payrollPeriodsError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in payrollPeriodsError && payrollPeriodsError.data?.error
              ? payrollPeriodsError.data.error
              : 'An error occurred while fetching data.'}
          </div>
        ) : payrollPeriodsData && payrollPeriodsData.results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {payrollPeriodsData?.results?.map((period) => (
              <div
                key={period.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                    <FiCalendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-600 font-medium">Payroll Period</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {period.period_label}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      period.status
                    )}`}
                  >
                    {period.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openProcessModal(period.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
                    title="Process Payroll"
                  >
                    <RiRestartLine className="w-4 h-4" />
                    <span>Process</span>
                  </button>
                  <button
                    onClick={() => openApproveModal(period.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
                    title="Approve Payroll"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => openPayModal(period.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                    title="Pay Employees"
                  >
                    <HiOutlineCash className="w-4 h-4" />
                    <span>Pay</span>
                  </button>
                  <button
                    onClick={() => openCancelModal(period.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                    title="Cancel Payroll"
                  >
                    <FiXCircle className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataFound message="No Payroll Periods found" />
        )}

        {payrollPeriodsData && payrollPeriodsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={payrollPeriodsData.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {modalConfig && (
        <ActionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          actionType={modalConfig.actionType}
          onDelete={modalConfig.onAction}
          isDeleting={modalConfig.isLoading}
          title={modalConfig.title}
          confirmationMessage={modalConfig.message}
          deleteMessage={modalConfig.subMessage}
        />
      )}
    </div>
  );
}