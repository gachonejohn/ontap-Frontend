import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetAllowancesQuery,
  useCreateAllowanceMutation,
  useUpdateAllowanceMutation,
  useDeleteAllowanceMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import DataTable from "@components/common/DataTable";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";

export default function Allowances({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: allowancesData,
    refetch: refetchAllowances,
    isFetching,
    isLoading,
  } = useGetAllowancesQuery(queryParams);

  const [createAllowance] = useCreateAllowanceMutation();
  const [updateAllowance] = useUpdateAllowanceMutation();
  const [deleteAllowance] = useDeleteAllowanceMutation();

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    console.log("=== EDIT CLICK DEBUG ===");
    console.log("Full item:", item);
    console.log("Item ID:", item.id);

    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (editingId) {
        const updateData = {
          id: editingId,
          name: formData.name,
          description: formData.description,
        };
        await updateAllowance(updateData).unwrap();
        toast.success("Allowance updated successfully!");
        await refetchAllowances();
      } else {
        const createData = {
          name: formData.name,
          description: formData.description,
        };
        await createAllowance(createData).unwrap();
        toast.success("Allowance created successfully!");
        await refetchAllowances();
      }

      setIsFormOpen(false);
      setFormData({
        name: "",
        description: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving Allowance:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || error?.data?.name?.[0]
        || "Failed to save allowance. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteAllowance(selectedItem.id).unwrap();
      toast.success("Allowance deleted successfully!");
      await refetchAllowances();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting Allowance:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete allowance. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (item) => <span className="text-sm font-medium">{item.name}</span>,
    },
    {
      header: "Description",
      accessor: "description",
      cell: (item) => (
        <span className="text-xs font-medium">{item.description || "N/A"}</span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (item) => (
        <ButtonDropdown>
          <button
            onClick={() => handleEditClick(item)}
            className="flex items-center space-x-2"
          >
            <LuPencil className="text-lg text-blue-500" />
            <span className="text-blue-600">Edit</span>
          </button>
          <button
            onClick={() => openDeleteModal(item)}
            className="flex items-center space-x-2"
          >
            <LuArchiveX className="text-lg text-red-500" />
            <span className="text-red-600">Delete</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];

  return (
    <>
      {/* Content Card with Shadow */}
      <div className="flex flex-col justify-between items-center pb-10 rounded-xl w-full shadow-sm bg-white mt-6">
        {/* Card Header with Title */}
        <div className="flex flex-row justify-between items-center gap-4 pt-6 pr-6 pb-6 pl-6 w-full border-neutral-200 border-b">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="font-inter text-lg text-neutral-900 leading-tight font-medium">
              Allowances Configuration
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add Allowance
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <ContentSpinner />
            </div>
          ) : allowancesData && allowancesData.results && allowancesData.results.length > 0 ? (
            <>
              <DataTable
                data={allowancesData.results}
                columns={columns}
                isLoading={isFetching}
                stripedRows={true}
                stripeColor="bg-slate-100"
              />
              {/* Pagination for Allowances */}
              {allowancesData && allowancesData.count > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={allowancesData.count}
                  pageSize={PAGE_SIZE}
                  onPageChange={onPageChange}
                />
              )}
            </>
          ) : (
            <NoDataFound message="No allowances found. Click 'Add Allowance' to create one." />
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Allowance' : 'Create New Allowance'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Allowance Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  maxLength={100}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Transport Allowance"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter description (optional)"
                  rows="3"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      name: "",
                      description: "",
                    });
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !formData.name.trim()}
                  className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors"
                >
                  {actionLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    editingId ? 'Update Allowance' : 'Create Allowance'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleConfirmDelete}
        isDeleting={actionLoading}
        confirmationMessage={`Are you sure you want to delete "${selectedItem?.name}"?`}
        deleteMessage="Deleting this allowance cannot be undone."
        title="Delete Allowance"
        actionText="Delete"
      />
    </>
  );
}