import Select from 'react-select';

const EmergencyContactTab = ({ register, errors, setValue }) => {
  const handleRelationshipChange = (selected) => {
    if (selected) setValue('emergency_contact.relationship', selected.value);
  };

  const relationshipOptions = [
    { value: 'SPOUSE', label: 'Spouse' },
    { value: 'PARENT', label: 'Parent' },
    { value: 'CHILD', label: 'Child' },
    { value: 'SIBLING', label: 'Sibling' },
    { value: 'RELATIVE', label: 'Relative' },
    { value: 'FRIEND', label: 'Friend' },
    { value: 'GUARDIAN', label: 'Guardian' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Name */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('emergency_contact.name')}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Emergency contact name"
            />
            {errors.emergency_contact?.name && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.emergency_contact.name.message}
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
              {...register('emergency_contact.phone')}
              className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
              placeholder="Emergency contact phone"
            />
            {errors.emergency_contact?.phone && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.emergency_contact.phone.message}
              </p>
            )}
          </div>
        </div>
        {/* Relationship with react-select */}
        <div className="mt-4 mb-2">
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
          {errors.emergency_contact?.relationship && (
            <p className="text-red-500 text-[12px] mt-1">
              {errors.emergency_contact.relationship.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mt-2">
          <label className="block text-[12px] font-medium mb-1">Address</label>
          <textarea
            {...register('emergency_contact.address')}
            rows={3}
            className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none 
              focus:border-primary focus:bg-white placeholder:text-[12px]"
            placeholder="Emergency contact address"
          />
          {errors.emergency_contact?.address && (
            <p className="text-red-500 text-[12px] mt-1">
              {errors.emergency_contact.address.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactTab;
