import React, { useState } from 'react';

const TaskHeader = ({
  isEditingMode,
  hasAnyEditPermission,
  canDeleteTask,
  onEditToggle,
  onSave,
  onCancel,
  onDelete,
  onClose,
  isUploading,
  task,
  onStatusChange,
  onPriorityChange,
  isAssignee,
  canViewAll,
  currentUser, // Add currentUser prop to get the correct ID
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);

  // Safe user ID extraction
  const userId = currentUser?.user?.id || currentUser?.id;

  const statusMap = {
    TO_DO: 'To Do',
    IN_PROGRESS: 'In Progress',
    UNDER_REVIEW: 'Under Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'On Hold',
  };

  const priorityMap = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    URGENT: 'Urgent',
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));

  const getUpgradablePriorityOptions = () => {
    const priorities = Object.entries(priorityMap);
    const currentPriorityIndex = priorities.findIndex(([key]) => key === task?.priority);

    if (currentPriorityIndex === -1) return [];

    return priorities.slice(currentPriorityIndex).map(([key, value]) => ({ key, value }));
  };

  const priorityOptions = getUpgradablePriorityOptions();

  // Enhanced status change handler
  const handleStatusChange = (newStatus) => {
    if (!userId) {
      console.error('User ID not available for status change');
      return;
    }

    if (onStatusChange) {
      onStatusChange(newStatus, userId); // Pass userId to the parent
    }
    setIsStatusDropdownOpen(false);
  };

  // Enhanced priority change handler
  const handlePriorityChange = (newPriority) => {
    if (!userId) {
      console.error('User ID not available for priority change');
      return;
    }

    if (onPriorityChange) {
      onPriorityChange(newPriority, userId); // Pass userId to the parent
    }
    setIsPriorityDropdownOpen(false);
  };

  return (
    <>
      {/* Header with Close Button, Edit Button and Delete Option */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg text-neutral-900 font-semibold">Task Details</h2>
        <div className="flex items-center gap-2">
          {hasAnyEditPermission && (
            <>
              {isEditingMode ? (
                <div className="flex gap-2">
                  <button
                    onClick={onSave}
                    disabled={isUploading}
                    className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={onCancel}
                    disabled={isUploading}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={onEditToggle}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit Task
                </button>
              )}
            </>
          )}
          {canDeleteTask && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              title="Delete Task"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 4L12 12"
                stroke="#4B5563"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Task Title */}
      <div className="flex flex-col justify-start items-start gap-4 mb-3">
        {isEditingMode ? (
          <div className="w-full">
            <input
              type="text"
              value={task?.title || ''}
              onChange={(e) => {
                /* You'll need to handle title change */
              }}
              className="w-full p-2 border border-gray-300 rounded text-lg font-semibold"
              placeholder="Enter task title"
            />
          </div>
        ) : (
          <div className="flex justify-between items-start w-full">
            <div className="text-lg font-semibold text-neutral-900">{task?.title}</div>
          </div>
        )}

        <div className="flex flex-row justify-start items-center gap-3">
          {/* Status Display */}
          <div className="relative">
            <div
              className={`flex flex-row justify-center items-center rounded-md border border-neutral-200 h-9 bg-white overflow-hidden ${
                isAssignee ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={() => isAssignee && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            >
              <div className="flex flex-row justify-center items-center gap-1.5 py-2 px-3 h-8">
                <div className="text-xs text-neutral-900 font-semibold">
                  {statusMap[task?.status] || task?.status}
                </div>
                {isAssignee && (
                  <div className="flex flex-col justify-center items-center w-4 h-5">
                    <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown" />
                  </div>
                )}
              </div>
            </div>

            {isStatusDropdownOpen && isAssignee && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                {statusOptions.map(({ key, value }) => (
                  <div
                    key={key}
                    className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                      task?.status === key ? 'bg-teal-100 text-teal-800' : 'text-neutral-900'
                    }`}
                    onClick={() => handleStatusChange(key)}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <div
              className={`flex flex-row justify-center items-center rounded-md border border-neutral-200 h-9 bg-white overflow-hidden cursor-pointer ${
                task?.priority === 'HIGH' || task?.priority === 'URGENT'
                  ? 'bg-red-100 text-pink-800'
                  : task?.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
              }`}
              onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            >
              <div className="flex flex-row justify-center items-center gap-1.5 py-2 px-3 h-8">
                <div className="text-xs font-semibold">
                  {priorityMap[task?.priority] || task?.priority} Priority
                </div>
                <div className="flex flex-col justify-center items-center w-4 h-5">
                  <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown" />
                </div>
              </div>
            </div>

            {isPriorityDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                {priorityOptions.map(({ key, value }) => (
                  <div
                    key={key}
                    className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                      task?.priority === key ? 'bg-teal-100 text-teal-800' : 'text-neutral-900'
                    }`}
                    onClick={() => handlePriorityChange(key)}
                  >
                    {value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskHeader;
