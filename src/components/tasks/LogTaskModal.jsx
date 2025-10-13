import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useGetEmployeesQuery } from "../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../store/services/companies/departmentsService";

const LogTaskModal = ({ isOpen, onClose, onSubmit }) => {
  // Get task permissions from backend
  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(p => p.feature_code === "task" || p.feature_code === "task_management");
  });

  // Check if user can view all tasks (determines if they can assign to others)
  const canViewAll = taskPermissions?.can_view_all || false;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO",
    priority: "",
    assignee: "", // Single assignee (for backward compatibility)
    assignees: [], // New field for multiple assignees
    department: "",
    start_date: "",
    due_date: "",
    progress_percentage: 0,
    estimated_hours: "",
    is_urgent: false,
    requires_approval: false,
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Fetch employees only if user can view all tasks (Admin/Manager)
  const { data: employeesData } = useGetEmployeesQuery({}, { skip: !canViewAll });
  const employees = employeesData?.results || [];

  // Fetch departments only if user can view all tasks
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { skip: !canViewAll, refetchOnMountOrArgChange: true }
  );
  const departments = departmentsData || [];

  const statusMap = {
    TO_DO: "To Do",
    IN_PROGRESS: "In Progress",
    UNDER_REVIEW: "Under Review",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    ON_HOLD: "On Hold",
  };

  const priorityMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({
    key,
    value,
  }));
  const priorityOptions = Object.entries(priorityMap).map(([key, value]) => ({
    key,
    value,
  }));

  // Prepare employee options for react-select
  const employeeOptions = employees.map((emp) => ({
    value: emp.user?.id,
    label: `${emp.user?.first_name} ${emp.user?.last_name}`,
  }));

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        status: "TO_DO",
        priority: "",
        assignee: "",
        assignees: [],
        department: "",
        start_date: "",
        due_date: "",
        progress_percentage: 0,
        estimated_hours: "",
        is_urgent: false,
        requires_approval: false,
        files: [],
      });
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Task title is required";
    }

    if (!formData.priority) {
      errors.priority = "Priority is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.due_date) {
      errors.due_date = "Due date is required";
    }

    // Validate that due date is not before start date
    if (formData.start_date && formData.due_date) {
      const startDate = new Date(formData.start_date);
      const dueDate = new Date(formData.due_date);
      
      if (dueDate < startDate) {
        errors.due_date = "Due date cannot be before start date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleAssigneeChange = (e) => {
    setFormData((prev) => ({ ...prev, assignee: e.target.value }));
  };

  const handleMultipleAssigneesChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData((prev) => ({ 
      ...prev, 
      assignees: selectedValues,
      // Maintain backward compatibility - set the first assignee as the primary one
      assignee: selectedValues.length > 0 ? selectedValues[0] : ""
    }));
  };

  const handleDepartmentChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      department: selected ? selected.value : "",
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...selectedFiles],
    }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12 4L4 12"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4L12 12"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4 w-full">
          {/* Task Title */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                formErrors.title ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {formErrors.title && (
              <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
            )}
          </div>

          {/* Status & Priority */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {statusOptions.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Priority *
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  formErrors.priority ? "border-red-500" : "border-neutral-200"
                }`}
              >
                <option value="">Select Priority</option>
                {priorityOptions.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              {formErrors.priority && (
                <p className="text-red-500 text-xs mt-1">{formErrors.priority}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
              className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                formErrors.description ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* File Upload - Styled like first version */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">Attachments</label>
            <label className="flex flex-col justify-center items-center gap-2.5 py-4 rounded-md border-2 border-dashed border-zinc-300 w-full bg-zinc-300/0 cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
              />
              <div className="flex flex-col items-center gap-2">
                <img width="29" height="34" src="/images/upload.png" alt="Upload icon" />
                <div className="text-xs text-gray-500/70">
                  {formData.files.length > 0 ? (
                    `${formData.files.length} file(s) selected`
                  ) : (
                    <>Upload or <span className="text-blue-600">browse</span></>
                  )}
                </div>
              </div>
            </label>
            
            {/* Allowed file types information */}
            <div className="text-xs text-gray-500 text-center mt-1">
              Allowed: pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .png, .txt
            </div>
            
            {/* Selected Files List */}
            {formData.files.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-gray-600 mb-2">Selected files:</div>
                <div className="space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-700 truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assignee (only for users with can_view_all permission) - Updated for multiple selection */}
          {canViewAll && employees.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Assignees
              </label>
              <Select
                isMulti
                options={employeeOptions}
                value={employeeOptions.filter(option => 
                  formData.assignees.includes(option.value)
                )}
                onChange={handleMultipleAssigneesChange}
                placeholder="Select assignees..."
                menuPortalTarget={document.body}
                menuPlacement="auto"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base, state) => ({
                    ...base,
                    minHeight: "48px",
                    borderColor: "#d1d5db",
                    borderRadius: "8px",
                    "&:hover": { borderColor: "#9ca3af" },
                    "&:focus-within": {
                      borderColor: "#14b8a6",
                      boxShadow: "0 0 0 2px rgba(20,184,166,0.2)",
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#e0f2fe",
                    borderRadius: "6px",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#0369a1",
                    fontWeight: "500",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "#0369a1",
                    ":hover": {
                      backgroundColor: "#bae6fd",
                      color: "#0c4a6e",
                    },
                  }),
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.assignees.length > 0 
                  ? `${formData.assignees.length} assignee(s) selected`
                  : "Select one or more assignees"
                }
              </div>
            </div>
          )}

          {/* Department Dropdown (only for users with can_view_all permission) */}
          {canViewAll && departments.length > 0 && (
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Department
              </label>
              <Select
                options={departments.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                value={
                  departments
                    .map((d) => ({ value: d.id, label: d.name }))
                    .find((opt) => opt.value === formData.department) || null
                }
                onChange={handleDepartmentChange}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: "48px",
                    borderColor: "#d1d5db",
                    borderRadius: "8px",
                    "&:hover": { borderColor: "#9ca3af" },
                    "&:focus-within": {
                      borderColor: "#14b8a6",
                      boxShadow: "0 0 0 2px rgba(20,184,166,0.2)",
                    },
                  }),
                }}
              />
            </div>
          )}

          {/* Dates */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Start Date *
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  formErrors.start_date ? "border-red-500" : "border-neutral-200"
                }`}
              />
              {formErrors.start_date && (
                <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Due Date *
              </label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  formErrors.due_date ? "border-red-500" : "border-neutral-200"
                }`}
              />
              {formErrors.due_date && (
                <p className="text-red-500 text-xs mt-1">{formErrors.due_date}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-normal mt-4 transition-colors ${
              isSubmitting
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {isSubmitting ? (
              <div className="flex justify-center items-center gap-2">
                <span>Creating Task</span>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              </div>
            ) : (
              "Create Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogTaskModal;