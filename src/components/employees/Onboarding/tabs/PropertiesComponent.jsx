import Select from 'react-select';
const PropertiesTab = ({ register, errors, setValue, propertiesData }) => {
  const handlePropertyChange = (selected) => {
    if (selected) {
        setValue("property.property_id", Number(selected.value));
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6 mt-3">
       
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium mb-1">Property*</label>
              <Select
                options={propertiesData?.results?.map((item) => ({
                  value: item.id,
                  label: `${item.name} (${item.type})`,
                }))}
                onChange={handlePropertyChange}
                placeholder="Select property"
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "24px",
                    backgroundColor: "white",
                    fontSize: "12px",
                    fontWeight: "normal",
                    color: "#000000",
                    border: "1px solid #D1D5DB",
                    borderRadius: "4px",
                    boxShadow: "none",
                    "&:hover": {
                      border: "1px solid #D1D5DB",
                    },
                    "&:focus": {
                      border: "1px solid #D1D5DB",
                    }
                  }),
                }}
              />
              {errors.property?.property_id && (
                <p className="text-red-500 text-[12px] mt-1">{errors.property.property_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1">Issue Date</label>
              <input
                type="date"
                {...register("property.issue_date")}
                className="w-full py-2 px-3 text-[12px] rounded-md border bg-white focus:outline-none focus:border-primary"
              />
              {errors.property?.issue_date && (
                <p className="text-red-500 text-[12px] mt-1">{errors.property.issue_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1">Return Date</label>
              <input
                type="date"
                {...register("property.return_date")}
                className="w-full py-2 px-3 text-[12px] rounded-md border bg-white focus:outline-none focus:border-primary"
              />
              {errors.property?.return_date && (
                <p className="text-red-500 text-[12px] mt-1">{errors.property.return_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[12px] font-medium mb-1">Condition on Issue</label>
              <input
                type="text"
                {...register("property.condition_on_issue")}
                className="w-full py-2 px-3 rounded-md border bg-white focus:outline-none focus:border-primary"
                placeholder="e.g. Good, Fair, Poor"
              />
              {errors.property?.condition_on_issue && (
                <p className="text-red-500 text-[12px] mt-1">{errors.property.condition_on_issue.message}</p>
              )}
            </div>

            {/* <div className="md:col-span-2">
              <label className="block text-[12px] font-medium mb-1">Condition on Return</label>
              <input
                type="text"
                {...register("property.condition_on_return")}
                className="w-full py-2 px-3 rounded-md border bg-white focus:outline-none focus:border-primary"
                placeholder="e.g. Good, Fair, Poor"
              />
              {errors.property?.condition_on_return && (
                <p className="text-red-500 text-[12px] mt-1">{errors.property.condition_on_return.message}</p>
              )}
            </div> */}
          </div>
       
      </div>
    </div>
  );
};
export default PropertiesTab;