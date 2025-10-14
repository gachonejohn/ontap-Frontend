import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useGetEmployeesQuery } from "../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../store/services/companies/departmentsService";
import { useAssignTaskMutation } from "../../store/services/tasks/tasksService";
import { formatDate } from "./taskFunctions/dateFormatters";
import { getAssigneeName, getDepartmentName } from "./taskFunctions/taskHelpers";

const TaskInfo = ({
  task,
  isEditingMode,
  fieldPermissions,
  formData,
  onFormDataUpdate,
  currentUser,
}) => {
  // Fetch employees and departments based on permissions
  const { data: employeesData } = useGetEmployeesQuery(
    {},
    { skip: !fieldPermissions.canViewAll }
  );
  let employees = employeesData?.results || [];

  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { skip: !fieldPermissions.canViewAll, refetchOnMountOrArgChange: true }
  );
  let departments = departmentsData || [];

  // Fallback for limited permissions
  if (!fieldPermissions.canViewAll && currentUser) {
    employees = [
      {
        id: currentUser.employee_id || currentUser.id,
        user: {
          id: currentUser.id,
          first_name: currentUser.first_name,
          last_name: currentUser.last_name,
        },
        department: currentUser.department
          ? {
              id: currentUser.department.id,
              name: currentUser.department.name,
            }
          : null,
      },
    ];
    if (currentUser.department) departments = [currentUser.department];
  }

  const priorityMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  // Assign Task mutation
  const [assignTask, { isLoading: isAssigning }] = useAssignTaskMutation();

  // Local state for reason modal
  const [isReasonPromptOpen, setIsReasonPromptOpen] = useState(false);
  const [pendingAssigneeId, setPendingAssigneeId] = useState(null);
  const [reasonText, setReasonText] = useState("");

  // Local state for live countdown
  const [timeRemaining, setTimeRemaining] = useState("");

  // Triggered when user selects a new assignee
  const handleAssigneeChange = (e) => {
    const newAssigneeId = e.target.value;
    onFormDataUpdate("assigneeValue", newAssigneeId);

    if (!newAssigneeId) return; // Unassigned, skip modal
    setPendingAssigneeId(newAssigneeId);
    setIsReasonPromptOpen(true);
  };

  // Confirm and send assign_task request
  const confirmReassignment = async () => {
    if (!pendingAssigneeId) return;
    try {
      await assignTask({
        id: task.id,
        assignee: pendingAssigneeId,
        reason: reasonText || `Reassigned by ${currentUser?.first_name || "User"}`,
      }).unwrap();

      console.log("✅ Task successfully reassigned");
    } catch (error) {
      console.error("❌ Error reassigning task:", error);
    } finally {
      setIsReasonPromptOpen(false);
      setReasonText("");
      setPendingAssigneeId(null);
    }
  };

  // Calculate live countdown
  useEffect(() => {
    if (!task?.due_date) return;

    const updateCountdown = () => {
      const now = new Date();
      const due = new Date(task.due_date);
      const diff = due - now;

      if (diff <= 0) {
        setTimeRemaining("Expired");
        return;
      }

      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateCountdown(); // initial call
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [task?.due_date]);

  const getDueDateForDisplay = () => {
    const dueDate = task?.due_date || task?.dueDate;
    return formatDate(dueDate) || "No due date";
  };

  return (
    <div className="flex flex-col justify-start items-start gap-3 w-[205px] relative">
      <div className="flex justify-between items-center w-full">
        <div className="text-sm font-semibold text-neutral-900">Task Info</div>
      </div>

      <div className="flex flex-col justify-center items-center rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
        <div className="flex flex-col justify-start items-start gap-3 w-full">
          {/* Assignee */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-xs text-gray-600 font-medium">Assignee</div>
            {isEditingMode && fieldPermissions.canEditAssignee ? (
              fieldPermissions.canViewAll ? (
                <select
                  value={formData.assigneeValue}
                  onChange={handleAssigneeChange}
                  disabled={isAssigning}
                  className="w-32 p-1 border border-gray-300 rounded text-xs disabled:opacity-60"
                >
                  <option value="">Unassigned</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.user?.id}>
                      {emp.user?.first_name} {emp.user?.last_name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-gray-600 font-medium">
                  {currentUser?.first_name} {currentUser?.last_name}
                </div>
              )
            ) : (
              <div className="text-xs text-gray-600 font-medium">
                {getAssigneeName(task, employees)}
              </div>
            )}
          </div>

          {/* Department */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-xs text-gray-600 font-medium">Department</div>
            {isEditingMode && fieldPermissions.canEditDepartment ? (
              <Select
                options={departments.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                value={
                  departments
                    .map((d) => ({ value: d.id, label: d.name }))
                    .find((opt) => opt.value === formData.departmentValue) ||
                  null
                }
                onChange={(selected) =>
                  onFormDataUpdate(
                    "departmentValue",
                    selected ? selected.value : ""
                  )
                }
                menuPortalTarget={document.body}
                menuPlacement="auto"
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  control: (base) => ({
                    ...base,
                    minHeight: "28px",
                    borderColor: "#d1d5db",
                    borderRadius: "4px",
                    fontSize: "12px",
                    "&:hover": { borderColor: "#9ca3af" },
                    "&:focus-within": {
                      borderColor: "#14b8a6",
                      boxShadow: "0 0 0 2px rgba(20,184,166,0.2)",
                    },
                  }),
                  dropdownIndicator: (base) => ({
                    ...base,
                    padding: "4px",
                  }),
                  clearIndicator: (base) => ({
                    ...base,
                    padding: "4px",
                  }),
                }}
                className="w-32 text-xs"
              />
            ) : (
              <div className="text-xs text-gray-600 font-medium">
                {getDepartmentName(task, departments)}
              </div>
            )}
          </div>

          {/* Priority */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-xs text-gray-600 font-medium">Priority</div>
            <div className="text-xs text-gray-600 font-medium">
              {priorityMap[task?.priority] || task?.priority}
            </div>
          </div>

          {/* Created */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-xs text-gray-600 font-medium">Created</div>
            <div className="text-xs text-gray-600 font-medium">
              {formatDate(task?.created_at)}
            </div>
          </div>

          {/* Due Date with live countdown */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-xs text-gray-600 font-medium">Due Date</div>
            {isEditingMode && fieldPermissions.canEditDueDate ? (
              <input
                type="date"
                value={formData.dueDateValue}
                onChange={(e) =>
                  onFormDataUpdate("dueDateValue", e.target.value)
                }
                className="w-32 p-1 border border-gray-300 rounded text-xs"
              />
            ) : (
              <div className="text-xs text-gray-600 font-medium">
                {task?.due_date
                  ? `${formatDate(task.due_date)} | Time left: ${timeRemaining}`
                  : "No due date"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple inline modal for reason input */}
      {isReasonPromptOpen && (
        <div className="absolute inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl shadow-md w-[220px]">
            <div className="text-xs font-medium text-gray-700 mb-2">
              Reason for reassignment
            </div>
            <textarea
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Enter reason..."
              className="w-full text-xs border border-gray-300 rounded p-1 mb-3"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsReasonPromptOpen(false);
                  setReasonText("");
                  setPendingAssigneeId(null);
                }}
                className="text-xs px-2 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmReassignment}
                disabled={isAssigning || !reasonText.trim()}
                className="text-xs px-2 py-1 bg-teal-600 text-white rounded disabled:opacity-60"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfo;
