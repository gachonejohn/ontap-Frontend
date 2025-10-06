
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
    FiBriefcase,
    FiChevronLeft,
    FiChevronRight,
    FiFileText,
    FiUser,
    FiUserPlus,
    FiX
} from "react-icons/fi";


import { completeEmployeeSchema } from "../../../schemas/employees/OnboardingSchema";
import { useGetDepartmentsQuery, useGetPositionsQuery, useGetPropertiesQuery } from "../../../store/services/companies/companiesService";
import { useCreateEmployeeMutation } from "../../../store/services/employees/employeesService";
import { useGetRolesQuery } from "../../../store/services/roles/rolesService";
import DocumentsTab from "./tabs/Documents";
import EmergencyContactTab from "./tabs/EmergencyDetails";
import EmploymentDetailsTab from "./tabs/EmploymentDetails";
import NextOfKinTab from "./tabs/NextOfKin";
import PaymentMethodDetails from "./tabs/PaymentMethodDetails";
import PersonalDetailsTab from "./tabs/PersonalInfo";
import PropertiesTab from "./tabs/PropertiesComponent";



export const CreateEmployeeMultiStep = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
    const {data:positionsData} = useGetPositionsQuery({},{refetchOnMountOrArgChange: true})
    const {data:rolesData} = useGetRolesQuery({},{refetchOnMountOrArgChange: true})
    const {data:departmentsData} = useGetDepartmentsQuery({},{refetchOnMountOrArgChange: true})
    const {data:propertiesData} = useGetPropertiesQuery({},{refetchOnMountOrArgChange: true})
    const [createEmployee, {isLoading:isCreating}] = useCreateEmployeeMutation();
  // Only documents remain as array
  const [documents, setDocuments] = useState([]);

  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(completeEmployeeSchema),
  });

  const tabs = [
    { id: 0, name: "Personal Details", icon: FiUser },
    { id: 1, name: "Employment Details", icon: FiBriefcase },
    { id: 2, name: "Documents", icon: FiFileText },
  ];

const onSubmit = async (formData) => {
  setIsSubmitting(true);
  try {
    // Build FormData directly - no intermediate object
    const fd = new FormData();

    // Append basic employee fields
    fd.append("first_name", formData.first_name);
    fd.append("last_name", formData.last_name);
    fd.append("phone_number", formData.phone_number);
    fd.append("email", formData.email);
    
    // Optional fields - only append if they exist
    if (formData.employee_no) fd.append("employee_no", formData.employee_no);
    if (formData.department_id) fd.append("department_id", formData.department_id);
    if (formData.position_id) fd.append("position_id", formData.position_id);
    if (formData.role_id) fd.append("role_id", formData.role_id);

    // Next of kin - fix the structure
    if (formData.next_of_kin?.full_name && formData.next_of_kin?.phone_number && formData.next_of_kin?.relationship) {
      fd.append("next_of_kin[0][full_name]", formData.next_of_kin.full_name);
      fd.append("next_of_kin[0][phone_number]", formData.next_of_kin.phone_number);
      fd.append("next_of_kin[0][relationship]", formData.next_of_kin.relationship);
      
      // Optional next of kin fields
      if (formData.next_of_kin.email) {
        fd.append("next_of_kin[0][email]", formData.next_of_kin.email);
      }
      if (formData.next_of_kin.address) {
        fd.append("next_of_kin[0][address]", formData.next_of_kin.address);
      }
    }

    // Emergency contacts - fix the structure
    if (formData.emergency_contact?.name && formData.emergency_contact?.phone && formData.emergency_contact?.relationship) {
      fd.append("emergency_contacts[0][name]", formData.emergency_contact.name);
      fd.append("emergency_contacts[0][phone]", formData.emergency_contact.phone);
      fd.append("emergency_contacts[0][relationship]", formData.emergency_contact.relationship);
      
      // Optional emergency contact fields
      if (formData.emergency_contact.address) {
        fd.append("emergency_contacts[0][address]", formData.emergency_contact.address);
      }
    }

    // Contracts - fix the structure and ensure required fields
    if (formData.contract?.start_date && formData.contract?.work_location) {
      fd.append("contracts[0][start_date]", formData.contract.start_date);
      fd.append("contracts[0][work_location]", formData.contract.work_location);
      
      // Optional contract fields
      if (formData.contract.end_date) {
        fd.append("contracts[0][end_date]", formData.contract.end_date);
      }
      if (formData.contract.basic_salary) {
        fd.append("contracts[0][basic_salary]", formData.contract.basic_salary);
      }
      if (formData.contract.salary_currency) {
        fd.append("contracts[0][salary_currency]", formData.contract.salary_currency);
      }
      if (formData.contract.contract_type) {
        fd.append("contracts[0][contract_type]", formData.contract.contract_type);
      }
      if (formData.contract.reporting_to) {
        fd.append("contracts[0][reporting_to]", formData.contract.reporting_to);
      }
    }

    // Payment method
    if (formData.payment?.method) {
      fd.append("payment_method[0][method]", formData.payment.method);
      
      // Optional payment fields
      if (formData.payment.account_number) {
        fd.append("payment_method[0][account_number]", formData.payment.account_number);
      }
      if (formData.payment.bank_name) {
        fd.append("payment_method[0][bank_name]", formData.payment.bank_name);
      }
      if (formData.payment.mobile_number) {
        fd.append("payment_method[0][mobile_number]", formData.payment.mobile_number);
      }
      if (formData.payment.notes) {
        fd.append("payment_method[0][notes]", formData.payment.notes);
      }
      if (formData.payment.is_primary) {
        fd.append("payment_method[0][is_primary]", formData.payment.is_primary);
      }
    }

    // Properties
    if (formData.property?.property_id) {
      fd.append("properties[0][property_id]", formData.property.property_id);
      
      // Optional property fields
      if (formData.property.issue_date) {
        fd.append("properties[0][issue_date]", formData.property.issue_date);
      }
      if (formData.property.return_date) {
        fd.append("properties[0][return_date]", formData.property.return_date);
      }
      if (formData.property.condition_on_issue) {
        fd.append("properties[0][condition_on_issue]", formData.property.condition_on_issue);
      }
      if (formData.property.condition_on_return) {
        fd.append("properties[0][condition_on_return]", formData.property.condition_on_return);
      }
    }

    // Documents - fix the structure and ensure required fields
    documents.forEach((doc, index) => {
      // Only include documents that have both required fields
      if (doc.document_type && doc.file instanceof File) {
        fd.append(`documents[${index}][document_type]`, doc.document_type);
        fd.append(`documents[${index}][file]`, doc.file);
        
        // Optional document fields
        if (doc.expiry_date) {
          fd.append(`documents[${index}][expiry_date]`, doc.expiry_date);
        }
        if (doc.description) {
          fd.append(`documents[${index}][description]`, doc.description);
        }
      }
    });

    console.log("FormData entries:");
    for (let [key, value] of fd.entries()) {
      console.log(key, value);
    }

    // Call API with FormData
    const res = await createEmployee(fd).unwrap();
    console.log("res", res);

    toast.success("Employee created successfully!");
    handleCloseModal();
    if (refetchData) refetchData();
  } catch (error) {
    console.error("Error:", error);
    toast.error(error?.data?.detail || error?.data?.error || "An error occurred. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const handleOpenModal = () => setIsOpen(true);

  const handleCloseModal = () => {
    reset();
    setDocuments([]);
    setCurrentTab(0);
    setIsOpen(false);
  };

  const nextTab = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const prevTab = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <>
            <div className="mb-6">
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-2">Personal Information</h3> */}
              <PersonalDetailsTab
                register={register}
                errors={errors}
                setValue={setValue}
                rolesData={rolesData}
                departmentsData={departmentsData}
                positionsData={positionsData}
              />
            </div>

            <div className="mb-5">
              <h3 className="text-sm font-semibold pb-2 border-b border-gray-300 mb-2">
                Next of Kin
              </h3>
              <NextOfKinTab register={register} setValue={setValue} errors={errors} />
            </div>

            <div className="mb-5">
              <h3 className="text-sm font-semibold pb-2 border-b border-gray-300 mb-2">
                Emergency Contact
              </h3>
              <EmergencyContactTab register={register} setValue={setValue} errors={errors} />
            </div>
          </>
        );

      case 1: // Employment Details (with Properties)
        return (
          <>
            <div className="mb-6">
              {/* <h3 className="text-lg font-semibold text-gray-700 mb-2">Employment Details</h3> */}
              <EmploymentDetailsTab
                register={register}
                errors={errors}
                setValue={setValue}
              />
              <PaymentMethodDetails
                register={register}
                errors={errors}
                setValue={setValue}
              />

            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold  mb-2 border-b pb-2 border-gray-300 font-montserrat">
                Property Details
              </h3>
              <PropertiesTab
                register={register}
                errors={errors}
                setValue={setValue}
                propertiesData={propertiesData}
              />
            </div>
          </>
        );

      case 2: // Documents
        return (
          <div className="mb-6">
            {/* <h3 className="text-sm font-semibold  mb-2">
              Documents
            </h3> */}
            <DocumentsTab documents={documents} setDocuments={setDocuments} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        title="Add New Employee"
        className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 
                   transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <FiUserPlus className="w-4 h-4" />
        <span>New Employee</span>
      </button>

      {isOpen && (
        <div className="relative z-50 animate-fadeIn" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Modal wrapper */}
          <div className="fixed inset-0 min-h-full flex items-center justify-center p-2 md:p-4 z-50">
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-md shadow-xl w-full max-w-c-500 
                         max-h-[90vh] flex flex-col overflow-hidden animate-slideIn"
            >
              {/* Sticky Header */}
              <div className="sticky top-0 bg-white z-40 flex justify-between items-center px-4 py-4 border-b">
                <h2 className="text-lg md:text-xl font-semibold">New Employee</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Tabs Navigation */}
               <div className="px-4 mt-2">
                <nav className="flex gap-2 w-full rounded-md bg-[#f8f8fa] min-h-[40px]   ">
                  {tabs.map((tab, index) => {
                    // const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setCurrentTab(index)}
                        className={`flex items-center w-full min-h-[40px] space-x-2 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          currentTab === index
                            ? "bg-white/50 text-gray-900 shadow"
                            : "bg-transparent text-gray-600 hover:text-gray-800 hover:bg-[#f8f8fa]"
                        }`}
                      >
                        {/* <Icon className="w-4 h-4" /> */}
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Scrollable Form Content */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex-1 overflow-y-auto px-4 py-3"
              >
                {renderTabContent()}
                <div className="sticky bottom-0 bg-white z-30 flex justify-between items-center px-4 py-3 border-t">
                {currentTab > 0 ? (
                  <button
                    type="button"
                    onClick={prevTab}
                    className="flex items-center gap-2 h-10 px-4 text-sm text-gray-600 
                               border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                ) : (
                  <div />
                )}

                {currentTab < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={nextTab}
                    className="flex items-center gap-2 h-10 px-4 text-sm bg-primary text-white rounded-md "
                  >
                    Next
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 h-10 px-6 text-sm bg-primary text-white rounded-md 
                                disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Creating...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                )}
              </div>
              </form>

              {/* Sticky Footer */}
              
            </div>
          </div>
        </div>
      )}
    </>
  );
};