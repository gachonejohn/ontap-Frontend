import { zodResolver } from '@hookform/resolvers/zod';

import { updateEmployeeSchema } from '@schemas/employees/employeeSchema';
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from '@store/services/companies/companiesService';
import { useGetRolesQuery } from '@store/services/roles/rolesService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useUpdateWorkInfoMutation } from '../../../../store/services/employees/employeesService';
import SubmitCancelButtons from '../../../common/Buttons/ActionButton';
import CreateUpdateButton from '../../../common/Buttons/CreateUpdateButton';

export const EditWorkInfo = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateWorkInfo, { isLoading: isUpdating }] = useUpdateWorkInfoMutation();
  const { data: rolesData } = useGetRolesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: departmentsData } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: positionsData } = useGetPositionsQuery({}, { refetchOnMountOrArgChange: true });
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      department_id: data?.department?.id ?? undefined,
      role_id: data?.role?.id ?? undefined,
      position: data?.position?.id ?? undefined,
    },
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const handleRoleChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('role', item_id);
    }
  };

  const handleDepartmentChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('department', item_id);
    }
  };

  const handlePositionChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('position', item_id);
    }
  };
  const onSubmit = async (formData) => {
    try {
      await updateWorkInfo({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success('Work details updated successfully!');
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error Updating work Info.');
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

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        title="Edit"
        label=""
        icon={<FiEdit className="w-4 h-4" />}
        className="group relative p-2 bg-amber-100 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
      />
      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center  p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
                   overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-500 md:max-w-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">Edit Work Information</p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={handleCloseModal}
                />
              </div>

              {/* Scrollable form content */}

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department<span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={departmentsData?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    defaultValue={{
                      label: `${data?.department?.name ?? ''}`,
                      value: `${data?.department?.id}`,
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
                    onChange={handleDepartmentChange}
                  />
                  {errors.department_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.department_id.message}</p>
                  )}
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <Select
                    options={positionsData?.results?.map((item) => ({
                      value: item.id,
                      label: `${item.title}`,
                    }))}
                    defaultValue={{
                      label: `${data?.position?.title ?? ''} `,
                      value: data?.position?.id,
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
                    onChange={handlePositionChange}
                  />
                  {errors.position_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.position_id.message}</p>
                  )}
                </div>

                {/* Role - spans full width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <Select
                    options={rolesData?.results?.map((item) => ({
                      value: item.id,
                      label: `${item.name}`,
                    }))}
                    defaultValue={{
                      label: `${data?.role?.name ?? ''}`,
                      value: `${data?.role?.id}`,
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
                    onChange={handleRoleChange}
                  />
                  {errors.role_id && (
                    <p className="text-red-500 text-sm mt-1">{errors.role_id.message}</p>
                  )}
                </div>
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isUpdating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
