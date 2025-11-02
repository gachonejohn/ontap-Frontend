import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheckCircle, FiUploadCloud, FiX } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { PiSpinnerGap } from 'react-icons/pi';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { CreateEmployeeDocumentSchema } from '@schemas/employees/documentsSchema';
import { useGetDocumentTypesQuery } from '@store/services/companies/documentsService';
import { useUploadDocumentMutation } from '@store/services/employees/employeesService';

const AddDocument = ({ refetchData, data: employeeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { data: documentTypeData } = useGetDocumentTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateEmployeeDocumentSchema),
  });

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    reset();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    if (!selectedFile) return;
    setFile(selectedFile);
    setValue('file', selectedFile, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setError('');
    const selectedFile = e.dataTransfer.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setValue('file', selectedFile, { shouldValidate: true, shouldDirty: true });
  };

  const onDragOver = (e) => e.preventDefault();
  const handleDocumentTypeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('document_type', item_id);
    }
  };
  const onSubmit = async (data) => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('document_type', data.document_type);
    if (data.description) formData.append('description', data.description);
    if (data.expiry_date) formData.append('expiry_date', data.expiry_date);
    formData.append('file', file);
    formData.append('employee', employeeData.id);

    try {
      const response = await uploadDocument(formData).unwrap();
      toast.success(response.message || 'Document uploaded successfully');

      console.log('Submitting document', Object.fromEntries(formData));

      refetchData();
      closeModal();
    } catch (err) {
      toast.error('Failed to upload document. Please try again.');
      console.error(err);
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="flex items-center space-x-2 px-4 py-2  text-white bg-primary rounded-md transition duration-300 cursor-pointer"
      >
        <FiUploadCloud className="w-4 h-4" />
        <span className="text-sm">Add Document</span>
      </div>

      {isOpen && (
        <div className="relative z-50 animate-fadeIn" role="dialog" aria-modal="true">
          <div
            onClick={closeModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          <div className="fixed inset-0 min-h-full z-100 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all w-full sm:max-w-c-450 md:max-w-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg font-semibold">Upload Document</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={closeModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Document Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={documentTypeData?.map((item) => ({
                      value: item.id,
                      label: `${item.name} `,
                    }))}
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base) => ({
                        ...base,
                        minHeight: '44px',
                        borderColor: '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#9ca3af' },
                        '&:focus-within': { borderColor: '#9ca3af', boxShadow: 'none' },
                      }),
                    }}
                    onChange={handleDocumentTypeChange}
                  />
                  {errors.document_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.document_type.message}</p>
                  )}
                </div>

                {/* Description */}
                {/* <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                    rows={3}
                    onChange={(e) => setValue("description", e.target.value)}
                  />
                </div> */}

                {/* Expiry Date */}

                {/* File Upload */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                    ${
                      file
                        ? 'border-primary bg-primary-50'
                        : error
                          ? 'border-red-400 bg-red-50'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  onClick={triggerFileInput}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {file ? (
                    <div className="flex flex-col items-center relative w-full">
                      <FiCheckCircle className="text-primary text-4xl mb-3" />
                      <p className="text-gray-700 font-medium">{file.name}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <MdOutlineCloudUpload
                        className={`text-4xl mb-3 ${error ? 'text-red-500' : 'text-primary'}`}
                      />
                      <p className="text-gray-700 font-medium">
                        Click to select or drag a file here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">Supported formats: PDF, Images</p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input
                    type="date"
                    className="w-full border focus:border-primary 
                    focus:ring-none focus:outline-none rounded-md p-2 text-sm"
                    onChange={(e) => setValue('expiry_date', e.target.value)}
                  />
                </div>
                {/* Buttons */}
                <div className="flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-red-500 rounded-md text-red-700 hover:bg-red-500 hover:text-white font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!file || isSubmitting}
                    className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2
                      ${!file || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <PiSpinnerGap className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <MdOutlineCloudUpload /> Upload
                      </>
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

export default AddDocument;
