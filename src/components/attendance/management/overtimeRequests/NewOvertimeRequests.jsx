import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { overtimeRequestSchema } from '@schemas/attendanceSchema';
import { useRequestOvertimeMutation } from '@store/services/attendance/attendanceService';
import {
  useCreateBreakMutation,
  useGetBreakCategoriesQuery,
} from '@store/services/policies/policyService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClock } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

export const RequestOvertime = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [requestOvertime, { isLoading: isCreating }] = useRequestOvertimeMutation();

  const { data: categoriesData } = useGetBreakCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log('categoriesData:', categoriesData);
  const {
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(overtimeRequestSchema),
    defaultValues: {
      break_type: undefined,
    },
  });

  const onSubmit = async (formData) => {
    try {
      await requestOvertime(formData).unwrap();
      toast.success('Overtime request sent successfully!');
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

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4.5 py-2.5
         bg-primary-dark text-white rounded-lg flex 
         items-center space-x-2 hover:bg-primary-dark transition-colors 
         font-medium"
      >
        <FiClock />
        <span>Request Overtime</span>
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
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-full bg-primary-50">
                    <FiClock size={16} className="text-primary-dark" />
                  </div>
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">
                    Request For Overtime Working Hours
                  </p>
                </div>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    placeholder="Date"
                    {...register('date')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Hours<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Total Hours"
                    {...register('total_hours')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.total_hours && (
                    <p className="text-red-500 text-sm mt-1">{errors.total_hours.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason For Overtime<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    cols={5}
                    placeholder="Reason For Overtime"
                    {...register('reason')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                  )}
                </div>

                {/* Wide left accent + note */}
                <div className="flex items-stretch rounded-lg overflow-hidden bg-[#E8F5F0]">
                  {/* Left border accent */}
                  <div className="w-1 bg-[#0F766E]" />

                  {/* Content */}
                  <div className="flex-1 p-4 text-[#2E4F46] text-sm">
                    Your overtime request will be sent to your manager for approval. You will be
                    notified once a decision is made.
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-white z-40 pt-2 pb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreating}
                    className="w-full bg-primary-dark pr-4 text-white py-3 rounded-lg text-sm font-medium hover:bg-primary-dark/90 disabled:opacity-50"
                  >
                    {isSubmitting || isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <SubmitSpinner />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit Request'
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
