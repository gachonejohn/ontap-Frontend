import React from 'react';
import { useSelector } from 'react-redux';

export const useTaskPermissions = (task) => {
  const currentUser = useSelector((state) => state.auth.user);

  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(
      (p) => p.feature_code === 'task' || p.feature_code === 'task_management'
    );
  });

  const canEditTask = taskPermissions?.can_edit;
  const canDeleteTask = taskPermissions?.can_delete;
  const canViewAll = taskPermissions?.can_view_all || false;
  
  // 🔥 FIX: Extract user ID correctly and check both single assignee and multiple assignees
  const userId = currentUser?.user?.id || currentUser?.id;
  
  // Check if user is in assignees array (new multi-assignee system)
  const isInAssignees = task?.assignees && Array.isArray(task.assignees) 
    ? task.assignees.includes(userId)
    : false;
  
  // Check legacy single assignee for backward compatibility
  const isSingleAssignee = task?.assignee === userId;
  
  // User is assignee if they're in either system
  const isAssignee = isInAssignees || isSingleAssignee;
  
  const isCreator = userId === task?.created_by;

  // DEBUGGING BLOCK - Updated with new logic
  React.useEffect(() => {
    console.group("🔎 TaskModal Permission Debug - UPDATED");
    console.log("Current User ID:", userId);
    console.log("Task Assignees:", task?.assignees);
    console.log("Task Assignee (legacy):", task?.assignee);
    console.log("isInAssignees:", isInAssignees);
    console.log("isSingleAssignee:", isSingleAssignee);
    console.log("isAssignee:", isAssignee);
    console.log("isCreator:", isCreator);
    console.log("taskPermissions:", taskPermissions);
    console.log("canEditTask:", canEditTask);
    console.log("canViewAll:", canViewAll);
    console.groupEnd();
  }, [currentUser, task, userId, isInAssignees, isSingleAssignee, isAssignee, isCreator]);

  // Field-level permissions - UPDATED for multi-assignee support
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
    isAssignee,
  };

  const hasAnyEditPermission = Object.values(fieldPermissions).some(Boolean);

  return {
    hasAnyEditPermission,
    canDeleteTask,
    fieldPermissions,
    currentUser,
  };
};
