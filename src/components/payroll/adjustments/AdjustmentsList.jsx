import ActionModal from '@components/common/Modals/ActionModal';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import FilterSelect from '@components/common/FilterSelect';
import {
  adjustmentTypesOptions,
  adjustmentApprovalStatusOptions,
  adjustmentStatusOptions,
  PAGE_SIZE,
} from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import {
  useApproveAdjustmentMutation,
  useGetAdjustmentsQuery,
} from '@store/services/payroll/Payroll.Service';

import { useMemo, useState } from 'react';
import { FiDollarSign, FiUser, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import { toast } from 'react-toastify';
import { RejectAdustment } from './RejectAdj';

export default function Adjustments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);
  const [modalType, setModalType] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      adjustment_type: searchParams.get('adjustment_type') || '',
      approval_status: searchParams.get('approval_status') || '',
      status: searchParams.get('status') || '',
      year: searchParams.get('year') || new Date().getFullYear(),
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
    data: adjustmentsData,
    isLoading: adjustmentsLoading,
    error: adjustmentsError,
    refetch,
  } = useGetAdjustmentsQuery(queryParams, { refetchOnMountOrArgChange: true });
  const [approveAdjustment, { isLoading: isApproving }] = useApproveAdjustmentMutation();

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  const handleYearChange = (selectedOption) => {
    handleFilterChange({ year: selectedOption.value });
  };

  const handleAdjustmentTypeChange = (selectedOption) => {
    handleFilterChange({
      adjustment_type: selectedOption ? selectedOption.value : '',
    });
  };

  const handleApprovalStatusChange = (selectedOption) => {
    handleFilterChange({
      approval_status: selectedOption ? selectedOption.value : '',
    });
  };

  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case 'OVERPAYMENT':
        return 'bg-red-100 text-red-700';
      case 'UNDERPAYMENT':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return 'bg-yellow-100 text-yellow-700';
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-700';
      case 'PATRIALLY_APPLIED':
        return 'bg-indigo-100 text-indigo-700';
      case 'FULLY_APPLIED':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const openApproveModal = (id) => {
    setSelectedItem(id);
    setModalType('approve');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleApproveAdjustment = async () => {
    const payLoad = {
      id: selectedItem,
    };
    console.log('payload', payLoad);
    try {
      const res = await approveAdjustment(payLoad).unwrap();
      const msg = res?.message || 'Adjustment approved!';
      toast.success(msg);
      await refetch();
      closeModal();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error approving adjustment!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
      closeModal();
    }
  };

  const getModalConfig = () => {
    switch (modalType) {
      case 'approve':
        return {
          title: 'Approve Adjustment',
          message: 'Are you sure you want to approve this adjustment?',
          subMessage: 'This will mark the adjustment as approved and ready for application.',
          actionType: 'approve',
          onAction: handleApproveAdjustment,
          isLoading: isApproving,
        };
      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="flex flex-col gap-4 font-inter">
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-700 font-semibold text-lg">Payroll Adjustments</h2>
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
              options={adjustmentTypesOptions}
              value={
                adjustmentTypesOptions.find(
                  (option) => option.value === filters.adjustment_type
                ) || {
                  value: '',
                  label: 'Type',
                }
              }
              onChange={handleAdjustmentTypeChange}
              placeholder="Select type"
              defaultLabel="Reset"
            />
            <FilterSelect
              options={adjustmentApprovalStatusOptions}
              value={
                adjustmentApprovalStatusOptions.find(
                  (option) => option.value === filters.approval_status
                ) || {
                  value: '',
                  label: 'Approval',
                }
              }
              onChange={handleApprovalStatusChange}
              placeholder="Select approval"
              defaultLabel="Reset"
            />
            <FilterSelect
              options={adjustmentStatusOptions}
              value={
                adjustmentStatusOptions.find((option) => option.value === filters.status) || {
                  value: '',
                  label: 'Application Status',
                }
              }
              onChange={handleStatusChange}
              placeholder="Select status"
              defaultLabel="Reset"
            />
          </div>
        </div>

        {adjustmentsLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : adjustmentsError ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in adjustmentsError && adjustmentsError.data?.error
              ? adjustmentsError.data.error
              : 'An error occurred while fetching data.'}
          </div>
        ) : adjustmentsData && adjustmentsData.results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {adjustmentsData?.results?.map((adjustment) => (
              <div
                key={adjustment.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                      <FiDollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">
                          {formatCurrencyWithSymbol(adjustment.amount)}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getAdjustmentTypeColor(
                            adjustment.adjustment_type
                          )}`}
                        >
                          {adjustment.adjustment_type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="w-4 h-4" />
                        <span className="font-medium">
                          {adjustment.employee?.user?.first_name}{' '}
                          {adjustment.employee?.user?.last_name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{adjustment.employee?.employee_no}</span>
                        <span className="text-gray-400">•</span>
                        <span>{adjustment.employee?.department?.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Period:</span>
                        <span>{adjustment.period?.period_label}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {adjustment.reason}
                      </div>
                      {adjustment.rejection_reason && (
                        <div className="text-sm text-red-600 flex items-center w-fit w-auto bg-red-50 p-2 rounded">
                          <span className="font-medium">Rejection Reason:</span>{' '}
                          {adjustment.rejection_reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(
                        adjustment.approval_status
                      )}`}
                    >
                      {adjustment.approval_status.replace('_', ' ')}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        adjustment.status
                      )}`}
                    >
                      {adjustment.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t">
                  <div className="text-sm">
                    <span className="text-gray-500">Applied Amount:</span>
                    <div className="font-semibold text-gray-900">
                      {formatCurrencyWithSymbol(
                        adjustment.applied_amount,
                        adjustment.employee?.latest_contract?.salary_currency || 'KES'
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Remaining Amount:</span>
                    <div className="font-semibold text-gray-900">
                      {formatCurrencyWithSymbol(
                        adjustment.remaining_amount,
                        adjustment.employee?.latest_contract?.salary_currency || 'KES'
                      )}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Applications:</span>
                    <div className="font-semibold text-gray-900">
                      {adjustment.applications?.length || 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t">
                  <button
                    onClick={() => openApproveModal(adjustment.id)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200"
                    title="Approve Adjustment"
                  >
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <div>
                    <RejectAdustment refetchData={refetch} data={adjustment} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataFound message="No Adjustments found" />
        )}

        {adjustmentsData && adjustmentsData.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={adjustmentsData.count}
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
