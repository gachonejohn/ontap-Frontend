import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBreakSchema } from '@schemas/companies/policies/breaksPolicySchema';
import {
  useCreateBreakMutation,
  useGetBreakCategoriesQuery,
} from '@store/services/policies/policyService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const CreateBreak = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [createBreak, { isLoading: isCreating }] = useCreateBreakMutation();

  const { data: categoriesData } = useGetBreakCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateBreakSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        ...formData,
        timezone: userTimezone,
      };

      await createBreak(payload).unwrap();
      toast.success('Break started  successfully!');
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

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  const handleBreakTypeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('break_type', item_id);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="min-w-[150px] h-[50px] 
             text-orange-500 rounded-md border  border-orange-500 shadow-md hover:bg-orange-100 transition-colors"
      >
        StartBreak
      </button>
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-c-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Go for a Break</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Break Type</label>
                  <Select
                    options={categoriesData?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
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
                    onChange={handleBreakTypeChange}
                  />
                  {errors.break_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.break_type.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Break Start</label>
                  <input
                    type="time"
                    {...register('break_start')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm cursor-text"
                  />
                  {errors.break_start && (
                    <p className="text-red-500 text-sm">{errors.break_start.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Break End</label>
                  <input
                    type="time"
                    {...register('break_end')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm cursor-text"
                  />
                  {errors.break_end && (
                    <p className="text-red-500 text-sm">{errors.break_end.message}</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white z-40 flex gap-4 justify-between items-center py-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full md:w-auto hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreating}
                    className="bg-primary text-white py-2 px-4 rounded-lg w-full md:w-auto hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting || isCreating ? (
                      <span className="flex items-center gap-2">
                        <SubmitSpinner />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
