import { CreateContract } from "./AddContract";
import { UpdateContract } from "./EditContract";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { CustomDate } from "@utils/dates";
import { FiBriefcase, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import ActionModal from "@components/common/Modals/ActionModal";
import { useDeleteContractMutation } from "@store/services/employees/employeesService";

export const ContractsDetails = ({ data: employeeData, refetch }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteContract, { isLoading: isDeleting }] =
    useDeleteContractMutation();
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
      await deleteContract(selectedItem).unwrap();
      toast.success("Contract Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error deleting contract.");
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
    }
  };

  const statusStyles = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "EXPIRED":
        return "bg-gray-100 text-gray-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiBriefcase className="text-primary" />
          Contracts
        </h3>
        <div className="py-3 flex items-center justify-end">
          <CreateContract data={employeeData} refetchData={refetch} />
        </div>
      </div>

      {employeeData.contracts?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {employeeData.contracts.map((contract, index) => {
            const isActive = contract.status === "ACTIVE";
            return (
              <div
                key={contract.id || index}
                className={`rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow ${
                  isActive ? "border-primary" : "border-gray-200 bg-gray-50"
                }`}
              >
                {/* Header */}
                <div className="mb-4 border-b pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-semibold text-gray-800">
                      {contract.contract_type || "Contract"}
                    </h4>
                    {employeeData.contracts.length > 1 && (
                      <span className="text-xs text-gray-500">
                        #{index + 1}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles(
                        contract.status
                      )}`}
                    >
                      {contract.status}
                    </span>
                    <div>
                      <UpdateContract data={contract} refetchData={refetch} />
                    </div>
                    <div
                      onClick={() => openDeleteModal(contract.id)}
                      className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 cursor-pointer transition duration-200 shadow-sm"
                      title="Delete"
                    >
                      <FiTrash2 className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Status:</span>{" "}
                    <span className="text-gray-900">
                      {employeeData.status || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Work Location:
                    </span>{" "}
                    <span className="text-gray-900">
                      {contract.work_location || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Salary:</span>{" "}
                    <span className="text-gray-900">
                      {contract.salary_currency} {contract.basic_salary} 
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Pay Frequency:
                    </span>{" "}
                    <span className="text-gray-900">
                      {contract.pay_frequency || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Supervisor:
                    </span>{" "}
                    <span className="text-gray-900">
                      {contract.reporting_to || "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Date of Hire:
                    </span>{" "}
                    <span className="text-gray-900">
                      {CustomDate(contract.start_date)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">End Date:</span>{" "}
                    <span className="text-gray-900">
                      {contract.end_date
                        ? CustomDate(contract.end_date)
                        : "Ongoing"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Paid:</span>{" "}
                    <span className="text-gray-900">
                      {contract.is_paid ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No Available contracts</p>
      )}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Contract Information ?"
        deleteMessage="This action cannot be undone."
        title="Delete Contract Information"
        actionText="Delete"
      />
    </div>
  );
};
