import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiClipboard,
  FiLayers,
  FiBriefcase,
  FiUsers,
  FiShield
} from "react-icons/fi";
import SettingsLayout from "./SettingsLayout";
import RolesList from "@components/roles";
import RolesDetails from "@components/roles/RoleDetails";
import { PiListStar } from "react-icons/pi";
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdOutlineFormatListNumbered } from "react-icons/md";
import DocumentCategories from "./Documents/Categories";
import DocumentTypes from "./Documents/DocumentTypes";

const Settings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("roles");

  
  useEffect(() => {
    if (id) {
      setActiveTab("roles");
    }
  }, [id]);

  const tabs = [
    {
      id: "roles",
      label: "Roles & Permissions",
      description: "Manage roles, permissions and access control across the app.",
      icon: <FiShield className="w-5 h-5" />,
      content: id ? <RolesDetails /> : <RolesList />
    },
     {
      id: "document_categories",
      label: "Document Categories",
      description: "Configure document categories and their properties.",
      icon: <MdOutlineFormatListNumbered className="w-5 h-5" />,
      content: <DocumentCategories />
    //   content: <div className="font-roboto">Document Categories</div>
    },
    {
      id: "document_type",
      label: "Document Types",
      description: "Configure document types and their properties.",
      icon: <IoBriefcaseOutline className="w-5 h-5" />,
      content: <DocumentTypes />
    },
    {
      id: "policies",
      label: "Company Policies",
      description: "Create and manage company policies, handbooks and related documents.",
      icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
      content: <div className="font-roboto">Company Policies settings content goes here</div>
    },
    {
      id: "departments",
      label: "Departments",
      description: "Manage departments, department heads and reporting structure.",
      icon: <FiLayers className="w-5 h-5" />,
      content: <div className="font-roboto">Departments settings content goes here</div>
    },
    {
      id: "positions",
      label: "Positions",
      description: "Define positions, levels and position-specific details.",
      icon: <FiBriefcase className="w-5 h-5" />,
      content: <div className="font-roboto">Positions settings content goes here</div>
    },
    {
      id: "leave",
      label: "Leave Policies",
      description: "Configure leave types, accrual rules and approval flows.",
      icon: <FiUsers className="w-5 h-5" />,
      content: <div className="font-roboto">Leave Policies settings content goes here</div>
    },
   
    
  ];

  const activeTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "roles" && id) {
      navigate("/dashboard/settings");
    }
  };

  return (
    <SettingsLayout>
      <div className="flex gap-4 w-full">
       
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 w-1/4 min-h-screen">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Settings
            </h2>
          </div>
          <div className="flex flex-col space-y-5 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors font-inter
                ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

      
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 w-3/4 font-roboto">
       
          {!id ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 font-montserrat">
                {activeTabObj.icon}
                {activeTabObj.label}
              </h2>
              <p className="text-gray-600 font-poppins">{activeTabObj.description}</p>
            </div>
          ) : (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 font-montserrat">
                {activeTabObj.icon}
                Edit Role Permissions
              </h2>
              <p className="text-gray-600 font-poppins">
                Configure specific permissions for this role
              </p>
            </div>
          )}

          
          {activeTabObj.content}
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Settings;