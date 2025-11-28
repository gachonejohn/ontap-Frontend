import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ActionModal from '@components/common/Modals/ActionModal';
import { toast } from 'react-toastify';

import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { LuArchiveX } from 'react-icons/lu';

import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';

import ButtonDropdown from '@components/common/ActionsPopover';
import {
  useDeletePositionMutation,
  useGetPositionsQuery,
} from '@store/services/companies/positionsService';

import NoDataFound from '@components/common/NoData';
import { YearMonthCustomDate } from '@utils/dates';
import { getApiErrorMessage } from '@utils/errorHandler';
import { EditPosition } from './EditPosition';
import { NewPosition } from './NewPosition';

const Positions = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
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
    data: PositionsData,
    refetch,
    error,
  } = useGetPositionsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('PositionsData', PositionsData);

  const [deletePosition, { isLoading: deleting }] = useDeletePositionMutation();

  const openDeleteModal = (id) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleDelete = async () => {
    try {
      await deletePosition(selectedRole).unwrap();
      toast.success('position deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting position.');
      toast.error(message);
    }
  };
  const handleViewDetails = (id) => navigate(`/dashboard/settings/${id}`);

  const columns = [
    {
      header: 'Name',
      accessor: 'title',
      cell: (item) => <span>{item.title}</span>,
    },
    {
      header: 'Department',
      accessor: 'department',
      cell: (item) => <span className="text-xs font-medium">{item?.department?.name ?? ''}</span>,
    },
 

    {
      header: 'Date Created',
      accessor: 'created_at',
      cell: (item) => (
        <span className="text-xs font-medium">{YearMonthCustomDate(item.created_at)}</span>
      ),
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

            <EditPosition data={item} refetchData={refetch} />
          </ButtonDropdown>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white w-full  font-nunito">
      <div className="p-3 flex flex-col md:flex-row md:items-center gap-4 justify-end">
        <div>
          <NewPosition refetchData={refetch} />
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
      ) : PositionsData && PositionsData.results.length > 0 ? (
        <DataTable
          data={PositionsData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <NoDataFound message="No positions  found." />
      )}

      {PositionsData && PositionsData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={PositionsData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this position?"
        deleteMessage="Deleting this position cannot be undone."
        title="Delete position"
        actionText="Delete"
      />
    </div>
  );
};

export default Positions;
