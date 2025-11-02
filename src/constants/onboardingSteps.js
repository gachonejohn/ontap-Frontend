export const onboardingStepsStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export const PRIORITY_COLORS = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-green-100 text-green-700',
  LOW: 'bg-gray-100 text-gray-700',
};

export const STATUS_COLORS = {
  PENDING: 'blue',
  IN_PROGRESS: 'yellow',
  COMPLETED: 'green',
};

export const COLUMN_CONFIG = [
  { key: 'PENDING', title: 'To Do', color: 'blue' },
  { key: 'IN_PROGRESS', title: 'In Progress', color: 'yellow' },
  { key: 'COMPLETED', title: 'Completed', color: 'green' },
  { key: 'OVER_DUE', title: 'Delayed', color: 'red' },
];