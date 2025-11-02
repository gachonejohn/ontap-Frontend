import React, { useState } from "react";
import { toast } from "react-toastify";
import { LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import {
  useGetLeavePoliciesQuery,
  useCreateSingleEmployeeEntitlementMutation,
  useCreateBulkEmployeeEntitlementMutation,
} from "@store/services/leaves/leaveService";
import { getApiErrorMessage } from "@utils/errorHandler";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";

const ManageEntitlements = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [singleFormData, setSingleFormData] = useState({
    employee_no: "",
    leave_type: "",
    year: new Date().getFullYear(),
  });

  const [bulkFormData, setBulkFormData] = useState({
    leave_type: "",
    year: new Date().getFullYear(),
    used_days: "0.00",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch leave policies
  const { data: policiesData, isLoading: loadingPolicies } =
    useGetLeavePoliciesQuery(
      { page_size: 100 },
      { refetchOnMountOrArgChange: true }
    );

  const [createSingleEntitlement] =
    useCreateSingleEmployeeEntitlementMutation();
  const [createBulkEntitlement] =
    useCreateBulkEmployeeEntitlementMutation();

  const handleSingleInputChange = (e) => {
    const { name, value } = e.target;
    setSingleFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBulkInputChange = (e) => {
    const { name, value } = e.target;
    setBulkFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateSingleForm = () => {
    const newErrors = {};

    if (!singleFormData.employee_no.trim()) {
      newErrors.employee_no = "Employee number is required";
    }

    if (!singleFormData.leave_type) {
      newErrors.leave_type = "Leave type is required";
    }

    if (!singleFormData.year) {
      newErrors.year = "Year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBulkForm = () => {
    const newErrors = {};

    if (!bulkFormData.leave_type) {
      newErrors.leave_type = "Leave type is required";
    }

    if (!bulkFormData.year) {
      newErrors.year = "Year is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSingleSubmit = async (e) => {
    e.preventDefault();

    if (!validateSingleForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        employee_no: singleFormData.employee_no,
        leave_type: parseInt(singleFormData.leave_type),
        year: parseInt(singleFormData.year),
      };

      await createSingleEntitlement(payload).unwrap();

      toast.success("Leave entitlement created successfully!");

      // Reset form
      setSingleFormData({
        employee_no: "",
        leave_type: "",
        year: new Date().getFullYear(),
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error creating leave entitlement."
      );
      toast.error(message);
      console.error("Error creating entitlement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();

    if (!validateBulkForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Show confirmation
    const confirmed = window.confirm(
      "This will create leave entitlements for ALL active employees in your organization. Continue?"
    );

    if (!confirmed) return;

    setIsSubmitting(true);

    try {
      const payload = {
        leave_type: parseInt(bulkFormData.leave_type),
        year: parseInt(bulkFormData.year),
        used_days: bulkFormData.used_days || "0.00",
      };

      await createBulkEntitlement(payload).unwrap();

      toast.success("Bulk leave entitlements created successfully!");

      // Reset form
      setBulkFormData({
        leave_type: "",
        year: new Date().getFullYear(),
        used_days: "0.00",
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error creating bulk leave entitlements."
      );
      toast.error(message);
      console.error("Error creating bulk entitlements:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Manage Leave Entitlements
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "single"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Single Employee
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex-1 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "bulk"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Bulk (All Employees)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loadingPolicies ? (
            <div className="flex justify-center py-8">
              <ContentSpinner />
            </div>
          ) : (
            <>
              {activeTab === "single" ? (
                <form onSubmit={handleSingleSubmit} className="space-y-4">
                  {/* Employee Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employee_no"
                      value={singleFormData.employee_no}
                      onChange={handleSingleInputChange}
                      placeholder="e.g., GTECH-8026-EMP-0001"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.employee_no ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.employee_no && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.employee_no}
                      </p>
                    )}
                  </div>

                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="leave_type"
                      value={singleFormData.leave_type}
                      onChange={handleSingleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.leave_type ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a leave type</option>
                      {policiesData?.results?.map((policy) => (
                        <option key={policy.id} value={policy.id}>
                          {policy.name} ({policy.default_days} days)
                        </option>
                      ))}
                    </select>
                    {errors.leave_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={singleFormData.year}
                      onChange={handleSingleInputChange}
                      min="2020"
                      max="2100"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <LuPlus className="w-4 h-4" />
                      {isSubmitting ? "Creating..." : "Create Entitlement"}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleBulkSubmit} className="space-y-4">
                  {/* Leave Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="leave_type"
                      value={bulkFormData.leave_type}
                      onChange={handleBulkInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.leave_type ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a leave type</option>
                      {policiesData?.results?.map((policy) => (
                        <option key={policy.id} value={policy.id}>
                          {policy.name} ({policy.default_days} days)
                        </option>
                      ))}
                    </select>
                    {errors.leave_type && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.leave_type}
                      </p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={bulkFormData.year}
                      onChange={handleBulkInputChange}
                      min="2020"
                      max="2100"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.year ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                    )}
                  </div>

                  {/* Used Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Used Days
                    </label>
                    <input
                      type="number"
                      name="used_days"
                      value={bulkFormData.used_days}
                      onChange={handleBulkInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Defaults to 0.00 if not specified
                    </p>
                  </div>

                  {/* Warning */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Warning:</strong> This will create entitlements
                      for ALL active employees in your organization for{" "}
                      {bulkFormData.leave_type ? "the selected leave type" : "the selected leave type"} in{" "}
                      {bulkFormData.year}. This action cannot be undone.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <LuPlus className="w-4 h-4" />
                      {isSubmitting ? "Creating..." : "Create for All"}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEntitlements;
