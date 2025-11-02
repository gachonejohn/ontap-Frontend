import { useState } from 'react';
import { NewEmployeeEmergencyContact } from './CreateEmergencyContact';
import { EditEmployeeEmergencyContact } from './EditEmergencyInfo';
import { useDeleteEmergencyContactMutation } from '@store/services/employees/employeesService';
import { FiTrash2 } from 'react-icons/fi';
import ActionModal from '@components/common/Modals/ActionModal';
import { getApiErrorMessage } from '@utils/errorHandler';
import { toast } from 'react-toastify';
export const EmergencyContacts = ({ data: employeeData, refetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteEmergencyContact, { isLoading: isDeleting }] = useDeleteEmergencyContactMutation();
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
      await deleteEmergencyContact(selectedItem).unwrap();
      toast.success('Contact Deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting class.');
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Emergency Information</h3>
        <NewEmployeeEmergencyContact refetchData={refetch} data={employeeData} />
      </div>

      {employeeData.emergency_contacts && employeeData.emergency_contacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employeeData.emergency_contacts.map((contact, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-sm border border-gray-200 font-inter p-4 hover:shadow-md transition-shadow"
            >
              <div className="mb-2">
                <h4 className="text-base font-semibold ">
                  {contact?.full_name ?? 'Not specified'}
                </h4>
                <span className="text-sm text-gray-500">
                  {contact?.relationship ?? 'Not specified'}
                </span>
              </div>

              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium ">Email:</span>{' '}
                  <span className="text-gray-900">{contact?.email ?? 'Not specified'}</span>
                </p>
                <p>
                  <span className="font-medium ">Phone:</span>{' '}
                  <span className="text-gray-900">{contact?.phone_number ?? 'Not specified'}</span>
                </p>
              </div>

              {/* Optional actions per card */}
              <div className="mt-3 flex gap-2 justify-end">
                <EditEmployeeEmergencyContact data={contact} refetchData={refetch} />
                <div
                  onClick={() => openDeleteModal(contact.id)}
                  className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
                  title="Delete"
                >
                  <FiTrash2 className="text-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No emergency contacts available</p>
      )}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Emergency Contact ?"
        deleteMessage="This action cannot be undone."
        title="Delete Emergency Contact"
        actionText="Delete"
      />
    </div>
  );
};
