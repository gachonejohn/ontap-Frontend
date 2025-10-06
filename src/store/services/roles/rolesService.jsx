import { apiSlice } from "../../api/apiSlice";

export const rolesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `users/roles/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getRolesPermissions: builder.query({
      query: (id) => {
      
      return {
          url: `users/roles/${id}/permissions/`,
          method: "GET",
        };
      },
    }),


    createRole: builder.mutation({
      query: (data) => ({
        url: `users/roles/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateRole: builder.mutation({
      query: ({id, data}) => ({
        url: `users/roles/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
 createUpdateRolePermission: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}/permissions/create-update/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `users/roles/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {

useGetRolesQuery,
useCreateRoleMutation,
useCreateUpdateRolePermissionMutation,
useDeleteRoleMutation,
useGetRolesPermissionsQuery,
useUpdateRoleMutation,

} = rolesApi;
