import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { rejectAdjustmentSchema } from '@schemas/payroll.Schema';
import {
    useRejectAdjustmentMutation
} from '@store/services/payroll/Payroll.Service';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiXCircle } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

export const RejectAdustment = ({ data, refetchData }) => {
  const [rejectAdjustment, { isLoading: isCreating }] = useRejectAdjustmentMutation();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(rejectAdjustmentSchema),
  });

 

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };
  const onSubmit = async (formData) => {
    const payLoad = {
      id: data.id,
      ...formData,
    };
    try {
      const result = await rejectAdjustment(payLoad).unwrap();
      const msg = result.message || 'Adjustment Rejected successfully!';
      toast.success(msg);
      refetchData();
      handleCloseModal();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error rejecting adjustment.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200"
        title="Reject Adjustment"
      >
        <FiXCircle className="w-4 h-4" />
        <span>Reject</span>
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
                  rounded-2xl bg-white text-left shadow-xl transition-all w-full 
                  sm:max-w-c-450 md:max-w-c-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Reject Payroll Adjustment
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason For Rejecting/Cancelling<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    cols={5}
                    placeholder="Reason For Adjustment"
                    {...register('rejection_reason')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.rejection_reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.rejection_reason.message}</p>
                  )}
                </div>
                {/* Buttons */}
                <div className="sticky bottom-0 bg-white z-40 flex gap-4 md:justify-between items-center pt-3">
                  <button
                    type="button"
                    //   onClick={}
                    className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[150px] md:w-auto hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreating}
                    className="bg-primary text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[150px] md:w-auto"
                  >
                    {isSubmitting || isCreating ? (
                      <span className="flex items-center">
                        <SubmitSpinner />
                        <span>Rejecting...</span>
                      </span>
                    ) : (
                      <span>Confirm Rejection</span>
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
