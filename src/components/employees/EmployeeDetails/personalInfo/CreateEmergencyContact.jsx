import { zodResolver } from "@hookform/resolvers/zod";
import {
    EmployeeEmergencyContactSchema
} from "@schemas/employees/employmentSchema";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiUserPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import { useCreateEmergencyContactMutation } from "../../../../store/services/employees/employeesService";
import SubmitCancelButtons from "../../../common/Buttons/ActionButton";
import CreateUpdateButton from "../../../common/Buttons/CreateUpdateButton";
import { relationshipOptions } from "@constants/constants";

export const NewEmployeeEmergencyContact = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createEmergencyContact, { isLoading: isCreating }] =
    useCreateEmergencyContactMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(EmployeeEmergencyContactSchema),
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    const payLoad = {
      employee: data.id,
      ...formData,
    };
    try {
      await createEmergencyContact(payLoad).unwrap();
      toast.success("Emergency Contact details added successfully!");
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
  const handleRelationshipChange = (selected) => {
    if (selected) {
      setValue("relationship", selected.value);
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
        title="Add New"
        label="Add Emergency Contact"
        icon={<FiUserPlus className="w-4 h-4" />}
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
                  Add New Emergency Contact
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
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={relationshipOptions}
                    onChange={handleRelationshipChange}
                    placeholder="Relationship"
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
                  {errors.relationship && (
                    <p className="text-red-500 text-[12px] mt-1">
                      {errors.relationship.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name<span className="text-red-500"></span>
                    </label>
                    <input
                      type="text"
                      placeholder="Peter Waigo"
                      {...register("full_name")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email<span className="text-red-500"></span>
                    </label>
                    <input
                      type="email"
                      placeholder="A valid email address"
                         {...register("email")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone Number<span className="text-red-500"></span>
                  </label>
                  <input
                    type="number"
                    placeholder="+254"
                    {...register("phone_number")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.mobile_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone_number.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address<span className="text-red-500"></span>
                  </label>
                  <textarea
                    cols={5}
                    ros={3}
                    placeholder="address here.."
                    {...register("address")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isCreating}
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
