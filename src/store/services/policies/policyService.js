
import { apiSlice } from "../../api/apiSlice";

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    
    getAttendancePolicies: builder.query({
      query: ({ page, page_size,} = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
       
        return {
          url: `attendance/work-schedule-rules/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createAttendancePolicy: builder.mutation({
      query: (data) => ({
        url: `attendance/work-schedule-rules/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateAttendancePolicy: builder.mutation({
      query: ({id, data}) => ({
        url: `attendance/work-schedule-rules/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteAttendancePolicy: builder.mutation({
      query: (id) => ({
        url: `attendance/work-schedule-rules/${id}/`,
        method: "DELETE",
      }),
    }),
    createBreakCategory: builder.mutation({
      query: (data) => ({
        url: `attendance/breaks/breaktypes/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateBreakCategory: builder.mutation({
      query: ({id, data}) => ({
        url: `attendance/breaks/breaktypes/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteBreakCategory: builder.mutation({
      query: (id) => ({
        url: `attendance/breaks/breaktypes/${id}/`,
        method: "DELETE",
      }),
    }),
    getBreakCategories: builder.query({
      query: ({ page, page_size,} = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
       
        return {
          url: `attendance/breaks/breaktypes/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    getBreakRules: builder.query({
      query: ({ page, page_size,} = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
       
        return {
          url: `attendance/breaks/breakrules/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
    createBreakRule: builder.mutation({
      query: (data) => ({
        url: `attendance/breaks/breakrules/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateBreakRule: builder.mutation({
      query: ({id, data}) => ({
        url: `attendance/breaks/breakrules/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteBreakRule: builder.mutation({
      query: (id) => ({
        url: `attendance/breaks/breakrules/${id}/`,
        method: "DELETE",
      }),
    }),
    getBreakTypesAssignments: builder.query({
      query: ({ page, page_size,} = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
       
        return {
          url: `attendance/breaks/breakassignments/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
   
    createBreakTypeAssignment: builder.mutation({
      query: (data) => ({
        url: `attendance/breaks/breakassignments/create/`,
        method: "POST",
        body: data,
      }),
    }),
    updateBreakTypeAssignment: builder.mutation({
      query: ({id, data}) => ({
        url: `attendance/breaks/breakassignments/${id}/`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteBreakTypeAssignment: builder.mutation({
      query: (id) => ({
        url: `attendance/breaks/breakassignments/${id}/`,
        method: "DELETE",
      }),
    }),
      getEmployeeBreaks: builder.query({
      query: ({ page, page_size,} = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
       
        return {
          url: `attendance/breaks/employeebreaks/latest/`,
          method: "GET",
          params: queryParams,
        };
      },
    }),
      createBreak: builder.mutation({
      query: (data) => ({
        url: `attendance/breaks/employeebreaks/create/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
useGetAttendancePoliciesQuery,

useGetBreakRulesQuery,
useGetBreakCategoriesQuery,
useCreateAttendancePolicyMutation,
useUpdateAttendancePolicyMutation,
useDeleteAttendancePolicyMutation,

useCreateBreakCategoryMutation,
useUpdateBreakCategoryMutation,
useDeleteBreakCategoryMutation,

useCreateBreakRuleMutation,
useUpdateBreakRuleMutation,
useDeleteBreakRuleMutation,

useGetBreakTypesAssignmentsQuery,
useCreateBreakTypeAssignmentMutation,
useUpdateBreakTypeAssignmentMutation,
useDeleteBreakTypeAssignmentMutation,

useCreateBreakMutation,
useGetEmployeeBreaksQuery

} = attendanceApi;
