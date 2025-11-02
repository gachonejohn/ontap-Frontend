import Select from 'react-select';

const NextOfKinTab = ({ register, errors, setValue }) => {
  const handleRelationshipChange = (selected) => {
    if (selected) {
      setValue('next_of_kin.relationship', selected.value);
    }
  };

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'relative', label: 'Relative' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('next_of_kin.full_name')}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Full name"
            />
            {errors.next_of_kin?.full_name && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.next_of_kin.full_name.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('next_of_kin.phone_number')}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Phone number"
            />
            {errors.next_of_kin?.phone_number && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.next_of_kin.phone_number.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('next_of_kin.email')}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Email address"
            />
            {errors.next_of_kin?.email && (
              <p className="text-red-500 text-[12px] mt-1">{errors.next_of_kin.email.message}</p>
            )}
          </div>

          {/* Relationship with react-select */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Relationship <span className="text-red-500">*</span>
            </label>
            <Select
              options={relationshipOptions}
              onChange={handleRelationshipChange}
              placeholder="Select relationship"
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
            {errors.next_of_kin?.relationship && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.next_of_kin.relationship.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-[12px] font-medium mb-1">Address</label>
            <textarea
              {...register('next_of_kin.address')}
              rows={3}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Full address"
            />
            {errors.next_of_kin?.address && (
              <p className="text-red-500 text-[12px] mt-1">{errors.next_of_kin.address.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextOfKinTab;
