import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { CreateBreakCategorySchema } from '@schemas/companies/policies/breaksPolicySchema';
import { useUpdateBreakCategoryMutation } from '@store/services/policies/policyService';
export const EditCategory = ({ data, refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateBreakCategory, { isLoading: isCreating }] = useUpdateBreakCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateBreakCategorySchema),
    defaultValues: {
      name: data?.name ?? '',
    },
  });

  const onSubmit = async (formData) => {
    try {
      await updateBreakCategory({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success('Break Category updated successfully!');
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
      <CreateUpdateButton
        onClick={handleOpenModal}
        label="Edit"
        icon={<FiEdit className="w-4 h-4 text-amber-500" />}
        className="px-4 py-2 w-full focus:outline-none focus:border-none ffocus:ring-none"
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
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Add New Break Type</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. HR"
                    {...register('name')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
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
