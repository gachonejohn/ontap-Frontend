import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { useGetEmployeesQuery } from "../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../store/services/companies/departmentsService";
import { useGetTasksQuery } from "../../store/services/tasks/tasksService";

const LogTaskModal = ({ isOpen, onClose, onSubmit, preselectedParentTask = null }) => {
  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(
      (p) =>
        p.feature_code === "task" || p.feature_code === "task_management"
    );
  });

  const canViewAll = taskPermissions?.can_view_all || false;
  const currentUser = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TO_DO",
    priority: "",
    team: null,
    assignee: "",
    teamMembers: [],
    assignees: [],
    department: "",
    start_date: "",
    due_date: "",
    progress_percentage: 0,
    estimated_hours: "",
    is_urgent: false,
    requires_approval: false,
    files: [],
    parent_task: preselectedParentTask || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showTeamDropdown, setShowTeamDropdown] = useState(false);
  const [parentTaskSearchQuery, setParentTaskSearchQuery] = useState("");
  const [showParentTaskDropdown, setShowParentTaskDropdown] = useState(false);

  const { data: employeesData } = useGetEmployeesQuery({}, { skip: !canViewAll });
  const employees = employeesData?.results || [];

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { skip: !canViewAll, refetchOnMountOrArgChange: true }
  );
  const departments = departmentsData || [];

  const { data: tasksData } = useGetTasksQuery(
    { 
      search: parentTaskSearchQuery,
      page_size: 50 
    },
    { 
      skip: !isOpen 
    }
  );
  const availableTasks = tasksData?.results || [];

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

  const employeeOptions = employees.map((emp) => ({
    value: emp.user?.id,
    label: `${emp.user?.first_name} ${emp.user?.last_name}`,
  }));

  const parentTaskOptions = availableTasks.map((task) => ({
    value: task.id,
    label: `${task.title} (${statusMap[task.status] || task.status})`,
    task: task,
  }));

  // Get selected parent task display name
  const getSelectedParentTaskName = () => {
    if (!formData.parent_task) return "Select a parent task...";
    const selectedTask = parentTaskOptions.find(opt => opt.value === formData.parent_task);
    return selectedTask ? selectedTask.label : "Select a parent task...";
  };

  const getCurrentUserName = () => {
    const userId = currentUser?.user?.id || currentUser?.id;
    
    const employeeOption = employeeOptions.find(opt => opt.value === userId);
    if (employeeOption) {
      return employeeOption.label;
    }
    
    if (currentUser?.user?.first_name && currentUser?.user?.last_name) {
      return `${currentUser.user.first_name} ${currentUser.user.last_name}`;
    }
    
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    
    if (currentUser?.full_name) {
      return currentUser.full_name;
    }
    
    return "Me";
  };

  const getAssigneeDisplayName = () => {
    if (!formData.assignee) return "";
    
    const employeeOption = employeeOptions.find(opt => opt.value === formData.assignee);
    if (employeeOption) {
      return employeeOption.label;
    }
    
    const userId = currentUser?.user?.id || currentUser?.id;
    if (formData.assignee === userId) {
      return getCurrentUserName();
    }
    
    return "";
  };

  const teams = [
    { id: 1, name: "Sales Team" },
    { id: 2, name: "Marketing Team" },
    { id: 3, name: "Development Team" },
  ];

  useEffect(() => {
    if (isOpen) {
      const userId = currentUser?.user?.id || currentUser?.id;
      const initialAssignees = canViewAll ? [] : [userId];
      
      setFormData({
        title: "",
        description: "",
        status: "TO_DO",
        priority: "",
        team: null,
        assignee: canViewAll ? "" : userId,
        teamMembers: [],
        assignees: initialAssignees,
        department: "",
        start_date: "",
        due_date: "",
        progress_percentage: 0,
        estimated_hours: "",
        is_urgent: false,
        requires_approval: false,
        files: [],
        parent_task: preselectedParentTask || null,
      });
      setFormErrors({});
      setIsSubmitting(false);
      setSearchQuery("");
      setShowTeamDropdown(false);
      setParentTaskSearchQuery("");
      setShowParentTaskDropdown(false);
    }
  }, [isOpen, canViewAll, currentUser, preselectedParentTask]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title || formData.title.trim().length === 0) {
      errors.title = "Task title is required";
    }

    if (!formData.priority) {
      errors.priority = "Priority is required";
    }

    if (!formData.description || formData.description.trim().length === 0) {
      errors.description = "Description is required";
    }

    if (!formData.start_date) {
      errors.start_date = "Start date is required";
    }

    if (!formData.due_date) {
      errors.due_date = "Due date is required";
    }

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

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTeamSelect = (team) => {
    setFormData((prev) => ({
      ...prev,
      team: team,
      teamMembers: [],
    }));
    setShowTeamDropdown(false);
  };

  const handleTeamMemberToggle = (employeeId) => {
    setFormData((prev) => {
      const isSelected = prev.teamMembers.includes(employeeId);
      return {
        ...prev,
        teamMembers: isSelected
          ? prev.teamMembers.filter(id => id !== employeeId)
          : [...prev.teamMembers, employeeId],
      };
    });
  };

  const handleSelectAllTeamMembers = () => {
    const allEmployeeIds = employees.map(emp => emp.user?.id);
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.length === allEmployeeIds.length ? [] : allEmployeeIds,
    }));
  };

  const handleAssignToMe = () => {
    const userId = currentUser?.user?.id || currentUser?.id;
    setFormData((prev) => ({
      ...prev,
      assignee: userId,
    }));
  };

  const handleAssigneeChange = (selected) => {
    setFormData((prev) => ({
      ...prev,
      assignee: selected?.value || "",
    }));
  };

  const handleDepartmentChange = (selected) => {
    setFormData((prev) => ({ ...prev, department: selected?.value || "" }));
  };

  const handleParentTaskSelect = (task) => {
    setFormData((prev) => ({ 
      ...prev, 
      parent_task: task ? task.value : null 
    }));
    setShowParentTaskDropdown(false);
    setParentTaskSearchQuery("");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...selectedFiles] }));
  };

  const removeFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.user?.first_name} ${emp.user?.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const filteredParentTasks = parentTaskOptions.filter(task => {
    const searchLower = parentTaskSearchQuery.toLowerCase();
    return task.label.toLowerCase().includes(searchLower);
  });

  const getProfilePicture = (employee) => {
    const API_BASE_URL = process.env.REACT_APP_SERVER_URI;
    const defaultProfile = "/images/avatar/default-avatar.jpg";
    let profilePic = employee.user?.profile_picture;

    if (profilePic && !profilePic.startsWith("http")) {
      profilePic = `${API_BASE_URL}${profilePic}`;
    }
    if (!profilePic) {
      profilePic = defaultProfile;
    }
    return profilePic;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data before validation:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    if (!onSubmit) {
      console.log('No onSubmit function provided');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = currentUser?.user?.id || currentUser?.id;
      
      let finalAssignees = [];
      
      if (formData.teamMembers.length > 0) {
        finalAssignees = [...formData.teamMembers];
      }
      
      if (formData.assignee && !finalAssignees.includes(formData.assignee)) {
        finalAssignees.push(formData.assignee);
      }
      
      if (finalAssignees.length === 0 && !canViewAll) {
        finalAssignees = [userId];
      }
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignees: finalAssignees,
        team: formData.team?.id || null,
        department: formData.department || null,
        start_date: formData.start_date,
        due_date: formData.due_date,
        progress_percentage: formData.progress_percentage,
        estimated_hours: formData.estimated_hours ? parseInt(formData.estimated_hours, 10) : null,
        is_urgent: formData.is_urgent,
        requires_approval: formData.requires_approval,
        files: formData.files,
        parent_task: formData.parent_task,
      };

      console.log('Payload to be submitted:', payload);
      await onSubmit(payload);
      console.log('Task created successfully');
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-6 bg-white">
          <h2 className="text-lg text-neutral-900 font-semibold">
            {formData.parent_task ? "Create Subtask" : "Create New Task"}
          </h2>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleCreateTask} className="flex flex-col gap-4 w-full">
            {/* Parent Task Selection - Custom Dropdown */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Parent Task (Optional)</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowParentTaskDropdown(!showParentTaskDropdown)}
                  className="w-full p-3 rounded-lg border border-neutral-200 bg-white text-left flex justify-between items-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <span className="text-sm text-neutral-900">
                    {getSelectedParentTaskName()}
                  </span>
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                {showParentTaskDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {/* Search Input */}
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 px-2">
                        <svg width="16.5" height="16.5" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 21l-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                          type="text"
                          value={parentTaskSearchQuery}
                          onChange={(e) => setParentTaskSearchQuery(e.target.value)}
                          placeholder="Search for tasks..."
                          className="flex-1 text-xs text-neutral-900/70 outline-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* Clear Selection Option */}
                    <button
                      type="button"
                      onClick={() => handleParentTaskSelect(null)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-900 border-b border-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                          {!formData.parent_task && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M8 2.5L2.5 8M2.5 2.5L8 8" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          )}
                        </div>
                        <span className={!formData.parent_task ? "text-teal-600 font-medium" : ""}>
                          No parent task
                        </span>
                      </div>
                    </button>

                    {/* Task List */}
                    {filteredParentTasks.length > 0 ? (
                      filteredParentTasks.map((task) => (
                        <button
                          key={task.value}
                          type="button"
                          onClick={() => handleParentTaskSelect(task)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-900 flex items-center gap-2"
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                            {formData.parent_task === task.value && (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M8 2.5L2.5 8M2.5 2.5L8 8" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-col text-left">
                            <div className={`text-sm ${formData.parent_task === task.value ? "text-teal-600 font-medium" : "text-gray-900"}`}>
                              {task.task.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              Status: {statusMap[task.task.status] || task.task.status}
                              {task.task.due_date && ` • Due: ${new Date(task.task.due_date).toLocaleDateString()}`}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        {parentTaskSearchQuery ? "No tasks found" : "No tasks available"}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Select a parent task to create this as a subtask.
              </p>
            </div>

            {/* Rest of the form remains exactly the same */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Task Title *</label>
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
              {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
            </div>

            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {statusOptions.map(({ key, value }) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Priority *</label>
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
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
                {formErrors.priority && <p className="text-red-500 text-xs mt-1">{formErrors.priority}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Description *</label>
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
              {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
            </div>

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
                    {formData.files.length > 0 ? `${formData.files.length} file(s) selected` : <>Upload or <span className="text-blue-600">browse</span></>}
                  </div>
                </div>
              </label>
              <div className="text-xs text-gray-500 text-center mt-1">
                Allowed: pdf, .doc, .docx, .xls, .xlsx, .jpg, .jpeg, .png, .txt
              </div>
              {formData.files.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-700 truncate flex-1">{file.name}</span>
                      <button type="button" onClick={() => removeFile(index)} className="ml-2 text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TEAM SELECTION */}
            {canViewAll && employees.length > 0 && (
              <div className="flex flex-col gap-3 w-full">
                {/* Team Field - Static display */}
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-sm text-neutral-900 font-medium">Team</label>
                  <div className="flex justify-start items-center pl-3 rounded-lg border-neutral-200 border w-full p-3 bg-white">
                    <div className="flex flex-row justify-start items-center gap-1">
                      <div className="flex flex-col justify-center items-center h-5">
                        <svg width="17.5" height="16.3" viewBox="0 0 24 24" fill="none">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-xs text-neutral-900/70 font-normal">
                        Choose a team
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignee Field */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-neutral-900 font-medium">Assignee</label>
                    <button
                      type="button"
                      onClick={handleAssignToMe}
                      className="text-sm text-teal-500 font-medium hover:text-teal-600"
                    >
                      Assign to me
                    </button>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2 px-3 py-3 rounded-lg border border-neutral-200 bg-white focus-within:ring-2 focus-within:ring-teal-500">
                      <svg width="16.5" height="16.5" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 21l-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <input
                        type="text"
                        value={formData.assignee ? getAssigneeDisplayName() : searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setFormData(prev => ({ ...prev, assignee: "" }));
                        }}
                        placeholder="Search by Name"
                        className="flex-1 text-xs text-neutral-900 outline-none"
                        readOnly={!!formData.assignee}
                      />
                      {formData.assignee && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, assignee: "" }));
                            setSearchQuery("");
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                    {/* Search Results Dropdown */}
                    {searchQuery && !formData.assignee && filteredEmployees.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredEmployees.map((emp) => (
                          <button
                            key={emp.user?.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, assignee: emp.user?.id }));
                              setSearchQuery("");
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                          >
                            {emp.user?.profile_picture ? (
                              <img
                                src={getProfilePicture(emp)}
                                alt={`${emp.user?.first_name} ${emp.user?.last_name}`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center rounded-full w-8 h-8 bg-indigo-100">
                                <span className="text-xs text-indigo-700 font-normal">
                                  {emp.user?.first_name?.charAt(0)}{emp.user?.last_name?.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <div className="text-sm text-gray-900 font-medium">
                                {emp.user?.first_name} {emp.user?.last_name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {emp.position || 'Employee'}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Select Team Members */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-black font-medium">Select Team Members *</label>
                    <button
                      type="button"
                      onClick={handleSelectAllTeamMembers}
                      className="text-sm text-teal-500 font-medium hover:text-teal-600"
                    >
                      Select All
                    </button>
                  </div>

                  {/* Team Members List */}
                  <div className="flex flex-col rounded-lg border border-gray-200 max-h-[200px] overflow-y-auto">
                    {/* Search Input */}
                    <div className="sticky top-0 bg-white p-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 px-2">
                        <svg width="16.5" height="16.5" viewBox="0 0 24 24" fill="none">
                          <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21 21l-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by Name"
                          className="flex-1 text-xs text-neutral-900/70 outline-none"
                        />
                      </div>
                    </div>

                    {/* Employee List */}
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp, index) => (
                        <div
                          key={emp.user?.id || index}
                          className={`flex items-center justify-between px-3 py-3 hover:bg-gray-50 cursor-pointer ${
                            index !== filteredEmployees.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                          onClick={() => handleTeamMemberToggle(emp.user?.id)}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="rounded border border-black w-4 h-4 shadow-sm bg-gray-100 flex items-center justify-center">
                              {formData.teamMembers.includes(emp.user?.id) && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            {emp.user?.profile_picture ? (
                              <img
                                src={getProfilePicture(emp)}
                                alt={`${emp.user?.first_name} ${emp.user?.last_name}`}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center rounded-full w-9 h-9 bg-indigo-100">
                                <span className="text-sm text-indigo-700 font-normal">
                                  {emp.user?.first_name?.charAt(0)}{emp.user?.last_name?.charAt(0)}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <div className="text-sm text-gray-900 font-medium">
                                {emp.user?.first_name} {emp.user?.last_name}
                              </div>
                              <div className="text-xs text-gray-600">
                                {emp.position || 'Employee'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No employees found
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {formData.teamMembers.length} of {employees.length} team members selected
                  </div>
                </div>
              </div>
            )}

            {!canViewAll && (
              <div className="flex flex-col gap-2 w-full p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-900 font-medium">This task will be assigned to you</div>
                <div className="text-xs text-blue-700">{currentUser?.first_name} {currentUser?.last_name}</div>
              </div>
            )}

            <div className="flex flex-row gap-4 w-full">
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Start Date *</label>
                <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.start_date ? "border-red-500" : "border-neutral-200"}`}/>
                {formErrors.start_date && <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Due Date *</label>
                <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className={`w-full p-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 ${formErrors.due_date ? "border-red-500" : "border-neutral-200"}`}/>
                {formErrors.due_date && <p className="text-red-500 text-xs mt-1">{formErrors.due_date}</p>}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-lg text-white font-normal mt-4 transition-colors ${isSubmitting ? "bg-teal-400 cursor-not-allowed" : "bg-teal-500 hover:bg-teal-600"}`}>
              {isSubmitting ? (
                <div className="flex justify-center items-center gap-2">
                  <span>{formData.parent_task ? "Creating Subtask" : "Creating Task"}</span>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                </div>
              ) : (formData.parent_task ? "Create Subtask" : "Create Task")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogTaskModal;