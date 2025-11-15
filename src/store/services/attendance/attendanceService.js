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
    
    getGroupedAttendace: builder.query({
      query: ({ page, page_size, department } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        
        if (department) queryParams.department = department;
        return {
          url: `attendance/management/departments/attendance/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getCompanyAttendaceList: builder.query({
      query: ({ page, page_size, department, id, date, from_date, to_date, status, search } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (department) queryParams.department = department;
        return {
          url: `attendance/management/departments/${id}/employees/`,
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
    getCompanyAttendanceTrends: builder.query({
      query: ({  search, year, department, date, from_date, to_date, status } = {}) => {
        const queryParams = {};
        if (year) queryParams.year = year;
        if (search) queryParams.search = search;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        return {
          url: `attendance/management/dashboard/trend/`,
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
    getWeeklyAttendance: builder.query({
      query: ({  period,   } = {}) => {
        const queryParams = {};
       
        if (period) queryParams.period = period;
     
        return {
          url: `attendance/weekly/`,
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
        getAttendanceMetrics: builder.query({
      query: ({  period,   } = {}) => {
        const queryParams = {};
       
        if (period) queryParams.period = period;
     
        return {
          url: `attendance/management/dashboard/metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
     requestOvertime: builder.mutation({
      query: (data) => ({
        url: `attendance/overtime/requests/create/`,
        method: 'POST',
        body: data,
      }),
    }),
   updateOvertimeRequest: builder.mutation({
  query: ({ id, action }) => ({
    url: `attendance/overtime/requests/${id}/approve/`,
    method: 'PATCH',
    body: { action },  
  }),
}),
    offSiteRequest: builder.mutation({
      query: (data) => ({
        url: `attendance/offoffice/requests/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOffSiteRequest: builder.mutation({
      query: ({ id, action }) => ({
    url: `attendance/offoffice/requests/${id}/approve/`,
    method: 'PATCH',
    body: { action },  
  }),
    }),
    getOffsiteRequests: builder.query({
      query: ({ page, page_size, search, department, date,time_range, from_date, to_date, status } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (time_range) queryParams.time_range = time_range;
        return {
          url: `attendance/offoffice/requests/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getOvertimeRequests: builder.query({
      query: ({ page, page_size, search, department,time_range, date, from_date, to_date, status } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (date) queryParams.date = date;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (status) queryParams.status = status;
        if (department) queryParams.department = department;
        if (time_range) queryParams.time_range = time_range;
        return {
          url: `attendance/overtime/requests/`,
          method: 'GET',
          params: queryParams,
        };
      },
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
  useGetWeeklyAttendanceQuery,
  useGetAttendanceMetricsQuery,
  useGetCompanyAttendanceTrendsQuery,
  useGetGroupedAttendaceQuery,
  useGetCompanyAttendaceListQuery,
  useRequestOvertimeMutation,
  useOffSiteRequestMutation,
  useUpdateOvertimeRequestMutation,
  useUpdateOffSiteRequestMutation,
  useGetOvertimeRequestsQuery,
  useGetOffsiteRequestsQuery,
} = attendanceApi;
