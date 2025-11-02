export const getAssigneeName = (task, employees) => {
  if (task?.assignee_name) return task.assignee_name;

  // If no assignee_name, find the employee in the employees list
  if (task?.assignee && employees?.length > 0) {
    const employee = employees.find((emp) => emp.user?.id === task.assignee);
    if (employee) {
      return `${employee.user?.first_name} ${employee.user?.last_name}`;
    }
  }

  return 'Unassigned';
};

export const getDepartmentName = (task, departments) => {
  if (task?.department_name) return task.department_name;

  // If no department_name, find the department in the departments list
  if (task?.department && departments?.length > 0) {
    const department = departments.find((dept) => dept.id === task.department);
    if (department) {
      return department.name;
    }
  }

  return 'Not specified';
};

export const getProgressSuggestions = (task) => {
  const progress = task?.progress_percentage || task?.progressPercentage || 0;
  if (progress === 0) return 'Task not started';
  if (progress < 25) return 'Just getting started';
  if (progress < 50) return 'Making good progress';
  if (progress < 75) return 'More than halfway there';
  if (progress < 100) return 'Almost complete';
  return 'Task completed!';
};

export const getUpgradablePriorityOptions = (currentPriority) => {
  const priorityMap = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };

  const priorities = Object.entries(priorityMap);
  const currentPriorityIndex = priorities.findIndex(([key]) => key === currentPriority);

  if (currentPriorityIndex === -1) return [];

  // Return only higher priorities (upgradable)
  return priorities.slice(currentPriorityIndex).map(([key, value]) => ({ key, value }));
};
