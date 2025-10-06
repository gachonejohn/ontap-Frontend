import { zodResolver } from "@hookform/resolvers/zod";
import { CreateEmployeeContractSchema } from "@schemas/employees/employmentSchema";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  contractTypeOptions,
  payFrequencyOptions,
  workLocationOptions,
} from "../../../constants/constants";
import { useCreateContractMutation, useUpdateContractMutation } from "../../../store/services/employees/employeesService";
import SubmitCancelButtons from "../../common/Buttons/ActionButton";
import CreateUpdateButton from "../../common/Buttons/CreateUpdateButton";

export const UpdateContract = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("data", data)
  const [updateContract, { isLoading: isUpdating }] =
    useUpdateContractMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateEmployeeContractSchema),
    defaultValues: {
      basic_salary: data?.basic_salary ?? "",
      salary_currency: data?.salary_currency ?? "",
      start_date: data?.start_date ?? "",
      end_date: data?.end_date ?? "",
      status: data?.status ?? "",
      contract_type: data?.contract_type ?? "",
      work_location: data?.work_location ?? "",
      reporting_to: data?.reporting_to ?? "",
      is_paid: data?.is_paid ?? "",
    },
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    try {
      await updateContract({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success("Contract details updated successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error Updating contract.");
      toast.error(message);
    } finally {
      refetchData();
    }
  };
  const handleContractTypeChange = (selected) => {
    if (selected) {
      setValue("contract_type", selected.value);
    }
  };
  const handlePayFrequencyChange = (selected) => {
    if (selected) {
      setValue("pay_frequency", selected.value);
    }
  };
  const handleWorkLocationChange = (selected) => {
    if (selected) {
      setValue("work_location", selected.value);
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
                   overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-550 md:max-w-550 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Edit Contract Information
                </p>
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
                    Basic Salary<span className="text-red-500"></span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ksh"
                    {...register("basic_salary")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.basic_salary && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.basic_salary.message}
                    </p>
                  )}
                </div>

                {/* Grid for remaining fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Salary Currency<span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. KES"
                      {...register("salary_currency")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.salary_currency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.salary_currency.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Start Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Start Date"
                      {...register("start_date")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.start_date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      End Date<span className="text-red-500"></span>
                    </label>
                    <input
                      type="date"
                      placeholder="End Date"
                      {...register("end_date")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.end_date && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.end_date.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contract Type <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={contractTypeOptions}
                      defaultValue={{
                        label:data.contract_type,
                        value: data.contract_type,
                     
                      }}
                      onChange={handleContractTypeChange}
                      placeholder="Contract Type"
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
                    {errors.contract_type && (
                      <p className="text-red-500 text-[12px] mt-1">
                        {errors.contract_type.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment Frequency <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={payFrequencyOptions}
                      defaultValue={{
                        label:data.pay_frequency,
                        value: data.pay_frequency,
                      }}
                      onChange={handlePayFrequencyChange}
                      placeholder="Payment Frequency"
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
                    {errors.pay_frequency && (
                      <p className="text-red-500 text-[12px] mt-1">
                        {errors.pay_frequency.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Work Location <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={workLocationOptions}
                      defaultValue={{
                        label:data.work_location,
                        value: data.work_location,
                    
                      }}
                      onChange={handleWorkLocationChange}
                      placeholder="Work Location"
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
                    {errors.work_location && (
                      <p className="text-red-500 text-[12px] mt-1">
                        {errors.work_location.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Supervisor<span className="text-red-500"></span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Peter"
                    {...register("reporting_to")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.reporting_to && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.reporting_to.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="is_paid"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    {...register("is_paid")}
                  />
                  <label
                    htmlFor="is_paid"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Is Paid
                  </label>
                </div>
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isUpdating}
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
