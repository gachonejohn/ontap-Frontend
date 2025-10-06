import React, { useState } from "react";

const LogTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    taskTitle: "",
    status: "To Do",
    priority: "",
    description: "",
    banner: null,
    team: "",
    assignee: "",
    startDate: "",
    dueDate: ""
  });

  const priorities = ["Low", "Medium", "High"];
  const statuses = ["To Do", "In Progress", "Completed"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = (e) => {
    setFormData(prev => ({ ...prev, banner: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[630px] bg-white p-6 overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">Create New Task</h2>
          <button 
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Task Title */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">Task Title</label>
            <input
              type="text"
              name="taskTitle"
              value={formData.taskTitle}
              onChange={handleChange}
              placeholder="Enter task title"
              required
              className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Status & Priority */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select Priority</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows="3"
              className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Upload Banner */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-inter text-sm text-neutral-900 font-medium">Upload File</label>
            <label className="flex flex-col justify-center items-center gap-2.5 py-4 rounded-md border-2 border-dashed border-zinc-300 w-full bg-zinc-300/0 cursor-pointer hover:bg-gray-50">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleBannerUpload}
              />
              <div className="flex flex-col items-center gap-2">
                <img width="29" height="34" src="/images/upload.png" alt="Upload icon" />
                <div className="font-inter text-xs text-gray-500/70">
                  {formData.banner ? formData.banner.name : <>Upload or <span className="text-blue-600">browse</span></>}
                </div>
              </div>
            </label>
          </div>

          {/* Team */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">Team</label>
            <input
              type="text"
              name="team"
              value={formData.team}
              onChange={handleChange}
              placeholder="Choose a team"
              className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm text-neutral-900 font-medium">Assignee</label>
            <input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Tap to search"
              className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Start & Due Dates */}
          <div className="flex flex-row gap-4 w-full">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-teal-500 text-white font-normal hover:bg-teal-600 transition-colors"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogTaskModal;