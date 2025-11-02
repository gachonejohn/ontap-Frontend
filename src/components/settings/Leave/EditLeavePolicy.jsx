import { zodResolver } from "@hookform/resolvers/zod";
import { createLeavePolicySchema } from "@schemas/companies/leaveSchema";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import SubmitCancelButtons from "@components/common/Buttons/ActionButton";
import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { 
  useUpdateLeavePolicyMutation,
  useSingleEmployeeLeaveEntitlementsMutation,
  useBulkEmployeeLeaveEntitlementsMutation 
} from "@store/services/leaves/leaveService";
import { useGetEmployeesQuery } from "@store/services/employees/employeesService";
import { getApiErrorMessage } from "@utils/errorHandler";

export const EditLeavePolicy = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("policy"); // "policy" or "entitlements"
  const [createBulkEntitlements, setCreateBulkEntitlements] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [entitlementData, setEntitlementData] = useState({
    employee_no: "",
    year: new Date().getFullYear(),
  });

  // Employee infinite scroll state
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
  const [allEmployees, setAllEmployees] = useState([]);
  const [hasMoreEmployees, setHasMoreEmployees] = useState(true);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = useState("");
  const employeeDropdownRef = useRef(null);
  const employeeScrollContainerRef = useRef(null);

  const [updateLeavePolicy, { isLoading: isUpdating }] =
    useUpdateLeavePolicyMutation();

  const [singleEmployeeLeaveEntitlements, { isLoading: isCreatingEntitlement }] =
    useSingleEmployeeLeaveEntitlementsMutation();

  const [bulkEmployeeLeaveEntitlements, { isLoading: isCreatingBulkEntitlements }] =
    useBulkEmployeeLeaveEntitlementsMutation();

  // Debounce employee search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedEmployeeSearch(employeeSearchQuery);
      // Reset pagination when search changes
      setCurrentEmployeePage(1);
      setAllEmployees([]);
      setHasMoreEmployees(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [employeeSearchQuery]);

  // Fetch employees with pagination
  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
    isFetching: isFetchingEmployees,
    error: employeesError
  } = useGetEmployeesQuery(
    { 
      page: currentEmployeePage,
      page_size: 10,
      search: debouncedEmployeeSearch || undefined
    },
    { skip: !isOpen || activeTab !== "entitlements" }
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createLeavePolicySchema),
    defaultValues: {
      name: data?.name ?? "",
      description: data?.description ?? "",
      default_days: data?.default_days?.toString() ?? "",
      can_carry_forward: data?.can_carry_forward ?? false,
      carry_forward_limit: data?.carry_forward_limit?.toString() ?? "0",
      requires_document_after: data?.requires_document_after?.toString() ?? "0",
      is_active: data?.is_active ?? true,
    },
  });

  const canCarryForward = watch("can_carry_forward");
  const defaultDays = watch("default_days");

  // Reset modal state when modal opens/closes
  useEffect(() => {
    if (isOpen && activeTab === "entitlements") {
      setCurrentEmployeePage(1);
      setAllEmployees([]);
      setHasMoreEmployees(true);
      setEmployeeSearchQuery("");
      setDebouncedEmployeeSearch("");
    }
  }, [isOpen, activeTab]);

  // Handle employee pagination - accumulate employees
  useEffect(() => {
    if (employeesData?.results?.length) {
      console.log('📦 Employees data received:', {
        page: currentEmployeePage,
        resultsCount: employeesData.results.length,
        totalCount: employeesData.count,
        hasNext: !!employeesData.next,
        nextUrl: employeesData.next
      });

      if (currentEmployeePage === 1) {
        // First page - replace all employees
        console.log('✅ First page - replacing employees');
        setAllEmployees(employeesData.results);
      } else {
        // Subsequent pages - append employees
        console.log('➕ Subsequent page - appending employees');
        setAllEmployees(prev => {
          const existingIds = new Set(prev.map(e => e.employee_no));
          const newEmployees = employeesData.results.filter(
            e => !existingIds.has(e.employee_no)
          );
          console.log(`   Added ${newEmployees.length} new employees`);
          return [...prev, ...newEmployees];
        });
      }
      
      // Check if there are more pages
      const hasMore = employeesData.next !== null;
      console.log('🔍 Has more pages:', hasMore);
      setHasMoreEmployees(hasMore);
    }
  }, [employeesData, currentEmployeePage]);

  // Manual scroll handler for infinite scroll on employee dropdown
  useEffect(() => {
    const scrollContainer = employeeScrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;
      
      console.log('📊 Employee Scroll:', {
        scrollTop,
        clientHeight,
        scrollHeight,
        scrollPercentage: scrollPercentage.toFixed(2) + '%',
        hasMore: hasMoreEmployees,
        isFetching: isFetchingEmployees,
        currentPage: currentEmployeePage,
        totalEmployees: allEmployees.length
      });

      // Load more when scrolled 80% down
      if (scrollPercentage >= 80 && hasMoreEmployees && !isFetchingEmployees) {
        console.log('🔄 Loading next page of employees:', currentEmployeePage + 1);
        setCurrentEmployeePage(prev => prev + 1);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [hasMoreEmployees, isFetchingEmployees, currentEmployeePage, allEmployees.length]);

  // Extract employees for dropdown
  const employeeOptions = allEmployees.map(employee => ({
    value: employee.employee_no,
    label: `${employee.employee_no} (${employee.user?.first_name || ''} ${employee.user?.last_name || ''})`.trim(),
    firstName: employee.user?.first_name || '',
    lastName: employee.user?.last_name || ''
  }));

  // Client-side filtering for search
  const filteredEmployeeOptions = employeeOptions.filter(emp => {
    if (!employeeSearchQuery) return true;
    const searchLower = employeeSearchQuery.toLowerCase();
    return (
      emp.label.toLowerCase().includes(searchLower) ||
      emp.value.toLowerCase().includes(searchLower)
    );
  });

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description || "",
        default_days: parseInt(formData.default_days, 10),
        can_carry_forward: Boolean(formData.can_carry_forward),
        carry_forward_limit: formData.can_carry_forward
          ? parseInt(formData.carry_forward_limit, 10)
          : 0,
        requires_document_after: parseInt(formData.requires_document_after, 10) || 0,
        is_active: Boolean(formData.is_active),
      };

      await updateLeavePolicy({ id: data.id, ...payload }).unwrap();
      toast.success("Leave policy updated successfully!");
      handleCloseModal();
      refetchData?.();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error updating leave policy.");
      toast.error(message);
    }
  };

  const handleCreateSingleEntitlement = async (e) => {
    e.preventDefault();

    if (!entitlementData.employee_no.trim()) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const payload = {
        employee_no: entitlementData.employee_no,
        leave_type: data.id, // Use the current policy ID
        year: entitlementData.year,
        allocated_days: parseInt(defaultDays),
        used_days: "0.00" // Must be string with 2 decimal places
      };

      console.log('Single entitlement payload:', payload);

      await singleEmployeeLeaveEntitlements(payload).unwrap();
      toast.success(`Entitlement created for employee ${entitlementData.employee_no} in ${entitlementData.year}!`);
      
      // Reset form
      setEntitlementData({
        employee_no: "",
        year: new Date().getFullYear(),
      });
      
      refetchData?.();
    } catch (error) {
      console.error('Single entitlement error:', error);
      const message = getApiErrorMessage(error, "Error creating entitlement for employee.");
      toast.error(message);
    }
  };

  const handleCreateBulkEntitlements = async () => {
    if (!defaultDays || defaultDays <= 0) {
      toast.error("Please set default days in the policy first");
      return;
    }

    try {
      const bulkPayload = {
        leave_type: data.id, // Use the current policy ID
        year: selectedYear,
        allocated_days: parseInt(defaultDays),
        used_days: "0.00"
      };

      console.log('Bulk entitlements payload:', bulkPayload);

      await bulkEmployeeLeaveEntitlements(bulkPayload).unwrap();
      toast.success(`Bulk entitlements created for all active employees in ${selectedYear}!`);
      setCreateBulkEntitlements(false);
      refetchData?.();
    } catch (error) {
      console.error('Bulk entitlement error:', error);
      const message = getApiErrorMessage(error, "Error creating bulk entitlements.");
      toast.error(message);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setActiveTab("policy");
    setCreateBulkEntitlements(false);
    setEntitlementData({
      employee_no: "",
      year: new Date().getFullYear(),
    });
    setCurrentEmployeePage(1);
    setAllEmployees([]);
    setHasMoreEmployees(true);
    setEmployeeSearchQuery("");
    setDebouncedEmployeeSearch("");
    setIsOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        label="Edit"
        icon={<FiEdit className="w-4 h-4 text-amber-500" />}
        className="
          px-4 py-2 w-full 
          border-none 
          focus:outline-none 
          focus:border-transparent 
          focus:ring-0 
          active:outline-none 
          active:ring-0
          hover:bg-gray-100
        "
      />

      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Modal */}
          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-c-600 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Edit Leave Policy
                </p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              {/* Tabs */}
              <div className="flex border-b">
                <button
                  type="button"
                  onClick={() => setActiveTab("policy")}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === "policy"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                >
                  Policy Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("entitlements")}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === "entitlements"
                      ? "border-b-2 border-primary text-primary"
                      : "text-gray-500"
                  }`}
                >
                  Manage Entitlements
                </button>
              </div>

              {activeTab === "policy" ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                  {/* Policy Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Policy Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="E.g Annual Leave"
                      {...register("name")}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe this policy..."
                      {...register("description")}
                      rows={3}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm resize-none"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Default Days */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Days<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 21"
                      min="0"
                      {...register("default_days")}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                    />
                    {errors.default_days && (
                      <p className="text-red-500 text-sm">{errors.default_days.message}</p>
                    )}
                  </div>

                  {/* Allow Carry Forward */}
                  <div className="flex items-center gap-3 py-2 px-4 border border-gray-400 rounded-md bg-white cursor-pointer hover:border-[#1E9FF2]">
                    <input
                      type="checkbox"
                      id="can_carry_forward"
                      {...register("can_carry_forward")}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label
                      htmlFor="can_carry_forward"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Allow carry forward to next year
                    </label>
                  </div>

                  {/* Carry Forward Limit */}
                  {canCarryForward && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Carry Forward Limit (days)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        min="0"
                        {...register("carry_forward_limit")}
                        className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                      />
                      {errors.carry_forward_limit && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.carry_forward_limit.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Require Document After */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Require Document After (days)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2 (0 = not required)"
                      min="0"
                      {...register("requires_document_after")}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                    />
                    {errors.requires_document_after && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.requires_document_after.message}
                      </p>
                    )}
                  </div>

                  {/* Is Active */}
                  <div className="flex items-center gap-3 py-2 px-4 border border-gray-400 rounded-md bg-white">
                    <input
                      type="checkbox"
                      id="is_active"
                      {...register("is_active")}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Active (available for use)
                    </label>
                  </div>

                  {/* Buttons */}
                  <SubmitCancelButtons
                    onCancel={handleCloseModal}
                    isSubmitting={isSubmitting}
                    isProcessing={isUpdating}
                  />
                </form>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Bulk Entitlements */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3">Bulk Entitlements</h3>
                    
                    {!createBulkEntitlements ? (
                      <div className="text-center py-4">
                        <button
                          type="button"
                          onClick={() => setCreateBulkEntitlements(true)}
                          className="py-2 px-4 rounded-md border border-[#1E9FF2] text-[#1E9FF2] font-medium hover:bg-blue-50 transition-colors"
                        >
                          Create Bulk Entitlements
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          Create entitlements for all active employees
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Entitlement Year<span className="text-red-500">*</span>
                          </label>
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#1E9FF2] focus:bg-white"
                          >
                            {yearOptions.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                          <p className="text-sm font-medium text-blue-800">Summary:</p>
                          <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                            <li><strong>Leave Type:</strong> {data?.name}</li>
                            <li><strong>Allocated Days:</strong> {defaultDays || 0} days</li>
                            <li><strong>Year:</strong> {selectedYear}</li>
                            <li><strong>Used Days:</strong> 0.00 days (initial)</li>
                            <li><strong>Scope:</strong> All active employees</li>
                          </ul>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCreateBulkEntitlements}
                            disabled={isCreatingBulkEntitlements}
                            className="flex-1 py-2 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                          >
                            {isCreatingBulkEntitlements ? "Creating..." : "Create Bulk Entitlements"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setCreateBulkEntitlements(false)}
                            className="flex-1 py-2 px-4 rounded-md border border-gray-400 font-medium hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Single Employee Entitlement */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold mb-3">Single Employee Entitlement</h3>
                    <form onSubmit={handleCreateSingleEntitlement} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Employee<span className="text-red-500">*</span>
                        </label>
                        {isLoadingEmployees && currentEmployeePage === 1 ? (
                          <div className="w-full py-2 px-3 rounded-md border border-gray-300 bg-gray-100">
                            <p className="text-sm text-gray-500">Loading employees...</p>
                          </div>
                        ) : employeesError ? (
                          <div className="w-full py-2 px-3 rounded-md border border-red-300 bg-red-50">
                            <p className="text-sm text-red-500">Error loading employees</p>
                          </div>
                        ) : (
                          <div className="relative">
                            {/* Search Input */}
                            <div className="w-full py-2 px-3 rounded-md border border-gray-300 focus-within:border-[#1E9FF2] bg-white mb-2">
                              <input
                                type="text"
                                value={employeeSearchQuery}
                                onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                                placeholder="Search employees..."
                                className="w-full outline-none text-sm"
                              />
                            </div>

                            {/* Scrollable Dropdown */}
                            <div 
                              ref={employeeScrollContainerRef}
                              className="w-full max-h-48 overflow-y-auto border border-gray-300 rounded-md bg-white"
                            >
                              {filteredEmployeeOptions.length > 0 ? (
                                <>
                                  {filteredEmployeeOptions.map((employee) => (
                                    <button
                                      key={employee.value}
                                      type="button"
                                      onClick={() =>
                                        setEntitlementData({
                                          ...entitlementData,
                                          employee_no: employee.value,
                                        })
                                      }
                                      className={`w-full text-left px-3 py-2 hover:bg-gray-50 text-sm ${
                                        entitlementData.employee_no === employee.value
                                          ? "bg-blue-50 text-blue-700 font-medium"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {employee.label}
                                    </button>
                                  ))}
                                  
                                  {/* Loading Indicator */}
                                  {isFetchingEmployees && hasMoreEmployees && (
                                    <div className="px-3 py-3 text-center border-t">
                                      <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        <span className="text-xs text-gray-500">Loading more employees...</span>
                                      </div>
                                    </div>
                                  )}

                                  {/* End of List Indicator */}
                                  {!hasMoreEmployees && allEmployees.length > 0 && (
                                    <div className="px-3 py-2 text-xs text-gray-500 text-center border-t bg-gray-50">
                                      {allEmployees.length} employees.
                                    </div>
                                  )}
                                  
                                  {/* Scroll Target - Keep for debugging */}
                                  <div
                                    ref={employeeDropdownRef}
                                    className="h-1"
                                    aria-hidden="true"
                                  />
                                </>
                              ) : (
                                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                  {isFetchingEmployees ? "Loading employees..." : "No employees found"}
                                </div>
                              )}
                            </div>

                            {/* Selected Employee Display */}
                            {entitlementData.employee_no && (
                              <div className="mt-2 px-3 py-2 bg-blue-50 rounded-md border border-blue-200">
                                <p className="text-xs text-blue-700">
                                  <span className="font-medium">Selected:</span>{" "}
                                  {employeeOptions.find(e => e.value === entitlementData.employee_no)?.label || entitlementData.employee_no}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Year<span className="text-red-500">*</span>
                        </label>
                        <select
                          value={entitlementData.year}
                          onChange={(e) =>
                            setEntitlementData({
                              ...entitlementData,
                              year: parseInt(e.target.value),
                            })
                          }
                          className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-[#1E9FF2] focus:bg-white"
                        >
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Policy:</span> {data?.name}
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Allocated Days:</span> {defaultDays || 0} days (from policy)
                        </p>
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Used Days:</span> 0.00 (initial)
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isCreatingEntitlement || !entitlementData.employee_no}
                        className="w-full py-2 px-4 rounded-md bg-primary text-white font-medium hover:bg-primary-600 disabled:opacity-50 transition-colors"
                      >
                        {isCreatingEntitlement ? "Creating..." : "Create Single Entitlement"}
                      </button>
                    </form>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setActiveTab("policy")}
                      className="flex-1 py-2 px-4 rounded-md border border-gray-400 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back to Policy
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 py-2 px-4 rounded-md bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};