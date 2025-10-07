import React from "react";
import { useSelector } from "react-redux";

export const useTaskPermissions = (task) => {
  const currentUser = useSelector((state) => state.auth.user);

  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(
      (p) => p.feature_code === "task" || p.feature_code === "task_management"
    );
  });

  const canEditTask = taskPermissions?.can_edit;
  const canDeleteTask = taskPermissions?.can_delete;
  const canViewAll = taskPermissions?.can_view_all || false;
  const isCreator = currentUser?.id === task?.created_by;
  const isAssignee = currentUser?.id === task?.assignee;

  // DEBUGGING BLOCK
  React.useEffect(() => {
    console.group("🔎 TaskModal Permission Debug");
    console.log("Current User:", currentUser);
    console.log("Task:", task);
    console.log("task.created_by:", task?.created_by);
    console.log("task.assignee:", task?.assignee);
    console.log("currentUser.id:", currentUser?.id);
    console.log("isCreator:", isCreator);
    console.log("isAssignee:", isAssignee);
    console.log("taskPermissions:", taskPermissions);
    console.log("canEditTask:", canEditTask);
    console.groupEnd();
  }, [currentUser, task]);

  // Field-level permissions
  const fieldPermissions = {
    canEditTitle: canEditTask && (isCreator || canViewAll),
    canEditDescription: canEditTask && (isCreator || canViewAll),
    canEditProgress: canEditTask && (isCreator || isAssignee || canViewAll),
    canEditDueDate: canEditTask && (isCreator || canViewAll),
    canEditAssignee: canEditTask && (isCreator || canViewAll),
    canEditDepartment: canEditTask && canViewAll,
    canEditAttachments: canEditTask && (isCreator || canViewAll),
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