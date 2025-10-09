import ButtonDropdown from "@components/common/ActionsPopover";
import DataTable from "@components/common/DataTable";
import ActionModal from "@components/common/Modals/ActionModal";
import NoDataFound from "@components/common/NoData";
import { useRemoveEmployeeRoleMutation } from "@store/services/employees/employeesService";
import { YearMonthCustomDate } from "@utils/dates";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { TbKeyOff } from "react-icons/tb";
import { toast } from "react-toastify";
import { AssignRole } from "./AssignRole";
import { EditEmployeeRole } from "./EditAccessRole";

export const SystemAccess = ({ data: employeeData, refetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [removeEmployeeRole, { isLoading: isRemoving }] =
    useRemoveEmployeeRoleMutation();
  const openDeleteModal = (id) => {
    setSelectedItem(id);
    console.log("id", id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleRevokeRole = async () => {
    console.log("selectedItem before delete:", selectedItem);
    if (!selectedItem) {
      toast.error("No item selected to delete");
      return;
    }

    try {
      await removeEmployeeRole(selectedItem).unwrap();
      toast.success("Access Role Revoked successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error revoking access role.");
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
      setSelectedItem(null);
    }
  };

  const columns = [
    {
      header: "Role",
      accessor: "role",
      cell: (item) => <span>{item?.role?.name ?? ""}</span>,
    },
    {
      header: "Primary",
      accessor: "is_primary",
      cell: (item) => (
        <span
          className={`
            text-xs font-medium border px-2 py-1 rounded-md 
            ${
              item?.is_primary
                ? "text-green-600 border-green-500 bg-primary-100"
                : "text-red-500 bg-red-100 border-red-500"
            }
            `}
        >
          {item?.is_primary ? "Yes" : "No"}
        </span>
      ),
    },

    

    {
      header: "Assigned On",
      accessor: "created_at",
      cell: (item) => (
        <span className="text-xs font-medium">
          {YearMonthCustomDate(item?.created_at ?? "")}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "actions",
      cell: (item) => (
        <ButtonDropdown>
       
          <EditEmployeeRole refetchData={refetch} data={item} />
          <button
            onClick={() => openDeleteModal(item.id)}
            className="flex items-center space-x-2"
          >
            <TbKeyOff className="text-sm" />
            <span className="text-red-600">Revoke</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];
  console.log("employeeData.statutory_info", employeeData.statutory_info);
  return (
    <div className="bg-white rounded-lg border border-gray-200 font-inter p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold mb-2">System Access Rights</h2>
        <div>
          <AssignRole refetchData={refetch} data={employeeData} />
        </div>
      </div>

      {employeeData.employee_assigned_roles &&
      employeeData.employee_assigned_roles.length > 0 ? (
        <DataTable
          data={employeeData.employee_assigned_roles}
          columns={columns}
          // isLoading={loadingData}
          // error={error}
          // stripedRows={true}
          // stripeColor="bg-slate-100"
        />
      ) : (
        <NoDataFound message="No statutory info found" />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleRevokeRole}
        isDeleting={isRemoving}
        confirmationMessage="Are you sure you want to Revoke this Access Role?"
        deleteMessage="This action cannot be undone."
        title="Revoke Role"
        actionText="Revoke"
      />
    </div>
  );
};
