import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { attachTemplateStepSchema } from '@schemas/onboarding/onboardingSchema';

import {
  useCreateTemplateStepMutation,
  useGetOnboardingStepsQuery,
} from '@store/services/staffcylce/onboardingService';

import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const AttachStep = ({ refetchData, data }) => {
  console.log('data==========>>>>>>>>>', data);
  const [isOpen, setIsOpen] = useState(false);

  const [createTemplateStep, { isLoading: isCreating }] = useCreateTemplateStepMutation();
  const { data: stepsData } = useGetOnboardingStepsQuery({}, { refetchOnMountOrArgChange: true });
  console.log('stepsData', stepsData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(attachTemplateStepSchema),
  });

  const onSubmit = async (formData) => {
    const payLoad = {
      onboarding_template: data.id,
      ...formData,
    };
    console.log('payload', payLoad);
    try {
      await createTemplateStep(payLoad).unwrap();
      toast.success('Step  added successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error adding step.');
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
  const handleOnboardingStepChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('onboarding_step', item_id);
    }
  };

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="Attach Step"
        icon={<FiPlus className="text-sm" />}
        className="flex px-3.5 py-2.5 items-center gap-2 border border-primary rounded-md text-primary"
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
                  Attach Onboarding Step
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                <div className="">
                  <label className="block text-sm font-medium mb-2">Select Step</label>
                  <Select
                    options={stepsData?.map((item) => ({
                      value: item.id,
                      label: `${item.title}`,
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
                    onChange={handleOnboardingStepChange}
                  />
                  {errors.onboarding_step && (
                    <p className="text-red-500 text-sm mt-1">{errors.onboarding_step.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Step Order<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g 1"
                    {...register('step_order')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.step_order && (
                    <p className="text-red-500 text-sm">{errors.step_order.message}</p>
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
