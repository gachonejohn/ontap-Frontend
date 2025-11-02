// src/store/services/leaves/leavesService.js
import { apiSlice } from '../../api/apiSlice';

export const leavesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ========================
     * LEAVES QUERIES (READ)
     * ========================
     */

    // Get all leave policies
    getLeavePolicies: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (page_size) params.append('page_size', page_size);

        return {
          url: `leaves/policies/?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['LeavePolicies'],
    }),

    // Get leave requests
    getLeaveRequests: builder.query({
      query: ({ page, page_size, status } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (page_size) params.append('page_size', page_size);
        if (status) params.append('status', status);

        return {
          url: `leaves/requests/?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['LeaveRequests'],
    }),

    // Get employee leave balances
    getEmployeeLeaveBalances: builder.query({
      query: () => ({
        url: `leaves/employee-leave-balances/`,
        method: 'GET',
      }),
      providesTags: ['LeaveBalances'],
    }),

    // Get approved leaves
    getApprovedLeaves: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page);
        if (page_size) params.append('page_size', page_size);

        return {
          url: `leaves/approved/?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['ApprovedLeaves'],
    }),

    /**
     * ========================
     * LEAVES MUTATIONS (WRITE)
     * ========================
     */

    // Create a new leave policy
    createLeavePolicy: builder.mutation({
      query: (data) => ({
        url: `leaves/policies/create/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LeavePolicies'],
    }),

    // Create a leave request
    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: `leaves/requests/create/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LeaveRequests'],
    }),

    // Approve a leave request
    approveLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/approve/`,
        method: 'PUT',
      }),
      invalidatesTags: ['LeaveRequests', 'ApprovedLeaves', 'LeaveBalances'],
    }),

    // Reject a leave request
    rejectLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/reject/`,
        method: 'PUT',
      }),
      invalidatesTags: ['LeaveRequests', 'LeaveBalances'],
    }),

    // Report from leave
    reportFromLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/report-from-leave/${id}/`,
        method: 'PUT',
      }),
      invalidatesTags: ['LeaveRequests', 'ApprovedLeaves', 'LeaveBalances'],
    }),

    // Bulk employee leave entitlements
    bulkEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/bulk-employee-leave-entitlements/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LeaveBalances'],
    }),

    // Single employee leave entitlements
    singleEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/single-employee-leave-entitlements/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['LeaveBalances'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetLeavePoliciesQuery,
  useGetLeaveRequestsQuery,
  useGetEmployeeLeaveBalancesQuery,
  useGetApprovedLeavesQuery,
  useCreateLeavePolicyMutation,
  useCreateLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
  useReportFromLeaveMutation,
  useBulkEmployeeLeaveEntitlementsMutation,
  useSingleEmployeeLeaveEntitlementsMutation,
} = leavesApi;
