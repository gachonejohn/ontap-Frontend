import { apiSlice } from "../../api/apiSlice";

export const onboardStepsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardSteps: builder.query({
      query: ({ page, page_size, search, status } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (status) queryParams.status = status;
        return {
          url: `onboarding/employee-steps/`,
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ['OnboardSteps'],
    }),

    getOnboardingStepDetails: builder.query({
      query: (id) => ({
        url: `onboarding/employee-steps/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'OnboardSteps', id }],
    }),

    updateOnboardingStepStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `onboarding/employee-steps/${id}/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        'OnboardSteps',
        { type: 'OnboardSteps', id }
      ],
    }),
  }),
});

export const {
  useGetOnboardStepsQuery,
  useGetOnboardingStepDetailsQuery,
  useUpdateOnboardingStepStatusMutation,
} = onboardStepsApi;