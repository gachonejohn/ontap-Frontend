import SubmitCancelButtons from "@components/common/Buttons/ActionButton";
import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBreakTypePolicyAssignmentSchema } from "@schemas/companies/policies/breaksPolicySchema";

import { useCreateBreakTypeAssignmentMutation, useGetBreakCategoriesQuery, useGetBreakRulesQuery } from "@store/services/policies/policyService";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
export const AssignBreakTypePolicy= ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createBreakTypeAssignment, { isLoading: isCreating }] =
    useCreateBreakTypeAssignmentMutation();
  const { data: categoriesData } = useGetBreakCategoriesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const { data: rulesData } = useGetBreakRulesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log("categoriesData", categoriesData)
 
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(CreateBreakTypePolicyAssignmentSchema),
  });
  useEffect(() => {
      console.log("Form Errors:", errors);
    }, [errors]);
  const onSubmit = async (formData) => {
    try {
      await createBreakTypeAssignment(formData).unwrap();
      toast.success("Break Type assigned Policy successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error assigning policy to break type."
      );
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
  const handleBreakTypeChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue("break_type", item_id);
    }
  };
  const handleBreakRuleChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue("break_rule", item_id);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="New Policy Assignment"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2
        rounded-md  transition-all duration-200 shadow-sm hover:shadow-md 
         hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
              rounded-2xl bg-white text-left shadow-xl transition-all w-full 
              sm:max-w-c-450 md:max-w-c-450 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Add New Break Type Policy Assignment
                </p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Name */}
                
                <div className="">
                  <label className="block text-sm font-medium mb-2">
                    Break Type
                  </label>
                  <Select
                    options={categoriesData?.map((item) => ({
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
                    onChange={handleBreakTypeChange}
                  />
                  {errors.break_type && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.break_type.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className="block text-sm font-medium mb-2">
                    Break Policy
                  </label>
                  <Select
                    options={rulesData?.map((item) => ({
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
                    onChange={handleBreakRuleChange}
                  />
                  {errors.break_rule && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.break_rule.message}
                    </p>
                  )}
                </div>
                 
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Max Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register("max_duration_minutes", {
                      valueAsNumber: true,
                    })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.max_duration_minutes && (
                    <p className="text-red-500 text-sm">
                      {errors.max_duration_minutes.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Grace Period (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register("grace_period_minutes", {
                      valueAsNumber: true,
                    })}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-primary focus:bg-white placeholder:text-sm"
                  />
                  {errors.grace_period_minutes && (
                    <p className="text-red-500 text-sm">
                      {errors.grace_period_minutes.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="required"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    {...register("required")}
                  />
                  <label
                    htmlFor="required"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Required
                  </label>
                </div>
                {/* Buttons */}
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isCreating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
