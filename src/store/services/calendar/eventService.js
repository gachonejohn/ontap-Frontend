import { apiSlice } from "@store/api/apiSlice";

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: ({ page, page_size, search, from_date, to_date, event_type } = {}) => {
        const queryParams = {};
        if (page) queryParams.page = page;
        if (page_size) queryParams.page_size = page_size;
        if (search) queryParams.search = search;
        if (from_date) queryParams.from_date = from_date;
        if (to_date) queryParams.to_date = to_date;
        if (event_type) queryParams.event_type = event_type;
        return {
          url: `calendar/events/`,
          method: 'GET',
          params: queryParams,
        };
      },
      providesTags: ['Events'],
    }),
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: `calendar/events/create/`,
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Events'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...eventData }) => ({
        url: `calendar/events/${id}/update/`,
        method: 'PATCH',
        body: eventData,
      }),
      invalidatesTags: ['Events'],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `calendar/events/${id}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Events'],
    }),

    updateParticipantStatus: builder.mutation({
      query: ({ participantId, status }) => ({
        url: `calendar/events/participants/${participantId}/status/`,
        method: 'PATCH',
        body: { status },
      }),
      // invalidatesTags: (result, error, { eventId }) => [
      //   { type: 'Events', id: eventId },
      //   { type: 'Events', id: 'LIST' },
      //   'Participants',
      // ],
      invalidatesTags: ['Events'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useUpdateParticipantStatusMutation,
} = eventApi;