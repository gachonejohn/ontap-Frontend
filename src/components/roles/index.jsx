import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FiEdit, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ActionModal from '../common/Modals/ActionModal';

import { LuArchiveX } from 'react-icons/lu';
import { PAGE_SIZE } from '../../constants/constants';
import { useFilters } from '../../hooks/useFIlters';
import { useDeleteRoleMutation, useGetRolesQuery } from '../../store/services/roles/rolesService';
import { CustomDate } from '../../utils/dates';
import DataTable from '../common/DataTable';
import Pagination from '../common/pagination';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import { CreateRole } from './NewRole';
import { EditRole } from './editRole';
import ButtonDropdown from '@components/common/ActionsPopover';
const RolesList = () => {
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
    data: rolesData,
    refetch,
    error,
  } = useGetRolesQuery(queryParams, { refetchOnMountOrArgChange: true });

  const [deleteRole, { isLoading: deleting }] = useDeleteRoleMutation();

  const openDeleteModal = (id) => {
    setSelectedRole(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteProgram = async () => {
    try {
      // await deleteAdmin(selectedRole).unwrap();
      toast.success('Role deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && error.data) {
        toast.error(error.data.error || 'Error deleting role.');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
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
      header: 'Description',
      accessor: 'description',
      cell: (item) => <span className="text-xs font-medium">{item.description}</span>,
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
              className="flex items-center space-x-2 "
              onClick={() => handleViewDetails(item.id)}
            >
              <FiEye className="text-lg" />
              <span>Edit Permissions</span>
            </button>
            <button
              onClick={() => openDeleteModal(item.id)}
              className="flex items-center space-x-2"
            >
              <LuArchiveX className="text-lg text-red-500" />
              <span className="text-red-600">Delete</span>
            </button>

            <EditRole data={item} refetchData={refetch} />
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
          <CreateRole refetchData={refetch} />
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
      ) : rolesData && rolesData.results.length > 0 ? (
        <DataTable
          data={rolesData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <div className="text-center text-gray-500 py-8">No data</div>
      )}

      {rolesData && rolesData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={rolesData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProgram}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this role account?"
        deleteMessage="Deleting this role will remove its access permanently. This action cannot be undone."
        title="Delete Role Account"
        actionText="Delete"
      />
    </div>
  );
};

export default RolesList;
