import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FiEdit, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ActionModal from '@components/common/Modals/ActionModal';

import { LuArchiveX } from 'react-icons/lu';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';

import DataTable from '@components/common/DataTable';
import Pagination from '@components/common/pagination';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import ButtonDropdown from '@components/common/ActionsPopover';
import {
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
} from '@store/services/companies/departmentsService';

import { CustomDate } from '@utils/dates';
import NoDataFound from '@components/common/NoData';
import { NewDepartment } from './NewDepartment';
import { EditDepartment } from './EditDepartment';
import { getApiErrorMessage } from '@utils/errorHandler';
const Departments = () => {
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
    data: departmentData,
    refetch,
    error,
  } = useGetDepartmentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('departmentData', departmentData);
  const [deleteDepartment, { isLoading: deleting }] = useDeleteDepartmentMutation();

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
      await deleteDepartment(selectedRole).unwrap();
      toast.success('Department deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting department.');
      toast.error(message);
    }
  };
  const handleViewDetails = (id) => navigate(`/dashboard/settings/${id}`);

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      cell: (item) => <span>{item.name}</span>,
    },

    {
      header: 'Date Created',
      accessor: 'created_at',
      cell: (item) => <span className="text-xs font-medium">{CustomDate(item.created_at)}</span>,
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

            <EditDepartment data={item} refetchData={refetch} />
          </ButtonDropdown>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white w-full  font-nunito">
      <div className="p-3 flex flex-col md:flex-row md:items-center gap-4 justify-end">
        {/* <h2 className="font-semibold text-black lg:text-xl md:text-lg text-sm">
          Roles
        </h2> */}
        <div>
          <NewDepartment refetchData={refetch} />
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
      ) : departmentData && departmentData.results.length > 0 ? (
        <DataTable
          data={departmentData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <NoDataFound message="No department  found." />
      )}

      {departmentData && departmentData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={departmentData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this department?"
        deleteMessage="Deleting this department cannot be undone."
        title="Delete department"
        actionText="Delete"
      />
    </div>
  );
};

export default Departments;
