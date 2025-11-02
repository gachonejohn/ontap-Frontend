import React from 'react';

const EditControls = ({
  isEditingMode,
  hasAnyEditPermission,
  canDeleteTask,
  onEditToggle,
  onSave,
  onCancel,
  onDelete,
  onClose,
  isUploading,
}) => {
  return (
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
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.5 1.5L14.5 2.5L13.5 3.5L12.5 2.5L13.5 1.5Z" fill="currentColor" />
                <path
                  d="M12.5 2.5L3.5 11.5L1.5 13.5L3.5 11.5L12.5 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
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
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v8a2 2 0 002 2h4a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6z" />
          </svg>
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
  );
};

export default EditControls;
