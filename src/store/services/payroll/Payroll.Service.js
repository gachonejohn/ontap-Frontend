import { apiSlice } from '../../api/apiSlice';

export const payrollService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollPeriods: builder.query({
      query: ({ page, page_size, status,year } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (status) queryParams.status = status;
        if (year) queryParams.year = year;
        return {
          url: `payroll/payroll-periods/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    //
    getGroupedPayslips: builder.query({
      query: ({ page, page_size, department,period,status,search } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        if (department) queryParams.department = department;
        if (period) queryParams.period = period;
        if (status) queryParams.status = status;
        if (search) queryParams.search = search;
        return {
          url: `payroll/payslips/department-grouped-payslips-summary/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getPayrollMetrics: builder.query({
      query: ({ end_date, start_date, department, period } = {}) => {
        const queryParams = {};
        if (end_date) queryParams.end_date = end_date;
        if (start_date) queryParams.start_date = start_date;
        if (period) queryParams.period = period;

        if (department) queryParams.department = department;
        return {
          url: `payroll/payslips/metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getDepartmentPaySlips: builder.query({
      query: ({
        page,
        page_size,
        department,
        id,
        date,
        from_date,
        to_date,
        period,
        status,
        search,
      } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (department) queryParams.department = department;
        if (period) queryParams.period = period;
        return {
          url: `payroll/payslips/department/${id}/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
   
    generateSinglePayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/generate/single-employee-payroll/`,
        method: 'POST',
        body: data,
      }),
    }),
    generateBulkPayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/generate/Bulk-employees-payroll/`,
        method: 'POST',
        body: data,
      }),
    }),
    processPayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/actions/processing/process/`,
        method: 'POST',
        body: data,
      }),
    }),
    approvePayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/actions/processing/approve/`,
        method: 'POST',
        body: data,
      }),
    }),
    payPayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/actions/processing/pay/`,
        method: 'POST',
        body: data,
      }),
    }),
    cancelPayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/actions/processing/cancel/`,
        method: 'POST',
        body: data,
      }),
    }),
      createAdjustment: builder.mutation({
      query: (data) => ({
        url: `payroll/adjustments/create/single/`,
        method: 'POST',
        body: data,
      }),
    }),
      createBulkAdjustment: builder.mutation({
      query: (data) => ({
        url: `payroll/adjustments/create/bulk/`,
        method: 'POST',
        body: data,
      }),
    }),
    approveAdjustment: builder.mutation({
      query: (data) => ({
        url: `/payroll/adjustments/approve/`,
        method: 'POST',
        body: data,
      }),
    }),
    rejectAdjustment: builder.mutation({
      query: (data) => ({
        url: `payroll/adjustments/reject/`,
        method: 'POST',
        body: data,
      }),
    }),
     getAdjustments: builder.query({
      query: ({
        page,
        page_size,
        department,
        period,
        status,
        approval_status,
        adjustment_type,
        year,
        search,
      } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (approval_status) queryParams.approval_status = approval_status;
        if (department) queryParams.department = department;
        if (adjustment_type) queryParams.adjustment_type = adjustment_type;
        if (period) queryParams.period = period;
        if (year) queryParams.year = year;
        return {
          url: `payroll/adjustments/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetPayrollPeriodsQuery,
  useGenerateSinglePayrollMutation,
  useGenerateBulkPayrollMutation,
  useGetGroupedPayslipsQuery,
  useGetDepartmentPaySlipsQuery,
  useGetPayrollMetricsQuery,
  useProcessPayrollMutation,
  useApprovePayrollMutation,
  usePayPayrollMutation,
  useCancelPayrollMutation,
  useCreateAdjustmentMutation,
  useApproveAdjustmentMutation,
  useRejectAdjustmentMutation,
  useGetAdjustmentsQuery,
  useCreateBulkAdjustmentMutation
} = payrollService;
