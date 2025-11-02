import { zodResolver } from '@hookform/resolvers/zod';
import { createDocumentTypeSchema } from '@schemas/companies/documentsSchema';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Select from 'react-select';

import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import {
  useGetDocumentCategoriesQuery,
  useUpdateDocumentTypeMutation,
} from '@store/services/companies/documentsService';
import { getApiErrorMessage } from '@utils/errorHandler';
export const EditDocumentType = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateDocumentType, { isLoading: isCreating }] = useUpdateDocumentTypeMutation();
  const { data: categoriesData } = useGetDocumentCategoriesQuery(
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
    resolver: zodResolver(createDocumentTypeSchema),
    defaultValues: {
      name: data?.name ?? '',
      category: data?.category?.id ?? undefined,
      description: data?.description ?? '',
      requires_acknowledgment: data?.requires_acknowledgment ?? false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      await updateDocumentType({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success('Document type successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error updating document type.');
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
        // title="Edit"
        label="Edit"
        icon={<FiEdit className="w-4 h-4 text-amber-500" />}
        className="
    px-4 py-2 w-full 
    border-none 
    focus:outline-none 
    focus:border-transparent 
    focus:ring-0 
    active:outline-none 
    active:ring-0
    hover:bg-gray-100
  "
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
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Edit Document Type</p>
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
                    defaultValue={{
                      label: `${data?.category?.name ?? ''}`,
                      value: `${data?.category?.id}`,
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
                    id="requires_acknowledgment"
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
