import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useGetEmployeesQuery } from "../../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../../store/services/companies/departmentsService";

const LogTaskModal = ({ isOpen, onClose, onSubmit, isHR }) => {
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO",
    priority: "",
    assignee: "",
    department: "",
    start_date: "",
    due_date: "",
    progress_percentage: 0,
    estimated_hours: "",
    is_urgent: false,
    requires_approval: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch employees for HR to assign tasks
  const { data: employeesData } = useGetEmployeesQuery({}, { skip: !isHR });
  const employees = employeesData?.results || [];

  // Fetch departments only if HR/admin
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { skip: !isHR, refetchOnMountOrArgChange: true }
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

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        status: "TO_DO",
        priority: "",
        assignee: "",
        department: "",
        start_date: "",
        due_date: "",
        progress_percentage: 0,
        estimated_hours: "",
        is_urgent: false,
        requires_approval: false,
      });
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAssigneeChange = (e) => {
    setFormData((prev) => ({ ...prev, assignee: e.target.value }));
  };

  const handleDepartmentChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      department: selected ? selected.value : "",
    }));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
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

  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white p-6 overflow-y-auto">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-6"> <h2 className="text-lg text-neutral-900 font-semibold">Create New Task </h2>
      <button
        onClick={onClose}
        className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
      > <svg width="16" height="16" viewBox="0 0 16 16" fill="none"> <path
        d="M12 4L4 12"
        stroke="#4B5563"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      /> <path
            d="M4 4L12 12"
            stroke="#4B5563"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          /> </svg> </button> </div>

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
          required
          className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
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
            required
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
            required
            className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Priority</option>
            {priorityOptions.map(({ key, value }) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
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
          required
          className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Assignee (HR only) */}
      {isHR && employees.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm text-neutral-900 font-medium">
            Assignee
          </label>
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleAssigneeChange}
            className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Unassigned</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.user?.id}>
                {emp.user?.first_name} {emp.user?.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Department Dropdown (HR only) */}
      {isHR && departments.length > 0 && (
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
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-sm text-neutral-900 font-medium">
            Due Date
          </label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg text-white font-normal mt-4 transition-colors ${isSubmitting
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
