import React, { useState } from 'react';
import ViewProfileModal from './ViewProfileModal.js';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // State for editable data
  const [personalData, setPersonalData] = useState({
    fullName: 'Emefo Victor Ebubechukwu',
    gender: 'Male',
    email: 'victor.emefo@company.com',
    phone: '+234 7099767789',
    address: '123 Main St, San Francisco, CA 94102',
    department: 'Design Team',
    position: 'Head of design',
    employeeId: 'EMP0035',
    startDate: '2023-08-13',
  });

  const [emergencyData, setEmergencyData] = useState({
    fullName: 'Sarah Watson Bush',
    gender: 'Female',
    email: 'victor.emefo@gmail.com',
    phone: '+234 7099767789',
    relationship: 'Sister',
  });

  const [preferencesData, setPreferencesData] = useState({
    emailNotifications: false,
    pushNotifications: false,
    taskUpdates: false,
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Here you would typically save the data to your backend
    console.log('Saving changes:', { preferencesData });
    setIsEditing(false);
    // You can add success notification here
  };

  const handlePersonalDataChange = (field, value) => {
    setPersonalData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyDataChange = (field, value) => {
    setEmergencyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePreferencesChange = (field) => {
    setPreferencesData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderReadOnlyField = (label, value, fullWidth = false) => (
    <div
      className={`flex flex-col justify-start items-start gap-2 ${fullWidth ? 'col-span-2' : ''}`}
    >
      <div className="text-sm text-gray-600 font-medium">{label}</div>
      <div className="flex justify-start items-center pl-4 rounded-lg w-full h-12 bg-gray-50">
        <div className="text-sm text-gray-600 font-normal">{value}</div>
      </div>
    </div>
  );

  const renderEditableField = (label, value, onChange, required = true, fullWidth = false) => (
    <div
      className={`flex flex-col justify-start items-start gap-2 ${fullWidth ? 'col-span-2' : ''}`}
    >
      <div className="text-sm text-gray-600 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex justify-start items-center pl-4 rounded-lg w-full h-12 border border-gray-300 focus:border-teal-500 focus:outline-none"
        />
      ) : (
        <div className="flex justify-start items-center pl-4 rounded-lg w-full h-12 bg-gray-50">
          <div className="text-sm text-gray-600 font-normal">{value}</div>
        </div>
      )}
    </div>
  );

  const renderToggleSwitch = (isOn, onChange) => (
    <div
      className={`flex items-center cursor-pointer transition-all duration-200 rounded-full w-10 h-5 ${isOn ? 'bg-teal-500' : 'bg-gray-300'} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={isEditing ? onChange : undefined}
    >
      <div
        className={`rounded-full w-4 h-4 shadow bg-white transition-all duration-200 ${isOn ? 'ml-5' : 'ml-0.5'}`}
      ></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">My Profile</div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your personal information and preferences
          </div>
        </div>

        {/* Edit/Save Button */}
        {!isEditing ? (
          <div
            className="flex justify-center items-center rounded-md w-[140px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
            onClick={handleEditToggle}
          >
            <div className="flex flex-row justify-center items-center gap-2">
              <div className="flex justify-center items-center h-5">
                <img
                  width="18.6px"
                  height="18.6px"
                  src="/images/editprofile.png"
                  alt="Edit Profile icon"
                />
              </div>
              <div className="text-sm text-white font-medium">Edit Profile</div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col justify-center items-center rounded-md w-[140px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
            onClick={handleSaveChanges}
          >
            <div className="flex flex-row justify-start items-start gap-2 w-32">
              <div className="flex justify-center items-center w-5 h-5">
                <img className="w-[20px] h-[19.4px]" src="/images/save.png" alt="Save Icon" />
              </div>
              <div className="text-sm text-white font-medium whitespace-nowrap">Save Changes</div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="flex flex-row gap-6 w-full">
        {/* Profile Sidebar */}
        <div className="flex flex-col justify-start items-center rounded-xl w-[300px] shadow-sm bg-white p-6">
          <div className="flex flex-col justify-start items-center gap-8 w-full">
            <div className="flex flex-col justify-start items-center gap-4 w-full">
              <div className="relative w-[140px] h-[140px]">
                <img
                  className="rounded-full w-full h-full object-cover border-4 border-white shadow-md"
                  src="/images/profilepic.png"
                  alt="Profile"
                />
                <div className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md border border-gray-200">
                  <img
                    className="w-7 h-7 object-contain"
                    src="/images/camera.png"
                    alt="Camera icon"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-start items-center gap-1 text-center">
                <div className="text-base text-neutral-900 font-semibold">Victor Emefo</div>
                <div className="text-sm text-gray-600 font-normal">Junior Product Designer</div>
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-3 w-full">
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <div className="flex justify-center items-center w-5 h-5">
                  <img width="19.3px" height="15.1px" src="/images/email.png" alt="Email icon" />
                </div>
                <div className="text-sm text-gray-600 font-normal">{personalData.email}</div>
              </div>
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <div className="flex justify-center items-center w-5 h-5">
                  <img width="17.9px" height="17.9px" src="/images/phonee.png" alt="Phone icon" />
                </div>
                <div className="text-sm text-gray-600 font-normal">{personalData.phone}</div>
              </div>
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <div className="flex justify-center items-center w-5 h-5">
                  <img
                    width="17.9px"
                    height="17.9px"
                    src="/images/calendar2.png"
                    alt="Calendar icon"
                  />
                </div>
                <div className="text-sm text-gray-600 font-normal">
                  Started {personalData.startDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="flex flex-col rounded-xl w-full shadow-sm bg-white">
          {/* Tabs */}
          <div className="flex flex-row justify-center items-center border-b border-slate-100 h-10 bg-slate-50">
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[33%] cursor-pointer border-r border-slate-100 ${
                activeTab === 'personalInfo' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('personalInfo')}
            >
              <div
                className={`text-xs text-neutral-900 tracking-wide ${
                  activeTab === 'personalInfo' ? 'font-semibold' : 'font-medium'
                }`}
              >
                Personal Info
              </div>
            </div>
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[33%] cursor-pointer border-r border-slate-100 ${
                activeTab === 'emergencyInfo' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('emergencyInfo')}
            >
              <div
                className={`text-xs text-neutral-900 tracking-wide ${
                  activeTab === 'emergencyInfo' ? 'font-semibold' : 'font-medium'
                }`}
              >
                Emergency Info
              </div>
            </div>
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[34%] cursor-pointer ${
                activeTab === 'preferences' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              <div
                className={`text-xs text-neutral-900 tracking-wide ${
                  activeTab === 'preferences' ? 'font-semibold' : 'font-medium'
                }`}
              >
                Preferences
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'personalInfo' && (
            <div className="flex flex-col justify-start items-start gap-6 p-6">
              <div className="flex flex-row justify-start items-center gap-2">
                <div className="flex justify-center items-center w-6 h-6">
                  <img
                    width="18px"
                    height="20px"
                    src="/images/personalinfo.png"
                    alt="Personal Info icon"
                  />
                </div>
                <div className="text-base text-neutral-900 font-medium">Personal Info</div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                {renderReadOnlyField('Full Name', personalData.fullName)}
                {renderReadOnlyField('Gender', personalData.gender)}
                {renderReadOnlyField('Email', personalData.email, true)}
                {renderReadOnlyField('Phone Number', personalData.phone, true)}
                {renderReadOnlyField('Address', personalData.address, true)}
                {renderReadOnlyField('Department', personalData.department)}
                {renderReadOnlyField('Position', personalData.position)}
                {renderReadOnlyField('Employee ID', personalData.employeeId)}
                {renderReadOnlyField('Start Date', personalData.startDate)}
              </div>
            </div>
          )}

          {activeTab === 'emergencyInfo' && (
            <div className="flex flex-col justify-start items-start gap-6 p-6">
              <div className="flex flex-row justify-start items-center gap-2">
                <div className="flex justify-center items-center w-6 h-6">
                  <img
                    width="21px"
                    height="21px"
                    src="/images/emergency.png"
                    alt="Emergency Info icon"
                  />
                </div>
                <div className="text-base text-neutral-900 font-medium">Emergency Information</div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                {renderReadOnlyField('Full Name', emergencyData.fullName)}
                {renderReadOnlyField('Gender', emergencyData.gender)}
                {renderReadOnlyField('Email', emergencyData.email, true)}
                {renderReadOnlyField('Phone Number', emergencyData.phone, true)}
                {renderReadOnlyField('Relationship', emergencyData.relationship, true)}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="flex flex-col justify-start items-start gap-6 p-6">
              <div className="flex flex-row justify-start items-center gap-2">
                <div className="flex justify-center items-center w-6 h-6">
                  <img
                    width="19.5px"
                    height="20.2px"
                    src="/images/preferences.png"
                    alt="Security icon"
                  />
                </div>
                <div className="text-base text-neutral-900 font-medium">Security Settings</div>
              </div>

              <div className="flex flex-col justify-start items-start gap-5 w-full">
                {/* Password */}
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="text-sm text-neutral-900 font-medium">
                      Password <span className="text-red-500">*</span>
                    </div>
                    <div
                      className={`flex justify-start items-center pl-4 rounded-lg w-full h-12 ${isEditing ? 'border border-teal-500 bg-white cursor-pointer hover:bg-gray-50' : 'border border-gray-300'}`}
                    >
                      <div className="text-sm text-neutral-900 font-normal">Change password</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-normal">Last changed 3 months ago</div>
                </div>

                {/* Notification Preferences */}
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  <div className="text-base text-neutral-900 font-medium">
                    Notification Preferences
                  </div>
                  <div className="flex flex-col justify-start items-start gap-3 w-full">
                    {/* Email Notifications */}
                    <div className="flex flex-row justify-between items-center w-full py-3">
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-sm text-neutral-900 font-medium">
                          Email Notifications
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          Receive notifications via email
                        </div>
                      </div>
                      <div className="flex items-center h-6">
                        {renderToggleSwitch(preferencesData.emailNotifications, () =>
                          handlePreferencesChange('emailNotifications')
                        )}
                      </div>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex flex-row justify-between items-center w-full py-3">
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-sm text-neutral-900 font-medium">
                          Push Notifications
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          Receive push notifications in browser
                        </div>
                      </div>
                      <div className="flex items-center h-6">
                        {renderToggleSwitch(preferencesData.pushNotifications, () =>
                          handlePreferencesChange('pushNotifications')
                        )}
                      </div>
                    </div>

                    {/* Task Updates */}
                    <div className="flex flex-row justify-between items-center w-full py-3">
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-sm text-neutral-900 font-medium">Task Updates</div>
                        <div className="text-xs text-gray-600 font-normal">
                          Receive notifications for task updates
                        </div>
                      </div>
                      <div className="flex items-center h-6">
                        {renderToggleSwitch(preferencesData.taskUpdates, () =>
                          handlePreferencesChange('taskUpdates')
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  <div className="text-base text-neutral-900 font-medium">Active Sessions</div>
                  <div className="flex flex-col justify-start items-start gap-3 w-full">
                    {/* Current Session */}
                    <div className="flex justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          <div className="text-sm text-neutral-900 font-medium">
                            Current Session
                          </div>
                          <div className="text-xs text-gray-600 font-normal">
                            Chrome on macOS • San Francisco, CA
                          </div>
                        </div>
                        <div className="flex items-center px-3 py-1 rounded-lg bg-green-100">
                          <div className="text-xs text-green-800 font-medium">Active</div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App */}
                    <div className="flex justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          <div className="text-sm text-neutral-900 font-medium">Mobile App</div>
                          <div className="text-xs text-gray-600 font-normal">
                            iOS App • Last active 2 hours ago
                          </div>
                        </div>
                        <div
                          className={`flex items-center px-3 py-1 rounded-md shadow-sm bg-white ${isEditing ? 'hover:bg-red-50 cursor-pointer' : ''}`}
                        >
                          <div className="text-sm text-neutral-900 font-normal">Revoke</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
