import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetNssfTiersQuery,
  useCreateNssfTierMutation,
  useUpdateNssfTierMutation,
  useDeleteNssfTierMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";

const TIER_TYPES = {
  TIER_1: "TIER_1",
  TIER_2: "TIER_2",
};

const TIER_TYPE_DISPLAY = {
  [TIER_TYPES.TIER_1]: "Tier I",
  [TIER_TYPES.TIER_2]: "Tier II",
};

export default function NSSF({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedNssfTierId, setSelectedNssfTierId] = useState(null);
  const [formData, setFormData] = useState({
    tier_type: TIER_TYPES.TIER_1,
    lower_limit: "",
    upper_limit: "",
    employee_rate_percentage: "",
    employer_rate_percentage: "",
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
    data: nssfTiersData,
    refetch: refetchNssfTiers,
    isFetching: isFetchingNssfTiers,
    isLoading: isLoadingNssfTiers,
  } = useGetNssfTiersQuery(queryParams);

  const [createNssfTier] = useCreateNssfTierMutation();
  const [updateNssfTier] = useUpdateNssfTierMutation();
  const [deleteNssfTier] = useDeleteNssfTierMutation();

  useEffect(() => {
    if (nssfTiersData?.results && nssfTiersData.results.length > 0 && !selectedNssfTierId) {
      setSelectedNssfTierId(nssfTiersData.results[0].id);
    }
  }, [nssfTiersData, selectedNssfTierId]);

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      tier_type: TIER_TYPES.TIER_1,
      lower_limit: "",
      upper_limit: "",
      employee_rate_percentage: "",
      employer_rate_percentage: "",
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
      tier_type: item.tier_type || TIER_TYPES.TIER_1,
      lower_limit: item.lower_limit || "",
      upper_limit: item.upper_limit || "",
      employee_rate_percentage: item.employee_rate_percentage || "",
      employer_rate_percentage: item.employer_rate_percentage || "",
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
          tier_type: formData.tier_type,
          lower_limit: formData.lower_limit,
          upper_limit: formData.upper_limit || null,
          employee_rate_percentage: parseFloat(formData.employee_rate_percentage),
          employer_rate_percentage: parseFloat(formData.employer_rate_percentage),
          is_active: formData.is_active,
        };
        await updateNssfTier(updateData).unwrap();
        toast.success("NSSF Tier updated successfully!");
        await refetchNssfTiers();
      } else {
        const createData = {
          tier_type: formData.tier_type,
          lower_limit: formData.lower_limit,
          upper_limit: formData.upper_limit || null,
          employee_rate_percentage: parseFloat(formData.employee_rate_percentage),
          employer_rate_percentage: parseFloat(formData.employer_rate_percentage),
          is_active: formData.is_active,
        };
        await createNssfTier(createData).unwrap();
        toast.success("NSSF Tier created successfully!");
        await refetchNssfTiers();
      }

      setIsFormOpen(false);
      setFormData({
        tier_type: TIER_TYPES.TIER_1,
        lower_limit: "",
        upper_limit: "",
        employee_rate_percentage: "",
        employer_rate_percentage: "",
        is_active: true,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving NSSF Tier:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || error?.data?.tier_type?.[0]
        || error?.data?.lower_limit?.[0]
        || error?.data?.upper_limit?.[0]
        || "Failed to save NSSF Tier. Please try again.";
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
      await deleteNssfTier(selectedItem.id).unwrap();
      toast.success("NSSF Tier deleted successfully!");
      await refetchNssfTiers();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting NSSF Tier:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete NSSF Tier. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

    const getAvailableTierTypes = () => {
    return [
      { value: TIER_TYPES.TIER_1, display: TIER_TYPE_DISPLAY[TIER_TYPES.TIER_1] },
      { value: TIER_TYPES.TIER_2, display: TIER_TYPE_DISPLAY[TIER_TYPES.TIER_2] }
    ];
  };

  return (
    <>
      {/* Content Card with Shadow */}
      <div className="flex flex-col justify-between items-center pb-10 rounded-xl w-full shadow-sm bg-white mt-6">
        {/* Card Header with Title */}
        <div className="flex flex-row justify-between items-center gap-4 pt-6 pr-6 pb-6 pl-6 w-full border-neutral-200 border-b">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="font-inter text-lg text-neutral-900 leading-tight font-medium">
              NSSF Tier Configuration
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add NSSF Tier
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          <div className="flex flex-col justify-start items-center gap-6 w-full">
            {/* Contribution Rates Section */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="font-inter text-base text-neutral-900 leading-snug tracking-normal font-semibold">
                  Contribution Rates
                </div>
                {nssfTiersData && nssfTiersData.results.length > 0 && (
                  <div className="flex items-center gap-3">
                    {/* Tier Selector */}
                    <select
                      value={selectedNssfTierId || ''}
                      onChange={(e) => setSelectedNssfTierId(Number(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {nssfTiersData.results.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.tier_type_display || TIER_TYPE_DISPLAY[tier.tier_type]}
                        </option>
                      ))}
                    </select>
                    
                    {/* Action Buttons */}
                    <div className="relative z-50">
                      <ButtonDropdown>
                        <button
                          onClick={() => {
                            const selectedTier = nssfTiersData.results.find(t => t.id === selectedNssfTierId);
                            if (selectedTier) handleEditClick(selectedTier);
                          }}
                          className="flex items-center space-x-2"
                        >
                          <LuPencil className="text-lg text-blue-500" />
                          <span className="text-blue-600">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            const selectedTier = nssfTiersData.results.find(t => t.id === selectedNssfTierId);
                            if (selectedTier) openDeleteModal(selectedTier);
                          }}
                          className="flex items-center space-x-2"
                        >
                          <LuArchiveX className="text-lg text-red-500" />
                          <span className="text-red-600">Delete</span>
                        </button>
                      </ButtonDropdown>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-row justify-between items-start gap-3.5 w-full">
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Employee Contribution Rate (%)
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center px-6 w-full">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {nssfTiersData?.results?.find(t => t.id === selectedNssfTierId)?.employee_rate_percentage || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Employer Contribution Rate (%)
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center px-6 w-full">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {nssfTiersData?.results?.find(t => t.id === selectedNssfTierId)?.employer_rate_percentage || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Limits Section */}
            <div className="flex flex-col justify-start items-start gap-4 pt-6 border-t border-gray-200 w-full">
              <div className="font-inter text-base text-neutral-900 leading-snug tracking-normal font-semibold">
                Earnings Limits
              </div>
              <div className="flex flex-row justify-between items-start gap-3.5 w-full">
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Lower Earnings Limit (LEL) - KSh
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center px-6 w-full">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {nssfTiersData?.results?.find(t => t.id === selectedNssfTierId)?.lower_limit ? parseFloat(nssfTiersData.results.find(t => t.id === selectedNssfTierId).lower_limit).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Upper Earnings Limit (UEL) - KSh
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center px-6 w-full">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {nssfTiersData?.results?.find(t => t.id === selectedNssfTierId)?.upper_limit ? parseFloat(nssfTiersData.results.find(t => t.id === selectedNssfTierId).upper_limit).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Configuration Section */}
            <div className="flex flex-col justify-start items-start gap-4 pt-6 border-t border-gray-200 w-full">
              <div className="font-inter text-base text-neutral-900 leading-snug tracking-normal font-semibold">
                Tier Configuration
              </div>
              <div className="flex flex-row justify-between items-start gap-3.5 w-full">
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                      Tier I Limit - KSh
                    </div>
                    <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                      <div className="flex flex-row justify-between items-center px-6 w-full">
                        <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                          {nssfTiersData?.results?.find(tier => tier.tier_type === TIER_TYPES.TIER_1)?.upper_limit ? parseFloat(nssfTiersData.results.find(tier => tier.tier_type === TIER_TYPES.TIER_1).upper_limit).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                    Current: KSh {nssfTiersData?.results?.find(tier => tier.tier_type === TIER_TYPES.TIER_1)?.upper_limit ? parseFloat(nssfTiersData.results.find(tier => tier.tier_type === TIER_TYPES.TIER_1).upper_limit).toLocaleString() : 'N/A'} (Lower earnings)
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                      Tier II Limit - KSh
                    </div>
                    <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                      <div className="flex flex-row justify-between items-center px-6 w-full">
                        <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                          {nssfTiersData?.results?.find(tier => tier.tier_type === TIER_TYPES.TIER_2)?.upper_limit ? parseFloat(nssfTiersData.results.find(tier => tier.tier_type === TIER_TYPES.TIER_2).upper_limit).toLocaleString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                    Current: KSh {nssfTiersData?.results?.find(tier => tier.tier_type === TIER_TYPES.TIER_2)?.upper_limit ? parseFloat(nssfTiersData.results.find(tier => tier.tier_type === TIER_TYPES.TIER_2).upper_limit).toLocaleString() : 'N/A'} (Pensionable earnings)
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Contribution Caps Section */}
            <div className="flex flex-col justify-start items-start gap-4 pt-6 border-t border-gray-200 w-full">
              <div className="font-inter text-base text-neutral-900 leading-snug tracking-normal font-semibold">
                Monthly Contribution Caps
              </div>
              <div className="flex flex-row justify-between items-start gap-3.5 w-full">
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                      Employee Monthly Cap - KSh
                    </div>
                    <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                      <div className="flex flex-row justify-between items-center px-6 w-full">
                        <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                          2,160
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                    Maximum employee contribution per month
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                      Employer Monthly Cap - KSh
                    </div>
                    <div className="flex justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-gray-100">
                      <div className="flex flex-row justify-between items-center px-6 w-full">
                        <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                          2,160
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                    Maximum employer contribution per month
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            {nssfTiersData && nssfTiersData.count > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={nssfTiersData.count}
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
              {editingId ? 'Edit NSSF Tier' : 'Create New NSSF Tier'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Tier Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.tier_type}
                  onChange={(e) =>
                    setFormData({ ...formData, tier_type: e.target.value })
                  }
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {getAvailableTierTypes().map((tier) => (
                    <option key={tier.value} value={tier.value}>
                      {tier.display}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  Select the NSSF tier classification
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Lower Limit (KES) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.lower_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, lower_limit: e.target.value })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 0"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Upper Limit (KES)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.upper_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, upper_limit: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 6000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Employee Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.employee_rate_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_rate_percentage: e.target.value })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 6"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Employer Rate (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.employer_rate_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, employer_rate_percentage: e.target.value })
                    }
                    required
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 6"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_nssf"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="is_active_nssf" className="text-sm font-medium text-gray-700">
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
                      tier_type: TIER_TYPES.TIER_1,
                      lower_limit: "",
                      upper_limit: "",
                      employee_rate_percentage: "",
                      employer_rate_percentage: "",
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
                    !formData.lower_limit || 
                    !formData.employee_rate_percentage || 
                    !formData.employer_rate_percentage
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
                    editingId ? 'Update NSSF Tier' : 'Create NSSF Tier'
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
        confirmationMessage={`Are you sure you want to delete ${selectedItem?.tier_type_display || TIER_TYPE_DISPLAY[selectedItem?.tier_type]}?`}
        deleteMessage="Deleting this NSSF Tier cannot be undone."
        title="Delete NSSF Tier"
        actionText="Delete"
      />
    </>
  );
}