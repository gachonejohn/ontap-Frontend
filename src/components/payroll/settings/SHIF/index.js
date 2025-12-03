import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetShifRatesQuery,
  useCreateShifRateMutation,
  useUpdateShifRateMutation,
  useDeleteShifRateMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";
import { CustomDate } from "@utils/dates";

export default function SHIF({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    rate_percentage: "",
    minimum_amount: "",
    is_active: true,
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: shifRatesData,
    refetch: refetchShifRates,
    isFetching: isFetchingShifRates,
    isLoading: isLoadingShifRates,
  } = useGetShifRatesQuery(queryParams);

  const [createShifRate] = useCreateShifRateMutation();
  const [updateShifRate] = useUpdateShifRateMutation();
  const [deleteShifRate] = useDeleteShifRateMutation();

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      name: "",
      rate_percentage: "",
      minimum_amount: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    console.log("=== EDIT CLICK DEBUG ===");
    console.log("Full item:", item);
    console.log("Item ID:", item.id);

    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      rate_percentage: item.rate_percentage || "",
      minimum_amount: item.minimum_amount || "",
      is_active: item.is_active ?? true,
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
          rate_percentage: parseFloat(formData.rate_percentage),
          minimum_amount: formData.minimum_amount,
          is_active: formData.is_active,
        };
        await updateShifRate(updateData).unwrap();
        toast.success("SHIF Rate updated successfully!");
        await refetchShifRates();
      } else {
        const createData = {
          name: formData.name,
          rate_percentage: parseFloat(formData.rate_percentage),
          minimum_amount: formData.minimum_amount,
          is_active: formData.is_active,
        };
        await createShifRate(createData).unwrap();
        toast.success("SHIF Rate created successfully!");
        await refetchShifRates();
      }

      setIsFormOpen(false);
      setFormData({
        name: "",
        rate_percentage: "",
        minimum_amount: "",
        is_active: true,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving SHIF Rate:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || error?.data?.name?.[0]
        || error?.data?.rate_percentage?.[0]
        || "Failed to save SHIF Rate. Please try again.";
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
      await deleteShifRate(selectedItem.id).unwrap();
      toast.success("SHIF Rate deleted successfully!");
      await refetchShifRates();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting SHIF Rate:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete SHIF Rate. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Content Card with Shadow */}
      <div className="flex flex-col justify-between items-center pb-10 rounded-xl w-full shadow-sm bg-white mt-6">
        {/* Card Header with Title */}
        <div className="flex flex-row justify-between items-center gap-4 pt-6 pr-6 pb-6 pl-6 w-full border-neutral-200 border-b">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="font-inter text-lg text-neutral-900 leading-tight font-medium">
              SHIF Rate Configuration
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add SHIF Rate
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          <div className="flex flex-col justify-start items-center gap-6 w-full">
            {/* SHIF Rates Section */}
            <div className="flex flex-col justify-between items-start gap-4 w-full">
              <div className="flex flex-col justify-start items-start">
                <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                  SHIF Rates
                </div>
                <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-normal">
                  Configure Social Health Insurance Fund contribution rates
                </div>
              </div>

              {/* Table */}
              {isLoadingShifRates ? (
                <div className="flex justify-center py-12 w-full">
                  <ContentSpinner />
                </div>
              ) : shifRatesData && shifRatesData.results.length > 0 ? (
                <div className="flex flex-col justify-start items-start rounded-lg border border-gray-200 overflow-visible w-full">
                  {/* Table Header */}
                  <div className="flex justify-start items-start pt-3 pr-6 pb-3 pl-6 border-b border-gray-200 w-full bg-gray-50">
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Rate Name
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Minimum Amount (KSh)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Rate Percentage (%)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Status
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Actions
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {shifRatesData.results.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex justify-between items-center pr-7 pl-6 gap-4 w-full h-[69px] ${
                        index !== shifRatesData.results.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex justify-start items-center w-[200px]">
                        <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-medium">
                          {item.name}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-[200px]">
                        <div className="font-inter text-sm text-zinc-500 leading-none tracking-normal font-normal">
                          {item.minimum_amount ? parseFloat(item.minimum_amount).toLocaleString() : '0'}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-[200px]">
                        <div className="font-inter text-sm text-black leading-5 tracking-normal font-normal">
                          {item.rate_percentage}
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-[200px]">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          item.is_active 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {item.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex justify-start items-center w-[200px]">
                        <div className="relative z-50">
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <NoDataFound message="No SHIF rates found. Click 'Add SHIF Rate' to create one." />
              )}
            </div>

            {/* Pagination */}
            {shifRatesData && shifRatesData.count > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={shifRatesData.count}
                pageSize={PAGE_SIZE}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit SHIF Rate' : 'Create New SHIF Rate'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Standard SHIF Rate"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Minimum Amount (KSh) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minimum_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_amount: e.target.value })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 300"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Rate Percentage (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.rate_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, rate_percentage: e.target.value })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 2.75"
                  />
                </div>
              </div>
              <span className="text-xs text-gray-500">
                Enter the SHIF contribution rate percentage and minimum amount
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_shif"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="is_active_shif" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      name: "",
                      rate_percentage: "",
                      minimum_amount: "",
                      is_active: true,
                    });
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    actionLoading || 
                    !formData.name.trim() || 
                    !formData.rate_percentage || 
                    !formData.minimum_amount
                  }
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
                    editingId ? 'Update SHIF Rate' : 'Create SHIF Rate'
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
        deleteMessage="Deleting this SHIF Rate cannot be undone."
        title="Delete SHIF Rate"
        actionText="Delete"
      />
    </>
  );
}