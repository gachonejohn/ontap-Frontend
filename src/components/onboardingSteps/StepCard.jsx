import React from 'react';
// import { MessageSquare, Calendar, User } from 'lucide-react';
import { AiOutlineMessage, AiOutlineCalendar, AiOutlineUser } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { PRIORITY_COLORS } from '../../constants/onboardingSteps';
import { formatDate, isOverdue } from './util/dateUtils';

const StepCard = ({ step, onClick }) => {
  const getPriorityLabel = (priority) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  };

  const overdueFlag = isOverdue(step.due_date, step.status);

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex-1 pr-2">
          {step.step.title}
        </h3>
        <button 
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            // comments integration
          }}
        >
          <FiMessageSquare size={16} />
        </button>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {step.step.description}
      </p>

      {/* {step.step.category_name && (
        <div className="mb-3">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {step.step.category_name}
          </span>
        </div>
      )} */}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <AiOutlineCalendar size={14} className="text-gray-400" />
        <span className={`text-xs ${overdueFlag ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
          {formatDate(step.due_date)}
          {overdueFlag && ' (Overdue)'}
        </span>
        <span className={`ml-auto text-xs px-2 py-1 rounded ${PRIORITY_COLORS[step.step.priority]}`}>
          {getPriorityLabel(step.step.priority)}
        </span>
      </div>

      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <AiOutlineUser size={14} className="text-gray-400" />
        <span className="text-xs text-gray-600">
          Employee: {step.employee_name}
        </span>
      </div>

      <div className="mt-3 space-y-1">
        <div className="text-xs text-gray-500">
          <span className="font-medium">Assigned to:</span> {step.step.assignee.full_name}
        </div>
        <div className="text-xs text-gray-500">
          <span className="font-medium">Coordinator:</span> {step.coordinator_name}
        </div>
      </div>
    </div>
  );
};

export default StepCard;