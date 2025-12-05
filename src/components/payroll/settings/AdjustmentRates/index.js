import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetPayrollAdjustmentRatesQuery,
  useCreatePayrollAdjustmentRateMutation,
  useUpdatePayrollAdjustmentRateMutation,
  usePatchPayrollAdjustmentRateMutation,
  useDeletePayrollAdjustmentRateMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";
import { CustomDate } from "@utils/dates";

export default function AdjustmentRates({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    adjustment_type: "OVERPAYMENT",
    rate: "",
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: adjustmentRatesData,
    refetch: refetchAdjustmentRates,
    isFetching: isFetchingAdjustmentRates,
    isLoading: isLoadingAdjustmentRates,
  } = useGetPayrollAdjustmentRatesQuery(queryParams);

  const [createAdjustmentRate] = useCreatePayrollAdjustmentRateMutation();
  const [updateAdjustmentRate] = useUpdatePayrollAdjustmentRateMutation();
  const [patchAdjustmentRate] = usePatchPayrollAdjustmentRateMutation();
  const [deleteAdjustmentRate] = useDeletePayrollAdjustmentRateMutation();

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      adjustment_type: "OVERPAYMENT",
      rate: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    console.log("=== EDIT CLICK DEBUG ===");
    console.log("Full item:", item);
    console.log("Item ID:", item.id);

    setEditingId(item.id);
    setFormData({
      adjustment_type: item.adjustment_type || "OVERPAYMENT",
      rate: item.rate || "",
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
          adjustment_type: formData.adjustment_type,
          rate: parseFloat(formData.rate),
        };
        await updateAdjustmentRate(updateData).unwrap();
        toast.success("Adjustment Rate updated successfully!");
        await refetchAdjustmentRates();
      } else {
        const createData = {
          adjustment_type: formData.adjustment_type,
          rate: parseFloat(formData.rate),
        };
        await createAdjustmentRate(createData).unwrap();
        toast.success("Adjustment Rate created successfully!");
        await refetchAdjustmentRates();
      }

      setIsFormOpen(false);
      setFormData({
        adjustment_type: "OVERPAYMENT",
        rate: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving Adjustment Rate:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || error?.data?.rate?.[0]
        || error?.data?.adjustment_type?.[0]
        || "Failed to save adjustment rate. Please try again.";
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
      await deleteAdjustmentRate(selectedItem.id).unwrap();
      toast.success("Adjustment Rate deleted successfully!");
      await refetchAdjustmentRates();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting Adjustment Rate:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete adjustment rate. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getAdjustmentTypeLabel = (type) => {
    switch (type) {
      case "OVERPAYMENT":
        return "Overpayment";
      case "UNDERPAYMENT":
        return "Underpayment";
      default:
        return type;
    }
  };

  const getAdjustmentTypeColor = (type) => {
    switch (type) {
      case "OVERPAYMENT":
        return "bg-red-100 text-red-800";
      case "UNDERPAYMENT":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              Adjustment Rates Configuration
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add Adjustment Rate
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          <div className="flex flex-col justify-start items-center gap-6 w-full">
            {/* Adjustment Rates Section */}
            <div className="flex flex-col justify-between items-start gap-4 w-full">
              <div className="flex flex-col justify-start items-start">
                <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                  Payroll Adjustment Rates
                </div>
                <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-normal">
                  Configure default rates for payroll adjustments (overpayments and underpayments)
                </div>
              </div>

              {/* Table */}
              {isLoadingAdjustmentRates ? (
                <div className="flex justify-center py-12 w-full">
                  <ContentSpinner />
                </div>
              ) : adjustmentRatesData && adjustmentRatesData.results.length > 0 ? (
                <div className="flex flex-col justify-start items-start rounded-lg border border-gray-200 overflow-visible w-full">
                  {/* Table Header */}
                  <div className="flex justify-start items-start pt-3 pr-6 pb-3 pl-6 border-b border-gray-200 w-full bg-gray-50">
                    <div className="flex justify-start items-center flex-1 min-w-[300px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Adjustment Type
                      </div>
                    </div>
                    <div className="flex justify-start items-center flex-1 min-w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Rate (%)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Actions
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {adjustmentRatesData.results.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex justify-between items-center pr-6 pl-6 gap-4 w-full h-[69px] ${
                        index !== adjustmentRatesData.results.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex justify-start items-center flex-1 min-w-[300px]">
                        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${getAdjustmentTypeColor(item.adjustment_type)}`}>
                          {getAdjustmentTypeLabel(item.adjustment_type)}
                        </span>
                      </div>
                      <div className="flex justify-start items-center flex-1 min-w-[200px]">
                        <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-auto min-w-[120px]">
                          <div className="font-inter text-sm text-black leading-5 tracking-normal font-normal">
                            {item.rate}%
                          </div>
                        </div>
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
                <NoDataFound message="No adjustment rates found. Click 'Add Adjustment Rate' to create one." />
              )}
            </div>

            {/* Pagination */}
            {adjustmentRatesData && adjustmentRatesData.count > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={adjustmentRatesData.count}
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
              {editingId ? 'Edit Adjustment Rate' : 'Create New Adjustment Rate'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Adjustment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.adjustment_type}
                  onChange={(e) =>
                    setFormData({ ...formData, adjustment_type: e.target.value })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="OVERPAYMENT">Overpayment</option>
                  <option value="UNDERPAYMENT">Underpayment</option>
                </select>
                <span className="text-xs text-gray-500">
                  Select whether this is for recovering overpayments or making additional payments
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Rate (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.rate}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: e.target.value })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 10.00"
                />
                <span className="text-xs text-gray-500">
                  Enter the percentage rate to apply (e.g., 10.00 for 10%)
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      adjustment_type: "OVERPAYMENT",
                      rate: "",
                    });
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !formData.rate}
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
                    editingId ? 'Update Adjustment Rate' : 'Create Adjustment Rate'
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
        confirmationMessage={`Are you sure you want to delete the ${getAdjustmentTypeLabel(selectedItem?.adjustment_type)} adjustment rate (${selectedItem?.rate}%)?`}
        deleteMessage="Deleting this Adjustment Rate cannot be undone."
        title="Delete Adjustment Rate"
        actionText="Delete"
      />
    </>
  );
}