import { apiSlice } from "../../api/apiSlice";

export const payslipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayslips: builder.query({
      query: ({ page, page_size, search, status, employee_id,year,month } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (search) params.append("search", search);
        if (month) params.append("month", month);
        if (year) params.append("year", year);
        if (status) params.append("status", status);
        if (employee_id) params.append("employee_id", employee_id);

        return {
          url: `payroll/payslips/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payslips"],
    }),

    getPayslipById: builder.query({
      query: (id) => ({
        url: `payroll/payslips/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payslips", id }],
    }),

    getAllowanceTypes: builder.query({
      query: () => ({
        url: `payroll/allowances/`,
        method: "GET",
      }),
      providesTags: ["AllowanceTypes"],
    }),

    createEmployeeAllowance: builder.mutation({
      query: (data) => ({
        url: `payroll/employee-allowances/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Allowances"],
    }),

    updateEmployeeAllowance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/employee-allowances/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Allowances"],
    }),


    deleteEmployeeAllowance: builder.mutation({
      query: (id) => ({
        url: `payroll/employee-allowances/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Allowances"],
    }),

  }),
});

export const {
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,
  useCreateEmployeeAllowanceMutation,
  useUpdateEmployeeAllowanceMutation,
  useDeleteEmployeeAllowanceMutation,
  useGetAllowanceTypesQuery,
} = payslipApi;