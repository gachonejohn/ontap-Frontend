import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { onboardingstepPriorityOptions } from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTemplateSchema } from '@schemas/onboarding/onboardingSchema';
import { useGetDepartmentsQuery } from '@store/services/companies/departmentsService';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { useUpdateTemplateMutation } from '@store/services/staffcylce/onboardingService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FiEdit2, FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const EditTemplate = ({ template, refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateTemplateMutation();
  const { data: departments } = useGetDepartmentsQuery();
  const { data: employeesData } = useGetEmployeesQuery();
  console.log('template', template);
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
      template_name: template?.template_name ?? '',
      department: template?.department.id ?? undefined,
      description: template?.description ?? '',
      duration_in_days: template?.duration_in_days ?? 1,
      steps: template?.steps || [],
    },
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  useEffect(() => {
    if (template) {
      reset({
        ...template,
        department: template?.department?.id ?? undefined,
        steps:
          template?.steps?.map((step) => ({
            ...step,
            assignee: step.assignee?.id ?? undefined,
          })) || [],
      });
    }
  }, [template, reset]);

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset(template);
    setIsOpen(false);
  };

  const onSubmit = async (formData) => {
    console.log('Submitting form data:', formData);
      const payLoad = {
      template_type: 'Onboarding',
      ...formData,
    };
    if (!payLoad.steps || payLoad.steps.length === 0) {
    delete payLoad.steps; 
  }
    try {
      await updateTemplate({
        id: template.id,
        data: payLoad,
      }).unwrap();
      toast.success('Template updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Error updating template.'));
    }
  };

  const handleDepartmentChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('department', item_id);
    }
  };
  const handlePriorityType = (selected, index) =>
    setValue(`steps.${index}.priority`, selected ? selected.value : '');

  const handleEmployeeChange = (selected, index) =>
    setValue(`steps.${index}.assignee`, selected ? Number(selected.value) : undefined);

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
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity cursor-pointer"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-2 md:p-3">
            <div
              className="relative font-inter max-h-[90vh] overflow-y-auto bg-white 
              rounded-2xl shadow-xl w-full sm:max-w-c-500 md:max-w-c-500 px-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg font-semibold">Edit Onboarding Template</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 gap-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Template Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none bg-input focus:border-primary focus:bg-white"
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
                      defaultValue={{
                        label: template.department.name,
                        value: template.department.id,
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
                          backgroundColor: '#F3F3F5',
                        }),
                      }}
                      onChange={handleDepartmentChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    className="w-full py-2 px-4 bg-input rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                </div>

                {/* Steps */}
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
                          priority: '',
                          step_order: fields.length + 1,
                        })
                      }
                      className="flex bg-primary items-center gap-1 p-2 rounded-md text-sm text-white"
                    >
                      <FiPlus /> Add Task
                    </button>
                  </div>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-xl p-3 mb-3 flex items-start gap-4 relative"
                    >
                      <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Task Title</label>
                            <input
                              type="text"
                              {...register(`steps.${index}.title`)}
                              className="w-full py-2 px-3 rounded-md border border-gray-400 focus:outline-none bg-input focus:border-primary focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Assignee</label>
                            <Select
                              defaultValue={employeesData
                                ?.map((e) => ({
                                  value: e.id,
                                  label: `${e.user.first_name} ${e.user.last_name}`,
                                }))
                                .find((opt) => opt.value === field.assignee)}
                              options={employeesData?.map((e) => ({
                                value: e.id,
                                label: `${e.user.first_name} ${e.user.last_name}`,
                              }))}
                              onChange={(sel) => handleEmployeeChange(sel, index)}
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
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="text-sm font-medium mb-1 block">Description</label>
                          <textarea
                            {...register(`steps.${index}.description`)}
                            className="w-full py-2 px-3 rounded-md border border-gray-400 focus:outline-none bg-input focus:border-primary focus:bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <label className="text-sm font-medium mb-1 block">Due Day</label>
                            <input
                              type="number"
                              {...register(`steps.${index}.duration_in_days`)}
                              className="w-full py-2 px-3 rounded-md border border-gray-400 focus:outline-none bg-input focus:border-primary focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Priority</label>
                            <Select
                              defaultValue={
                                onboardingstepPriorityOptions.find(
                                  (opt) => opt.value === field.priority
                                ) || null
                              }
                              options={onboardingstepPriorityOptions}
                              onChange={(sel) => handlePriorityType(sel, index)}
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
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1 block">Step Order</label>
                            <input
                              type="number"
                              {...register(`steps.${index}.step_order`)}
                              className="w-full py-2 px-3 rounded-md border border-gray-400 focus:outline-none bg-input focus:border-primary focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isUpdating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
