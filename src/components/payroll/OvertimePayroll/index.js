import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { LuArchiveX, LuPencil } from "react-icons/lu";
import {
  useGetOvertimeSettingsQuery,
  useCreateOvertimeSettingMutation,
  useUpdateOvertimeSettingMutation,
  useDeleteOvertimeSettingMutation,
} from "@store/services/payroll/payrollService";
import ActionModal from "@components/common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import ButtonDropdown from "@components/common/ActionsPopover";
import Pagination from "@components/common/pagination";
import { PAGE_SIZE } from "@constants/constants";
import { CustomDate } from "@utils/dates";

export default function OvertimePayroll({ currentPage, onPageChange }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    calculation_method: "hourly_rate",
    derive_hourly_from_salary: true,
    standard_month_hours: "173",
    flat_hourly_rate: "",
    weekday_multiplier: "",
    weekend_multiplier: "",
    holiday_multiplier: "",
    weekday_fixed: "",
    weekend_fixed: "",
    holiday_fixed: "",
  });

  const queryParams = useMemo(
    () => ({}),
    []
  );

  const {
    data: overtimeData,
    refetch: refetchOvertime,
    isFetching: isFetchingOvertime,
    isLoading: isLoadingOvertime,
  } = useGetOvertimeSettingsQuery(queryParams);

  const [createOvertimeSetting] = useCreateOvertimeSettingMutation();
  const [updateOvertimeSetting] = useUpdateOvertimeSettingMutation();
  const [deleteOvertimeSetting] = useDeleteOvertimeSettingMutation();

  const overtimeSettings = Array.isArray(overtimeData) ? overtimeData : overtimeData?.results || [];
  const hasData = overtimeSettings.length > 0;

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      calculation_method: "hourly_rate",
      derive_hourly_from_salary: true,
      standard_month_hours: "173",
      flat_hourly_rate: "",
      weekday_multiplier: "",
      weekend_multiplier: "",
      holiday_multiplier: "",
      weekday_fixed: "",
      weekend_fixed: "",
      holiday_fixed: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item) => {
    console.log("Editing item:", item);
    setEditingId(item.id);
    setFormData({
      calculation_method: item.calculation_method || "hourly_rate",
      derive_hourly_from_salary: item.derive_hourly_from_salary ?? true,
      standard_month_hours: item.standard_month_hours?.toString() || "173",
      flat_hourly_rate: item.flat_hourly_rate || "",
      weekday_multiplier: item.weekday_multiplier || "",
      weekend_multiplier: item.weekend_multiplier || "",
      holiday_multiplier: item.holiday_multiplier || "",
      weekday_fixed: item.weekday_fixed || "",
      weekend_fixed: item.weekend_fixed || "",
      holiday_fixed: item.holiday_fixed || "",
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const payload = {
        calculation_method: formData.calculation_method,
        derive_hourly_from_salary: formData.derive_hourly_from_salary,
        standard_month_hours: parseInt(formData.standard_month_hours) || 173,
      };

      if (formData.calculation_method === "hourly_rate") {
        if (formData.flat_hourly_rate) {
          payload.flat_hourly_rate = formData.flat_hourly_rate;
        }
        if (formData.weekday_multiplier) {
          payload.weekday_multiplier = formData.weekday_multiplier;
        }
        if (formData.weekend_multiplier) {
          payload.weekend_multiplier = formData.weekend_multiplier;
        }
        if (formData.holiday_multiplier) {
          payload.holiday_multiplier = formData.holiday_multiplier;
        }
      } else if (formData.calculation_method === "fixed_rate") {
        if (formData.weekday_fixed) {
          payload.weekday_fixed = formData.weekday_fixed;
        }
        if (formData.weekend_fixed) {
          payload.weekend_fixed = formData.weekend_fixed;
        }
        if (formData.holiday_fixed) {
          payload.holiday_fixed = formData.holiday_fixed;
        }
      }

      if (editingId) {
        await updateOvertimeSetting({ id: editingId, ...payload }).unwrap();
        toast.success("Overtime setting updated successfully!");
        await refetchOvertime();
      } else {
        await createOvertimeSetting(payload).unwrap();
        toast.success("Overtime setting created successfully!");
        await refetchOvertime();
      }

      setIsFormOpen(false);
      setFormData({
        calculation_method: "hourly_rate",
        derive_hourly_from_salary: true,
        standard_month_hours: "173",
        flat_hourly_rate: "",
        weekday_multiplier: "",
        weekend_multiplier: "",
        holiday_multiplier: "",
        weekday_fixed: "",
        weekend_fixed: "",
        holiday_fixed: "",
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error saving Overtime Setting:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || Object.values(error?.data || {}).flat()[0]
        || "Failed to save overtime setting. Please try again.";
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
      await deleteOvertimeSetting(selectedItem.id).unwrap();
      toast.success("Overtime setting deleted successfully!");
      await refetchOvertime();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting Overtime Setting:", error);
      const errorMessage = error?.data?.detail 
        || error?.data?.message 
        || "Failed to delete overtime setting. Please try again.";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const getMethodDisplayName = (method) => {
    switch (method) {
      case "hourly_rate":
        return "Hourly Rate";
      case "fixed_amount":
        return "Fixed Amount";
      default:
        return method;
    }
  };

  const formatMultiplier = (value) => {
    if (!value) return "N/A";
    const numValue = parseFloat(value);
    return `${(numValue * 100).toFixed(0)}%`;
  };

  const formatCurrency = (value) => {
    if (!value) return "N/A";
    return `KES ${parseFloat(value).toFixed(2)}`;
  };

  const getCalculationMethodDescription = (method) => {
    switch (method) {
      case "hourly_rate":
        return "Monthly Salary ÷ Standard Hours × Overtime Hours × Multiplier";
      case "fixed_amount":
        return "Fixed amount per overtime hour";
      default:
        return method;
    }
  };

  const getHourlyRateSourceText = (deriveFromSalary, flatRate) => {
    if (deriveFromSalary) {
      return "Derived from monthly salary";
    }
    return flatRate ? `Flat rate: ${formatCurrency(flatRate)}/hour` : "Flat hourly rate";
  };

  return (
    <>
      {/* Overtime Payment Rates Card */}
      <div className="flex flex-col justify-between items-center pb-6 rounded-xl w-full shadow-sm bg-white mt-6">
        <div className="flex flex-row justify-between items-center gap-4 pt-6 pr-6 pb-6 pl-6 w-full border-neutral-200 border-b">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="font-inter text-lg text-neutral-900 leading-tight font-medium">
              Overtime Payment Rates
            </div>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex justify-center items-center gap-2 rounded-lg h-10 px-4 bg-teal-500 hover:bg-teal-600 transition-colors"
          >
            <div className="font-inter text-xs whitespace-nowrap text-white font-semibold">
              + Add Overtime Setting
            </div>
          </button>
        </div>

        <div className="flex flex-col justify-start items-center gap-6 pt-3 pr-6 pb-3 pl-6 w-full">
          {isLoadingOvertime ? (
            <div className="flex justify-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : hasData ? (
            overtimeSettings.map((item) => (
              <div key={item.id} className="w-full space-y-6">
                {/* Header with metadata and actions */}
                <div className="flex flex-row justify-between items-center pt-6 border-t border-gray-200 w-full">
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-3 py-1.5 rounded ${
                      item.calculation_method === "hourly_rate"
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {getMethodDisplayName(item.calculation_method)}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">
                        Hourly Rate: {getHourlyRateSourceText(item.derive_hourly_from_salary, item.flat_hourly_rate)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Created: {CustomDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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

                {/* Overtime Rates Section */}
                {item.calculation_method === "hourly_rate" ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full">
                      <div className="flex flex-col justify-start items-start gap-2">
                        <div className="gap-2 flex flex-col justify-start items-start w-full">
                          <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                            Weekday Overtime Rate (%)
                          </div>
                          <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                            <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                              <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                {item.weekday_multiplier ? formatMultiplier(item.weekday_multiplier) : "150%"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                          {item.weekday_multiplier ? `${item.weekday_multiplier}x regular hourly rate` : "1.5x regular hourly rate"}
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-start items-start gap-2">
                        <div className="gap-2 flex flex-col justify-start items-start w-full">
                          <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                            Weekend Overtime Rate (%)
                          </div>
                          <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                            <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                              <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                {item.weekend_multiplier ? formatMultiplier(item.weekend_multiplier) : "200%"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                          {item.weekend_multiplier ? `${item.weekend_multiplier}x regular hourly rate` : "2x regular hourly rate"}
                        </div>
                      </div>

                      {item.holiday_multiplier && (
                        <div className="flex flex-col justify-start items-start gap-2">
                          <div className="gap-2 flex flex-col justify-start items-start w-full">
                            <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                              Holiday Overtime Rate (%)
                            </div>
                            <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                              <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                                <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                  {formatMultiplier(item.holiday_multiplier)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                            {item.holiday_multiplier}x regular hourly rate
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full">
                      <div className="flex flex-col justify-start items-start gap-2">
                        <div className="gap-2 flex flex-col justify-start items-start w-full">
                          <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                            Weekday Fixed Rate
                          </div>
                          <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                            <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                              <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                {item.weekday_fixed ? formatCurrency(item.weekday_fixed) : "KES 300.00"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                          Fixed amount per overtime hour
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start gap-2">
                        <div className="gap-2 flex flex-col justify-start items-start w-full">
                          <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                            Weekend Fixed Rate
                          </div>
                          <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                            <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                              <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                {item.weekend_fixed ? formatCurrency(item.weekend_fixed) : "KES 500.00"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                          Fixed amount per overtime hour
                        </div>
                      </div>

                      {item.holiday_fixed && (
                        <div className="flex flex-col justify-start items-start gap-2">
                          <div className="gap-2 flex flex-col justify-start items-start w-full">
                            <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                              Holiday Fixed Rate
                            </div>
                            <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                              <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                                <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                                  {formatCurrency(item.holiday_fixed)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
                            Fixed amount per overtime hour
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Calculation Method */}
                <div className="gap-2 flex flex-col justify-start items-start">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Payment Calculation Method
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {getCalculationMethodDescription(item.calculation_method)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hourly Rate Source - Simplified */}
                <div className="gap-2 flex flex-col justify-start items-start">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Hourly Rate Source
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {item.derive_hourly_from_salary 
                          ? "Derived from monthly salary" 
                          : item.flat_hourly_rate 
                            ? `Flat rate: ${formatCurrency(item.flat_hourly_rate)} per hour`
                            : "Flat hourly rate"
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standard Monthly Hours */}
                <div className="gap-2 flex flex-col justify-start items-start">
                  <div className="font-inter text-sm text-neutral-900 leading-snug tracking-normal font-medium">
                    Standard Monthly Hours
                  </div>
                  <div className="flex justify-center items-center rounded-lg border border-gray-200 w-full h-11 bg-gray-100">
                    <div className="flex flex-row justify-between items-center w-full px-4 h-4">
                      <div className="font-inter text-xs text-neutral-900 leading-snug tracking-normal font-medium">
                        {item.standard_month_hours} hours
                      </div>
                    </div>
                  </div>
                </div>

                {/* Divider between settings */}
                <div className="border-t border-gray-200 pt-6"></div>
              </div>
            ))
          ) : (
            <NoDataFound message="No overtime settings found. Click 'Add Overtime Setting' to create one." />
          )}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? 'Edit Overtime Setting' : 'Create New Overtime Setting'}
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {/* Calculation Method */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Calculation Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.calculation_method}
                  onChange={(e) => setFormData({...formData, calculation_method: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="hourly_rate">Hourly Rate (Multiplier)</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
                <span className="text-xs text-gray-500">
                  Hourly Rate or Fixed Amount.
                </span>
              </div>

              {/* Hourly Rate Source */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Hourly Rate Source
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="from_salary"
                      name="hourly_source"
                      checked={formData.derive_hourly_from_salary}
                      onChange={() => setFormData({...formData, derive_hourly_from_salary: true})}
                      className="w-4 h-4 text-teal-600"
                    />
                    <label htmlFor="from_salary" className="text-sm text-gray-700">
                      Derive from monthly salary
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="flat_rate"
                      name="hourly_source"
                      checked={!formData.derive_hourly_from_salary}
                      onChange={() => setFormData({...formData, derive_hourly_from_salary: false})}
                      className="w-4 h-4 text-teal-600"
                    />
                    <label htmlFor="flat_rate" className="text-sm text-gray-700">
                      Use flat hourly rate
                    </label>
                  </div>
                </div>
              </div>

              {/* Standard Month Hours */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Standard Monthly Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="744"
                  value={formData.standard_month_hours}
                  onChange={(e) => setFormData({...formData, standard_month_hours: e.target.value})}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., 173"
                />
                <span className="text-xs text-gray-500">
                  Number of standard working hours in a month.
                </span>
              </div>

              {/* Conditional Fields based on method */}
              {formData.calculation_method === "hourly_rate" ? (
                <>
                  {/* Flat Hourly Rate (only if not deriving from salary) */}
                  {!formData.derive_hourly_from_salary && (
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Flat Hourly Rate (KES)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.flat_hourly_rate}
                        onChange={(e) => setFormData({...formData, flat_hourly_rate: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 500.00"
                      />
                      <span className="text-xs text-gray-500">
                        Enter the base hourly rate for overtime calculations
                      </span>
                    </div>
                  )}

                  {/* Multipliers */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Weekday Multiplier
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={formData.weekday_multiplier}
                        onChange={(e) => setFormData({...formData, weekday_multiplier: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 1.5"
                      />
                      <span className="text-xs text-gray-500">e.g., 1.5 for 1.5x rate (150%)</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Weekend Multiplier
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={formData.weekend_multiplier}
                        onChange={(e) => setFormData({...formData, weekend_multiplier: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 2.0"
                      />
                      <span className="text-xs text-gray-500">e.g., 2.0 for 2x rate (200%)</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Holiday Multiplier
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        value={formData.holiday_multiplier}
                        onChange={(e) => setFormData({...formData, holiday_multiplier: e.target.value})}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., 3.0"
                      />
                      <span className="text-xs text-gray-500">e.g., 3.0 for 3x rate (300%)</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Fixed Rate Fields */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Weekday Fixed Rate (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weekday_fixed}
                      onChange={(e) => setFormData({...formData, weekday_fixed: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 300.00"
                    />
                    <span className="text-xs text-gray-500">Fixed amount for weekday overtime</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Weekend Fixed Rate (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.weekend_fixed}
                      onChange={(e) => setFormData({...formData, weekend_fixed: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 500.00"
                    />
                    <span className="text-xs text-gray-500">Fixed amount for weekend overtime</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Holiday Fixed Rate (KES)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.holiday_fixed}
                      onChange={(e) => setFormData({...formData, holiday_fixed: e.target.value})}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., 700.00"
                    />
                    <span className="text-xs text-gray-500">Fixed amount for holiday overtime</span>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingId(null);
                    setFormData({
                      calculation_method: "hourly_rate",
                      derive_hourly_from_salary: true,
                      standard_month_hours: "173",
                      flat_hourly_rate: "",
                      weekday_multiplier: "",
                      weekend_multiplier: "",
                      holiday_multiplier: "",
                      weekday_fixed: "",
                      weekend_fixed: "",
                      holiday_fixed: "",
                    });
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !formData.standard_month_hours}
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
                    editingId ? 'Update Setting' : 'Create Setting'
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
        confirmationMessage={`Are you sure you want to delete this overtime setting?`}
        deleteMessage="Deleting this overtime setting will affect all future overtime calculations."
        title="Delete Overtime Setting"
        actionText="Delete"
      />
    </>
  );
}