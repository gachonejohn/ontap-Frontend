import ButtonDropdown from "@components/common/ActionsPopover";
import ActionModal from "@components/common/Modals/ActionModal";
import NoDataFound from "@components/common/NoData";
import {
  useDeleteStatutoryInfoMutation
} from "@store/services/employees/employeesService";
import { YearMonthCustomDate } from "@utils/dates";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { FiDownload, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

import DataTable from "@components/common/DataTable";
import { EditStatutoryInfo } from "./EditStatutoryInfo";
import { NewStatutoryInfo } from "./NewStatutoryInfo";
export const StatutoryInfo = ({ data: employeeData, refetch }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteStatutoryInfo, { isLoading: isDeleting }] =
    useDeleteStatutoryInfoMutation();
  const openDeleteModal = (id) => {
    setSelectedItem(id);
    console.log("id", id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };
  const handleDelete = async () => {
    console.log("selectedItem before delete:", selectedItem);
    if (!selectedItem) {
      toast.error("No item selected to delete");
      return;
    }

    try {
      await deleteStatutoryInfo(selectedItem).unwrap();
      toast.success("Statutory Info Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error deleting info.");
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
      setSelectedItem(null);
    }
  };

  const columns = [
    {
      header: "Type",
      accessor: "document_type",
      cell: (item) => <span>{item?.document_type?.name ?? ""}</span>,
    },
    {
      header: "Identifier",
      accessor: "identifier",
      cell: (item) => (
        <span className="text-xs font-medium">{item?.identifier ?? ""}</span>
      ),
    },
    {
      header: "Issue Date",
      accessor: "issue_date",
      cell: (item) => (
        <span className="text-xs font-medium">
          {YearMonthCustomDate(item?.issue_date ?? "")}
        </span>
      ),
    },
    {
      header: "Expiry Date",
      accessor: "expiry_date",
      cell: (item) => (
        <span className="text-xs font-medium">
          {YearMonthCustomDate(item?.expiry_date ?? "")}
        </span>
      ),
    },
    {
      header: "Added by",
      accessor: "created_by",
      cell: (item) => (
        <span className="text-xs font-medium">
          {item?.created_by?.first_name ?? ""}{" "}
          {item?.created_by?.last_name ?? ""}
        </span>
      ),
    },
    {
      header: "Added On",
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
          {/* View */}
         <EditStatutoryInfo refetchData={refetch} data={item} />

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
          <button
            onClick={() => openDeleteModal(item.id)}
            className="flex items-center space-x-2"
          >
            <FiTrash2 className="text-lg" />
            <span className="text-red-600">Delete</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];
  console.log("employeeData.statutory_info", employeeData.statutory_info);
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Statutory Information
        </h3>
        <div>
          <NewStatutoryInfo refetchData={refetch} data={employeeData} />
        </div>
      </div>

      {employeeData.statutory_info && employeeData.statutory_info.length > 0 ? (
        <DataTable
          data={employeeData.statutory_info}
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
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Statutory Info  ?"
        deleteMessage="This action cannot be undone."
        title="Delete Statutory Info"
        actionText="Delete"
      />
    </div>
  );
};
