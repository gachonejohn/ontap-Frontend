
import React, { useState } from "react";

const TaskModal = ({ isOpen, onClose, task, onUpdateTask }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(task?.status || "To Do");

  const statuses = ["To Do", "In Progress", "Completed"];

  if (!isOpen || !task) return null;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    setIsStatusDropdownOpen(false);

    // If an update function is provided, call it with the new status
    if (onUpdateTask) {
      onUpdateTask({ ...task, status: newStatus });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">Task Details</h2>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Task Title and Status/Priority Row */}
        <div className="flex flex-col justify-start items-start gap-4 mb-3">
          <div className="text-lg font-semibold text-neutral-900">
            {task.title}
          </div>

          <div className="flex flex-row justify-start items-center gap-3">
            {/* Status Dropdown */}
            <div className="relative">
              <div
                className="flex flex-row justify-center items-center rounded-md border border-neutral-200 h-9 bg-white overflow-hidden cursor-pointer"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <div className="flex flex-row justify-center items-center gap-1.5 py-2 px-3 h-8">
                  <div className="text-xs text-neutral-900 font-semibold">
                    {currentStatus}
                  </div>
                  <div className="flex flex-col justify-center items-center w-4 h-5">
                    <img
                      width="9.5px"
                      height="5.1px"
                      src="/images/dropdown.png"
                      alt="Dropdown"
                    />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                  {statuses.map(status => (
                    <div
                      key={status}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${currentStatus === status ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                        }`}
                      onClick={() => handleStatusChange(status)}
                    >
                      {status}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Badge */}
            <div className={`flex flex-row justify-center items-center gap-2.5 py-1 px-5 rounded-md h-9 ${task.priority === "High"
                ? "bg-red-100 text-pink-800"
                : task.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}>
              <div className="text-[10px] font-medium">
                {task.priority} Priority
              </div>
            </div>
          </div>
        </div>

        {/* Thin Horizontal Separator */}
        <div className="w-full border-t border-gray-200 mb-4"></div>

        {/* Main Content Area */}
        <div className="flex flex-col justify-start items-start gap-5">
          {/* Description and Task Info Row */}
          <div className="flex flex-row justify-between items-start gap-4 w-full">
            {/* Left Column - Description and Attachments */}
            <div className="flex flex-col justify-start items-start gap-4 w-[307px]">
              {/* Description */}
              <div className="flex flex-col justify-start items-start gap-3">
                <div className="text-sm font-semibold text-neutral-900">
                  Description
                </div>
                <div className="rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
                  <div className="text-xs text-gray-600 font-medium">
                    {task.description}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {task.attachments?.length > 0 && (
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-start items-center gap-1">
                    <div className="flex justify-center items-center w-6 h-4">
                      <img
                        width="24px"
                        height="25px"
                        src="/images/attachment.png"
                        alt="Attachment"
                      />
                    </div>
                    <div className="text-sm font-medium text-neutral-900">
                      Attachments ({task.attachments.length})
                    </div>
                  </div>

                  {task.attachments.map((att, idx) => (
                    <div key={idx} className="flex flex-col justify-center items-center rounded-lg w-full p-3 shadow-sm bg-white">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col justify-start items-start">
                          <div className="text-xs font-medium text-neutral-900">
                            {att.name}
                          </div>
                          <div className="text-[10px] text-gray-600 font-medium">
                            {att.size}
                          </div>
                        </div>
                        <button className="flex flex-row justify-center items-center gap-1 py-1 px-5 rounded-lg border border-neutral-200">
                          <div className="flex justify-center items-center h-4">
                            <img
                              width="13px"
                              height="13px"
                              src="/images/download.png"
                              alt="Download"
                            />
                          </div>
                          <div className="text-[10px] text-gray-800 font-medium">
                            Download
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Task Info */}
            <div className="flex flex-col justify-start items-start gap-3 w-[205px]">
              <div className="text-sm font-semibold text-neutral-900">
                Task Info
              </div>
              <div className="flex flex-col justify-center items-center rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Assignee
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.assignee}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Team
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.team}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Priority
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.priority}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Start Date
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.startDate}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Due Date
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.dueDate}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <div className="text-sm font-semibold text-neutral-900">
              Comments
            </div>
            <div className="flex flex-col justify-center items-center rounded-lg w-full p-3 bg-gray-50">
              <div className="flex justify-start items-center w-full p-3 rounded-md bg-gray-100/80">
                <div className="text-sm text-gray-600 font-normal">
                  Add a comment.....
                </div>
              </div>
            </div>

            {/* Existing Comments */}
            {task.comments && (
              <div className="text-xs text-gray-600 font-normal w-full mt-2">
                {task.comments}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;