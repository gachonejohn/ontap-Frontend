import Select from "react-select";

const EmploymentDetailsTab = ({ register, errors, setValue }) => {
  const handleContractTypeChange = (selected) => {
    if (selected) setValue("contract.contract_type", selected.value);
  };

  const handleWorkLocationChange = (selected) => {
    if (selected) setValue("contract.work_location", selected.value);
  };

  const contractTypeOptions = [
    { value: "Permanent", label: "Permanent" },
    { value: "Contract", label: "Fixed Term" },
    { value: "Probation", label: "Probation" },
    { value: "Internship", label: "Internship" },
    { value: "Volunteer", label: "Volunteer" },
    { value: "Other", label: "Other" },
  ];

  const workLocationOptions = [
    { value: "On Site", label: "On Site" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Salary */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Basic Salary
            </label>
            <input
              type="number"
              {...register("contract.basic_salary", { valueAsNumber: true })}
              className="w-full py-2 px-3 rounded-md border bg-white focus:outline-none focus:border-primary"
              placeholder="0.00"
            />
            {errors.contract?.basic_salary && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.contract.basic_salary.message}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Currency
            </label>
            <input
              type="text"
              {...register("contract.salary_currency")}
              className="w-full py-2 px-3 rounded-md border bg-white focus:outline-none focus:border-primary"
              placeholder="e.g KES"
            />
            {errors.contract?.salary_currency && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.contract.salary_currency.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {/* Contract Type */}
          <div className="mt-3">
            <label className="block text-[12px] font-medium mb-1">
              Contract Type
            </label>
            <Select
              options={contractTypeOptions}
              onChange={handleContractTypeChange}
              placeholder="Select type"
              menuPortalTarget={document.body}
              menuPlacement="auto"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  minHeight: "36px",
                  borderColor: "#d1d5db",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#9ca3af" },
                  backgroundColor: "#F3F4F6",
                }),
              }}
            />
            {errors.contract?.contract_type && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.contract.contract_type.message}
              </p>
            )}
          </div>

          {/* Work Location */}
          <div className="mt-3">
            <label className="block text-[12px] font-medium mb-1">
              Work Location <span className="text-red-500">*</span>
            </label>
            <Select
              options={workLocationOptions}
              onChange={handleWorkLocationChange}
              placeholder="Select location"
              menuPortalTarget={document.body}
              menuPlacement="auto"
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  minHeight: "36px",
                  borderColor: "#d1d5db",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#9ca3af" },
                  backgroundColor: "#F3F4F6",
                }),
              }}
            />
            {errors.contract?.work_location && (
              <p className="text-red-500 text-[12px] mt-1">
                {errors.contract.work_location.message}
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-[12px] font-medium mb-1">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("contract.start_date")}
              className="w-full py-2 px-3  text-[12px] rounded-md border bg-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("contract.end_date")}
              className="w-full py-2 px-3 text-[12px] rounded-md border bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Supervisor */}
        <div className="mt-3">
          <label className="block text-[12px] font-medium mb-1">
            Supervisor
          </label>
          <input
            type="text"
            {...register("contract.reporting_to")}
            className="w-full py-2 px-3 rounded-md border bg-white focus:outline-none focus:border-primary"
            placeholder="supervisor name"
          />
        </div>
      </div>
    </div>
  );
};

export default EmploymentDetailsTab;
