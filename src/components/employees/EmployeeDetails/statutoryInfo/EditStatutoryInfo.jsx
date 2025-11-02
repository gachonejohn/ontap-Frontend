import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEmployeeStatutorySchema } from '@schemas/employees/employeeSchema';
import { useGetDocumentTypesQuery } from '@store/services/companies/documentsService';
import { useEditStatutoryInfoMutation } from '@store/services/employees/employeesService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCheckCircle, FiEdit, FiX } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineCloudUpload } from 'react-icons/md';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const EditStatutoryInfo = ({ refetchData, data: employeeData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [editStatutoryInfo, { isLoading: isCreating }] = useEditStatutoryInfoMutation();
  const { data: documentTypesData } = useGetDocumentTypesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log('employeeData', employeeData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateEmployeeStatutorySchema),
    defaultValues: {
      identifier: employeeData?.identifier ?? '',
      document_type: employeeData?.document_type?.id ?? undefined,
      issue_date: employeeData?.issue_date ?? '',
      expiry_date: employeeData?.expiry_date ?? '',
    },
  });

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
  const onSubmit = async (data) => {
    const formData = new FormData();

    if (data.document_type) formData.append('document_type', data.document_type);
    if (data.identifier) formData.append('identifier', data.identifier);
    if (data.issue_date) formData.append('issue_date', data.issue_date);
    if (data.expiry_date) formData.append('expiry_date', data.expiry_date);
    // formData.append("employee", employeeData.id);

    // file is optional now
    if (file) formData.append('file', file);

    try {
      const response = await editStatutoryInfo({
        id: employeeData.id,
        data: formData,
      }).unwrap();
      toast.success(response.message || 'Info updated successfully!');
      refetchData();
      handleCloseModal();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Error saving info!.');
      toast.error(message);
    }
  };

  const existingFile = employeeData?.file;
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
    setFile(null);
    reset();
  };
  const handleDocumentTypeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('document_type', item_id);
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
          <div
            className="fixed inset-0 min-h-full z-50 w-screen
           flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none"
          >
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-2xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-500 md:max-w-c-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Add New Statutory Info
                </p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Identifier(Identification No.)
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g A071233R "
                    {...register('identifier')}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.identifier && (
                    <p className="text-red-500 text-sm">{errors.identifier.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Issue Date<span className="text-red-500"></span>
                    </label>
                    <input
                      type="date"
                      placeholder="Start Date"
                      {...register('issue_date')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.issue_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.issue_date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Expiry Date<span className="text-red-500"></span>
                    </label>
                    <input
                      type="date"
                      placeholder="Expiry Date"
                      {...register('expiry_date')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.expiry_date && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiry_date.message}</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Document Type</label>
                  <Select
                    options={documentTypesData?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    defaultValue={{
                      label: `${employeeData?.document_type?.name ?? ''}`,
                      value: `${employeeData?.document_type?.id ?? ''}`,
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
                    onChange={handleDocumentTypeChange}
                  />
                  {errors.document_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.document_type.message}</p>
                  )}
                </div>
                {/* <div
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer mb-6
                                ${
                                  file
                                    ? "border-primary bg-primary-50"
                                    : error
                                    ? "border-red-400 bg-red-50"
                                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
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
                        className={`text-4xl mb-3 ${
                          error ? "text-red-500" : "text-primary"
                        }`}
                      />
                      <p className="text-gray-700 font-medium">
                        Click to select or drag a file here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Supported formats: PDF
                      </p>
                    </>
                  )}
                </div> */}
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

                  {/* New file selected */}
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
                  ) : existingFile ? (
                    /* No new file but we have an existing file */
                    <div className="flex flex-col items-center w-full">
                      <FiCheckCircle className="text-primary text-4xl mb-3" />
                      <p className="text-gray-700 font-medium">Current file:</p>
                      <a
                        href={existingFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm break-words"
                      >
                        {existingFile.split('/').pop()}
                      </a>
                      <p className="text-gray-500 text-xs mt-1">
                        Click to replace with another file
                      </p>
                    </div>
                  ) : (
                    /* Nothing selected yet */
                    <>
                      <MdOutlineCloudUpload
                        className={`text-4xl mb-3 ${error ? 'text-red-500' : 'text-primary'}`}
                      />
                      <p className="text-gray-700 font-medium">
                        Click to select or drag a file here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">Supported formats: PDF</p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}

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
