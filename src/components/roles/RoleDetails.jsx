import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiArrowLeft } from "react-icons/fi";
import {
  useGetRolesPermissionsQuery,
  useCreateUpdateRolePermissionMutation,
} from "../../store/services/roles/rolesService";
import ContentSpinner from "../common/spinners/dataLoadingSpinner";
import  { toast } from "react-toastify";
const PERMISSION_FIELDS = [
  { key: "can_view", label: "View" },
  { key: "can_create", label: "Create" },
  { key: "can_edit", label: "Edit" },
  { key: "can_delete", label: "Delete" },
  { key: "can_approve", label: "Approve" },
  { key: "can_export", label: "Export" },
  { key: "can_print", label: "Print" },
  { key: "can_view_all", label: "View All" },
];

// Zod schema for validation
const permissionsSchema = z.object({
  permissions: z.array(
    z.object({
      feature_id: z.number().int().positive(),
      can_view: z.boolean(),
      can_create: z.boolean(),
      can_edit: z.boolean(),
      can_delete: z.boolean(),
      can_approve: z.boolean(),
      can_export: z.boolean(),
      can_print: z.boolean(),
      can_view_all: z.boolean(),
    })
  ),
});

const RolesDetails = () => {
  const { id } = useParams();
  const {
    data: role,
    isLoading,
    error,
    refetch,
  } = useGetRolesPermissionsQuery(id);

  const [createUpdateRolePermission, { isLoading: isUpdating }] =
    useCreateUpdateRolePermissionMutation();


  const { control, handleSubmit, reset, getValues } = useForm({
    resolver: zodResolver(permissionsSchema),
    defaultValues: { permissions: [] },
  });

  // Prefill form when data is loaded
  useEffect(() => {
    if (role?.permissions?.length) {
      const mapped = role.permissions.map((p) => ({
        feature_id: p.feature_id,
        can_view: !!p.can_view,
        can_create: !!p.can_create,
        can_edit: !!p.can_edit,
        can_delete: !!p.can_delete,
        can_approve: !!p.can_approve,
        can_export: !!p.can_export,
        can_print: !!p.can_print,
        can_view_all: !!p.can_view_all,
      }));
      reset({ permissions: mapped });
    }
  }, [role, reset]);

  const onSubmit = async () => {
    const values = getValues();

    const filteredPermissions = values.permissions.filter((perm) =>
      PERMISSION_FIELDS.some((f) => perm[f.key])
    );

    try {
      await createUpdateRolePermission({
        id: Number(id),
        data: { permissions: filteredPermissions },
      }).unwrap();

      
      toast.success("Permissions updated successfully");
     
      refetch();
    } catch (error) {
  console.error(error);
  toast.error("Failed to update permissions" || error.data.error);
     
    } finally {
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <ContentSpinner />
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600">
            An error occurred while loading permissions data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-white  ">
      <Link
        to="/dashboard/settings"
        className="flex items-center space-x-2 mb-6"
      >
        <FiArrowLeft className="text-xl" />
        <span>Back</span>
      </Link>

      <h1 className="text-xl font-bold mb-4">
        {role.name}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6  font-montserrat"
      >
        {role.permissions.map((feature, i) => (
          <div key={feature.feature_id} className="border rounded p-3">
            <h3 className="font-semibold">{feature.feature_name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
              {PERMISSION_FIELDS.map(({ key, label }) => (
                <Controller
                  key={key}
                  name={`permissions.${i}.${key}`}
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      {label}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={isUpdating}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Permissions"}
        </button>
      </form>

     
    </div>
  );
};

export default RolesDetails;
