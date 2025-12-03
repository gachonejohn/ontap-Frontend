import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetPayrollPeriodSettingsQuery,
  useCreatePayrollPeriodSettingMutation,
  useUpdatePayrollPeriodSettingMutation,
  useDeletePayrollPeriodSettingMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";
import { CustomDate } from "@utils/dates";

export default function PayrollRules({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    frequency: "monthly",
    start_day: "",
    duration_days: "",
    is_active: true,
  });

  const queryParams = useMemo(
    () => ({}),
    []
  );

  const {
    data: payrollPeriodData,
    refetch: refetchPayrollPeriod,
    isFetching: isFetchingPayrollPeriod,
    isLoading: isLoadingPayrollPeriod,
  } = useGetPayrollPeriodSettingsQuery(queryParams);

  const [createPayrollPeriodSetting] = useCreatePayrollPeriodSettingMutation();
  const [updatePayrollPeriodSetting] = useUpdatePayrollPeriodSettingMutation();
  const [deletePayrollPeriodSetting] = useDeletePayrollPeriodSettingMutation();

  const payrollPeriodSettings = Array.isArray(payrollPeriodData) ? payrollPeriodData : payrollPeriodData?.results || [];
  const hasData = payrollPeriodSettings.length > 0;

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      frequency: "monthly",
      start_day: "",
      duration_days: "",
      is_active: true,
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    console.log("Editing payroll period:", item);
    setEditingId(item.id);
    setFormData({
      frequency: item.frequency || "monthly",
      start_day: item.start_day?.toString() || "",
      duration_days: item.duration_days?.toString() || "",
      is_active: item.status === "active", 
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        frequency: formData.frequency,
        start_day: parseInt(formData.start_day) || 1,
        duration_days: parseInt(formData.duration_days) || 30,
        status: formData.is_active ? "active" : "inactive", 
      };

      if (editingId) {
        await updatePayrollPeriodSetting({ id: editingId, ...payload }).unwrap();
        toast.success("Payroll period setting updated successfully!");
        await refetchPayrollPeriod();
      } else {
        await createPayrollPeriodSetting(payload).unwrap();
        toast.success("Payroll period setting created successfully!");
        await refetchPayrollPeriod();
      }

      setIsFormOpen(false);
      setFormData({
        frequency: "monthly",
        start_day: "",
        duration_days: "",
        is_active: true,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving Payroll Period Setting:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || Object.values(error?.data || {}).flat()[0]
        || "Failed to save payroll period setting. Please try again.";
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
      await deletePayrollPeriodSetting(selectedItem.id).unwrap();
      toast.success("Payroll period setting deleted successfully!");
      await refetchPayrollPeriod();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting Payroll Period Setting:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete payroll period setting. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getFrequencyDisplay = (frequency) => {
    switch (frequency) {
      case "monthly":
        return "Monthly";
      case "biweekly":
        return "Bi-weekly";
      case "weekly":
        return "Weekly";
      case "quarterly":
        return "Quarterly";
      default:
        return frequency;
    }
  };

  const getStatusDisplay = (status) => {
    const isActive = status === "active";
    return {
      text: isActive ? "Active" : "Inactive",
      className: isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
    };
  };

  console.log("Payroll Period Data:", payrollPeriodData);
  console.log("Payroll Period Settings Array:", payrollPeriodSettings);
  console.log("Has Data:", hasData);

  return (
    <>
      {/* Content Card with Shadow */}
      <div className="flex flex-col justify-between items-center pb-10 rounded-xl w-full shadow-sm bg-white mt-6">
        {/* Card Header with Title */}
        <div className="flex flex-row justify-between items-center gap-4 pt-6 pr-6 pb-6 pl-6 w-full border-neutral-200 border-b">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="font-inter text-lg text-neutral-900 leading-tight font-medium">
              Payroll Rules
            </div>
          </div>
          {/* Add Button */}
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add Payroll Rule
            </div>
          </button>
        </div>

        {/* Table Content */}
        <div className="w-full px-6 pt-6">
          <div className="flex flex-col justify-start items-center gap-6 w-full">
            {/* Payroll Period Settings Section */}
            <div className="flex flex-col justify-between items-start gap-4 w-full">
              <div className="flex flex-col justify-start items-start">
                <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                  Payroll Period Settings
                </div>
                <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-normal">
                  Configure payroll periods and processing rules
                </div>
              </div>

              {/* Table */}
              {isLoadingPayrollPeriod ? (
                <div className="flex justify-center py-12 w-full">
                  <ContentSpinner />
                </div>
              ) : hasData ? (
                <div className="flex flex-col justify-start items-start rounded-lg border border-gray-200 overflow-visible w-full">
                  {/* Table Header */}
                  <div className="flex justify-start items-start pt-3 pr-6 pb-3 pl-6 border-b border-gray-200 w-full bg-gray-50">
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Frequency
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[150px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Start Day
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[150px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Duration (Days)
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[150px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Status
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[200px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Created At
                      </div>
                    </div>
                    <div className="flex justify-start items-center w-[180px]">
                      <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-medium">
                        Actions
                      </div>
                    </div>
                  </div>

                  {/* Table Rows */}
                  {payrollPeriodSettings.map((item, index) => {
                    const statusInfo = getStatusDisplay(item.status);
                    return (
                      <div 
                        key={item.id} 
                        className={`flex justify-between items-center pr-7 pl-6 gap-4 w-full h-[69px] ${
                          index !== payrollPeriodSettings.length - 1 ? 'border-b border-gray-200' : ''
                        }`}
                      >
                        {/* Frequency */}
                        <div className="flex justify-start items-center w-[180px]">
                          <span className="text-sm font-medium text-gray-900">
                            {getFrequencyDisplay(item.frequency)}
                          </span>
                        </div>
                        
                        {/* Start Day */}
                        <div className="flex justify-start items-center w-[150px]">
                          <span className="text-sm font-medium">
                            Day {item.start_day}
                          </span>
                        </div>
                        
                        {/* Duration */}
                        <div className="flex justify-start items-center w-[150px]">
                          <span className="text-sm font-medium">
                            {item.duration_days} days
                          </span>
                        </div>
                        
                        {/* Status */}
                        <div className="flex justify-start items-center w-[150px]">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${statusInfo.className}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        
                        {/* Created At */}
                        <div className="flex justify-start items-center w-[200px]">
                          <span className="text-xs font-medium">
                            {CustomDate(item.created_at)}
                          </span>
                        </div>
                        
                        {/* Actions */}
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
                    );
                  })}
                </div>
              ) : (
                <NoDataFound message="No payroll period settings found. Click 'Add Payroll Rule' to create one." />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Payroll Rule' : 'Create New Payroll Rule'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Frequency */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
                <span className="text-xs text-gray-500">
                  How often payroll should be processed
                </span>
              </div>

              {/* Start Day */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.start_day}
                  onChange={(e) => setFormData({...formData, start_day: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 1"
                />
                <span className="text-xs text-gray-500">
                  Day of the month when payroll period starts (1-31)
                </span>
              </div>

              {/* Duration Days */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Duration (Days) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({...formData, duration_days: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 30"
                />
                <span className="text-xs text-gray-500">
                  Number of days in the payroll period
                </span>
              </div>

              {/* Active Status Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_payroll_rule"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="is_active_payroll_rule" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
              <span className="text-xs text-gray-500 -mt-2">
                Active settings are used for current payroll calculations
              </span>

              {/* Form Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      frequency: "monthly",
                      start_day: "",
                      duration_days: "",
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
                  disabled={actionLoading || !formData.start_day || !formData.duration_days}
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
                    editingId ? 'Update Rule' : 'Create Rule'
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
        confirmationMessage={`Are you sure you want to delete this payroll rule?`}
        deleteMessage="Deleting this payroll rule will affect payroll period calculations."
        title="Delete Payroll Rule"
        actionText="Delete"
      />
    </>
  );
}