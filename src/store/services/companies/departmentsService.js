// src/store/services/companies/departmentsService.js
import { apiSlice } from "../../api/apiSlice";

export const departmentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all departments
    getDepartments: builder.query({
      query: ({ page } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;

        return {
          url: `companies/departments/`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Departments"],
    }),

    // Get single department detail
    getDepartmentDetail: builder.query({
      query: (id) => ({
        url: `companies/departments/${id}/`,
        method: "GET",
      }),
      providesTags: ["Departments"],
    }),

    // Create new department
    createDepartment: builder.mutation({
      query: (data) => ({
        url: `companies/departments/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    // Update department
    updateDepartment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `companies/departments/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    // Delete department
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `companies/departments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetDepartmentDetailQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApi;
