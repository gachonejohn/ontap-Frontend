import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import SubmitSpinner from '@components/common/spinners/submitSpinner';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { CreateBreakRuleSchema } from '@schemas/companies/policies/breaksPolicySchema';
import { useCreateBreakRuleMutation } from '@store/services/policies/policyService';

export const CreateBreakRule = ({ data, refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [createBreakRule, { isLoading: isCreating }] = useCreateBreakRuleMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateBreakRuleSchema),
    defaultValues: {
      name: '',
      // max_breaks_per_day: 2,
      // max_total_break_minutes: 60,
      default_max_duration_minutes: 30,
      // default_grace_period_minutes: 5,
      enforce_strictly: false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      await createBreakRule(formData).unwrap();
      toast.success('Break Policy created successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error?.data?.error || 'An error occurred. Please try again.');
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
      <CreateUpdateButton
        onClick={handleOpenModal}
        label="New Policy "
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2
                   rounded-md  transition-all duration-200 shadow-sm hover:shadow-md 
                    hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-c-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b">
                <p className="text-sm md:text-lg font-semibold">Add New Break Policy</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Lunch Break"
                    {...register('name')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Max Breaks per Day */}
                {/* <div>
                  <label className="block text-sm font-medium mb-2">Max Breaks per Day</label>
                  <input
                    type="number"
                    min="1"
                    {...register('max_breaks_per_day', { valueAsNumber: true })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.max_breaks_per_day && (
                    <p className="text-red-500 text-sm">{errors.max_breaks_per_day.message}</p>
                  )}
                </div> */}

                {/* Max Total Break Minutes */}
                {/* <div>
                  <label className="block text-sm font-medium mb-2">Max Total Break Minutes</label>
                  <input
                    type="number"
                    min="1"
                    {...register('max_total_break_minutes', { valueAsNumber: true })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.max_total_break_minutes && (
                    <p className="text-red-500 text-sm">{errors.max_total_break_minutes.message}</p>
                  )}
                </div> */}

                {/* Default Max Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                  Max Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('default_max_duration_minutes', {
                      valueAsNumber: true,
                    })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.default_max_duration_minutes && (
                    <p className="text-red-500 text-sm">
                      {errors.default_max_duration_minutes.message}
                    </p>
                  )}
                </div>

                {/* Default Grace Period */}
                {/* <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register('default_grace_period_minutes', {
                      valueAsNumber: true,
                    })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.default_grace_period_minutes && (
                    <p className="text-red-500 text-sm">
                      {errors.default_grace_period_minutes.message}
                    </p>
                  )}
                </div> */}

                {/* Enforce Strictly */}
                {/* <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enforce_strictly"
                    {...register('enforce_strictly')}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="enforce_strictly"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Enforce Strictly
                  </label>
                </div> */}

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white z-40 flex gap-4 justify-between items-center py-2 mt-4">
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
