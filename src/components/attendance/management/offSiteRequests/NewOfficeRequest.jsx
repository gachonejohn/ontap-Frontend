import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { offsiteRequestSchema } from '@schemas/attendanceSchema';
import { useOffSiteRequestMutation } from '@store/services/attendance/attendanceService';
import { useGetBreakCategoriesQuery } from '@store/services/policies/policyService';
import Select from 'react-select';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClock, FiMapPin } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { offsiteRequestTypes } from '@constants/constants';

export const NewOffOfficeRequest = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [offSiteRequest, { isLoading: isCreating }] = useOffSiteRequestMutation();

  const {
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(offsiteRequestSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await offSiteRequest(formData).unwrap();
      toast.success('Off office request sent successfully!');
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
  const handleRequestTypeChange = (selected) => {
    console.log('Selected request type:', selected);
    if (selected) {
      setValue('request_type', selected.value);
      console.log('Selected request type:', selected);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4.5 py-2.5 bg-[#FAA541]
         text-white rounded-lg flex items-center space-x-2 
          transition-colors font-medium"
      >
        <FiMapPin className="text-lg" />
        <span>Request Offsite</span>
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
                  <div className="p-2 rounded-full bg-yellow-50">
                    <FiMapPin size={16} className="text-yellow-600" />
                  </div>
                  <p className="text-sm md:text-lg lg:text-lg font-semibold">Request For Offsite</p>
                </div>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={offsiteRequestTypes}
                    onChange={handleRequestTypeChange}
                    placeholder="Request Type"
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
                  {errors.request_type && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.request_type.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter location"
                    {...register('location')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
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
                    Start Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    placeholder="Start Time"
                    {...register('start_time')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.start_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Time<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    placeholder="End Time"
                    {...register('end_time')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.end_time && (
                    <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reason<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    cols={5}
                    placeholder="Reason"
                    {...register('reason')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.reason && (
                    <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                  )}
                </div>

                {/* Wide left accent + note */}
                <div className="flex items-stretch rounded-lg overflow-hidden bg-yellow-50">
                  {/* Left border accent */}
                  <div className="w-1 bg-yellow-600" />

                  {/* Content */}
                  <div className="flex-1 p-4 text-yellow-900 text-sm">
                    Your offsite request will be sent to your manager for approval. You will be
                    notified once a decision is made.
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-white z-40 pt-2 pb-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreating}
                    className="w-full bg-yellow-600 pr-4 text-white py-3 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50"
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
