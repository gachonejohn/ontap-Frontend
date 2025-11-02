import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ActionModal from '@components/common/Modals/ActionModal';
import { toast } from 'react-toastify';

import ButtonDropdown from '@components/common/ActionsPopover';
import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import {
  useDeleteBreakCategoryMutation,
  useDeleteBreakRuleMutation,
  useGetBreakRulesQuery,
} from '@store/services/policies/policyService';
import { LuArchiveX } from 'react-icons/lu';
import { CreateBreakRule } from './NewRule';
import { EditBreakRule } from './EditRule';

const BreakPolicies = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {},
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: [''],
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
    isLoading: loadingData,
    data: breakRulesData,
    refetch,
    error,
  } = useGetBreakRulesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('breakRulesData', breakRulesData);
  const [deleteBreakRule, { isLoading: deleting }] = useDeleteBreakRuleMutation();

  const openDeleteModal = (id) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteProgram = async () => {
    try {
      await deleteBreakRule(selectedItem).unwrap();
      toast.success('Break Rule deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && error.data) {
        toast.error(error.data.error || 'Error deleting break rule.');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item) => <span>{item.name}</span>,
    },
    {
      header: 'Max Breaks Per day',
      accessor: 'name',
      cell: (item) => <span>{item.max_breaks_per_day}</span>,
    },
    {
      header: 'Max Total Duration(Minutes)',
      accessor: 'name',
      cell: (item) => <span>{item.max_total_break_minutes}</span>,
    },
    {
      header: 'Default Max Break Duration(Minutes)',
      accessor: 'name',
      cell: (item) => <span>{item.default_max_duration_minutes}</span>,
    },
    {
      header: 'Default Grace Duration(Minutes)',
      accessor: 'name',
      cell: (item) => <span>{item.default_grace_period_minutes}</span>,
    },
    {
      header: 'Enforce Strictly',
      accessor: 'enforce_strictly',
      cell: (item) => <span>{item.enforce_strictly === true ? 'Enforced' : 'Not Enforced'}</span>,
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (item) => (
        <>
          <ButtonDropdown>
            <button
              onClick={() => openDeleteModal(item.id)}
              className="flex items-center space-x-2"
            >
              <LuArchiveX className="text-lg text-red-500" />
              <span className="text-red-600">Delete</span>
            </button>

            <EditBreakRule data={item} refetchData={refetch} />
          </ButtonDropdown>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white w-full  font-nunito">
      <div className="p-3 flex flex-col md:flex-row md:items-center gap-4 justify-end">
        <div>
          <CreateBreakRule refetchData={refetch} />
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
            : 'An error occurred while fetching roles.'}
        </div>
      ) : breakRulesData && breakRulesData.results.length > 0 ? (
        <DataTable
          data={breakRulesData.results}
          columnBgColor="bg-gray-200"
          columns={columns}
          isLoading={loadingData}
          error={error}
          //   stripedRows={true}
          //   stripeColor="bg-slate-100"
        />
      ) : (
        <div className="text-center text-gray-500 py-8">No data</div>
      )}

      {breakRulesData && breakRulesData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={breakRulesData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProgram}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this Break Policy?"
        deleteMessage=".
         This action cannot be undone."
        title="Delete Break Policy"
        actionText="Delete"
      />
    </div>
  );
};

export default BreakPolicies;
