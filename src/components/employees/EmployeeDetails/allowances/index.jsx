import { CreateEmployeeAllowance } from './CreateEmployeeAllowance';
import { UpdateEmployeeAllowanceInfo } from './EditEmployeeAllowance';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ActionModal from '@components/common/Modals/ActionModal';
import { useDeleteEmployeeAllowanceMutation } from '@store/services/payslips/payslipService';

export const EmployeeAllowance = ({ data: employeeData, refetch }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteEmployeeAllowance, { isLoading: isDeleting }] = useDeleteEmployeeAllowanceMutation();
  
  const openDeleteModal = (id) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    try {
      await deleteEmployeeAllowance(selectedItem).unwrap();
      toast.success('Employee Allowance Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting Employee Allowance.');
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Allowances</h3>

      {/* Create new allowance */}
      <div className="py-3 flex items-center justify-end">
        <CreateEmployeeAllowance data={employeeData} refetchData={refetch} />
      </div>

      {employeeData.employee_allowances?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employeeData.employee_allowances.map((allowance) => (
            <div 
              key={allowance.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 mb-4">
                <UpdateEmployeeAllowanceInfo refetchData={refetch} data={allowance} />
                <div
                  onClick={() => openDeleteModal(allowance.id)}
                  className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
                  title="Delete"
                >
                  <FiTrash2 className="text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Allowance */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Allowance</p>
                  <p className="font-medium text-gray-900">{allowance?.allowance?.name}</p>
                </div>

                {/* Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-medium text-gray-900">{allowance?.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No Employee Allowances available.</p>
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Employee Allowance Information?"
        deleteMessage="This action cannot be undone."
        title="Delete Employee Allowance Information"
        actionText="Delete"
      />
    </div>
  );
};