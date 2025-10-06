// CreateBusinessCardModal.js
import React, { useState } from "react";

const CreateBusinessCardModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    companyName: "",
    website: "",
    email: "",
    phone: "",
    location: "",
    twitter: "",
    linkedin: "",
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">
            {activeTab === "templates" ? "Edit ID Card" : "Create New Business Card"}
          </h2>
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

        {/* Tabs */}
        <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden w-full mb-6">
          {["details", "contact", "templates"].map((tab, idx) => (
            <div
              key={tab}
              className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer ${idx !== 2 ? "border-r border-slate-100" : ""
                } ${activeTab === tab ? "bg-white" : "hover:bg-gray-50"}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="text-xs text-neutral-900 font-semibold tracking-wide capitalize">
                {tab}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            {/* Profile Photo Upload */}
            <div className="flex justify-center items-center rounded-xl w-full p-6 bg-gray-50">
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="relative flex justify-center items-center">
                  <div className="flex justify-center items-center rounded-full border-4 border-white w-24 h-24 bg-gray-200 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src="/images/profilepic.png"
                      alt="Profile preview"
                    />
                  </div>
                  <div className="absolute bottom-2 right-0 translate-x-1/4 translate-y-1/4 flex justify-center items-center rounded-full w-8 h-8 bg-white shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <img
                      width="20"
                      height="19"
                      src="/images/camera.png"
                      alt="Camera icon"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium text-center">
                  Click the camera icon to change your photo
                </div>
              </div>
            </div>

            {/* Details Form */}
            <form
              className="flex flex-col justify-start items-start gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. UX Designer"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="OnTap Technologies"
                />
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="www.yourwebsite.com"
                />
              </div>
              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="text-base text-neutral-900 font-normal">
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
                >
                  <div className="text-base text-white font-normal">Next</div>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "contact" && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            <form
              className="flex flex-col justify-start items-start gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-900">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-neutral-900">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-neutral-900">
                  Office Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="No.2 avenue, London"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-neutral-900">
                  Twitter Profile URL
                </label>
                <input
                  type="text"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="@victor_design"
                />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-neutral-900">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  placeholder="linkedin.com/in/victor-smith"
                />
              </div>
              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="text-base text-neutral-900 font-normal">
                    Cancel
                  </div>
                </button>
                <button
                  type="submit"
                  className="flex justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
                >
                  <div className="text-base text-white font-normal">Next</div>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            <div className="flex flex-col gap-4 w-full">
              <div className="text-sm font-medium text-neutral-900">
                Choose Template
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-start items-center gap-3 p-4 rounded-lg border border-red-700 w-full h-[100px] cursor-pointer hover:bg-gray-50"
                    >
                      <div className="rounded-lg w-8 h-8 bg-red-700"></div>
                      <div className="flex flex-col">
                        <div className="text-base font-semibold text-neutral-900">
                          Modern Professional
                        </div>
                        <div className="text-xs font-medium text-gray-600">
                          Traditional business layout
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
              <button
                type="button"
                className="flex justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                <div className="text-base text-neutral-900 font-normal">
                  Cancel
                </div>
              </button>
              <button
                type="submit"
                className="flex justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4v16m8-8H4" />
                </svg>
                <div className="text-base text-white font-normal">
                  Create Card
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBusinessCardModal;
