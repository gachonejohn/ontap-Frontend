// components/NewEmployeeModal.js
import React, { useState, useEffect } from 'react';

export default function NewEmployeeModal({ isOpen, onClose, onEmployeeAdded }) {
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Hardcoded options for now - we'll replace these with API data later
  const [departments] = useState([
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'HR' },
    { id: 4, name: 'Marketing' },
    { id: 5, name: 'Sales' },
    { id: 6, name: 'Operations' },
  ]);

  const [positions] = useState([
    { id: 1, title: 'Software Developer' },
    { id: 2, title: 'UX Designer' },
    { id: 3, title: 'HR Manager' },
    { id: 4, title: 'Marketing Specialist' },
    { id: 5, title: 'Sales Executive' },
    { id: 6, title: 'Operations Manager' },
  ]);

  const [roles] = useState([
    { id: 1, name: 'Employee' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Admin' },
    { id: 4, name: 'HR' },
  ]);

  const [formData, setFormData] = useState({
    // Required fields from your API documentation
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    employee_no: '',
    department_id: '',
    position_id: '',
    role_id: '',

    // Emergency contact info (will be stored separately if needed)
    emergency_full_name: '',
    emergency_phone: '',
    emergency_relationship: '',

    // Additional info for the employee profile
    gender: '',
    address: '',
    employment_status: 'active',
  });

  // Debug API on modal open

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');

    try {
      // Prepare the data exactly as your API expects
      const employeeData = {};

      console.log('Submitting employee data:', employeeData);

      onClose();

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        employee_no: '',
        department_id: '',
        position_id: '',
        role_id: '',
        emergency_full_name: '',
        emergency_phone: '',
        emergency_relationship: '',
        gender: '',
        address: '',
        employment_status: 'active',
      });
    } catch (error) {
      console.error('Failed to create employee:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to create employee. Please check the console for details.';
      setApiError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">Add New Employee</h2>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            disabled={loading}
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

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">API Error: {apiError}</div>
        )}

        {/* Tabs */}
        <div className="flex flex-row justify-center items-center rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden w-full mb-6">
          {['personal', 'emergency', 'additional'].map((tab, idx) => (
            <div
              key={tab}
              className={`flex flex-row justify-center items-center h-10 flex-1 cursor-pointer ${
                idx !== 2 ? 'border-r border-slate-100' : ''
              } ${activeTab === tab ? 'bg-white' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="text-xs text-neutral-900 font-semibold tracking-wide capitalize">
                {tab === 'personal'
                  ? 'Personal Info'
                  : tab === 'emergency'
                    ? 'Emergency Info'
                    : 'Additional Info'}
              </div>
            </div>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
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
                    <img width="20" height="19" src="/images/camera.png" alt="Camera icon" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      disabled={loading}
                    />
                  </label>
                </div>
                <div className="text-xs text-gray-600 font-medium text-center">
                  Click the camera icon to change your photo
                </div>
              </div>
            </div>

            <form className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="First name"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Last name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="employee@company.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+1234567890"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Employee Number</label>
                  <input
                    type="text"
                    name="employee_no"
                    value={formData.employee_no}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="EMP001"
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={loading}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors text-white"
                  onClick={() => setActiveTab('emergency')}
                  disabled={loading}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Emergency Info Tab */}
        {activeTab === 'emergency' && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            <form className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    name="emergency_full_name"
                    value={formData.emergency_full_name}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Full name"
                    disabled={loading}
                  />
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Emergency Phone</label>
                  <input
                    type="tel"
                    name="emergency_phone"
                    value={formData.emergency_phone}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+1234567890"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Relationship</label>
                <input
                  type="text"
                  name="emergency_relationship"
                  value={formData.emergency_relationship}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Relationship (e.g., Spouse, Parent)"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab('personal')}
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors text-white"
                  onClick={() => setActiveTab('additional')}
                  disabled={loading}
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Additional Info Tab */}
        {activeTab === 'additional' && (
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            <form
              className="flex flex-col justify-start items-start gap-4 w-full"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Department *</label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Position *</label>
                  <select
                    name="position_id"
                    value={formData.position_id}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select position</option>
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Role *</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    disabled={loading}
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <label className="text-sm text-neutral-900 font-medium">Employment Status</label>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <label className="text-sm text-neutral-900 font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Full address"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-row justify-between items-center gap-3 w-full mt-4">
                <button
                  type="button"
                  className="flex flex-row justify-center items-center p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors"
                  onClick={() => setActiveTab('emergency')}
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex flex-row justify-center items-center p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors text-white"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
