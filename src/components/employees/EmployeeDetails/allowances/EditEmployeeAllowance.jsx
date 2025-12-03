import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeAllowanceSchema } from '@schemas/employees/employmentSchema';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form'; 
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
import SubmitCancelButtons from '../../../common/Buttons/ActionButton';
import CreateUpdateButton from '../../../common/Buttons/CreateUpdateButton';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useGetAllowanceTypesQuery } from '@store/services/payslips/payslipService';
import { useUpdateEmployeeAllowanceMutation } from '../../../../store/services/payslips/payslipService';

export const UpdateEmployeeAllowanceInfo = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateEmployeeAllowance, { isLoading: isUpdating }] = useUpdateEmployeeAllowanceMutation();
  const { data: AllowanceTypesData } = useGetAllowanceTypesQuery({}, { refetchOnMountOrArgChange: true });

  const {
    register,
    handleSubmit,
    reset,
    control, 
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(EmployeeAllowanceSchema),
    defaultValues: {
      allowance: data?.allowance?.id, 
      amount: data?.amount ?? ''
    },
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const onSubmit = async (formData) => {
    console.log('Update form data:', formData); 
    try {
      await updateEmployeeAllowance({
        id: data.id,
        ...formData,
      }).unwrap();
      toast.success('Employee Allowance Details updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error Updating employee Allowance info.');
      toast.error(message);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset({
      allowance: data?.allowance?.id,
      amount: data?.amount ?? ''
    });
    setIsOpen(false);
  };

  const allowanceOptions = Array.isArray(AllowanceTypesData)
    ? AllowanceTypesData.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    : [];

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        title="Edit"
        label=""
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2 bg-amber-100 text-amber-500
         rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2
          focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      />
      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                   overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-550 md:max-w-550 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Edit Employee Allowance</p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={handleCloseModal}
                />
              </div>

              {/* Scrollable form content */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Allowance <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="allowance"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={allowanceOptions}
                        value={allowanceOptions.find(option => option.value === field.value) || null}
                        onChange={(selected) => field.onChange(selected ? selected.value : null)}
                        placeholder="Select allowance type"
                        menuPortalTarget={document.body}
                        menuPlacement="auto"
                        isClearable={false}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (base, state) => ({
                            ...base,
                            minHeight: '36px',
                            borderColor: errors.allowance ? '#ef4444' : '#d1d5db',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: errors.allowance ? '#ef4444' : '#9ca3af'
                            },
                            backgroundColor: '#F3F4F6',
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.allowance && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.allowance.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="2000"
                      {...register('amount')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                    )}
                  </div>
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