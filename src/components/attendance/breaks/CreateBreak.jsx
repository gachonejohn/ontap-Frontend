import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBreakSchema } from '@schemas/companies/policies/breaksPolicySchema';
import {
  useCreateBreakMutation,
  useGetBreakCategoriesQuery,
} from '@store/services/policies/policyService';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiClock } from 'react-icons/fi';
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
  console.log('categoriesData:', categoriesData);
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateBreakSchema),
    defaultValues: {
      break_type: undefined,
    },
  });

  const onSubmit = async (formData) => {
    try {
     
     await createBreak(formData).unwrap();
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
  if (selected && selected.id !== undefined && selected.id !== null) {
    setValue('break_type', Number(selected.id)); 
  } else {
    setValue('break_type', undefined);
  }
};


  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 text-white rounded-md border 
             flex items-center space-x-2
              bg-orange-400   transition-colors"
      >
        <FiClock />
        <span>Take a Break</span>
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
                    options={categoriesData || []}
                     getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        minHeight: '40px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#9ca3af' },
                        '&:focus-within': { borderColor: '#9ca3af', boxShadow: 'none' },
                        backgroundColor: '#F8FAFC',
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? '#dbeafe' 
                          : state.isFocused
                            ? '#e2e8f0' 
                            : 'white',
                        color: state.isSelected ? '#1e40af' : 'black', 
                        padding: '10px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                      }),
                    }}
                    formatOptionLabel={(option) => (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{option.name}</span>
                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                          {option.default_max_duration_minutes !== null && (
                            <span className="bg-green-100 text-green-700 px-1 rounded">
                              Duration: {option.default_max_duration_minutes} min
                            </span>
                          )}
                          {option.default_grace_period_minutes !== null && (
                            <span className="bg-blue-100 text-blue-700 px-1 rounded">
                              Grace: {option.default_grace_period_minutes} min
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    onChange={handleBreakTypeChange}
                  />

                  {errors.break_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.break_type.message}</p>
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
