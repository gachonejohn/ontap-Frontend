import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetTaxBandsQuery,
  useCreateTaxBandMutation,
  useUpdateTaxBandMutation,
  useDeleteTaxBandMutation,
  useGetPersonalReliefsQuery,
  useCreatePersonalReliefMutation,
  useUpdatePersonalReliefMutation,
  useDeletePersonalReliefMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";
import { CustomDate } from "@utils/dates";

export default function PAYETax({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    lower_limit: "",
    upper_limit: "",
    rate_percentage: "",
    order: "",
    amount: "",
    is_active: true,
    organization: 2,
    created_by: 2,
    _editingPersonalRelief: false,
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: taxBandsData,
    refetch: refetchTaxBands,
    isFetching: isFetchingTaxBands,
    isLoading: isLoadingTaxBands,
  } = useGetTaxBandsQuery(queryParams);

  const {
    data: personalReliefsData,
    refetch: refetchPersonalReliefs,
    isFetching: isFetchingPersonalReliefs,
    isLoading: isLoadingPersonalReliefs,
  } = useGetPersonalReliefsQuery(queryParams);

  const [createTaxBand] = useCreateTaxBandMutation();
  const [updateTaxBand] = useUpdateTaxBandMutation();
  const [deleteTaxBand] = useDeleteTaxBandMutation();

  const [createPersonalRelief] = useCreatePersonalReliefMutation();
  const [updatePersonalRelief] = useUpdatePersonalReliefMutation();
  const [deletePersonalRelief] = useDeletePersonalReliefMutation();

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      name: "",
      lower_limit: "",
      upper_limit: "",
      rate_percentage: "",
      order: "",
      is_active: true,
      organization: 2,
      created_by: 2,
      _editingPersonalRelief: false,
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
      lower_limit: item.lower_limit || "",
      upper_limit: item.upper_limit || "",
      rate_percentage: item.rate_percentage || "",
      order: item.order || "",
      is_active: item.is_active ?? true,
      organization: typeof item.organization === 'object' ? item.organization?.id : item.organization,
      created_by: 2,
      _editingPersonalRelief: false,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      if (formData._editingPersonalRelief) {
        // Personal Relief logic
        if (editingId) {
          const updateData = {
            id: editingId,
            amount: formData.amount,
            is_active: formData.is_active,
          };
          await updatePersonalRelief(updateData).unwrap();
          toast.success("Personal Relief updated successfully!");
          await refetchPersonalReliefs();
        } else {
          const createData = {
            organization: formData.organization,
            amount: formData.amount,
            is_active: formData.is_active,
          };
          await createPersonalRelief(createData).unwrap();
          toast.success("Personal Relief created successfully!");
          await refetchPersonalReliefs();
        }
      } else {
        // PAYE Tax Band logic
        if (editingId) {
          const updateData = {
            id: editingId,
            name: formData.name,
            lower_limit: formData.lower_limit,
            upper_limit: formData.upper_limit,
            rate_percentage: parseFloat(formData.rate_percentage),
            order: parseInt(formData.order),
            is_active: formData.is_active,
          };
          await updateTaxBand(updateData).unwrap();
          toast.success("Tax Band updated successfully!");
          await refetchTaxBands();
        } else {
          const createData = {
            organization: formData.organization,
            name: formData.name,
            lower_limit: formData.lower_limit,
            upper_limit: formData.upper_limit,
            rate_percentage: parseFloat(formData.rate_percentage),
            order: parseInt(formData.order),
            is_active: formData.is_active,
          };
          await createTaxBand(createData).unwrap();
          toast.success("Tax Band created successfully!");
          await refetchTaxBands();
        }
      }

      setIsFormOpen(false);
      setFormData({
        name: "",
        lower_limit: "",
        upper_limit: "",
        rate_percentage: "",
        order: "",
        amount: "",
        is_active: true,
        organization: 2,
        created_by: 2,
        _editingPersonalRelief: false,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || error?.data?.name?.[0]
        || error?.data?.rate_percentage?.[0]
        || error?.data?.order?.[0]
        || "Failed to save. Please try again.";
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
    setFormData(prev => ({ ...prev, _editingPersonalRelief: false }));
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      if (formData._editingPersonalRelief) {
        await deletePersonalRelief(selectedItem.id).unwrap();
        toast.success("Personal Relief deleted successfully!");
        await refetchPersonalReliefs();
      } else {
        await deleteTaxBand(selectedItem.id).unwrap();
        toast.success("Tax Band deleted successfully!");
        await refetchTaxBands();
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete. Please try again.";
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
              PAYE Tax Bands & Relief Configuration
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add Tax Band
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          <div className="flex flex-col justify-start items-start gap-6 w-full">
            {/* Income Tax Bands Section */}
            <div className="flex flex-col justify-between items-start gap-4 w-full">
              <div className="flex flex-col justify-start items-start">
                <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                  Income Tax Bands
                </div>
                <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-normal">
                  Configure progressive tax rates per income bracket
                </div>
              </div>

              {/* Table */}
              {isLoadingTaxBands ? (
                <div className="flex justify-center py-12 w-full">
                  <ContentSpinner />
                </div>
              ) : taxBandsData && taxBandsData.results.length > 0 ? (
                <div className="flex flex-col justify-start items-start rounded-lg border border-gray-200 w-full overflow-visible">
                  {/* Table Header */}
                  <div className="flex justify-start items-start pt-3 pr-6 pb-3 pl-6 border-b border-gray-200 w-full bg-gray-50">
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Tax Band
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Lower Limit (KSh)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Upper Limit (KSh)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Tax Rate (%)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Actions
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {taxBandsData.results.map((item, index) => (
                    <div 
                      key={item.id} 
                      className={`flex justify-between items-center pr-7 pl-6 gap-4 w-full h-[69px] ${
                        index !== taxBandsData.results.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div className="flex justify-start items-center w-[180px]">
                        <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-medium">
                          {item.name}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-[180px]">
                        <div className="font-inter text-sm text-zinc-500 leading-none tracking-normal font-normal">
                          {item.lower_limit ? parseFloat(item.lower_limit).toLocaleString() : '0'}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-[180px]">
                        <div className="font-inter text-sm text-zinc-500 leading-none tracking-normal font-normal">
                          {item.upper_limit ? parseFloat(item.upper_limit).toLocaleString() : 'No limit'}
                        </div>
                      </div>
                      <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-9 bg-gray-100 w-[180px]">
                        <div className="font-inter text-sm text-black leading-5 tracking-normal font-normal">
                          {item.rate_percentage}
                        </div>
                      </div>
                      <div className="flex justify-start items-center w-[180px]">
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
                <NoDataFound message="No tax bands found. Click 'Add Tax Band' to create one." />
              )}
            </div>

            {/* Personal Relief and Insurance Relief Section */}
            <div className="flex justify-start items-start pt-6 gap-6 border-t border-gray-300 w-full">
              <div className="flex flex-col justify-start items-start gap-2 w-1/2">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="font-inter text-sm text-black leading-3 tracking-normal font-medium">
                    Personal Relief (Monthly)
                  </div>
                  <div className="flex items-center gap-2">
                    {!personalReliefsData?.results?.[0] && (
                      <button
                        onClick={() => {
                          setFormData({
                            amount: "",
                            is_active: true,
                            organization: 2,
                            _editingPersonalRelief: true,
                          });
                          setEditingId(null);
                          setIsFormOpen(true);
                        }}
                        className="px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        + Add
                      </button>
                    )}
                    {personalReliefsData?.results?.[0] && (
                      <div className="relative z-50">
                        <ButtonDropdown>
                          <button
                            onClick={() => {
                              const item = personalReliefsData.results[0];
                              setEditingId(item.id);
                              setFormData({
                                amount: item.amount || "",
                                is_active: item.is_active ?? true,
                                organization: 2,
                                _editingPersonalRelief: true,
                              });
                              setIsFormOpen(true);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <LuPencil className="text-lg text-blue-500" />
                            <span className="text-blue-600">Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(personalReliefsData.results[0]);
                              setFormData(prev => ({ ...prev, _editingPersonalRelief: true }));
                              setIsDeleteModalOpen(true);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <LuArchiveX className="text-lg text-red-500" />
                            <span className="text-red-600">Delete</span>
                          </button>
                        </ButtonDropdown>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-2 w-full">
                  <div className="font-inter text-base text-gray-600 leading-6 tracking-normal font-normal">
                    KSh
                  </div>
                  <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-gray-300 h-11 bg-gray-100 flex-1">
                    <div className="font-inter text-sm text-black leading-5 tracking-normal font-normal">
                      {personalReliefsData?.results?.[0]?.amount ? parseFloat(personalReliefsData.results[0].amount).toLocaleString() : '2400'}
                    </div>
                  </div>
                </div>
                <div className="font-inter text-sm text-gray-500 leading-5 tracking-normal font-normal">
                  Annual: KSh {personalReliefsData?.results?.[0]?.amount ? (parseFloat(personalReliefsData.results[0].amount) * 12).toLocaleString() : '28,800'}
                </div>
              </div>

              {/* Insurance Relief Section
              <div className="flex flex-col justify-start items-start gap-2 flex-1">
                <div className="font-inter text-sm text-black leading-3 tracking-normal font-medium">
                  Insurance Relief Rate (%)
                </div>
                <div className="flex flex-row justify-start items-center pt-1 pr-3 pb-1 pl-3 rounded-lg border border-black h-11 bg-gray-100 w-full">
                  <div className="font-inter text-sm text-black leading-5 tracking-normal font-normal">
                    15
                  </div>
                </div>
                <div className="font-inter text-sm text-gray-500 leading-5 tracking-normal font-normal">
                  Applied to insurance premiums paid
                </div>
              </div>
              */}
            </div>

            {/* Allowable Deductions Section - Commented Out
            <div className="flex flex-col justify-start items-start gap-4 pt-6 border-t border-black w-full">
              <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                Allowable Deductions
              </div>
              <div className="flex flex-row justify-between items-center gap-4 pr-4 pl-4 rounded-lg w-full h-16 bg-gray-50">
                <div className="flex flex-col justify-start items-start">
                  <div className="font-inter text-sm text-black leading-3 tracking-normal font-medium">
                    NSSF Contributions Deductible
                  </div>
                  <div className="font-inter text-sm text-gray-500 leading-5 tracking-normal font-normal">
                    Deduct NSSF from taxable income
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center pl-3.5 rounded-full border border-black h-4 bg-black overflow-hidden">
                  <div className="rounded-full w-4 h-4 bg-white"></div>
                </div>
              </div>
            </div>
            */}

            {/* Pagination */}
            {taxBandsData && taxBandsData.count > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={taxBandsData.count}
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
              {editingId 
                ? `Edit ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'}` 
                : `Create New ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'}`
              }
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {formData._editingPersonalRelief ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Monthly Amount (KSh) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 2400"
                    />
                    <span className="text-xs text-gray-500">
                      Enter the monthly personal relief amount (Annual = Monthly × 12)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active_personal_relief"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="is_active_personal_relief" className="text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Band Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., Band 1"
                    />
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
                        Upper Limit (KES) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.upper_limit}
                        onChange={(e) =>
                          setFormData({ ...formData, upper_limit: e.target.value })
                        }
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 10000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tax Rate (%) <span className="text-red-500">*</span>
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
                        placeholder="e.g., 10"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Order <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: e.target.value })
                        }
                        required
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 1"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active_paye"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({ ...formData, is_active: e.target.checked })
                      }
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="is_active_paye" className="text-sm font-medium text-gray-700">
                      Active
                    </label>
                  </div>
                </>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      name: "",
                      lower_limit: "",
                      upper_limit: "",
                      rate_percentage: "",
                      order: "",
                      amount: "",
                      is_active: true,
                      organization: 2,
                      created_by: 2,
                      _editingPersonalRelief: false,
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
                    (formData._editingPersonalRelief
                      ? !formData.amount
                      : !formData.name.trim() || !formData.lower_limit || !formData.upper_limit || !formData.rate_percentage || !formData.order
                    )
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
                    editingId 
                      ? `Update ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'}` 
                      : `Create ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'}`
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
        confirmationMessage={`Are you sure you want to delete ${
          formData._editingPersonalRelief
            ? 'this Personal Relief'
            : `"${selectedItem?.name}"`
        }?`}
        deleteMessage={`Deleting this ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'} cannot be undone.`}
        title={`Delete ${formData._editingPersonalRelief ? 'Personal Relief' : 'Tax Band'}`}
        actionText="Delete"
      />
    </>
  );
}