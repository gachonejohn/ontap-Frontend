import { apiSlice } from '../../api/apiSlice';

export const assetsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProperties: builder.query({
      query: ({ page, page_size, category } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (category) queryParams.category = category;
        return {
          url: `assets/properties/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const { useGetPropertiesQuery } = assetsApi;
