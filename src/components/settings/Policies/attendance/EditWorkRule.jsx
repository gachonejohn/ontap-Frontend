import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import SubmitSpinner from "../../../common/spinners/submitSpinner";

import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { attendancePolicyOptions } from "@constants/constants";
import { CreateAttendancePolicySchema } from "@schemas/companies/policies/attendancePolicySchema";
import { useUpdateAttendancePolicyMutation } from "@store/services/policies/policyService";
export const EditAttendacePolicy = ({ data, refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateAttendacePolicy, { isLoading: isCreating }] =
    useUpdateAttendancePolicyMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateAttendancePolicySchema),
    defaultValues: {
      rule_type: data?.rule_type ?? "",
      rule_time: data?.rule_time ?? "",
      grace_minutes: data?.grace_minutes ?? "",
      description: data?.description ?? "",
      is_default: data?.is_default ?? false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const payload = {
        ...formData,
        timezone: userTimezone,
      };

      await updateAttendacePolicy({
        id: data.id,
        data: payload,
      }).unwrap();
      toast.success("Attendance Policy updated successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      console.error("Error:", error);
      if (error && error.data && error.data.error) {
        toast.error(error.data.error);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      refetchData();
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    reset();
    setIsOpen(false);
  };
  const handleRuleTypeChange = (selected) => {
    if (selected) {
      setValue("rule_type", selected.value);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Edit"
        label="Edit"
        icon={<FiEdit className="w-4 h-4 text-amber-500" />}
        className="px-4 py-2 w-full focus:outline-none focus:border-none ffocus:ring-none"
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
          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-c-500 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Add New Attendance Policy
                </p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Rule Type
                  </label>
                  <Select
                    options={attendancePolicyOptions}
                    menuPortalTarget={document.body}
                    defaultValue={{
                      label: data.rule_type,
                      value: data.rule_type,
                    }}
                    menuPlacement="auto"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "40px",
                        borderColor: "#d1d5db",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#9ca3af",
                        },
                        "&:focus-within": {
                          borderColor: "#9ca3af",
                          boxShadow: "none",
                        },
                        backgroundColor: "#F8FAFC",
                      }),
                    }}
                    onChange={handleRuleTypeChange}
                  />
                  {errors.rule_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rule_type.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rule Time
                  </label>
                  <input
                    type="time"
                    {...register("rule_time")}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm cursor-text"
                  />
                  {errors.rule_time && (
                    <p className="text-red-500 text-sm">
                      {errors.rule_time.message}
                    </p>
                  )}
                </div>

                {/* Grace Minutes */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grace Minutes
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Enter grace period in minutes"
                    {...register("grace_minutes", { valueAsNumber: true })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.grace_minutes && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.grace_minutes.message}
                    </p>
                  )}
                </div>
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Description here..."
                    {...register("description")}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="is_default"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    {...register("is_default")}
                  />
                  <label
                    htmlFor="is_default"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Set as Default
                  </label>
                </div>
                {/* Buttons */}
                <div className="sticky bottom-0 bg-white z-40 flex gap-4 justify-between items-center py-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full md:w-auto hover:bg-red-500 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isCreating}
                    className="bg-primary text-white py-2 px-4 rounded-lg w-full md:w-auto hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting || isCreating ? (
                      <span className="flex items-center gap-2">
                        <SubmitSpinner />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
