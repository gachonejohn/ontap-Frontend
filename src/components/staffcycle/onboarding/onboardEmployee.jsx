import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardEmployeeSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import {
  useOnboardEmployeeMutation,
  useGetOnboardingTemplatesQuery,
} from '@store/services/staffcylce/onboardingService';
import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FiUserPlus, FiCalendar } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { BsListCheck } from 'react-icons/bs';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import SubmitSpinner from '@components/common/spinners/submitSpinner';

export const OnboardEmployee = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  // Employee filters
  const {
    filters: employeeFilters,
    currentPage: employeePage,
    handleFilterChange: handleEmployeeFilterChange,
    handlePageChange: handleEmployeePageChange,
  } = useFilters({
    initialFilters: { search: '' },
    initialPage: 1,
    debounceTime: 300,
    debouncedFields: ['search'],
  });

  const {
    filters: coordinatorFilters,
    currentPage: coordinatorPage,
    handleFilterChange: handleCoordinatorFilterChange,
    handlePageChange: handleCoordinatorPageChange,
  } = useFilters({
    initialFilters: { search: '' },
    initialPage: 1,
    debounceTime: 300,
    debouncedFields: ['search'],
  });

 
  const {
    filters: templateFilters,
    currentPage: templatePage,
    handleFilterChange: handleTemplateFilterChange,
    handlePageChange: handleTemplatePageChange,
  } = useFilters({
    initialFilters: { search: '' },
    initialPage: 1,
    debounceTime: 300,
    debouncedFields: ['search'],
  });

  const [onboardEmployee, { isLoading: isCreating }] = useOnboardEmployeeMutation();

  
  const { data: employeesData, isFetching: fetchingEmployees } = useGetEmployeesQuery(
    {
      page: employeePage,
      page_size: PAGE_SIZE,
      search: employeeFilters.search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: coordinatorsData, isFetching: fetchingCoordinators } = useGetEmployeesQuery(
    {
      page: coordinatorPage,
      page_size: PAGE_SIZE,
      search: coordinatorFilters.search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: templatesData, isFetching: fetchingTemplates } = useGetOnboardingTemplatesQuery(
    {
      page: templatePage,
      page_size: PAGE_SIZE,
      search: templateFilters.search,
    },
    { refetchOnMountOrArgChange: true }
  );


  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(onboardEmployeeSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await onboardEmployee(formData).unwrap();
      toast.success('Onboarding Process started successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Error occurred while starting onboarding process.'
      );
      toast.error(message);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setSelectedTemplate(null);
    setIsOpen(false);
  };

  const employeeOptions =
    employeesData?.results?.map((item) => ({
      value: item.id,
      label: `${item.user.first_name} ${item.user.last_name}`,
      department: item.department?.name || 'No Department',
      position: item.position?.title || '',
      image: item.user?.profile_picture || null,
    })) || [];

  const coordinatorOptions =
    coordinatorsData?.results?.map((item) => ({
      value: item.id,
      label: `${item.user.first_name} ${item.user.last_name}`,
      department: item.department?.name || 'No Department',
      position: item.position?.title || '',
      image: item.user?.profile_picture || null,
    })) || [];

  const hasMoreEmployees = employeesData?.count > employeePage * PAGE_SIZE;
  const hasMoreCoordinators = coordinatorsData?.count > coordinatorPage * PAGE_SIZE;
  const hasMoreTemplates = templatesData?.count > templatePage * PAGE_SIZE;

  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '35px',
      borderColor: '#e5e7eb',
      boxShadow: 'none',
      '&:hover': { borderColor: '#d1d5db' },
      backgroundColor: '#fff',
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#ECFDF5' : isFocused ? 'rgba(13, 148, 136, 0.1)' : 'white',
      color: '#111827',
      cursor: 'pointer',
    }),
    menu: (base) => ({ ...base, zIndex: 9999 }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  };

  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const getProfilePicture = (image) => {
    if (!image) return defaultProfile;
    if (image.startsWith('http')) return image;
    return `${API_BASE_URL}${image}`;
  };

  const handleTemplateSelect = (templateId) => {
    if (selectedTemplate === templateId) {
      setSelectedTemplate(null);
      setValue('template', null);
    } else {
      setSelectedTemplate(templateId);
      setValue('template', templateId);
    }
  };
const handleEmployeeChange = (selected) => {
  if (selected) {
    const employeeId = Number(selected.value); 
    setValue('employee', employeeId); 
  } else {
    setValue('employee', null); 
  }
};

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        label="Start Onboarding"
        icon={<FiUserPlus className="text-primary w-5 h-5" />}
        className="flex justify-center items-center gap-2 px-4 py-2.5 rounded-md text-primary border border-primary text-sm transition-colors"
      />

      {isOpen && (
        <div className="relative z-50" role="dialog" aria-modal="true">
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          />
          <div className="fixed inset-0 z-50 w-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Start New Onboarding Process
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Select the employee to begin their onboarding journey
                  </p>
                </div>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                  <IoCloseOutline size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} id="onboardingForm" className="px-6 py-4 space-y-5">
                {/* Employee Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Employee</label>
                  <Controller
                    name="employee"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={employeeOptions}
                        value={employeeOptions.find((opt) => opt.value === field.value) || null}
                        // onChange={(option) => field.onChange(option?.value || null)}
                        onChange={handleEmployeeChange}
                        onInputChange={(value) => handleEmployeeFilterChange({ search: value })}
                        onMenuScrollToBottom={() =>
                          hasMoreEmployees && handleEmployeePageChange(employeePage + 1)
                        }
                        isLoading={fetchingEmployees}
                        isClearable
                        placeholder="Select employee"
                        formatOptionLabel={(option) => (
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              <img
                                src={getProfilePicture(option.image)}
                                alt={option.label}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = defaultProfile)}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {option.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {option.position && `${option.position} · `}
                                {option.department}
                              </span>
                            </div>
                          </div>
                        )}
                        styles={customSelectStyles}
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                  {errors.employee && (
                    <p className="text-red-500 text-xs mt-1">{errors.employee.message}</p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
                  <input
                    type="date"
                    {...register('start_date')}
                    className="w-full px-4 py-2.5 text-sm border
                     border-gray-200 rounded-lg focus:ring-none 
                      focus:border-primary focus:outline-none focus:bg-white bg-gray-100"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>
                  )}
                </div>

                {/* Template Search Input */}
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Onboarding Template
                </label>
                <div>
                  <input
                    type="text"
                    value={templateFilters.search}
                    name="search"
                    onChange={(e) => handleTemplateFilterChange({ search: e.target.value })}
                    placeholder="Search templates..."
                    className="w-full px-4 py-2.5 text-sm border
                      bg-gray-100 rounded-lg focus:ring-none
                       focus:ring-none focus:bg-white focus:outline-none focus:border-primary mb-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {templatesData?.results?.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`relative p-4 border rounded-lg text-left transition-all ${
                        selectedTemplate === template.id
                          ? 'border-primary-400 bg-primary-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {template.department?.name || 'All Departments'}
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <BsListCheck className="w-3.5 h-3.5" />
                          <span>{template.steps?.length || 0} tasks</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-600">
                          <FiCalendar className="w-3.5 h-3.5" />
                          <span>{template.duration_in_days} days</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {hasMoreTemplates && (
                  <button
                    type="button"
                    onClick={() => handleTemplatePageChange(templatePage + 1)}
                    className="mt-3 w-full text-center py-2 text-sm font-medium text-teal-500 border border-teal-500 rounded-lg hover:bg-teal-50"
                  >
                    Load More
                  </button>
                )}

                {errors.template && (
                  <p className="text-red-500 text-xs mt-1">{errors.template.message}</p>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Assign HR Coordinator
                  </label>
                  <Controller
                    name="coordinator"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={coordinatorOptions}
                        value={coordinatorOptions.find((opt) => opt.value === field.value) || null}
                        onChange={(option) => field.onChange(option?.value || null)}
                        onInputChange={(value) => handleCoordinatorFilterChange({ search: value })}
                        onMenuScrollToBottom={() =>
                          hasMoreCoordinators && handleCoordinatorPageChange(coordinatorPage + 1)
                        }
                        isLoading={fetchingCoordinators}
                        isClearable
                        placeholder="Select coordinator"
                        formatOptionLabel={(option) => (
                          <div className="flex items-center gap-3 py-1">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                              <img
                                src={getProfilePicture(option.image)}
                                alt={option.label}
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = defaultProfile)}
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-sm font-medium text-gray-900">
                                {option.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {option.position && `${option.position} · `}
                                {option.department}
                              </span>
                            </div>
                          </div>
                        )}
                        styles={customSelectStyles}
                        menuPortalTarget={document.body}
                      />
                    )}
                  />
                  {errors.coordinator && (
                    <p className="text-red-500 text-xs mt-1">{errors.coordinator.message}</p>
                  )}
                </div>

              </form>
                            <div className="flex  justify-between px-4 shadow-md py-4 gap-4 md:justify-between items-center border-t
                             sticky bottom-0 bg-white z-10">
             
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="onboardingForm"
                    disabled={isSubmitting || isCreating}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-teal-500 rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                       <SubmitSpinner />
                        Starting...
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-4 h-4" />
                        Start Onboarding
                      </>
                    )}
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
