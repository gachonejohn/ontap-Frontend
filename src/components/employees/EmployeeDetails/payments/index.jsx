import { CreateEmployeePaymentMethodDetails } from "./CreatePaymentMethod";
import { UpdatePymentMethodInfo } from "./EditPaymentMethod";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { CustomDate } from "@utils/dates";
import { FiBriefcase, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import ActionModal from "@components/common/Modals/ActionModal";
import { useDeletePaymentMethodMutation } from "@store/services/employees/employeesService";
export const PaymentMethodDetails = ({ data: employeeData, refetch }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePaymentMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();
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
      await deletePaymentMethod(selectedItem).unwrap();
      toast.success("Payment Method Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error deleting payment method."
      );
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
    }
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Payment Methods
      </h3>

      {/* Create new method */}
      <div className="py-3 flex items-center justify-end">
        <CreateEmployeePaymentMethodDetails
          data={employeeData}
          refetchData={refetch}
        />
      </div>

      {employeeData.payment_methods?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employeeData.payment_methods.map((method) => (
            <div
              key={method.id}
              className={`border rounded-lg p-4 shadow-sm bg-gray-50 relative ${
                method.is_primary ? "border-primary" : "border-gray-200"
              }`}
            >
              {/* actions + badges go together */}
              <div className=" flex items-center justify-between gap-2 mb-4 ">
                {method.is_primary && (
                  <span className="bg-primary-100 text-primary text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <div>
                    <UpdatePymentMethodInfo
                      refetchData={refetch}
                      data={method}
                    />
                  </div>

                  <div
                    onClick={() => openDeleteModal(method.id)}
                    className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
                    title="Delete"
                  >
                    <FiTrash2 className="text-sm" />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <p className="text-sm text-gray-600 mb-1">Channel</p>
              <p className="font-medium text-gray-900">{method.method}</p>

              {method.method === "BANK" && (
                <>
                  <p className="text-sm text-gray-600 mt-3 mb-1">Bank Name</p>
                  <p className="font-medium text-gray-900">
                    {method?.bank_name ?? "Not Specified"}
                  </p>

                  <p className="text-sm text-gray-600 mt-3 mb-1">
                    Account Number
                  </p>
                  <p className="font-medium text-gray-900 break-all">
                    {method?.account_number ?? "N/A"}
                  </p>
                </>
              )}

              {method.method === "MOBILE_MONEY" && (
                <>
                  <p className="text-sm text-gray-600 mt-3 mb-1">
                    Mobile Number
                  </p>
                  <p className="font-medium text-gray-900">
                    {method.mobile_number || "N/A"}
                  </p>
                </>
              )}

              {method.notes && (
                <>
                  <p className="text-sm text-gray-600 mt-3 mb-1">Notes</p>
                  <p className="text-gray-900">{method.notes}</p>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No payment methods available.</p>
      )}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Payment method Information ?"
        deleteMessage="This action cannot be undone."
        title="Delete Payment Method Information"
        actionText="Delete"
      />
    </div>
  );
};
