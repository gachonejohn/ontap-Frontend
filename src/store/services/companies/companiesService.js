import { apiSlice } from '../../api/apiSlice';

export const companiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `companies/departments/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    getPositions: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `companies/positions/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const { useGetDepartmentsQuery, useGetPositionsQuery } = companiesApi;
