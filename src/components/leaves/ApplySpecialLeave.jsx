import React, { useState } from 'react';

const ApplySpecialLeave = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    supportingDocument: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      supportingDocument: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      supportingDocument: null
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        supportingDocument: file
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[90vh] bg-white overflow-hidden">
        {/* Fixed Header */}
        <div className="flex flex-row justify-between items-start p-6 w-full bg-white">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-orange-100 overflow-hidden">
              <img
                width="20px"
                height="20px"
                src="/images/ApplySpecialleave.png"
                alt="Special Leave Icon"
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-1 h-6">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                Apply for Special Leave
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-end gap-2">
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="flex flex-col justify-start items-start gap-5 w-full">
            <div className="flex flex-col justify-start items-center gap-4 w-full">
              {/* Leave Type */}
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Leave type
                </div>
                <select
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleInputChange}
                  className="flex flex-col justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  required
                >
                  <option value="">Select leave type</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="COMPASSIONATE">Compassionate Leave</option>
                  <option value="STUDY">Study Leave</option>
                  <option value="MATERNITY">Maternity Leave</option>
                  <option value="PATERNITY">Paternity Leave</option>
                  <option value="SABBATICAL">Sabbatical Leave</option>
                </select>
              </div>

              {/* Date Range */}
              <div className="flex flex-row justify-between items-center gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    Start Date
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="flex flex-col justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2 flex-1">
                  <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    End Date
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="flex flex-col justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>

              {/* Reason */}
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Reason
                </div>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  className="flex justify-start items-center rounded-lg border border-neutral-200 w-full bg-white p-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Please provide a reason for this leave.."
                  required
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                Supporting Document
              </div>
              <div 
                className="flex justify-center items-center w-full h-[150px] rounded-md border-2 border-dashed border-zinc-300 bg-transparent cursor-pointer hover:border-orange-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <div className="flex flex-col justify-center items-center gap-2">
                  <div className="flex flex-col justify-start items-center gap-2">
                    <img
                      width="32px"
                      height="32px"
                      src="/images/upload.png"
                      alt="Upload Icon"
                    />
                    <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-medium">
                      Drag & drop files here or
                    </div>
                  </div>
                  <div className="flex flex-col justify-start items-center gap-3">
                    <div className="flex flex-col justify-center items-center gap-2.5 px-4 py-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">
                      <div className="font-inter text-sm whitespace-nowrap text-gray-800 text-opacity-100 leading-snug tracking-normal font-medium">
                        Browse Files
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              {formData.supportingDocument && (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg w-full">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M13.3333 4L6 11.3333L2.66666 8" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div className="text-sm text-green-700 truncate">
                    {formData.supportingDocument.name}
                  </div>
                </div>
              )}
              <div className="font-inter text-xs text-gray-500 text-opacity-100 leading-snug tracking-normal font-normal">
                Attach supporting document (doctor's note, travel letter, etc.). Accepted formats: PDF, DOC, DOCX, JPG, PNG
              </div>
            </div>

            {/* Info Box */}
            <div className="flex flex-col justify-start items-center rounded-lg border-l-4 border-orange-400 bg-orange-50 w-full p-4">
              <div className="flex justify-start items-center w-full">
                <div className="font-inter text-sm text-gray-700 text-opacity-100 leading-5 tracking-normal font-normal">
                  Your special leave request will be sent to your manager for approval.
                  You will receive a notification once your request has been reviewed.
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="flex flex-row justify-center items-center gap-2 rounded-lg h-12 bg-orange-400 w-full cursor-pointer hover:bg-orange-500 transition-colors"
            >
              <div className="font-inter text-base whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-normal">
                Submit Request
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplySpecialLeave;