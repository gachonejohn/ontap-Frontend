import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  useGetMyProfileQuery,
  useUpdateProfileMutation 
} from "../../store/services/profile/profileService";
import ChangePasswordModal from "./ChangePasswordModal";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function MyProfileContent({ canEdit, user }) {
  const [activeTab, setActiveTab] = useState('personalInfo');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  
  const { data: apiProfileData } = useGetMyProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const profileData = apiProfileData || user;

  const userId = profileData?.id || profileData?.user?.id || profileData?.employee_profile?.user?.id;
  const userEmail = profileData?.email || profileData?.user?.email || profileData?.employee_profile?.user?.display_email;
  const userFirstName = profileData?.first_name || profileData?.user?.first_name || profileData?.employee_profile?.user?.first_name || "";
  const userLastName = profileData?.last_name || profileData?.user?.last_name || profileData?.employee_profile?.user?.last_name || "";
  const userPhone = profileData?.employee_profile?.user?.display_phone || profileData?.user?.phone_number || profileData?.phone_number || "";
  const userPosition = profileData?.employee_profile?.position || profileData?.user?.position || profileData?.position || "";
  const userProfilePicture = profileData?.employee_profile?.user?.profile_picture || profileData?.user?.profile_picture || profileData?.profile_picture;
  const userDepartment = profileData?.employee_profile?.department_name || profileData?.department?.name || "No department";
  const userGender = profileData?.employee_profile?.user?.gender;
  const employeeId = profileData?.employee_profile?.employee_no;

  const [personalData, setPersonalData] = useState({
    fullName: `${userFirstName} ${userLastName}`.trim(),
    gender: userGender,
    email: userEmail,
    phone: userPhone,
    address: "123 Main St",
    department: userDepartment,
    position: userPosition,
    employeeId: employeeId,
    startDate: "2023-08-13"
  });

  useEffect(() => {
    if (profileData) {
      setPersonalData(prev => ({
        ...prev,
        fullName: `${userFirstName} ${userLastName}`.trim(),
        gender: userGender,
        email: userEmail,
        phone: userPhone,
        department: userDepartment,
        position: userPosition,
        employeeId: employeeId,
      }));
    }
  }, [profileData, userFirstName, userLastName, userGender, userEmail, userPhone, userDepartment, userPosition, employeeId]);

  const [emergencyData] = useState({
    fullName: "",
    gender: "",
    email: "",
    phone: "",
    relationship: ""
  });

  const [preferencesData, setPreferencesData] = useState({
    emailNotifications: false,
    pushNotifications: false,
    taskUpdates: false
  });

  const handleEditToggle = () => {
    if (!canEdit) {
      toast.error("You don't have permission to edit your profile");
      return;
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      await updateProfile({
        id: userId,
        first_name: personalData.fullName.split(' ')[0],
        last_name: personalData.fullName.split(' ').slice(1).join(' '),
        phone_number: personalData.phone,
        position: personalData.position,
      }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error?.data?.detail || "Failed to update profile");
    }
  };

  const handlePreferencesChange = (field) => {
    setPreferencesData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleOpenForgotPassword = () => {
    setIsPasswordModalOpen(false);
    setIsForgotPasswordOpen(true);
  };

  const getPasswordChangeTime = () => {
    const lastActive = profileData?.last_active || profileData?.employee_profile?.user?.last_active;
    if (!lastActive) return "Not available";
    
    const lastActiveDate = new Date(lastActive);
    const now = new Date();
    const diffInMs = now - lastActiveDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 1) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  const renderReadOnlyField = (label, value, fullWidth = false) => (
    <div className={`flex flex-col justify-start items-start gap-2 ${fullWidth ? 'col-span-2' : ''}`}>
      <div className="text-sm text-gray-600 font-medium">
        {label}
      </div>
      <div className="flex justify-start items-center pl-4 rounded-lg w-full h-12 bg-gray-50">
        <div className="text-sm text-gray-600 font-normal">
          {value}
        </div>
      </div>
    </div>
  );

  const renderToggleSwitch = (isOn, onChange) => (
    <div
      className={`flex items-center cursor-pointer transition-all duration-200 rounded-full w-10 h-5 ${isOn ? 'bg-teal-500' : 'bg-gray-300'} ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
      onClick={isEditing ? onChange : undefined}
    >
      <div className={`rounded-full w-4 h-4 shadow bg-white transition-all duration-200 ${isOn ? 'ml-5' : 'ml-0.5'}`}></div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            My Profile
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your personal information and preferences
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-row gap-6 w-full">
        {/* Profile Sidebar */}
        <div className="flex flex-col justify-start items-center rounded-xl w-[300px] shadow-sm bg-white p-6">
          <div className="flex flex-col justify-start items-center gap-8 w-full">
            <div className="flex flex-col justify-start items-center gap-4 w-full">
              <div className="relative w-[140px] h-[140px]">
                {userProfilePicture ? (
                  <img
                    className="rounded-full w-full h-full object-cover border-4 border-white shadow-md"
                    src={userProfilePicture}
                    alt="Profile"
                  />
                ) : (
                  <div className="rounded-full w-full h-full flex items-center justify-center bg-teal-100 border-4 border-white shadow-md">
                    <span className="text-4xl font-semibold text-teal-600">
                      {userFirstName?.[0]}{userLastName?.[0]}
                    </span>
                  </div>
                )}
                
              </div>

              <div className="flex flex-col justify-start items-center gap-1 text-center">
                <div className="text-base text-neutral-900 font-semibold">
                  {personalData.fullName}
                </div>
                <div className="text-sm text-gray-600 font-normal">
                  {personalData.position}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col justify-start items-start gap-3 w-full">
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <div className="flex justify-center items-center w-5 h-5">
                  <img
                    width="19.3px"
                    height="15.1px"
                    src="/images/email.png"
                    alt="Email icon"
                  />
                </div>
                <div className="text-sm text-gray-600 font-normal">
                  {personalData.email}
                </div>
              </div>
              <div className="flex flex-row justify-start items-center gap-2 w-full">
                <div className="flex justify-center items-center w-5 h-5">
                  <img
                    width="17.9px"
                    height="17.9px"
                    src="/images/phonee.png"
                    alt="Phone icon"
                  />
                </div>
                <div className="text-sm text-gray-600 font-normal">
                  {personalData.phone}
                </div>
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
          {/* Horizontal Tabs */}
          <div className="flex flex-row justify-center items-center border-b border-slate-100 h-10 bg-slate-50">
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[33%] cursor-pointer border-r border-slate-100 ${
                activeTab === 'personalInfo' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('personalInfo')}
            >
              <div className={`text-xs text-neutral-900 tracking-wide ${
                activeTab === 'personalInfo' ? 'font-semibold' : 'font-medium'
              }`}>
                Personal Info
              </div>
            </div>
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[33%] cursor-pointer border-r border-slate-100 ${
                activeTab === 'emergencyInfo' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('emergencyInfo')}
            >
              <div className={`text-xs text-neutral-900 tracking-wide ${
                activeTab === 'emergencyInfo' ? 'font-semibold' : 'font-medium'
              }`}>
                Emergency Info
              </div>
            </div>
            <div
              className={`flex flex-row justify-center items-center h-10 min-w-[33%] cursor-pointer ${
                activeTab === 'preferences' ? 'bg-white' : 'hover:bg-gray-50 transition-colors'
              }`}
              onClick={() => setActiveTab('preferences')}
            >
              <div className={`text-xs text-neutral-900 tracking-wide ${
                activeTab === 'preferences' ? 'font-semibold' : 'font-medium'
              }`}>
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
                    width="21px"
                    height="21px"
                    src="/images/personalinfo.png"
                    alt="Personal Info icon"
                  />
                </div>
                <div className="text-base text-neutral-900 font-medium">
                  Personal Information
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                {renderReadOnlyField("Full Name", personalData.fullName)}
                {renderReadOnlyField("Gender", personalData.gender)}
                {renderReadOnlyField("Email", personalData.email, true)}
                {renderReadOnlyField("Phone Number", personalData.phone, true)}
                {renderReadOnlyField("Address", personalData.address, true)}
                {renderReadOnlyField("Department", personalData.department)}
                {renderReadOnlyField("Position", personalData.position)}
                {renderReadOnlyField("Employee ID", personalData.employeeId)}
                {renderReadOnlyField("Start Date", personalData.startDate)}
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
                <div className="text-base text-neutral-900 font-medium">
                  Emergency Information
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 w-full">
                {renderReadOnlyField("Full Name", emergencyData.fullName || "Not provided")}
                {renderReadOnlyField("Gender", emergencyData.gender || "Not provided")}
                {renderReadOnlyField("Email", emergencyData.email || "Not provided", true)}
                {renderReadOnlyField("Phone Number", emergencyData.phone || "Not provided", true)}
                {renderReadOnlyField("Relationship", emergencyData.relationship || "Not provided", true)}
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
                <div className="text-base text-neutral-900 font-medium">
                  Security Settings
                </div>
              </div>

              <div className="flex flex-col justify-start items-start gap-5 w-full">
                {/* Password */}
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="text-sm text-neutral-900 font-medium">
                      Password <span className="text-red-500">*</span>
                    </div>
                    <div 
                      onClick={() => canEdit && setIsPasswordModalOpen(true)}
                      className={`flex justify-start items-center pl-4 rounded-lg w-full h-12 ${canEdit ? 'border border-teal-500 bg-white cursor-pointer hover:bg-gray-50' : 'border border-gray-300 bg-gray-50'}`}
                    >
                      <div className="text-sm text-neutral-900 font-normal">
                        Change password
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 font-normal">
                    Last changed {getPasswordChangeTime()}
                  </div>
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
                        {renderToggleSwitch(preferencesData.emailNotifications, () => handlePreferencesChange('emailNotifications'))}
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
                        {renderToggleSwitch(preferencesData.pushNotifications, () => handlePreferencesChange('pushNotifications'))}
                      </div>
                    </div>

                    {/* Task Updates */}
                    <div className="flex flex-row justify-between items-center w-full py-3">
                      <div className="flex flex-col justify-start items-start gap-0.5">
                        <div className="text-sm text-neutral-900 font-medium">
                          Task Updates
                        </div>
                        <div className="text-xs text-gray-600 font-normal">
                          Receive notifications for task updates
                        </div>
                      </div>
                      <div className="flex items-center h-6">
                        {renderToggleSwitch(preferencesData.taskUpdates, () => handlePreferencesChange('taskUpdates'))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="flex flex-col justify-start items-start gap-4 w-full">
                  <div className="text-base text-neutral-900 font-medium">
                    Active Sessions
                  </div>
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
                          <div className="text-xs text-green-800 font-medium">
                            Active
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile App */}
                    <div className="flex justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col justify-start items-start gap-0.5">
                          <div className="text-sm text-neutral-900 font-medium">
                            Mobile App
                          </div>
                          <div className="text-xs text-gray-600 font-normal">
                            iOS App • Last active 2 hours ago
                          </div>
                        </div>
                        <div className={`flex items-center px-3 py-1 rounded-md shadow-sm bg-white ${isEditing && canEdit ? 'hover:bg-red-50 cursor-pointer' : ''}`}>
                          <div className="text-sm text-neutral-900 font-normal">
                            Revoke
                          </div>
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

      {/* Change Password Modal */}
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onForgotPassword={handleOpenForgotPassword}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}