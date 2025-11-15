
import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { onboardingstepPriorityOptions } from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTemplateSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetDepartmentsQuery } from '@store/services/companies/departmentsService';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { useCreateTemplateMutation } from '@store/services/staffcylce/onboardingService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const NewTemplate = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [createTemplate, { isLoading: isCreating }] = useCreateTemplateMutation();
  const { data: departments } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: employeesData } = useGetEmployeesQuery({}, { refetchOnMountOrArgChange: true });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      steps: [],
    },
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const onSubmit = async (formData) => {
    const payLoad = {
      template_type: 'Onboarding',
      ...formData,
    };
    if (!payLoad.steps || payLoad.steps.length === 0) {
    delete payLoad.steps; 
  }
console.log('Payload:', payLoad);
    try {
      await createTemplate(payLoad).unwrap();
      toast.success('Template created successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error creating template.');
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
const handleEmployeeChange = (index, selected) => {
  setValue(`steps.${index}.assignee`, selected ? Number(selected.value) : undefined);
};

const handlePriorityType = (index, selected) => {
  setValue(`steps.${index}.priority`, selected ? selected.value : '');
};

 

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        label="New Template"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
      />

      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative font-inter transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-2xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-500 md:max-w-c-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Create Onboarding Template
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                {/* Template Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Engineering Onboarding"
                      {...register('name')}
                      className="w-full py-2 px-4 
                    rounded-md border border-gray-400
                     focus:outline-none bg-input focus:border-primary focus:bg-white placeholder:text-sm"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Department</label>
                    <Select
                      options={departments?.map((item) => ({
                        value: item.id,
                        label: item.name,
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
                          backgroundColor: '#F3F3F5',
                        }),
                      }}
                      onChange={handleDepartmentChange}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Brief description..."
                    {...register('description')}
                    className="w-full py-2 px-4 bg-input rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (Days)</label>
                    <input
                      type="text"
                      {...register('duration_in_days')}
                      placeholder="e.g., 30"
                      className="w-full py-2 px-4 bg-input rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                    />
                    {errors.duration_in_days && (
                      <p className="text-red-500 text-sm">{errors.duration_in_days.message}</p>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-sm">Onboarding Tasks</p>
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          title: '',
                          assignee: undefined,
                          description: '',
                          duration_in_days: 1,
                          category: '',
                          priority: '',
                          step_order: fields.length + 1,
                        })
                      }
                      className="flex bg-primary items-center gap-1 p-2
                       rounded-md text-sm text-white "
                    >
                      <FiPlus /> Add Task
                    </button>
                  </div>

                  {fields.length === 0 && (
                    <p className="text-gray-500 text-sm">No tasks added yet.</p>
                  )}

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-xl p-3 mb-3 flex items-start gap-4  relative"
                    >
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Task Title</label>
                            <input
                              type="text"
                              {...register(`steps.${index}.title`)}
                              placeholder="Enter task title"
                              className="w-full py-2 px-3 
                    rounded-md border border-gray-400
                     focus:outline-none bg-input focus:border-primary focus:bg-white placeholder:text-sm"
                            />
                          </div>

                          <div className="">
                            <label className="block text-sm font-medium mb-2">
                              Default Assignee
                            </label>
                            <Select
                              options={employeesData?.map((item) => ({
                                value: item.id,
                                label: `${item.user.first_name} ${item.user.last_name} (${item?.department?.name})`,
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
                                  backgroundColor: '#F3F3F5',
                                }),
                              }}
                              onChange={(selected) => handleEmployeeChange(index, selected)}
                            />
                            {errors.assignee && (
                              <p className="text-red-500 text-sm mt-1">{errors.assignee.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="text-sm font-medium mb-1 block">Description</label>
                          <textarea
                            {...register(`steps.${index}.description`)}
                            placeholder="Task details..."
                            className="w-full py-2 px-3 
                    rounded-md border border-gray-400
                     focus:outline-none bg-input focus:border-primary focus:bg-white placeholder:text-sm"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Due Day</label>
                            <input
                              type="number"
                              {...register(`steps.${index}.duration_in_days`)}
                              className="w-full py-2 px-3 
                    rounded-md border border-gray-400
                     focus:outline-none bg-input focus:border-primary focus:bg-white placeholder:text-sm"
                            />
                          </div>

                          <div className="">
                            <label className="block text-sm font-medium mb-1">Priority</label>
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
                                  backgroundColor: '#F3F3F5',
                                }),
                              }}
                             onChange={(selected) => handlePriorityType(index, selected)}
                            />
                            {errors.priority && (
                              <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
                            )}
                          </div>
                          <div className="">
                            <label className="text-sm font-medium mb-1  block">Step Order</label>
                            <input
                              type="number"
                              {...register(`steps.${index}.step_order`)}
                              placeholder="e.g., 1, 2, 3"
                              className="w-full py-2 px-3 
                    rounded-md border border-gray-400
                     focus:outline-none bg-input focus:border-primary focus:bg-white placeholder:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className=" text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

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
