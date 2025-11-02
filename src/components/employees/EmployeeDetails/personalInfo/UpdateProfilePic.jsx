import { useState, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { FiEdit, FiCheckCircle, FiX } from 'react-icons/fi';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { PiSpinnerGap } from 'react-icons/pi';
import { toast } from 'react-toastify';
import { useUpdateProfilePicMutation } from '@store/services/employees/employeesService';

const EditProfilePicture = ({ data: employeeData, refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const [updateProfilePicture, { isLoading }] = useUpdateProfilePicMutation();

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setFile(null);
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setError('');
    if (!selectedFile) return;
    setFile(selectedFile);
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
  };
  const onDragOver = (e) => e.preventDefault();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      await updateProfilePicture({
        id: employeeData.user.id,
        data: formData,
      }).unwrap();
      toast.success('Profile picture updated successfully');
      refetchData();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <>
      {/* Button over the profile pic */}
      <div
        onClick={openModal}
        className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-200 cursor-pointer"
      >
        <FiEdit className="w-3 h-3 text-gray-600" />
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
                <p className="text-sm md:text-lg font-semibold">Update Profile Picture</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={closeModal} />
              </div>

              <form onSubmit={onSubmit} className="space-y-4 p-4">
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
                    accept="image/*"
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
                        Click to select or drag an image here
                      </p>
                      <p className="text-gray-500 text-sm mt-1">
                        Supported formats: Images (JPG, PNG, …)
                      </p>
                    </>
                  )}
                </div>

                {error && (
                  <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}

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
                    disabled={!file || isLoading}
                    className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2
                      ${!file || isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'}`}
                  >
                    {isLoading ? (
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

export default EditProfilePicture;
