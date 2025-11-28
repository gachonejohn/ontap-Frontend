import { useEffect, useState } from "react";
import {
  FiBriefcase,
  FiCoffee,
  FiLayers,
  FiSettings,
  FiShield,
  FiSliders,
  FiUsers,
  FiChevronDown,
    FiMenu,
  FiX,
} from "react-icons/fi";
import { MdOutlineAccessTime } from "react-icons/md";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoBriefcaseOutline } from "react-icons/io5";
import { MdOutlineFormatListNumbered } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

import RolesList from "@components/roles";
import RolesDetails from "@components/roles/RoleDetails";
import DocumentCategories from "./Documents/Categories";
import DocumentTypes from "./Documents/DocumentTypes";
import SettingsLayout from "./SettingsLayout";
import AttendancePolicies from "./Policies/attendance";
import BreakCategories from "./Policies/breaks/Categories";
import BreakPolicies from "./Policies/breaks/rules";
import LeavePolicies from "./Leave";
import BreakTypeRuleAssignments from "./Policies/breaks/rulesAssignments";
import Departments from "./departments";
import Positions from "./positions";

const Settings = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("departments");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    if (id) setActiveTab("roles");
  }, [id]);

 
  const groupedTabs = [
    {
      label: "Organization",
      icon: <FiLayers className="text-sm" />,
      items: [
        {
          id: "departments",
          label: "Departments",
          description: "Manage company departments and reporting structure.",
          icon: <FiLayers className="text-sm" />,
          content: <Departments />,
        },
        {
          id: "positions",
          label: "Positions",
          description: "Define job titles, ranks, and structure.",
          icon: <FiBriefcase className="text-sm" />,
          content: <Positions />,
        },
      ],
    },
    {
      label: "Documents",
      icon: <IoBriefcaseOutline className="text-sm" />,
      items: [
        {
          id: "document_categories",
          label: "Document Categories",
          description: "Organize document categories.",
          icon: <MdOutlineFormatListNumbered className="text-sm" />,
          content: <DocumentCategories />,
        },
        {
          id: "document_type",
          label: "Document Types",
          description: "Configure document types and templates.",
          icon: <IoBriefcaseOutline className="text-sm" />,
          content: <DocumentTypes />,
        },
      ],
    },
    {
      label: "Breaks",
      icon: <FiCoffee className="text-sm" />,
      items: [
        {
          id: "break_types",
          label: "Break Types",
          description: "Manage break categories (Tea, Lunch, etc.).",
          icon: <FiCoffee className="text-sm" />,
          content: <BreakCategories />,
        },
        
        // {
        //   id: "break_limits",
        //   label: "Break Types Policy Assignments",
        //   description: "Set per-break duration limits.",
        //   icon: <FiSliders className="text-sm" />,
        //   content: <BreakTypeRuleAssignments />,
        // },
      ],
    },
    {
      label: "Access",
      icon: <FiShield className="text-sm" />,
      items: [
        {
          id: "roles",
          label: "Roles & Permissions",
          description: "Manage user roles and permissions.",
          icon: <FiShield className="text-sm" />,
          content: id ? <RolesDetails /> : <RolesList />,
        },
      ],
    },
    {
      label: "Policies",
      icon: <HiOutlineClipboardDocumentList className="text-sm" />,
      items: [
        {
          id: "company_policies",
          label: "Company Policies",
          description: "Manage global company policies.",
          icon: <HiOutlineClipboardDocumentList className="text-sm" />,
          content: <div>Company policies content goes here</div>,
        },
        {
          id: "leave",
          label: "Leave Policies",
          description: "Configure leave rules and entitlements.",
          icon: <FiUsers className="text-sm" />,
          content: <LeavePolicies />,
        },
        {
          id: "break_policies",
          label: "Break Policies",
          description: "Define company break policies.",
          icon: <FiSettings className="text-sm" />,
          content: <BreakPolicies />
        },
        {
          id: "attendace_policies",
          label: "Attendance Policies",
          description: "Define company attendance policies.",
          icon: <MdOutlineAccessTime className="text-sm" />,
          content: <AttendancePolicies />,
        },
      ],
    },
  ];

  const allTabs = groupedTabs.flatMap((g) => g.items);
  const activeTabObj = allTabs.find((t) => t.id === activeTab) || allTabs[0];

  // const handleTabChange = (tabId) => {
  //   setActiveTab(tabId);
  //   setOpenDropdown(null);
  //   if (tabId !== "roles" && id) navigate("/dashboard/settings");
  // };
 const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setOpenDropdown(null);
    setMobileMenuOpen(false);
    if (tabId !== "roles" && id) navigate("/dashboard/settings");
  };


  useEffect(() => {
    const close = () => setOpenDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <SettingsLayout>
      <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200">
<div className="flex justify-between items-center p-3 border-b md:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
        <div
          className="hidden md:flex items-center gap-2 px-4 overflow-x-auto bg-gray-50 border-b border-gray-200"
          style={{ overflow: "visible" }} 
        >
          {groupedTabs.map((group) => (
            
            <div
              key={group.label}
              className="relative"
              onClick={(e) => e.stopPropagation()} 
            >
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === group.label ? null : group.label)
                }
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-md transition-all duration-200 ${
                  openDropdown === group.label ||
                  group.items.some((i) => i.id === activeTab)
                    ? "text-primary border-b-2 border-primary bg-white"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {group.icon}
                <span>{group.label}</span>
                <FiChevronDown
                  className={`text-sm transition-transform ${
                    openDropdown === group.label ? "rotate-180" : ""
                  }`}
                />
              </button>

         
              {openDropdown === group.label && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 mt-2
                   bg-white border w-full border-gray-200 rounded-md shadow-lg z-50 min-w-67.5"
                >
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      className={`flex w-full min-w-67.5 items-center gap-2 px-4 py-2 text-sm text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

{/* Mobile Menu */}
{mobileMenuOpen && (
  <div
    className="flex flex-col md:hidden bg-gray-50 max-h-[90vh] border-b z-50 relative"
    onClick={(e) => e.stopPropagation()} 
  >
    {groupedTabs.map((group) => (
      <>
      <div key={group.label} className="border-b relative">
        <button
          onClick={() =>
            setOpenDropdown(openDropdown === group.label ? null : group.label)
          }
          className="w-full flex justify-between items-center px-4 py-3 font-semibold text-gray-800"
        >
          <span className="flex items-center gap-2">
            {group.icon}
            {group.label}
          </span>
          <FiChevronDown
            className={`transition-transform ${
              openDropdown === group.label ? "rotate-180" : ""
            }`}
          />
        </button>

        {openDropdown === group.label && (
          <div
            className="bg-white shadow-inner border-t border-gray-200 z-50"
            onClick={(e) => e.stopPropagation()}  
          >
            {group.items.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full text-left px-8 py-2 text-sm flex items-center gap-2 ${
                  activeTab === item.id
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      </>
    ))}
  </div>
)}

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2 font-montserrat">
              {activeTabObj.icon}
              {activeTabObj.label}
            </h2>
            <p className="text-gray-600 font-poppins">{activeTabObj.description}</p>
          </div>

          <div className="mt-4">{activeTabObj.content}</div>
        </div>
      </div>
   

    </SettingsLayout>
  );
};

export default Settings;
