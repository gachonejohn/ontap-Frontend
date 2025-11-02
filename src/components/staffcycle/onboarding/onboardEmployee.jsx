import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardEmployeeSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import {
  useOnboardEmployeeMutation,
  useGetOnboardingTemplatesQuery,
} from '@store/services/staffcylce/onboardingService';

import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUserPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const OnboardEmployee = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [onboardEmployee, { isLoading: isCreating }] = useOnboardEmployeeMutation();
  const { data: employeesData } = useGetEmployeesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: templatesData } = useGetOnboardingTemplatesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log('templatesData', templatesData);
  console.log('employeesData', employeesData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(onboardEmployeeSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await onboardEmployee(formData).unwrap();
      toast.success('Onborading Process started successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error occured while starting onboarding process.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };
  const handleEmployeeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('employee', item_id);
    }
  };
  const handleCoordinatorChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('coordinator', item_id);
    }
  };
  const handleTemplateChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('template', item_id);
    }
  };

  const handlePriorityType = (selected) => {
    setValue('priority', selected ? selected.value : '');
  };

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="Start Onboarding"
        icon={<FiUserPlus className="text-primary w-5 h-5" />}
        className="flex justify-center items-center gap-2 px-4 py-2.5 
                    rounded-md   text-primary border border-primary text-sm  transition-colors"
      />

      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Modal */}
          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-2xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-450 md:max-w-c-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Start New Onboarding Process
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                <div className="">
                  <label className="block text-sm font-medium mb-2">Employee</label>
                  <Select
                    options={employeesData?.map((item) => ({
                      value: item.id,
                      label: `${item.user.first_name} ${item.user.last_name} (${item.department.name})`,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: '40px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#9ca3af',
                        },
                        '&:focus-within': {
                          borderColor: '#9ca3af',
                          boxShadow: 'none',
                        },
                        backgroundColor: '#F8FAFC',
                      }),
                    }}
                    onChange={handleEmployeeChange}
                  />
                  {errors.employee && (
                    <p className="text-red-500 text-sm mt-1">{errors.employee.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    placeholder="Start Date"
                    {...register('start_date')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.start_date && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_date.message}</p>
                  )}
                </div>

                <div className="">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Template
                  </label>
                  <Select
                    isClearable
                    options={templatesData?.map((item) => ({
                      value: item.id,
                      label: item.name,
                      department: item.department.name,
                      duration: item.duration_in_days,
                      steps: item.steps.length,
                      type: item.template_type,
                    }))}
                    formatOptionLabel={(option, { context }) => {
                      if (context === 'value') {
                        return (
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{option.label}</span>
                            <span className="text-xs text-gray-500">
                              {option.department} • {option.steps} steps • {option.duration} days
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div className="py-2">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-medium text-gray-900">{option.label}</div>
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium whitespace-nowrap flex-shrink-0">
                                {option.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium w-fit">
                                {option.department}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 text-purple-700 rounded font-medium w-fit">
                                {option.steps} {option.steps === 1 ? 'Step' : 'Steps'}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded font-medium w-fit">
                                {option.duration} Days
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base, state) => ({
                        ...base,
                        minHeight: '48px',
                        borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
                        boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
                        '&:hover': {
                          borderColor: '#9ca3af',
                        },
                        backgroundColor: '#ffffff',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#eff6ff'
                          : state.isFocused
                            ? '#f9fafb'
                            : 'white',
                        color: '#111827',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        '&:active': {
                          backgroundColor: '#e5e7eb',
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        boxShadow:
                          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb',
                        minWidth: '300px',
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: '200px',
                      }),
                      singleValue: (base) => ({
                        ...base,
                        display: 'flex',
                        alignItems: 'flex-start',
                      }),
                    }}
                    onChange={handleTemplateChange}
                    placeholder="Select a template..."
                  />
                  {errors.template && (
                    <p className="text-red-500 text-sm mt-1">{errors.template.message}</p>
                  )}
                </div>
                <div className="">
                  <label className="block text-sm font-medium mb-2">Coordinator</label>
                  <Select
                    options={employeesData?.map((item) => ({
                      value: item.id,
                      label: `${item.user.first_name} ${item.user.last_name} (${item.department.name})`,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: '40px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#9ca3af',
                        },
                        '&:focus-within': {
                          borderColor: '#9ca3af',
                          boxShadow: 'none',
                        },
                        backgroundColor: '#F8FAFC',
                      }),
                    }}
                    onChange={handleCoordinatorChange}
                  />
                  {errors.coordinator && (
                    <p className="text-red-500 text-sm mt-1">{errors.coordinator.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isCreating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
