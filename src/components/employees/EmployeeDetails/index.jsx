import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import {
  FiArrowLeft,
  FiEdit,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiMapPin,
  FiEye,
  FiDownload,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import ContentSpinner from "../../common/spinners/dataLoadingSpinner";
import { CustomDate, YearMonthCustomDate } from "../../../utils/dates";
import EmployeeLayoutWrapper from "../EmployeeLayoutWrapper";
import { useGetEmployeeDetailsQuery } from "../../../store/services/employees/employeesService";
import AddDocument from "../Documents/Upload";
import { CreateContract } from "../contract/AddContract";
import { CreateEmployeePaymentMethodDetails } from "./payments/CreatePaymentMethod";
import { NewEmployeeEmergencyContact } from "./personalInfo/CreateEmergencyContact";
import { PersonalDetails } from "./personalInfo";
import { EmergencyContacts } from "./personalInfo/EmergencyContact";
import { WorkDetails } from "./workInfo/WorkDetails";
import { ContractsDetails } from "../contract";
import { PaymentMethodDetails } from "./payments";
import { Documents } from "../Documents";
import EditProfilePicture from "./personalInfo/UpdateProfilePic";
import { StatutoryInfo } from "./statutoryInfo";
import { EducationHistory } from "./educationInfo";

const EmployeeDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");

  const {
    data: employeeData,
    isLoading,
    error,
    refetch,
  } = useGetEmployeeDetailsQuery(id);
  console.log("employeeData", employeeData);
  const defaultProfile = "/images/avatar/default-avatar.jpg";
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const getProfilePic = (profilePic) => {
    if (profilePic && !profilePic.startsWith("http")) {
      return `${API_BASE_URL}${profilePic}`;
    }
    return profilePic || defaultProfile;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-500 border-green-500";
      case "INACTIVE":
        return "bg-red-100 text-red-500 border-red-500";
      case "ON_LEAVE":
        return "bg-yellow-100 text-yellow-500 border-yellow-500";
      case "SUSPENDED":
      case "TERMINATED":
      case "RESIGNED":
        return "bg-gray-100 text-gray-500 border-gray-500";
      default:
        return "bg-gray-100 text-gray-500 border-gray-500";
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "employment", label: "Employment Details" },
    { id: "documents", label: "Documents " },
    { id: "education_info", label: "Education Info" },
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
            {error ? "Error loading employee details" : "Employee not found"}
          </div>
          <button
            onClick={() => navigate("/dashboard/employees")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FiArrowLeft />
            Back to Employees
          </button>
        </div>
      </EmployeeLayoutWrapper>
    );
  }

  //   const customTitle = `${employeeData.user?.first_name || ''} ${employeeData.user?.last_name || ''}`;
  //   const customDescription = `Employee #${employeeData.employee_no || 'N/A'} - ${employeeData.position?.title || 'N/A'}`;

  //   const customActions = (
  //     <div className="flex items-center gap-3">
  //       <button
  //         onClick={() => navigate("/dashboard/employees")}
  //         className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
  //       >
  //         <FiArrowLeft className="text-lg" />
  //       </button>
  //       <button className="flex justify-center items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm hover:bg-primary/90 transition-colors">
  //         <FiEdit className="h-4 w-4" />
  //         Edit Profile
  //       </button>
  //     </div>
  //   );

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      {/* Personal Details Section */}
      <PersonalDetails data={employeeData} refetch={refetch} />

      {/* Emergency Information Section */}
      <EmergencyContacts data={employeeData} refetch={refetch} />
      <StatutoryInfo data={employeeData} refetch={refetch} />
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-6">
      <WorkDetails data={employeeData} refetch={refetch} />
      <ContractsDetails data={employeeData} refetch={refetch} />

      {/* Payment Methods Section */}
      <PaymentMethodDetails data={employeeData} refetch={refetch} />
    </div>
  );

  const renderDocuments = () => (
    <Documents data={employeeData} refetch={refetch} />
  );
 
  const renderEducationInfo = () => (
    <EducationHistory data={employeeData} refetch={refetch} />
  );

  return (
    <EmployeeLayoutWrapper
    //   customTitle={customTitle}
    //   customDescription={customDescription}
    //   customActions={customActions}
    >
      <div className="w-full flex gap-4 ">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 w-1/4 min-h-screen  flex flex-col ">
          {/* Profile Picture */}
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
              {/* <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200">
                <FiEdit className="w-3 h-3 text-gray-600" />
              </div> */}
              <EditProfilePicture refetchData={refetch} data={employeeData} />
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center space-y-2 w-full">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {employeeData.user?.first_name} {employeeData.user?.last_name}
              </h2>
              <p className="text-gray-600">
                {employeeData?.position?.title ?? "No Position Assigned"}
              </p>
            </div>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <FiMail className="w-4 h-4 flex-shrink-0" />
              <span className="break-all w-0 flex-1">
                {employeeData?.user?.email ?? "No  email"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiPhone className="w-4 h-4" />
              <span>{employeeData.user?.phone_number || "Not available"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiCalendar className="w-4 h-4" />
              <span>
                Started{" "}
                {YearMonthCustomDate(
                  employeeData?.latest_contract?.start_date ?? ""
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm w-3/4">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "personal" && renderPersonalDetails()}
            {activeTab === "employment" && renderEmploymentDetails()}
            {activeTab === "education_info" && renderEducationInfo()}
            {activeTab === "documents" && renderDocuments()}
          </div>
        </div>
      </div>

      {/* Back to Employees Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => navigate("/dashboard/employees")}
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
