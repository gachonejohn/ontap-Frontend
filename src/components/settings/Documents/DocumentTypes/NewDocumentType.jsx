import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { createDocumentTypeSchema } from '@schemas/companies/documentsSchema';
import {
  useCreateDocumentTypeMutation,
  useGetDocumentCategoriesQuery,
} from '@store/services/companies/documentsService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const NewDocumentType = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createDocumentType, { isLoading: isCreating }] = useCreateDocumentTypeMutation();
  const { data: categoriesData } = useGetDocumentCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log('categoriesData', categoriesData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createDocumentTypeSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await createDocumentType(formData).unwrap();
      toast.success('Document Type created successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error Creating document type.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };
  const handleCategoryChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('category', item_id);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="New Category"
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-2xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-450 md:max-w-c-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Add Document Type</p>
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
                    placeholder="E.g Personal Identification"
                    {...register('name')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Category</label>
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
                    onChange={handleCategoryChange}
                  />
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Description here..."
                    {...register('description')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="re"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    {...register('requires_acknowledgment')}
                  />
                  <label
                    htmlFor="requires_acknowledgment"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Requires Acknowledgement
                  </label>
                </div>
                {/* Buttons */}
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isCreating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
