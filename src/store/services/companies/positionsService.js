import { apiSlice } from '../../api/apiSlice';

export const PositionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

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

    getPositionDetail: builder.query({
      query: (id) => ({
        url: `companies/positions/${id}/`,
        method: 'GET',
      }),
      providesTags: ['Positions'],
    }),

    createPosition: builder.mutation({
      query: (data) => ({
        url: `companies/positions/create/`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Positions'],
    }),

    updatePosition: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `companies/positions/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Positions'],
    }),

    deletePosition: builder.mutation({
      query: (id) => ({
        url: `companies/positions/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Positions'],
    }),
  }),
});

export const {
  useGetPositionsQuery,
  useGetPositionDetailQuery,
  useCreatePositionMutation,
  useUpdatePositionMutation,
  useDeletePositionMutation,
} = PositionsApi;
