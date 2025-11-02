import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeePaymentMethodSchema } from '@schemas/employees/employmentSchema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit, FiUserPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { paymentMethodOptions } from '../../../../constants/constants';
import { useUpdatePaymentMethodMutation } from '../../../../store/services/employees/employeesService';
import SubmitCancelButtons from '../../../common/Buttons/ActionButton';
import CreateUpdateButton from '../../../common/Buttons/CreateUpdateButton';
import { getApiErrorMessage } from '@utils/errorHandler';

export const UpdatePymentMethodInfo = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updatePaymentMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(EmployeePaymentMethodSchema),
    defaultValues: {
      method: data?.method ?? '',
      bank_name: data?.bank_name ?? '',
      mobile_number: data?.mobile_number ?? '',
      is_primary: data?.is_primary ?? '',
      account_number: data?.account_number ?? '',
    },
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    try {
      await updatePaymentMethod({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success('Payment Method Details updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error Updating payment method info.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };
  const handleMethodTypeChange = (selected) => {
    if (selected) {
      setValue('method', selected.value);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        title="Edit"
        label=""
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2  bg-amber-100 text-amber-500
        
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

          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center  p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                   overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-550 md:max-w-550 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Edit Payment Method</p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={handleCloseModal}
                />
              </div>

              {/* Scrollable form content */}

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                {/* First Name - Full Width */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={paymentMethodOptions}
                    onChange={handleMethodTypeChange}
                    defaultValue={{
                      label: data.method,
                      value: data.method,
                    }}
                    placeholder="Select Method"
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        minHeight: '36px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#9ca3af' },
                        backgroundColor: '#F3F4F6',
                      }),
                    }}
                  />
                  {errors.method && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.method.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account Number<span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      placeholder="A2345"
                      {...register('account_number')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.account_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.account_number.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bank Name<span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. KES"
                      {...register('bank_name')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.bank_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.bank_name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number<span className="text-red-500"></span>
                  </label>
                  <input
                    type="number"
                    placeholder="+254"
                    {...register('mobile_number')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobile_number.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="is_primary"
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    {...register('is_primary')}
                  />
                  <label htmlFor="is_primary" className="ml-2 text-sm font-medium text-gray-700">
                    Is Primary
                  </label>
                </div>
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isUpdating}
                />
              </form>

              {/* Footer - sticky */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
