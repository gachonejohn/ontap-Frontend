import SubmitCancelButtons from "@components/common/Buttons/ActionButton";
import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignRoleSchema } from "@schemas/roleSchema";
import { useCreateEmployeeRoleMutation } from "@store/services/employees/employeesService";
import { useGetRolesQuery } from "@store/services/roles/rolesService";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiPlus } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";

export const AssignRole = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [createEmployeeRole, { isLoading: isCreating }] =
    useCreateEmployeeRoleMutation();
  const { data: rolesData } = useGetRolesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  console.log("rolesData", rolesData)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(assignRoleSchema),
  });

  const onSubmit = async (formData) => {
    const payLoad = {
        employee: data?.id,
        ...formData
    }
    try {
      await createEmployeeRole(payLoad).unwrap();
      toast.success("Access Role granted successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error granting access role."
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
  const handleRoleChange = (selected) => {
    if (selected) {
      const itemId = Number(selected.value);
      setValue("role", itemId);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Add New"
        label="Grant New Role"
        icon={<FiPlus className="w-4 h-4" />}
        className="bg-teal-500 text-xs text-white px-4 py-2 rounded-md transition-all duration-200 
    shadow-sm hover:shadow-md hover:bg-teal-600 focus:ring-2 focus:ring-teal-400 
    focus:ring-offset-2 font-medium"
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
                Grant Role to Employee
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
                    Role
                  </label>
                  <Select
                    options={rolesData?.map((item) => ({
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
                    onChange={handleRoleChange}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.role.message}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="is_primary"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    {...register("is_primary")}
                  />
                  <label
                    htmlFor="is_primary"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Set as Primary Role
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
