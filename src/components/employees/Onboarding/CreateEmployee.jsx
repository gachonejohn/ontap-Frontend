import { personalInfoSchema } from '@schemas/onboarding/createEmployeeSchema';
import countryList from 'react-select-country-list';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetDepartmentsQuery,
  useGetPositionsQuery,
} from '@store/services/companies/companiesService';
import Select from 'react-select';

import { useCreateEmployeeMutation } from '@store/services/employees/employeesService';
import { useGetRolesQuery } from '@store/services/roles/rolesService';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FiChevronLeft, FiX } from 'react-icons/fi';
import { BiImageAdd } from 'react-icons/bi';
import { toast } from 'react-toastify';

import { Country, State, City } from 'country-state-city';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { genderOptions } from '@constants/constants';

export const CreateNewEmployee = () => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const { data: rolesData } = useGetRolesQuery({}, { refetchOnMountOrArgChange: true });
  const { data: departmentsData } = useGetDepartmentsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: positionsData } = useGetPositionsQuery({}, { refetchOnMountOrArgChange: true });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
  });

  useEffect(() => {
    console.log('Form Errors:', errors);
  }, [errors]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('street_address', data.street_address);
    formData.append('city', data.city);
    formData.append('postal_code', data.postal_code);
    formData.append('country', data.country);
    formData.append('email', data.email);
    formData.append('phone_number', data.phone_number);
    formData.append('date_of_birth', data.date_of_birth);
    formData.append('gender', data.gender);
    formData.append('nationality', data.nationality);

    if (data.marital_status) {
      formData.append('marital_status', data.marital_status);
    }
    if (data.role_id) {
      formData.append('role_id', data.role_id);
    }
    if (data.department_id) {
      formData.append('department_id', data.department_id);
    }
    if (data.position_id) {
      formData.append('position_id', data.position_id);
    }
    if (data.employee_no) {
      formData.append('employee_no', data.employee_no);
    }
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    try {
      const newEmployee = await createEmployee(formData).unwrap();
      toast.success('Employee added successfully!');
      navigate(`/dashboard/employees/${newEmployee.id}`);
    } catch (error) {
      console.error('Error:', error);
      if (error?.data?.error) {
        toast.error(error.data.error);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
;
    }
  };

  const handleGenderChange = (selected) => {
    selected && setValue('gender', selected.value);
  };

  const handleRoleChange = (selected) => {
    selected && setValue('role_id', Number(selected.value));
  };

  const handleDepartmentChange = (selected) => {
    selected && setValue('department_id', Number(selected.value));
  };

  const handlePositionChange = (selected) => {
    selected && setValue('position_id', Number(selected.value));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profile_picture', file, { shouldValidate: true });

      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setValue('profile_picture', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const nationalityOptions = useMemo(() => countryList().getData(), []);

  const handleCountryChange = (selected) => {
    if (selected) {
      setValue('nationality', selected.label);
    }
  };

  const countryOptions = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry).map((s) => ({
        value: s.isoCode,
        label: s.name,
      }))
    : [];

  const cityOptions =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry, selectedState).map((ci) => ({
          value: ci.name,
          label: ci.name,
        }))
      : [];

  const handleCountrySelect = (selected) => {
    setSelectedCountry(selected?.value || '');
    setSelectedState('');
    setValue('country', selected?.label || '');
  };

  const handleStateSelect = (selected) => {
    setSelectedState(selected?.value || '');
    setValue('state', selected?.label || '');
  };

  const handleCitySelect = (selected) => {
    setValue('city', selected?.label || '');
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center p-4 border bg-white rounded-lg shadow-sm justify-between border-b pb-4">
        <button
          onClick={() => navigate('/dashboard/employees')}
          className="flex items-center px-4 py-2 bg-white border rounded-md text-gray-600 hover:text-gray-800"
        >
          <FiChevronLeft size={20} />
          <span>Back to Employees</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl font-bold font-montserrat">Add New Employee</h1>
          <p className="text-sm text-gray-600">Fill in all required employee details</p>
        </div>

        <div className="px-6 py-2"></div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 py-5 bg-white rounded-lg border shadow-md"
      >
        <div className="pb-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Photo</h3>

          <div className="flex items-center justify-start">
            <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-slate-50 hover:bg-gray-100 transition-colors flex items-center justify-center text-center cursor-pointer relative">
              <label className="w-full h-full flex flex-col items-center justify-center rounded-lg cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {profileImage ? (
                  <>
                    <img
                      src={profileImage}
                      alt="Passport photo"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </>
                ) : (
                  <div className="px-2 flex flex-col items-center">
                    <BiImageAdd className="text-primary text-2xl mb-1" />
                    <p className="text-xs font-semibold text-gray-700">Passport photo</p>
                    <p className="text-[10px] text-gray-500 mt-1">PNG, JPG or JPEG (max. 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* BASIC INFO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FIRST NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('first_name')}
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none"
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="text-red-600 text-sm">{errors.first_name.message}</p>
              )}
            </div>

            {/* LAST NAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register('last_name')}
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none"
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="text-red-600 text-sm">{errors.last_name.message}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('date_of_birth')}
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none"
              />
              {errors.date_of_birth && (
                <p className="text-red-500 text-sm">{errors.date_of_birth.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full py-2 px-4 rounded-md border bg-slate-50"
                placeholder="Enter email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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
            {/* PHONE NUMBER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phone_number')}
                className="w-full px-4 py-2 border rounded-lg bg-slate-50 focus:outline-none"
                placeholder="+1 555 123 4567"
              />
              {errors.phone_number && (
                <p className="text-red-500 text-sm">{errors.phone_number.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                Employee No <span className="text-red-500"></span>
              </label>
              <input
                {...register('employee_no')}
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none"
                placeholder="Enter employee no"
              />
              {errors.employee_no && (
                <p className="text-red-600 text-sm">{errors.employee_no.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Nationality <span className="text-red-500">*</span>
              </label>
              <Select
                options={nationalityOptions}
                menuPortalTarget={document.body}
                onChange={handleCountryChange}
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
              {errors.nationality && (
                <p className="text-red-500 text-sm">{errors.nationality.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Address <span className="text-red-500">*</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-red-500">*</span>
              </label>
              <Select
                options={countryOptions}
                onChange={handleCountrySelect}
                menuPortalTarget={document.body}
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
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
              )}
            </div>

            {/* STATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State / Region <span className="text-red-500">*</span>
              </label>
              <Select
                options={stateOptions}
                onChange={handleStateSelect}
                isDisabled={!selectedCountry}
                menuPortalTarget={document.body}
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
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <Select
                options={cityOptions}
                onChange={handleCitySelect}
                isDisabled={!selectedState}
                menuPortalTarget={document.body}
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
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            {/* STREET ADDRESS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                {...register('street_address')}
                className="w-full px-4 py-2 border bg-slate-50 rounded-lg focus:outline-none"
                placeholder="Enter Street Address"
              />
              {errors.street_address && (
                <p className="text-red-500 text-sm mt-1">{errors.street_address.message}</p>
              )}
            </div>

            {/* POSTAL CODE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                {...register('postal_code')}
                className="w-full px-4 py-2 border bg-slate-50 rounded-lg focus:outline-none"
                placeholder="Enter Postal Code"
              />
              {errors.postal_code && (
                <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Information <span className="text-red-500"></span>
          </h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Department<span className="text-red-500"></span>
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
            <div className="">
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
        </div>

        {/* Submit button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isCreating}
            className={`px-6 py-2 rounded-md text-white font-medium shadow-sm transition-colors
              ${isCreating ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-600'}`}
          >
            {isCreating ? 'Saving...' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};
