import Select from 'react-select';
const PersonalDetailsTab = ({
  register,
  errors,
  setValue,
  rolesData,
  departmentsData,
  positionsData,
}) => {
  const handleRoleChange = (selected) => {
    if (selected) setValue('role_id', Number(selected.value));
  };

  const handleDepartmentChange = (selected) => {
    if (selected) setValue('department_id', Number(selected.value));
  };

  const handlePositionChange = (selected) => {
    if (selected) setValue('position_id', Number(selected.value));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px]  font-medium mb-2">
            First Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="E.g. Peter"
            {...register('first_name')}
            className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] "
          />
          {errors.first_name && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px] font-medium mb-2 ">
            Last Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="E.g. Smith"
            {...register('last_name')}
            className="w-full py-2
             px-4 rounded-md border bg-slate-50 focus:outline-none
              focus:border-primary focus:bg-white placeholder:text-[12px] "
          />
          {errors.last_name && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="+234...."
            {...register('phone_number')}
            className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] "
          />
          {errors.phone_number && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.phone_number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="Enter email"
            {...register('email')}
            className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] "
          />
          {errors.email && <p className="text-red-500 text-[12px]  mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">Employee Number</label>
          <input
            type="text"
            placeholder="EMP-002"
            {...register('employee_no')}
            className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] "
          />
          {errors.employee_no && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.employee_no.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">Department</label>
          <Select
            options={departmentsData?.results?.map((item) => ({
              value: item.id,
              label: item.name,
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
                minHeight: '24px',
                minWidth: '200px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
                '&:focus-within': {
                  borderColor: '#9ca3af',
                  boxShadow: 'none',
                },
                backgroundColor: '#F3F4F6',
              }),
            }}
            onChange={handleDepartmentChange}
            placeholder="Select department"
          />
          {errors.department_id && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.department_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">Position</label>
          <Select
            options={positionsData?.results?.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.department.name})`,
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
                minHeight: '24px',
                minWidth: '200px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
                '&:focus-within': {
                  borderColor: '#9ca3af',
                  boxShadow: 'none',
                },
                backgroundColor: '#F3F4F6',
              }),
            }}
            onChange={handlePositionChange}
            placeholder="Select position"
          />
          {errors.position_id && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.position_id.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[12px]  font-medium mb-2">Role</label>
          <Select
            options={rolesData?.results?.map((item) => ({
              value: item.id,
              label: item.name,
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
                minHeight: '24px',
                minWidth: '200px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
                '&:focus-within': {
                  borderColor: '#9ca3af',
                  boxShadow: 'none',
                },
                backgroundColor: '#F3F4F6',
              }),
            }}
            onChange={handleRoleChange}
            placeholder="Select role"
          />
          {errors.role_id && (
            <p className="text-red-500 text-[12px]  mt-1">{errors.role_id.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default PersonalDetailsTab;
