import { apiSlice } from '../../api/apiSlice';

export const onbardingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingSteps: builder.query({
      query: ({ page, page_size } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `onboarding/steps/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getOnboardingTemplates: builder.query({
      query: ({ page, page_size,search } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;

        return {
          url: `onboarding/templates/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),

    getOnboardingTemplatesDetails: builder.query({
      query: (id) => {
        return {
          url: `onboarding/templates/${id}/`,
          method: 'GET',
        };
      },
    }),

    createTemplate: builder.mutation({
      query: (data) => ({
        url: `onboarding/templates/create/`,
        method: 'POST',
        body: data,
      }),
    }),

    updateTemplate: builder.mutation({
      query: ({ id, data }) => ({
        url: `onboarding/templates/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteTemplate: builder.mutation({
      query: (id) => ({
        url: `onboarding/templates/${id}/`,
        method: 'DELETE',
      }),
    }),
    createTemplateStep: builder.mutation({
      query: (data) => ({
        url: `onboarding/template-steps/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteTemplateStep: builder.mutation({
      query: (id) => ({
        url: `onboarding/template-steps/${id}/`,
        method: 'DELETE',
      }),
    }),
    createOnboardingStep: builder.mutation({
      query: (data) => ({
        url: `onboarding/steps/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    updateOnboardingStep: builder.mutation({
      query: ({ id, data }) => ({
        url: `onboarding/steps/${id}/`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteOnboardingStep: builder.mutation({
      query: (id) => ({
        url: `onboarding/steps/${id}/`,
        method: 'DELETE',
      }),
    }),
    onboardEmployee: builder.mutation({
      query: (data) => ({
        url: `onboarding/employee-steps/create/`,
        method: 'POST',
        body: data,
      }),
    }),
    getEmployeeOnboardingCheckList: builder.query({
      query: (id) => {
        return {
          url: `onboarding/employee/${id}/onboarding-steps/`,
          method: 'GET',
        };
      },
    }),
    getOnboardingList: builder.query({
      query: ({ page, page_size } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;

        return {
          url: `onboarding/onboarding-list/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
    getOnboardingMetrics: builder.query({
      query: ({ page, page_size, department } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (department) queryParams.department = department;

        return {
          url: `onboarding/metrics/`,
          method: 'GET',
          params: queryParams,
        };
      },
    }),
  }),
});

export const {
  useGetOnboardingStepsQuery,
  useGetOnboardingTemplatesQuery,
  useGetOnboardingTemplatesDetailsQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useCreateTemplateStepMutation,
  useDeleteTemplateStepMutation,
  useCreateOnboardingStepMutation,
  useUpdateOnboardingStepMutation,
  useDeleteOnboardingStepMutation,
  useOnboardEmployeeMutation,
  useGetEmployeeOnboardingCheckListQuery,
  useGetOnboardingListQuery,
  useGetOnboardingMetricsQuery,
} = onbardingApi;
