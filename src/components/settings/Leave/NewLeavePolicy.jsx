import { zodResolver } from "@hookform/resolvers/zod";
import { createLeavePolicySchema } from "@schemas/companies/leaveSchema";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "react-toastify";

import SubmitCancelButtons from "@components/common/Buttons/ActionButton";
import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { 
  useCreateLeavePolicyMutation
} from "@store/services/leaves/leaveService";
import { getApiErrorMessage } from "@utils/errorHandler";

export const CreateLeavePolicy = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createLeavePolicy, { isLoading: isCreating }] =
    useCreateLeavePolicyMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createLeavePolicySchema),
    defaultValues: {
      name: "",
      description: "",
      default_days: "",
      can_carry_forward: false,
      carry_forward_limit: "0",
      requires_document_after: "0",
      is_active: true,
    },
  });

  const canCarryForward = watch("can_carry_forward");

  const onSubmit = async (formData) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description || "",
        default_days: parseInt(formData.default_days, 10),
        can_carry_forward: Boolean(formData.can_carry_forward),
        carry_forward_limit: formData.can_carry_forward
          ? parseInt(formData.carry_forward_limit, 10)
          : 0,
        requires_document_after: parseInt(formData.requires_document_after, 10) || 0,
        is_active: Boolean(formData.is_active),
      };

      await createLeavePolicy(payload).unwrap();
      toast.success("Leave policy created successfully!");
      
      toast.info("You can edit and create entitlements for this policy.");

      handleCloseModal();
      refetchData?.();
    } catch (error) {
      console.error('Create policy error:', error);
      const message = getApiErrorMessage(error, "Error creating leave policy.");
      toast.error(message);
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
        label="New Leave Policy"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-primary text-white px-4 py-2 rounded-md transition-all duration-200 shadow-sm hover:shadow-md hover:bg-primary-600 focus:ring-primary-500 focus:ring-offset-1"
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
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-c-600 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Add Leave Policy
                </p>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={handleCloseModal}
                />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
                {/* Policy Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Policy Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g Annual Leave"
                    {...register("name")}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe this policy..."
                    {...register("description")}
                    rows={3}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm resize-none"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Default Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Days<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 21"
                    min="0"
                    {...register("default_days")}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.default_days && (
                    <p className="text-red-500 text-sm">{errors.default_days.message}</p>
                  )}
                </div>

                {/* Allow Carry Forward */}
                <div className="flex items-center gap-3 py-2 px-4 border border-gray-400 rounded-md bg-white cursor-pointer hover:border-[#1E9FF2]">
                  <input
                    type="checkbox"
                    id="can_carry_forward"
                    {...register("can_carry_forward")}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor="can_carry_forward"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Allow carry forward to next year
                  </label>
                </div>

                {/* Carry Forward Limit */}
                {canCarryForward && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Carry Forward Limit (days)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      min="0"
                      {...register("carry_forward_limit")}
                      className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                    />
                    {errors.carry_forward_limit && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.carry_forward_limit.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Require Document After */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Require Document After (days)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2 (0 = not required)"
                    min="0"
                    {...register("requires_document_after")}
                    className="w-full py-2 px-4 rounded-md border border-gray-400 focus:outline-none focus:border-[#1E9FF2] focus:bg-white placeholder:text-sm"
                  />
                  {errors.requires_document_after && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.requires_document_after.message}
                    </p>
                  )}
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3 py-2 px-4 border border-gray-400 rounded-md bg-white">
                  <input
                    type="checkbox"
                    id="is_active"
                    {...register("is_active")}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Active
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