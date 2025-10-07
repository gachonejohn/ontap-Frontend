import React from "react";
import Select from "react-select";
import { useGetEmployeesQuery } from "../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "../../store/services/companies/departmentsService";
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

  // ✅ Fallback: If user does not have view_all permission, use their own info
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

    if (currentUser.department) {
      departments = [currentUser.department];
    }
  }

  const priorityMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  const getDueDateForDisplay = () => {
    const dueDate = task?.due_date || task?.dueDate;
    return formatDate(dueDate) || "No due date";
  };

  return (
    <div className="flex flex-col justify-start items-start gap-3 w-[205px]">
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
                  onChange={(e) =>
                    onFormDataUpdate("assigneeValue", e.target.value)
                  }
                  className="w-32 p-1 border border-gray-300 rounded text-xs"
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
                    .find(
                      (opt) => opt.value === formData.departmentValue
                    ) || null
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

          {/* Due Date */}
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
                {getDueDateForDisplay()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfo;
