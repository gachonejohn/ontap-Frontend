import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiChevronLeft, FiUser, FiMapPin, FiBriefcase, FiFileText, FiUsers } from 'react-icons/fi';
import { PersonalInfoStep } from './steps/personalInfo';
import { addressSchema, documentsSchema, employmentSchema, personalInfoSchema } from '@schemas/onboarding/createEmployeeSchema';
import { AddressStep } from './steps/address';
import { EmploymentStep } from './steps/employment';
import { DocumentsStep } from './steps/document';
import { useNavigate } from 'react-router-dom';

export default function CreateEmployeeWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const tabsRef = useRef(null);
  const navigate = useNavigate();

  // Define steps configuration with icons
  const steps = [
    {
      id: 1,
      title: 'Personal Info',
      icon: FiUser,
      component: PersonalInfoStep,
      schema: personalInfoSchema
    },
    {
      id: 2,
      title: 'Employment',
      icon: FiBriefcase,
      component: EmploymentStep,
      schema: employmentSchema
    },
    {
      id: 3,
      title: 'Bank Details',
      icon: FiFileText,
      component: AddressStep,
      schema: addressSchema
    },
    {
      id: 4,
      title: 'Payroll',
      icon: FiFileText,
      component: DocumentsStep,
      schema: documentsSchema
    },
    {
      id: 5,
      title: 'Assets',
      icon: FiFileText,
      component: DocumentsStep,
      schema: documentsSchema
    },
    {
      id: 6,
      title: 'Documents',
      icon: FiFileText,
      component: DocumentsStep,
      schema: documentsSchema
    },
    {
      id: 7,
      title: 'Emergency',
      icon: FiUsers,
      component: DocumentsStep,
      schema: documentsSchema
    }
  ];

  const currentStepData = steps.find(step => step.id === currentStep);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(currentStepData.schema),
    defaultValues: formData
  });

  const onNext = async (data) => {
    setFormData({ ...formData, ...data });
    
    if (currentStep === steps.length) {
      const finalData = { ...formData, ...data };
      console.log('Final submission:', finalData);
      alert('Employee created successfully!');
      // navigate('/dashboard/employees');
    } else {
      setCurrentStep(currentStep + 1);
      setTimeout(() => scrollToTab(currentStep + 1), 100);
    }
  };

  const onBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(() => scrollToTab(currentStep - 1), 100);
    }
  };

  const scrollToTab = (stepId) => {
    const tabElement = document.querySelector(`[data-step-id="${stepId}"]`);
    if (tabElement && tabsRef.current) {
      const container = tabsRef.current;
      const tabLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      
      // Calculate if tab is visible
      const tabRight = tabLeft + tabWidth;
      const visibleLeft = scrollLeft;
      const visibleRight = scrollLeft + containerWidth;
      
      // Only scroll if tab is not fully visible
      if (tabLeft < visibleLeft || tabRight > visibleRight) {
        container.scrollTo({
          left: tabLeft - (containerWidth / 2) + (tabWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  };

 
  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleTabClick = (stepId) => {
    setCurrentStep(stepId);
    setTimeout(() => scrollToTab(stepId), 50);
  };

  const onCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All progress will be lost.')) {
      // navigate('/dashboard/employees');
      alert('Cancelled');
    }
  };

  const CurrentStepComponent = currentStepData.component;
  const CurrentIcon = currentStepData.icon;

  return (
    <div className=" font-inter p-4">
      <div className="flex items-center justify-between border-b pb-4">

      
      <button
        onClick={onCancel}
        className="flex items-center px-4 py-2 bg-white border rounded-md text-gray-600 hover:text-gray-800"
      >
        <FiChevronLeft size={20} />
        <span>Back to Employees</span>
      </button>

      <div className="text-center">
        <h1 className="text-xl font-bold font-montserrat">Add New Employee</h1>
        <p className="text-sm text-gray-600">Fill in all required employee details</p>
      </div>

      
      <button
        onClick={handleSubmit(onNext)}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all"
      >
        Create Employee
      </button>

    </div>
   
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          
          <div className="border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3 px-6 py-3">
             
              <button
                onClick={scrollLeft}
                className="p-2 rounded-lg transition-all text-gray-600 hover:bg-gray-100 flex-shrink-0"
                aria-label="Scroll tabs left"
              >
                <FiChevronLeft size={20} />
              </button>

          
              <div 
                ref={tabsRef}
                className="flex overflow-x-auto scroll-smooth flex-1"
                style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                
                <style>{`
                  div[class*="overflow-x-auto"]::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = currentStep > step.id;
                  
                  return (
                    <button
                      key={step.id}
                      data-step-id={step.id}
                      onClick={() => handleTabClick(step.id)}
                      className={`flex items-center gap-2 px-6 py-4  transition-all whitespace-nowrap 
                       ${
                        isActive
                          ? 'border-primary text-primary bg-primary/5'
                         
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }
                          `}
                      // className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap 
                      // ${
                      //   isActive
                      //     ? 'border-primary text-primary bg-primary/5'
                      //     : isCompleted
                      //     ? 'border-green-500 text-green-600'
                      //     : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      // }
                      // `}
                    >
                      <StepIcon size={18} />
                      <span className="text-sm font-medium">{step.title}</span>
                    </button>
                  );
                })}
              </div>
              
         
              <button
                onClick={scrollRight}
                className="p-2 rounded-lg transition-all text-gray-600 hover:bg-gray-100 flex-shrink-0"
                aria-label="Scroll tabs right"
              >
                <FiChevronLeft size={20} className="rotate-180" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <CurrentStepComponent register={register} errors={errors} />
          </div>

       
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
            <button
              type="button"
              onClick={onBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiChevronLeft size={18} />
              Previous
            </button>

            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>

            <button
              type="button"
              onClick={handleSubmit(onNext)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-all"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
              {currentStep < steps.length && <FiChevronLeft size={18} className="rotate-180" />}
            </button>
          </div>
        </div>
      
    </div>
  );
}