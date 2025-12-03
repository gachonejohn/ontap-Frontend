import { apiSlice } from "../../api/apiSlice";

export const leavesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getLeavePolicies: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `leaves/policies/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["LeavePolicies"],
    }),

    getLeavePolicyById: builder.query({
      query: (id) => ({
        url: `leaves/policies/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LeavePolicies", id }],
    }),

    getEmployeeLeaveBalances: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `leaves/employee-leave-balances/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["LeaveBalances"],
    }),

    getLeaveRequests: builder.query({
      query: ({ page, page_size, status, start_date, end_date, department, search } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (status) params.append("status", status);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        if (department) params.append("department", department);
        if (search) params.append("search", search);

        return {
          url: `leaves/requests/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["LeaveRequests"],
    }),

    getApprovedLeaves: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `leaves/approved/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ApprovedLeaves"],
    }),

    getSingleEmployeeLeaveEntitlements: builder.query({
      query: ({ employee_no, leave_type, year } = {}) => {
        const params = new URLSearchParams();
        if (employee_no) params.append("employee_no", employee_no);
        if (leave_type) params.append("leave_type", leave_type);
        if (year) params.append("year", year);

        return {
          url: `leaves/single-employee-leave-entitlements/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["EmployeeEntitlements"],
    }),

    getAllEmployeeLeaveEntitlements: builder.query({
      query: ({ page, page_size, leave_type, year } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (leave_type) params.append("leave_type", leave_type);
        if (year) params.append("year", year);

        return {
          url: `leaves/employee-leave-entitlements/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["EmployeeEntitlements"],
    }),

    getBulkEmployeeLeaveEntitlements: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `leaves/bulk-employee-leave-entitlements/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["BulkEntitlements"],
    }),

    createLeavePolicy: builder.mutation({
      query: (data) => ({
        url: `leaves/policies/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    updateLeavePolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/policies/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    patchLeavePolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/policies/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    deleteLeavePolicy: builder.mutation({
      query: (id) => ({
        url: `leaves/policies/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: `leaves/requests/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances"],
    }),

    approveLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/approve/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    patchApproveLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/approve/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    rejectLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/reject/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances"],
    }),

    patchRejectLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/reject/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances"],
    }),

    reportFromLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/report-from-leave/${id}/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    patchReportFromLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/report-from-leave/${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    bulkEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/bulk-employee-leave-entitlements/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements", "BulkEntitlements"],
    }),

    singleEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/single-employee-leave-entitlements/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    updateEmployeeLeaveEntitlements: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/employee-leave-entitlements/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    patchEmployeeLeaveEntitlements: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/employee-leave-entitlements/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    deleteEmployeeLeaveEntitlements: builder.mutation({
      query: (id) => ({
        url: `leaves/employee-leave-entitlements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),
  }),
});

export const {
  // Queries
  useGetLeavePoliciesQuery,
  useGetLeavePolicyByIdQuery,
  useGetEmployeeLeaveBalancesQuery,
  useGetLeaveRequestsQuery,
  useGetApprovedLeavesQuery,
  useGetSingleEmployeeLeaveEntitlementsQuery,
  useGetAllEmployeeLeaveEntitlementsQuery,
  useGetBulkEmployeeLeaveEntitlementsQuery,
  
  // Mutations
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
  usePatchLeavePolicyMutation,
  useDeleteLeavePolicyMutation,
  useCreateLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  usePatchApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  usePatchRejectLeaveRequestMutation,
  useReportFromLeaveMutation,
  usePatchReportFromLeaveMutation,
  useBulkEmployeeLeaveEntitlementsMutation,
  useSingleEmployeeLeaveEntitlementsMutation,
  useUpdateEmployeeLeaveEntitlementsMutation,
  usePatchEmployeeLeaveEntitlementsMutation,
  useDeleteEmployeeLeaveEntitlementsMutation,
} = leavesApi;