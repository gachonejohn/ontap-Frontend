import React from "react";
import { useAppSelector } from "../../store/hooks";
import EmployeeTasksDashboardContent from "./EmployeeTasksDashboardContent";
import MainTaskDashboardContent from "./mainTaskDashboardContent";

export default function TaskContent() {
  const { user } = useAppSelector(state => state.auth);
  
  // Get task permissions - check for different possible feature codes
  const taskPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "tasks" || p.feature_code === "task_management"
  );
  
  // If no specific task permissions found, check for general permissions
  const canViewAll = taskPermissions?.can_view_all || 
                    user?.role?.permissions?.some(p => p.can_view_all) ||
                    user?.role?.name === "HR" || 
                    user?.role?.name === "Admin";

  const canView = taskPermissions?.can_view || 
                 user?.role?.permissions?.some(p => p.can_view) ||
                 user?.role?.name === "Employee" || 
                 canViewAll;

  console.log("Task Permissions:", {
    userRole: user?.role?.name,
    taskPermissions,
    canViewAll,
    canView
  });

  return (
    <div className="flex flex-col gap-6">
      {canViewAll ? (
        <div>
          <MainTaskDashboardContent />
        </div>
      ) : canView ? (
        <div>
          <EmployeeTasksDashboardContent />
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
              You don't have permission to view tasks. Please contact your administrator 
              to request access to the task management feature.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}