import { apiSlice } from "../../api/apiSlice";

export const leavesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ========================
     * LEAVES QUERIES (READ)
     * ========================
     */

    // Get all leave policies (Admin only - for listings)
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

    // Get single leave policy by ID (Works for both admin and employees)
    getLeavePolicyById: builder.query({
      query: (id) => ({
        url: `leaves/policies/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "LeavePolicies", id }],
    }),

    // Get employee leave balances (Shows employee's entitlements)
    getEmployeeLeaveBalances: builder.query({
      query: () => ({
        url: `leaves/employee-leave-balances/`,
        method: "GET",
      }),
      providesTags: ["LeaveBalances"],
    }),

    // Get leave requests - WORKS FOR BOTH ADMIN AND EMPLOYEES
    getLeaveRequests: builder.query({
      query: ({ page, page_size, status, search, department, start_date, end_date } = {}) => {
        const queryParams = {};
        if (page) queryParams.append("page", page);
        if (page_size) queryParams.append("page_size", page_size);
        if (status) queryParams.append("status", status);
        if (search) queryParams.append("search", search);
        // if (department) queryParams.append("department", department);
        if (department) queryParams.department = department;

        if (start_date) queryParams.append("start_date", start_date);
        if (end_date) queryParams.append("end_date", end_date);

        return {
          url: `leaves/requests/?${queryParams.toString()}`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["LeaveRequests"],
    }),

    // Get approved leaves
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

    // Get single employee leave entitlements
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

    // Get all employee leave entitlements with filters
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

    // Get bulk employee leave entitlements
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

    /**
     * ========================
     * LEAVES MUTATIONS (WRITE)
     * ========================
     */

    // Create a new leave policy
    createLeavePolicy: builder.mutation({
      query: (data) => ({
        url: `leaves/policies/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    // Update a leave policy (PUT)
    updateLeavePolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/policies/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    // Update a leave policy (PATCH)
    patchLeavePolicy: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/policies/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    // Delete a leave policy
    deleteLeavePolicy: builder.mutation({
      query: (id) => ({
        url: `leaves/policies/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["LeavePolicies"],
    }),

    // Create a leave request
    createLeaveRequest: builder.mutation({
      query: (data) => ({
        url: `leaves/requests/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveRequests"],
    }),

    // Approve a leave request (PUT)
    approveLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/approve/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    // Approve a leave request (PATCH)
    patchApproveLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/approve/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    // Reject a leave request (PUT)
    rejectLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/reject/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances"],
    }),

    // Reject a leave request (PATCH)
    patchRejectLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `leaves/requests/${id}/reject/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "LeaveBalances"],
    }),

    // Report from leave (PUT)
    reportFromLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/report-from-leave/${id}/`,
        method: "PUT",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    // Report from leave (PATCH)
    patchReportFromLeave: builder.mutation({
      query: (id) => ({
        url: `leaves/report-from-leave/${id}/`,
        method: "PATCH",
      }),
      invalidatesTags: ["LeaveRequests", "ApprovedLeaves", "LeaveBalances"],
    }),

    // Bulk employee leave entitlements - CREATE
    bulkEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/bulk-employee-leave-entitlements/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements", "BulkEntitlements"],
    }),

    // Single employee leave entitlements - CREATE
    singleEmployeeLeaveEntitlements: builder.mutation({
      query: (data) => ({
        url: `leaves/single-employee-leave-entitlements/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    // Update employee leave entitlements (PUT)
    updateEmployeeLeaveEntitlements: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/employee-leave-entitlements/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    // Update employee leave entitlements (PATCH)
    patchEmployeeLeaveEntitlements: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `leaves/employee-leave-entitlements/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["LeaveBalances", "EmployeeEntitlements"],
    }),

    // Delete employee leave entitlements
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