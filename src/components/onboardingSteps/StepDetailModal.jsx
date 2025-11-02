import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineCalendar, AiOutlineUser, AiOutlineClockCircle, AiOutlineTag, AiOutlineExclamationCircle } from "react-icons/ai";
import Select from 'react-select';
import { getApiErrorMessage } from "@utils/errorHandler";
import { 
  useGetOnboardingStepDetailsQuery, 
  useUpdateOnboardingStepStatusMutation 
} from '../../store/services/onboardingSteps/onboardStepsService';
import { onboardingStepsStatusOptions, PRIORITY_COLORS } from '../../constants/onboardingSteps';
import { formatDate, isOverdue } from './util/dateUtils';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import { toast } from "react-toastify";

const StepDetailModal = ({ stepId, onClose }) => {
  const { data: step, isLoading, isError } = useGetOnboardingStepDetailsQuery(stepId);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOnboardingStepStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    if (step) {
      const currentStatus = onboardingStepsStatusOptions.find(
        option => option.value === step.status
      );
      setSelectedStatus(currentStatus);
    }
  }, [step]);

  const handleStatusChange = async (selectedOption) => {
    try {
      await updateStatus({ id: stepId, status: selectedOption.value }).unwrap();
      setSelectedStatus(selectedOption);

      toast.success("Status updated successfully!");
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error updating Status"
      );
      toast.error(message);
    }
  };

  const getPriorityLabel = (priority) => {
    return priority.charAt(0) + priority.slice(1).toLowerCase();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const selectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    control: (base, state) => ({
      ...base,
      minHeight: "40px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
      backgroundColor: state.isDisabled ? "#f3f4f6" : "#F8FAFC",
      cursor: state.isDisabled ? "not-allowed" : "default",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "#e5e7eb" 
        : state.isFocused 
        ? "#f3f4f6" 
        : "white",
      color: "#374151",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#e5e7eb",
      },
    }),
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div>
          <ContentSpinner />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AiOutlineExclamationCircle size={20} />
            <span>Error loading Task details</span>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const overdueFlag = isOverdue(step.due_date, step.status);

  return (
    <div 
      className="relative z-50 animate-fadeIn"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
        aria-hidden="true"
      />

      <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center p-2 md:p-3 pointer-events-none">
        <div
          className="relative transform justify-center animate-fadeIn max-h-[90vh] overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-2xl px-3 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - sticky */}
          <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
            <p className="text-sm md:text-lg lg:text-lg font-semibold">
              {step.step.title}
            </p>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="p-5 space-y-6">
            {/* Status Update Section */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <div className="flex gap-3">
                <div className="flex-1 max-w-xs">
                  <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={onboardingStepsStatusOptions}
                    isDisabled={isUpdating}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={selectStyles}
                    placeholder="Select status..."
                  />
                </div>
                <button
                  onClick={() => handleStatusChange(selectedStatus)}
                  disabled={isUpdating || !selectedStatus || selectedStatus.value === step.status}
                  className="bg-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-600 bg-slate-50 p-3 rounded-md border">
                {step.step.description}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assigned To */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineUser size={16} className="text-gray-400" />
                  Assigned To
                </label>
                <div className="text-sm font-medium text-gray-900 bg-slate-50 p-3 rounded-md border">
                  {step.step.assignee.full_name}
                  {step.step.assignee.department && (
                    <p className="text-xs text-gray-500 mt-1">{step.step.assignee.department}</p>
                  )}
                </div>
              </div>

              {/* Employee */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineUser size={16} className="text-gray-400" />
                  Employee
                </label>
                <div className="text-sm font-medium text-gray-900 bg-slate-50 p-3 rounded-md border">
                  {step.employee_name}
                </div>
              </div>

              {/* Coordinator */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineUser size={16} className="text-gray-400" />
                  Coordinator
                </label>
                <div className="text-sm font-medium text-gray-900 bg-slate-50 p-3 rounded-md border">
                  {step.coordinator_name}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineTag size={16} className="text-gray-400" />
                  Priority
                </label>
                <div className="bg-slate-50 p-3 rounded-md border">
                  <span className={`inline-block text-xs px-2 py-1 rounded ${PRIORITY_COLORS[step.step.priority]}`}>
                    {getPriorityLabel(step.step.priority)}
                  </span>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineCalendar size={16} className="text-gray-400" />
                  Start Date
                </label>
                <div className="text-sm font-medium text-gray-900 bg-slate-50 p-3 rounded-md border">
                  {formatDate(step.start_date)}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineCalendar size={16} className="text-gray-400" />
                  Due Date
                </label>
                <div className={`text-sm font-medium bg-slate-50 p-3 rounded-md border ${overdueFlag ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-900'}`}>
                  {formatDate(step.due_date)}
                  {overdueFlag && <span className="ml-2 text-xs">(Overdue)</span>}
                </div>
              </div>

              {/* Duration */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 items-center gap-2">
                  <AiOutlineClockCircle size={16} className="text-gray-400" />
                  Duration
                </label>
                <div className="text-sm font-medium text-gray-900 bg-slate-50 p-3 rounded-md border inline-block">
                  {step.step.duration_in_days} {step.step.duration_in_days === 1 ? 'day' : 'days'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDetailModal;