import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import ActionModal from '../../../common/Modals/ActionModal';

import ButtonDropdown from '@components/common/ActionsPopover';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import {
  useDeleteAttendancePolicyMutation,
  useGetAttendancePoliciesQuery,
} from '@store/services/policies/policyService';
import { formatClockTime } from '@utils/dates';
import { LuArchiveX } from 'react-icons/lu';
import DataTable from '../../../common/DataTable';
import Pagination from '../../../common/pagination';
import ContentSpinner from '../../../common/spinners/dataLoadingSpinner';
import { EditAttendacePolicy } from './EditWorkRule';
import { CreateAttendacePolicy } from './NewWorkRule';
const AttendancePolicies = () => {
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
    data: attendanceRulesData,
    refetch,
    error,
  } = useGetAttendancePoliciesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log('attendanceRulesData', attendanceRulesData);
  const [deleteAttendancePolicy, { isLoading: deleting }] = useDeleteAttendancePolicyMutation();

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
      await deleteAttendancePolicy(selectedItem).unwrap();
      toast.success('Policy deleted successfully!');
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

  const columns = [
    {
      header: 'Type',
      accessor: 'rule_type',
      cell: (item) => <span>{item.rule_type}</span>,
    },
    {
      header: 'Time',
      accessor: 'rule_time',
      cell: (item) => (
        <span className="text-xs font-medium">{formatClockTime(item.rule_time)}</span>
      ),
    },

    {
      header: 'Grace Minutes',
      accessor: 'grace_minutes',
      cell: (item) => <span className="text-xs font-medium">{item.grace_minutes}</span>,
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (item) => <span className="text-xs font-medium">{item.description}</span>,
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

            <EditAttendacePolicy data={item} refetchData={refetch} />
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
          <CreateAttendacePolicy refetchData={refetch} />
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
      ) : attendanceRulesData && attendanceRulesData.results.length > 0 ? (
        <DataTable
          data={attendanceRulesData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <div className="text-center text-gray-500 py-8">No data</div>
      )}

      {attendanceRulesData && attendanceRulesData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={attendanceRulesData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProgram}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this Attendance Policy?"
        deleteMessage=".
         This action cannot be undone."
        title="Delete Attendance Policy"
        actionText="Delete"
      />
    </div>
  );
};

export default AttendancePolicies;
