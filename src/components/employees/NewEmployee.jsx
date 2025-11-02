import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { genderOptions } from '../../constants/constants';
import { createEmployeeSchema } from '../../schemas/employees/employeeSchema';
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from '../../store/services/companies/companiesService';
import { useCreateEmployeeMutation } from '../../store/services/employees/employeesService';
import { useGetRolesQuery } from '../../store/services/roles/rolesService';
import SubmitCancelButtons from '../common/Buttons/ActionButton';
import CreateUpdateButton from '../common/Buttons/CreateUpdateButton';

export const CreateEmployee = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const { data: rolesData } = useGetRolesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: departmentsData } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: positionsData } = useGetPositionsQuery({}, { refetchOnMountOrArgChange: true });
  console.log('departments', departmentsData);
  console.log('positions', positionsData);
  console.log('roles', rolesData);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createEmployeeSchema),
  });
  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    try {
      await createEmployee(formData).unwrap();
      toast.success('Employee added successfully!');
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
  const handleGenderChange = (selected) => {
    if (selected) {
      setValue('gender', selected.value);
    }
  };
  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };

  const handleRoleChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('role_id', item_id);
    }
  };

  const handleDepartmentChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('department_id', item_id);
    }
  };

  const handlePositionChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('position_id', item_id);
    }
  };

  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        title="Add New"
        label="New Employee"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2
         hover:bg-primary-600 focus:ring-primary-500 rounded-md  transition-all duration-200 shadow-sm hover:shadow-md  focus:ring-offset-1"
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
                   overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-500 md:max-w-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">New Employee</p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer hover:text-gray-600"
                  onClick={handleCloseModal}
                />
              </div>

              {/* Scrollable form content */}

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                {/* First Name - Full Width */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Peter"
                    {...register('first_name')}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                {/* Grid for remaining fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. Smith"
                      {...register('last_name')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Date of birth"
                      {...register('date_of_birth')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">{errors.date_of_birth.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={genderOptions}
                      onChange={handleGenderChange}
                      placeholder="Select Gender"
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        control: (base) => ({
                          ...base,
                          minHeight: '36px',
                          borderColor: '#d1d5db',
                          boxShadow: 'none',
                          '&:hover': { borderColor: '#9ca3af' },
                          backgroundColor: '#F3F4F6',
                        }),
                      }}
                    />
                    {errors.gender && (
                      <p className="text-red-500 text-[12px] mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+234...."
                      {...register('phone_number')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...register('email')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Employee Number */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee Number</label>
                    <input
                      type="text"
                      placeholder="EMP-002"
                      {...register('employee_no')}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.employee_no && (
                      <p className="text-red-500 text-sm mt-1">{errors.employee_no.message}</p>
                    )}
                  </div>

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
                      options={positionsData?.map((item) => ({
                        value: item.id,
                        label: `${item.title}`,
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
                      options={rolesData?.map((item) => ({
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
                      onChange={handleRoleChange}
                    />
                    {errors.role_id && (
                      <p className="text-red-500 text-sm mt-1">{errors.role_id.message}</p>
                    )}
                  </div>
                </div>
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isCreating}
                />
              </form>

              {/* Footer - sticky */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
