import React, { useState } from "react";

const LeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Maternity Leave",
    "Paternity Leave",
    "Emergency Leave",
    "Unpaid Leave"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col justify-center items-center rounded-2xl w-[560px] bg-white p-6">
        <div className="flex flex-col justify-start items-start gap-6 w-full">
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-lg text-neutral-900 font-semibold">
              Apply for Leave
            </div>
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
          
          <form onSubmit={handleSubmit} className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Leave type
              </label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col justify-start items-start gap-2 w-full">
              <label className="text-sm text-neutral-900 font-medium">
                Reason
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please provide a reason for your leave.."
                required
                rows="3"
                className="w-full p-3 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-teal-500 text-white font-normal hover:bg-teal-600 transition-colors"
            >
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;