import { apiSlice } from '../../api/apiSlice';

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocumentCategories: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `companies/document-categories/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    getDocumentTypes: builder.query({
      query: ({ page, page_size, employee_no } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (employee_no) queryParams.employee_no = employee_no;
        return {
          url: `companies/document-types/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    createDocumentCategory: builder.mutation({
      query: (data) => ({
        url: `companies/document-categories/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateDocumentCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `companies/document-categories/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteDocumentCategory: builder.mutation({
      query: (id) => ({
        url: `companies/document-categories/${id}/`,
        method: 'DELETE',
      }),
    }),
    createDocumentType: builder.mutation({
      query: (data) => ({
        url: `companies/document-types/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateDocumentType: builder.mutation({
      query: ({ id, data }) => ({
        url: `companies/document-types/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteDocumentType: builder.mutation({
      query: (id) => ({
        url: `companies/document-types/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetDocumentCategoriesQuery,
  useGetDocumentTypesQuery,
  useCreateDocumentCategoryMutation,
  useUpdateDocumentCategoryMutation,
  useDeleteDocumentCategoryMutation,
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
  useDeleteDocumentTypeMutation,
} = documentsApi;
