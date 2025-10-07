import React, { useState } from "react";

const TaskProgress = ({ task, isEditingMode, canEditProgress, onProgressUpdate }) => {
  const [progressValue, setProgressValue] = useState(task?.progress_percentage || task?.progressPercentage || 0);

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setProgressValue(Math.min(100, Math.max(0, value)));
  };

  const saveProgress = () => onProgressUpdate(progressValue);

  const getProgressSuggestions = () => {
    const progress = task?.progress_percentage || task?.progressPercentage || 0;
    if (progress === 0) return "Task not started";
    if (progress < 25) return "Just getting started";
    if (progress < 50) return "Making good progress";
    if (progress < 75) return "More than halfway there";
    if (progress < 100) return "Almost complete";
    return "Task completed!";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
        <span>Progress</span>
        {isEditingMode && canEditProgress ? (
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={progressValue} 
              onChange={handleProgressChange} 
              className="w-16 p-1 border rounded text-xs"
            />
            <span>%</span>
            <button 
              onClick={saveProgress} 
              className="px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600"
            >
              Update
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>{task?.progress_percentage || task?.progressPercentage || 0}%</span>
          </div>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
          style={{width:`${task?.progress_percentage || task?.progressPercentage || 0}%`}}
        ></div>
      </div>
      <div className="text-xs text-gray-500 italic mt-1">{getProgressSuggestions()}</div>
    </div>
  );
};

export default TaskProgress;