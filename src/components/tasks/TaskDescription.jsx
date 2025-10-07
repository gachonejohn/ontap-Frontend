import React from "react";

const TaskDescription = ({ task, isEditingMode, canEditDescription, descriptionValue, onDescriptionChange }) => {
  return (
    <div className="flex flex-col justify-start items-start gap-3 w-full">
      <div className="flex justify-between items-center w-full">
        <div className="text-sm font-semibold text-neutral-900">
          Description
        </div>
      </div>
      
      {isEditingMode && canEditDescription ? (
        <div className="w-full">
          <textarea
            value={descriptionValue}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded text-xs min-h-[100px] resize-none"
            placeholder="Enter task description"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
          <div className="text-xs text-gray-600 font-medium whitespace-pre-wrap">
            {task?.description || 'No description provided'}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;