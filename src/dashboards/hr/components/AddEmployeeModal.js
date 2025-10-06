import React, { useState } from "react";

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    startDate: "",
    salary: "",
    emergencyName: "",
    gender: "",
    emergencyEmail: "",
    emergencyPhone: "",
    relationship: ""
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">
            Add New Employee
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
              xmlns="http://www.w3.org/2000/svg "
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
          {["personal", "emergency"].map((tab, idx) => (
            <div
              key={tab}
              className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer ${idx !== 1 ? "border-r border-slate-100" : ""
                } ${activeTab === tab ? "bg-white" : "hover:bg-gray-50"}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="text-xs text-neutral-900 font-semibold tracking-wide capitalize">
                {tab === "personal" ? "Personal Info" : "Emergency Info"}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "personal" && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            {/* Profile Photo Upload */}
            <div className="flex justify-center items-center rounded-xl w-full p-6 bg-gray-50">
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="relative flex justify-center items-center">
                  <div className="flex justify-center items-center rounded-full border-4 border-white w-24 h-24 bg-gray-200 overflow-hidden">
                    {profileImageUrl ? (
                      <img
                        className="w-full h-full object-cover"
                        src={profileImageUrl}
                        alt="Profile preview"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <img
                          src="/images/profilepic.png"
                          alt="Default profile"
                          className="w-12 h-12 opacity-50"
                        />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-0 translate-x-1/4 translate-y-1/4 flex justify-center items-center rounded-full w-8 h-8 bg-white shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                    <img
                      width="20"
                      height="19"
                      src="/images/camera.png"
                      alt="Camera icon"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <div className="text-xs text-gray-600 font-medium text-center">
                  Click the camera icon to change your photo
                </div>
              </div>
            </div>

            {/* Personal Info Form */}
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

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter user role"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select department</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Salary
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="$"
                  />
                </div>
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
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
                  onClick={() => setActiveTab("emergency")}
                >
                  <div className="text-base text-white font-normal">Next</div>
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
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
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="emergencyEmail"
                    value={formData.emergencyEmail}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="your@gmail.com"
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">
                  Relationship
                </label>
                <input
                  type="text"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter relationship"
                />
              </div>

              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab("personal")}
                >
                  <div className="text-base text-neutral-900 font-normal">
                    Back
                  </div>
                </button>
                <button
                  type="submit"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors"
                >
                  <div className="text-base text-white font-normal">
                    Add Employee
                  </div>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}