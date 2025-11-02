import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { templateTypeOptions } from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTemplateSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetDepartmentsQuery } from '@store/services/companies/departmentsService';
import { useUpdateTemplateMutation } from '@store/services/staffcylce/onboardingService';

import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit3, FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const EditTemplate = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateTemplate, { isLoading: isCreating }] = useUpdateTemplateMutation();
  const { data: departments } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  console.log('departments', departments);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      name: data?.name ?? '',
      template_type: data?.template_type ?? '',
      department: data?.department?.id ?? undefined,
      description: data?.description ?? '',
      duration_in_days: Number(data?.duration_in_days ?? 0),
    },
  });

  const onSubmit = async (formData) => {
    try {
      await updateTemplate({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success('Template  updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error updating template.');
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
  const handleDepartmentChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('department', item_id);
    }
  };
  const handleTypeChange = (selected) => {
    if (selected) {
      const item_id = String(selected.value);
      setValue('template_type', item_id);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="Edit"
        icon={<FiEdit3 className="text-sm text-gray-600" />}
        className="flex items-center space-x-2 px-4 py-2 w-full font-inter hover:bg-gray-100"
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
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Edit Template</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g Personal Identification"
                    {...register('name')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  <div className="">
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select
                      options={templateTypeOptions}
                      defaultValue={{
                        label: data.template_type,
                        value: data.template_type,
                      }}
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
                      onChange={handleTypeChange}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                    )}
                  </div>
                </div>
                <div className="">
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <Select
                    options={departments?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    defaultValue={{
                      label: data.department.name,
                      value: data.department.id,
                    }}
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
                    onChange={handleDepartmentChange}
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                  )}
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
