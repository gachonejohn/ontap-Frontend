import { apiSlice } from '../../api/apiSlice';

export const employeesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: ({ page, page_size, search, status, department } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        return {
          url: `employees/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getEmployeesMetricis: builder.query({
      query: () => {
       
        return {
          url: `employees/metrics/`,
          method: 'GET',
        };
      },
    }),

    getDashboardMetrics: builder.query({
      query: () => {
       
        return {
          url: `employees/dashboard/metrics/`,
          method: 'GET',
        };
      },
    }),

     getRecentHires: builder.query({
      query: ({ page, page_size, search, status, department } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        return {
          url: `employees/recent-hires/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    getEmployeeDetails: builder.query({
      query: (id) => ({
        url: `employees/staff/${id}/`,
        method: 'GET',
      }),
    }),

    getEmployeeByUser: builder.query({
      query: (userId) => ({
        url: `employees/`,
        method: 'GET',
        params: { user: userId },
      }),
      transformResponse: (response) => {
        if (response?.results?.length > 0) {
          return response.results[0];
        }
        return null;
      },
    }),

    getTodayAttendace: builder.query({
      query: ({ page, page_size, search } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        return {
          url: `attendance/today/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTimezones: builder.query({
      query: ({ page, page_size, search } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        return {
          url: `users/timezone-choices/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getProfileInfo: builder.query({
      query: () => {
        return {
          url: `users/profile/`,
          method: 'GET',
        };
      },
    }),

    setTimezone: builder.mutation({
      query: (data) => ({
        url: `users/update-timezone/`,
        method: 'POST',
        body: data,
      }),
    }),
    createEmployee: builder.mutation({
      query: (data) => ({
        url: `employees/staff/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `employees/staff/${id}/`,
        method: 'DELETE',
      }),
    }),

    createContract: builder.mutation({
      query: (data) => ({
        url: `employees/employee-contracts/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateContract: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/employee-contracts/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteContract: builder.mutation({
      query: (id) => ({
        url: `employees/employee-contracts/${id}/`,
        method: 'DELETE',
      }),
    }),

    uploadDocument: builder.mutation({
      query: (data) => ({
        url: `employees/staff/documents/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `employees/staff/documents/${id}/`,
        method: 'DELETE',
      }),
    }),

    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `employees/employee-payment-methods/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updatePaymentMethod: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/employee-payment-methods/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `employees/employee-payment-methods/${id}/`,
        method: 'DELETE',
      }),
    }),

    createEmergencyContact: builder.mutation({
      query: (data) => ({
        url: `employees/employee-emergency-contacts/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateEmergencyContact: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/employee-emergency-contacts/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteEmergencyContact: builder.mutation({
      query: (id) => ({
        url: `employees/employee-emergency-contacts/${id}/`,
        method: 'DELETE',
      }),
    }),

    updateUserInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}/info/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    updateProfilePic: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}/profile-picture/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    removeProfilePic: builder.mutation({
      query: ({ id, data }) => ({
        url: `users/${id}/profile-picture/`,
        method: 'DELETE',
        body: data,
      }),
    }),

    updateWorkInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/staff/${id}/update/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    createStatutoryInfo: builder.mutation({
      query: (data) => ({
        url: `employees/statutory-info/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    editStatutoryInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/statutory-info/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteStatutoryInfo: builder.mutation({
      query: (id) => ({
        url: `employees/statutory-info/${id}/`,
        method: 'DELETE',
      }),
    }),
    createEducationInfo: builder.mutation({
      query: (data) => ({
        url: `employees/education/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    editEducationInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/education/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteEducationInfo: builder.mutation({
      query: (id) => ({
        url: `employees/education/${id}/`,
        method: 'DELETE',
      }),
    }),
    createEmployeeRole: builder.mutation({
      query: (data) => ({
        url: `employees/employee-roles/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateEmployeeRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `employees/employee-roles/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    removeEmployeeRole: builder.mutation({
      query: (id) => ({
        url: `employees/employee-roles/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailsQuery,
  useGetEmployeeByUserQuery,
  useGetTodayAttendaceQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateContractMutation,
  useUpdateContractMutation,
  useDeleteContractMutation,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useCreateEmergencyContactMutation,
  useUpdateEmergencyContactMutation,
  useDeleteEmergencyContactMutation,
  useUpdateUserInfoMutation,
  useUpdateProfilePicMutation,
  useRemoveProfilePicMutation,
  useUpdateWorkInfoMutation,
  useCreateStatutoryInfoMutation,
  useEditStatutoryInfoMutation,
  useDeleteStatutoryInfoMutation,
  useCreateEducationInfoMutation,
  useEditEducationInfoMutation,
  useDeleteEducationInfoMutation,
  useCreateEmployeeRoleMutation,
  useUpdateEmployeeRoleMutation,
  useRemoveEmployeeRoleMutation,
  useGetTimezonesQuery,
  useSetTimezoneMutation,
  useGetProfileInfoQuery,
  useGetRecentHiresQuery,
  useGetEmployeesMetricisQuery,
  useGetDashboardMetricsQuery
} = employeesApi;
