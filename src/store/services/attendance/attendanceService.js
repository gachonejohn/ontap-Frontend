import { apiSlice } from '../../api/apiSlice';

export const attendanceApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTodayAttendace: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `attendance/today/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAttendace: builder.query({
      query: ({ page, page_size, search, department, date, from_date, to_date, status } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        return {
          url: `attendance/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAttendanceTrends: builder.query({
      query: ({ page, page_size, search, department, date, from_date, to_date, status } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        return {
          url: `attendance/trends/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getAttendanceConsistency: builder.query({
      query: ({  month,   } = {}) => {
        const queryParams = {};
       
        if (month) queryParams.month = month;
     
        return {
          url: `attendance/consistency/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getTodayClockIns: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `attendance/present-attendance/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    checkIn: builder.mutation({
      query: () => ({
        url: `attendance/attendance/clock-in/`,
        method: 'PATCH',
      }),
    }),
    checkOut: builder.mutation({
      query: (id) => ({
        url: `attendance/attendance/${id}/clock-out/`,
        method: 'PATCH',
      }),
    }),
  }),
});

export const {
  useGetTodayAttendaceQuery,
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayClockInsQuery,
  useGetAttendaceQuery,
  useGetAttendanceTrendsQuery,
  useGetAttendanceConsistencyQuery,
} = attendanceApi;
