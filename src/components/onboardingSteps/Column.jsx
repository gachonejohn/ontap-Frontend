import React from 'react';
import StepCard from './StepCard';

const Column = ({ title, count, color, steps, onStepClick }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2 h-2 rounded-full ${colorClasses[color]}`} />
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {steps.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks available
          </div>
        ) : (
          steps.map((step) => (
            <StepCard 
              key={step.id} 
              step={step} 
              onClick={() => onStepClick(step.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;