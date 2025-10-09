import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEdit } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import Select from "react-select";
import { toast } from "react-toastify";

import SubmitCancelButtons from "@components/common/Buttons/ActionButton";
import CreateUpdateButton from "@components/common/Buttons/CreateUpdateButton";
import { assignRoleSchema } from "@schemas/roleSchema";
import { useUpdateEmployeeRoleMutation } from "@store/services/employees/employeesService";
import { useGetRolesQuery } from "@store/services/roles/rolesService";
import { getApiErrorMessage } from "@utils/errorHandler";
export const EditEmployeeRole = ({ refetchData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [updateEmployeeRole, { isLoading: isCreating }] =
    useUpdateEmployeeRoleMutation();
 const { data: rolesData } = useGetRolesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(assignRoleSchema),
    defaultValues: {
    role: data?.role?.id ?? undefined,
    is_primary: data?.is_primary ?? false,
    },
  });

  const onSubmit = async (formData) => {
    try {
      await updateEmployeeRole({
        id: data.id,
        data: formData,
      }).unwrap();
      toast.success("Employee Access role updated successfully!");
      handleCloseModal();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Error updating employee access role."
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
      const item_id = Number(selected.value);
      setValue("role", item_id);
    }
  };
  return (
    <>
      <CreateUpdateButton
        onClick={handleOpenModal}
        // title="Edit"
        label="Edit"
        icon={<FiEdit className="w-4 h-4 " />}
        className="
    px-4 py-2 w-full 
    border-none 
    focus:outline-none 
    focus:border-transparent 
    focus:ring-0 
    active:outline-none 
    active:ring-0
    hover:bg-gray-100
  "
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
                  Edit Employee Access Role
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
                    defaultValue={{
                        value: data?.role?.id,
                        label: data?.role?.name,
                    }}
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
