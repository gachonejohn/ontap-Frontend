// src/store/services/cards/cardsService.js
import { apiSlice } from "../../api/apiSlice";

export const cardsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ========================
     * CARDS QUERIES (READ)
     * ========================
     */

    // Get all digital cards (for managers/admins)
    getDigitalCards: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.search) queryParams.append("search", params.search);
        if (params.is_active !== undefined) queryParams.append("is_active", params.is_active);
        if (params.department) queryParams.append("department", params.department);
        if (params.page) queryParams.append("page", params.page);
        if (params.page_size) queryParams.append("page_size", params.page_size);

        return {
          url: `digital-cards/?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["DigitalCards"],
    }),

    // Get a single digital card by ID
    getDigitalCard: builder.query({
      query: (id) => ({
        url: `digital-cards/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DigitalCards", id }],
    }),

    // Get my own digital card (for employees)
    getMyDigitalCard: builder.query({
      query: () => ({
        url: `digital-cards/my-card/`,
        method: "GET",
      }),
      providesTags: ["MyDigitalCard"],
    }),

    /**
     * ========================
     * CARDS MUTATIONS (WRITE)
     * ========================
     */

    // Create a new digital card
    createDigitalCard: builder.mutation({
      query: (data) => ({
        url: `digital-cards/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DigitalCards"],
    }),

    // Update a digital card
    updateDigitalCard: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `digital-cards/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DigitalCards", id },
        "DigitalCards",
        "MyDigitalCard",
      ],
    }),

    // Delete a digital card
    deleteDigitalCard: builder.mutation({
      query: (id) => ({
        url: `digital-cards/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["DigitalCards"],
    }),

    // Activate/Deactivate a card
    toggleCardStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `digital-cards/${id}/toggle-status/`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DigitalCards", id },
        "DigitalCards",
        "MyDigitalCard",
      ],
    }),

    // Generate QR code for card
    generateCardQR: builder.mutation({
      query: (id) => ({
        url: `digital-cards/${id}/generate-qr/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "DigitalCards", id },
        "DigitalCards",
        "MyDigitalCard",
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetDigitalCardsQuery,
  useGetDigitalCardQuery,
  useGetMyDigitalCardQuery,
  useCreateDigitalCardMutation,
  useUpdateDigitalCardMutation,
  useDeleteDigitalCardMutation,
  useToggleCardStatusMutation,
  useGenerateCardQRMutation,
} = cardsApi;