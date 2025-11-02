import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { onboardingstepPriorityOptions } from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { createStepSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { useCreateOnboardingStepMutation } from '@store/services/staffcylce/onboardingService';

import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const NewStep = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createOnboardingStep, { isLoading: isCreating }] = useCreateOnboardingStepMutation();
  const { data: employeesData } = useGetEmployeesQuery({}, { refetchOnMountOrArgChange: true });
  console.log('employeesData', employeesData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createStepSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await createOnboardingStep(formData).unwrap();
      toast.success('Onboarding step  created successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error occured while creating onboarding step.');
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
      setValue('assignee', item_id);
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
        label="New Step"
        icon={<FiPlus className="w-4 h-4" />}
        className="flex justify-center items-center gap-2 px-4 py-2.5 
          rounded-md text-primary border border-primary text-sm transition-colors"
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
                  Add New Onboarding Step
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g Create Email account for new hire"
                    {...register('title')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div className="grid grid-1 md:grid-cols-2 gap-4">
                  <div className="">
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <Select
                      options={onboardingstepPriorityOptions}
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
                      onChange={handlePriorityType}
                    />
                    {errors.priority && (
                      <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                    )}
                  </div>
                  <div className="">
                    <label className="block text-sm font-medium mb-2">Default Assignee</label>
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
                    {errors.assignee && (
                      <p className="text-red-500 text-sm mt-1">{errors.assignee.message}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Description here..."
                    {...register('description')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration in days<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g 15"
                    {...register('duration_in_days')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.duration_in_days && (
                    <p className="text-red-500 text-sm">{errors.duration_in_days.message}</p>
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
