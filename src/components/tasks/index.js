import React from "react";
import { useAppSelector } from "../../store/hooks";
import EmployeeTasksDashboardContent from "./EmployeeTasksDashboardContent";
import MainTaskDashboardContent from "./mainTaskDashboardContent";

export default function TaskContent() {
  const { user } = useAppSelector((state) => state.auth);

  // Get task permissions - check for "tasks" or "task_management"
  const taskPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "task" || p.feature_code === "task_management"
  );

  // Respect only backend permissions (no role name fallback)
  const canViewAll = taskPermissions?.can_view_all || false;
  const canView = taskPermissions?.can_view || canViewAll;

  // Extract all CRUD permissions from backend
  const canCreate = taskPermissions?.can_create || false;
  const canEdit = taskPermissions?.can_edit || false;
  const canDelete = taskPermissions?.can_delete || false;
  const canExport = taskPermissions?.can_export || false;

  console.log("Task Permissions:", {
    userRole: user?.role?.name,
    taskPermissions,
    canViewAll,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canExport,
  });

  // Create complete permissions object to pass down
  const fullTaskPermissions = {
    canView,
    canViewAll,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    // Include the raw permission object for any additional checks
    raw: taskPermissions
  };

  return (
    <div className="flex flex-col gap-6">
      {canViewAll ? (
        <div>
          <MainTaskDashboardContent taskPermissions={fullTaskPermissions} />
        </div>
      ) : canView ? (
        <div>
          <EmployeeTasksDashboardContent taskPermissions={fullTaskPermissions} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <img
              src="/images/no_permission.png"
              alt="No permission"
              className="w-32 h-32 mx-auto mb-4 opacity-50"
            />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Access Restricted
            </h3>
            <p className="text-gray-500 max-w-md">
              You don't have permission to view tasks. Please contact your
              administrator to request access to the task management feature.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}