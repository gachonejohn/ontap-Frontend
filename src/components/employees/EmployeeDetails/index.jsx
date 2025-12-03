import { useState } from 'react';
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiDownload,
  FiMail,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetEmployeeDetailsQuery } from '../../../store/services/employees/employeesService';
import { YearMonthCustomDate } from '../../../utils/dates';
import ContentSpinner from '../../common/spinners/dataLoadingSpinner';
import { Documents } from '../Documents';
import EmployeeLayoutWrapper from '../EmployeeLayoutWrapper';
import { ContractsDetails } from '../contract';
import { EducationHistory } from './educationInfo';
import { PaymentMethodDetails } from './payments';
import { PersonalDetails } from './personalInfo';
import { EmergencyContacts } from './personalInfo/EmergencyContact';
import EditProfilePicture from './personalInfo/UpdateProfilePic';
import { StatutoryInfo } from './statutoryInfo';
import { WorkDetails } from './workInfo/WorkDetails';
import { SystemAccess } from './accessRights';
import { EmployeeAllowance } from './allowances';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  const { data: employeeData, isLoading, error, refetch } = useGetEmployeeDetailsQuery(id);

  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const getProfilePic = (profilePic) => {
    if (profilePic && !profilePic.startsWith('http')) {
      return `${API_BASE_URL}${profilePic}`;
    }
    return profilePic || defaultProfile;
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FiUser /> },
    { id: 'employment', label: 'Employment Details', icon: <FiBriefcase /> },
    { id: 'documents', label: 'Documents', icon: <FiDownload /> },
    { id: 'education_info', label: 'Education Info', icon: <FiMapPin /> },
    { id: 'system_access', label: 'System Access', icon: <FiShield /> },
  ];

  if (isLoading) {
    return (
      <EmployeeLayoutWrapper>
        <div className="flex justify-center items-center h-64">
          <ContentSpinner />
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  if (error || !employeeData) {
    return (
      <EmployeeLayoutWrapper>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-lg text-gray-600 mb-4">
            {error ? 'Error loading employee details' : 'Employee not found'}
          </div>
          <button
            onClick={() => navigate('/dashboard/employees')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FiArrowLeft />
            Back to Employees
          </button>
        </div>
      </EmployeeLayoutWrapper>
    );
  }
  console.log('Employee Data:', employeeData);
  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <PersonalDetails data={employeeData} refetch={refetch} />
      <EmergencyContacts data={employeeData} refetch={refetch} />
      <StatutoryInfo data={employeeData} refetch={refetch} />
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <WorkDetails data={employeeData} refetch={refetch} />
      <ContractsDetails data={employeeData} refetch={refetch} />
      <EmployeeAllowance data={employeeData} refetch={refetch} />
      <PaymentMethodDetails data={employeeData} refetch={refetch} />
    </div>
  );

  const renderDocuments = () => <Documents data={employeeData} refetch={refetch} />;

  const renderEducationInfo = () => <EducationHistory data={employeeData} refetch={refetch} />;

  const renderSystemAccess = () => <SystemAccess data={employeeData} refetch={refetch} />;

  return (
    <EmployeeLayoutWrapper>
      <div className="w-full flex gap-3 font-inter">
        {/* Sidebar Profile */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3 w-1/4 min-h-screen flex flex-col">
          <div className="flex justify-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 flex items-center justify-center bg-gray-100">
                <img
                  src={getProfilePic(employeeData.user?.profile_picture)}
                  alt={`${employeeData.user?.first_name} ${employeeData.user?.last_name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = defaultProfile;
                  }}
                />
              </div>
              <EditProfilePicture refetchData={refetch} data={employeeData} />
            </div>
          </div>

          <div className="text-center space-y-2 w-full">
            <div className="mb-4">
              <h2 className="text-sm font-semibold font-inter text-gray-900">
                {employeeData.user?.first_name} {employeeData.user?.last_name}
              </h2>
              <p className="text-gray-600 text-sm">
                {employeeData?.position?.title ?? 'No Position Assigned'}
              </p>
            </div>
          </div>

          <div className="space-y-2 w-full">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <FiMail className="text-sm" />
              <span className=" text-[12px]">{employeeData?.user?.email ?? 'No email'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiPhone className="text-sm" />
              <span className="text-[12px]">
                {employeeData.user?.phone_number || 'Not available'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <FiCalendar className="text-sm" />
              <span className=" text-[12px]">
                Started {YearMonthCustomDate(employeeData?.latest_contract?.start_date ?? '')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="bg-white border rounded-lg shadow-sm w-3/4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-6 px-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-xs transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="px-4 py-3">
            {activeTab === 'personal' && renderPersonalDetails()}
            {activeTab === 'employment' && renderEmploymentDetails()}
            {activeTab === 'documents' && renderDocuments()}
            {activeTab === 'education_info' && renderEducationInfo()}
            {activeTab === 'system_access' && renderSystemAccess()}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate('/dashboard/employees')}
          className="flex items-center gap-2 px-6 py-2 bg-primary min-w-[250px] text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Employees
        </button>
      </div>
    </EmployeeLayoutWrapper>
  );
};

export default EmployeeDetails;
