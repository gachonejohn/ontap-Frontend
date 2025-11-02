import ButtonDropdown from '@components/common/ActionsPopover';
import ActionModal from '@components/common/Modals/ActionModal';
import NoDataFound from '@components/common/NoData';
import { useDeleteEducationInfoMutation } from '@store/services/employees/employeesService';
import { YearMonthCustomDate } from '@utils/dates';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

// import { NewStatutoryInfo } from "./NewStatutoryInfo";
import DataTable from '@components/common/DataTable';
import { NewEducationInfo } from './NewEducation';
import { EditEducationInfo } from './EditEducation';
// import { EditStatutoryInfo } from "./EditStatutoryInfo";
export const EducationHistory = ({ data: employeeData, refetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteEducationInfo, { isLoading: isDeleting }] = useDeleteEducationInfoMutation();
  const openDeleteModal = (id) => {
    setSelectedItem(id);
    console.log('id', id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleDelete = async () => {
    console.log('selectedItem before delete:', selectedItem);
    if (!selectedItem) {
      toast.error('No item selected to delete');
      return;
    }

    try {
      await deleteEducationInfo(selectedItem).unwrap();
      toast.success('Education history Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting education history.');
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
      setSelectedItem(null);
    }
  };

  const columns = [
    {
      header: 'Level',
      accessor: 'level',
      cell: (item) => <span>{item?.level ?? ''}</span>,
    },
    {
      header: 'Institution',
      accessor: 'institution',
      cell: (item) => <span className="text-xs font-medium">{item?.institution ?? ''}</span>,
    },
    {
      header: 'Specialization',
      accessor: 'specialization',
      cell: (item) => <span className="text-xs font-medium">{item?.specialization ?? ''}</span>,
    },

    {
      header: 'Start Date',
      accessor: 'start_date',
      cell: (item) => (
        <span className="text-xs font-medium">{YearMonthCustomDate(item?.start_date ?? '')}</span>
      ),
    },
    {
      header: 'End Date',
      accessor: 'end_date',
      cell: (item) => (
        <span className="text-xs font-medium">{YearMonthCustomDate(item?.end_date ?? '')}</span>
      ),
    },

    {
      header: 'Added On',
      accessor: 'created_at',
      cell: (item) => (
        <span className="text-xs font-medium">{YearMonthCustomDate(item?.created_at ?? '')}</span>
      ),
    },

    {
      header: 'Actions',
      accessor: 'actions',
      cell: (item) => (
        <ButtonDropdown>
          <EditEducationInfo refetchData={refetch} data={item} />

          {/* Download */}
          {item.file ? (
            <a
              href={item.file}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center space-x-2"
            >
              <FiDownload className="text-lg" />
              <span>Download</span>
            </a>
          ) : (
            <div className="flex items-center space-x-2 text-gray-400 cursor-not-allowed">
              <FiDownload className="text-lg" />
              <span>No file</span>
            </div>
          )}

          {/* Delete */}
          <button onClick={() => openDeleteModal(item.id)} className="flex items-center space-x-2">
            <FiTrash2 className="text-lg" />
            <span className="text-red-600">Delete</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];
  console.log('employeeData.education_history', employeeData.education_history);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Education History</h3>
        <div>
          <NewEducationInfo refetchData={refetch} data={employeeData} />
        </div>
      </div>

      {employeeData.education_history && employeeData.education_history.length > 0 ? (
        <DataTable
          data={employeeData.education_history}
          columns={columns}
          // isLoading={loadingData}
          // error={error}
          // stripedRows={true}
          // stripeColor="bg-slate-100"
        />
      ) : (
        <NoDataFound message="No Education info found" />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Education history  ?"
        deleteMessage="This action cannot be undone."
        title="Delete Education history"
        actionText="Delete"
      />
    </div>
  );
};
