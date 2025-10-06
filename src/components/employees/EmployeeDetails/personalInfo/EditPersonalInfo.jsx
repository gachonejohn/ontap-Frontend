import { genderOptions } from "@constants/constants";
import { zodResolver } from "@hookform/resolvers/zod";

import { updateEmployeeSchema } from "@schemas/employees/employeeSchema";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";
import { useUpdateUserInfoMutation } from "../../../../store/services/employees/employeesService";
import SubmitCancelButtons from "../../../common/Buttons/ActionButton";
import CreateUpdateButton from "../../../common/Buttons/CreateUpdateButton";

export const EditPersonalInfo = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateUserInfo, { isLoading: isUpdating }] =
    useUpdateUserInfoMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      first_name: data?.user?.first_name ?? "",
      last_name: data?.user?.last_name ?? "",
      email: data?.user?.email ?? "",
      phone_number: data?.user?.phone_number ?? "",
      date_of_birth: data?.user?.date_of_birth ?? "",
    },
  });
  useEffect(() => {
    console.log("Form Errors:", errors);
  }, [errors]);
  const onSubmit = async (formData) => {
    try {
      await updateUserInfo({
        id: data.user.id,
        data: formData,
      }).unwrap();
      toast.success("Personal Info details updated successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error Updating info.");
      toast.error(message);
    } finally {
      refetchData();
    }
  };
  const handleGenderChange = (selected) => {
    if (selected) {
      setValue("gender", selected.value);
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
                   overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
                   w-full sm:max-w-c-550 md:max-w-550 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header - sticky */}
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <p className="text-sm md:text-lg lg:text-lg font-semibold">
                  Edit Personal Information
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
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="E.g. Peter"
                    {...register("first_name")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                {/* Grid for remaining fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="E.g. Smith"
                      {...register("last_name")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.last_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Date of Birth<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Date of birth"
                      {...register("date_of_birth")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.date_of_birth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.date_of_birth.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <Select
                      options={genderOptions}
                      defaultValue={{
                        label: data.user.gender,
                        value: data.user.gender,
                      }}
                      onChange={handleGenderChange}
                      placeholder="Select Gender"
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
                    {errors.gender && (
                      <p className="text-red-500 text-[12px] mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+234...."
                      {...register("phone_number")}
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                    />
                    {errors.phone_number && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone_number.message}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    {...register("email")}
                    className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <SubmitCancelButtons
                  onCancel={handleCloseModal}
                  isSubmitting={isSubmitting}
                  isProcessing={isUpdating}
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
