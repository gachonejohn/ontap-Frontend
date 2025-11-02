import SubmitCancelButtons from '@components/common/Buttons/ActionButton';
import CreateUpdateButton from '@components/common/Buttons/CreateUpdateButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { selectTimezoneSchema } from '@schemas/settingsSchema';
import {
  useGetTimezonesQuery,
  useSetTimezoneMutation,
} from '@store/services/employees/employeesService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiGlobe } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
export const SetTimezone = ({ refetchData, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [setTimezone, { isLoading: isCreating }] = useSetTimezoneMutation();
  const { data: timezoneData } = useGetTimezonesQuery({}, { refetchOnMountOrArgChange: true });
  console.log('timezoneData', timezoneData);
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(selectTimezoneSchema),
  });

  const onSubmit = async (formData) => {
    try {
      await setTimezone(formData).unwrap();
      toast.success('Timezone updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error Updating timezone.');
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
  const handleTimezoneChange = (selected) => {
    if (selected) {
      const item_id = String(selected.value);
      setValue('timezone', item_id);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label={buttonText}
        icon={<FiGlobe className="w-4 h-4" />}
        className="text-sm text-gray-600  font-montserrat group font-medium group-hover:text-gray-800 transition-colors"
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
          flex flex-col text-center md:items-center justify-start 
          overflow-y-auto p-2 md:p-3 pointer-events-none"
          >
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-400 md:max-w-c-400 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Configure Timezone</p>
                <IoCloseOutline size={20} className="cursor-pointer" onClick={handleCloseModal} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <Select
                    options={timezoneData?.map((item) => ({
                      value: item.value,
                      label: `${item.label}`,
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
                        minHeight: '25px',
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
                    onChange={handleTimezoneChange}
                  />
                  {errors.timezone && (
                    <p className="text-red-500 text-sm mt-1">{errors.timezone.message}</p>
                  )}
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
