import React from "react";
import { useSelector } from "react-redux";

export const useTaskPermissions = (task) => {
  const currentUser = useSelector((state) => state.auth.user);

  // 🔥 CRITICAL FIX: Use the same safe ID extraction as in comments
  const userId = currentUser?.user?.id || currentUser?.id;

  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(
      (p) => p.feature_code === "task" || p.feature_code === "task_management"
    );
  });

  const canEditTask = taskPermissions?.can_edit;
  const canDeleteTask = taskPermissions?.can_delete;
  const canViewAll = taskPermissions?.can_view_all || false;
  
  // 🔥 FIX: Use the extracted userId for comparisons
  const isCreator = userId === task?.created_by;
  const isAssignee = userId === task?.assignee;

  // DEBUGGING BLOCK - Updated with correct IDs
  React.useEffect(() => {
    console.group("🔎 TaskModal Permission Debug");
    console.log("Current User:", currentUser);
    console.log("Extracted User ID:", userId); // This is the important one!
    console.log("Task:", task);
    console.log("task.created_by:", task?.created_by);
    console.log("task.assignee:", task?.assignee);
    console.log("isCreator:", isCreator);
    console.log("isAssignee:", isAssignee);
    console.log("taskPermissions:", taskPermissions);
    console.log("canEditTask:", canEditTask);
    console.groupEnd();
  }, [currentUser, task, userId]); // Added userId to dependencies

  // Field-level permissions - UPDATED with status editing permission
  const fieldPermissions = {
    canEditTitle: canEditTask && (isCreator || canViewAll),
    canEditDescription: canEditTask && (isCreator || canViewAll),
    canEditProgress: canEditTask && (isCreator || isAssignee || canViewAll),
    canEditDueDate: canEditTask && (isCreator || canViewAll),
    canEditAssignee: canEditTask && (isCreator || canViewAll),
    canEditDepartment: canEditTask && canViewAll,
    canEditAttachments: canEditTask && (isCreator || canViewAll),
    // 🔥 ADD STATUS EDITING PERMISSION
    canEditStatus: canEditTask && (isCreator || isAssignee || canViewAll),
    canViewAll,
    isCreator,
    isAssignee
  };

  const hasAnyEditPermission = Object.values(fieldPermissions).some(Boolean);

  return {
    hasAnyEditPermission,
    canDeleteTask,
    fieldPermissions,
    currentUser
  };
};