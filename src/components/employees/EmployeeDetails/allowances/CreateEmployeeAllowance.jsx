import { zodResolver } from '@hookform/resolvers/zod';
import { EmployeeAllowanceSchema } from '@schemas/employees/employmentSchema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUserPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useCreateEmployeeAllowanceMutation, useGetAllowanceTypesQuery } from '../../../../store/services/payslips/payslipService';
import SubmitCancelButtons from '../../../common/Buttons/ActionButton';
import CreateUpdateButton from '../../../common/Buttons/CreateUpdateButton';

export const CreateEmployeeAllowance = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [CreateAllowance, { isLoading: isCreating }] = useCreateEmployeeAllowanceMutation();
  const { data: allowanceTypesData } = useGetAllowanceTypesQuery({}, { refetchOnMountOrArgChange: true });
  console.log('Allowance Types Data:', allowanceTypesData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(EmployeeAllowanceSchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    const payLoad = {
      employee: data.id,
      ...formData,
    };
    try {
      await CreateAllowance(payLoad).unwrap();
      toast.success('Employee Allowance created successfully');
      handleCloseModal();
      refetchData();
    } catch (error) {
      console.error('Error:', error);
      if (error && error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      refetchData();
    }
  };
   const handleAllowanceTypeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('allowance', item_id);
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
        title="Add New"
        label="New Allowance"
        icon={<FiUserPlus className="w-4 h-4" />}
        className="bg-primary rounded-md  transition-all duration-200 shadow-sm hover:shadow-md  text-white px-4 py-2 hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
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
                   overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-550 md:max-w-550 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Add New Employee Allowance
                </p>
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
                    Employee Allowance <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={allowanceTypesData?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    defaultValue={{
                      label: `${data?.allowance?.name ?? ''}`,
                      value: `${data?.allowance?.id}`,
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
                    onChange={handleAllowanceTypeChange}
                  />
                  {errors.allowance && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.allowance.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount<span className="text-red-500"></span>
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
                  isProcessing={isCreating}
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
