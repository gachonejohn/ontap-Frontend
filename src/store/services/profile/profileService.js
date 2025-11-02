// src/store/services/profile/profileService.js
import { apiSlice } from "../../api/apiSlice";

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ========================
     * PROFILE QUERIES (READ)
     * ========================
     */
    // Get current user profile
    getMyProfile: builder.query({
      query: () => ({
        url: `users/profile/`,
        method: "GET",
      }),
      providesTags: ["Profile"],
      // Transform the response to make it easier to use in components
      transformResponse: (response) => {
        return {
          // User basic info
          id: response.id,
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
          full_name: response.full_name,
          timezone: response.timezone,
          is_verified: response.is_verified,
          last_active: response.last_active,
          
          // Organization info
          organization: {
            id: response.organization?.id,
            name: response.organization?.name,
          },
          
          // Roles
          roles: response.roles || [],
          
          // Employee profile data
          employee_profile: {
            id: response.employee_profile?.id,
            employee_no: response.employee_profile?.employee_no,
            department_name: response.employee_profile?.department_name,
            position: response.employee_profile?.position,
            onboarding_status: response.employee_profile?.onboarding_status,
            status: response.employee_profile?.status,
            
            // User details from employee_profile
            user: {
              id: response.employee_profile?.user?.id,
              first_name: response.employee_profile?.user?.first_name,
              last_name: response.employee_profile?.user?.last_name,
              display_email: response.employee_profile?.user?.display_email,
              display_phone: response.employee_profile?.user?.display_phone,
              gender: response.employee_profile?.user?.gender,
              profile_picture: response.employee_profile?.user?.profile_picture,
              timezone: response.employee_profile?.user?.timezone,
              is_verified: response.employee_profile?.user?.is_verified,
              last_active: response.employee_profile?.user?.last_active,
              role: response.employee_profile?.user?.role,
            },
            
            // Employee roles
            roles: response.employee_profile?.roles || [],
          },
        };
      },
    }),

    /**
     * ========================
     * PROFILE MUTATIONS (WRITE)
     * ========================
     */
    // Update user profile
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/profile/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Update profile picture
    updateProfilePicture: builder.mutation({
      query: ({ id, formData }) => ({
        url: `users/profile/${id}/picture/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),

    /**
     * ========================
     * PASSWORD MANAGEMENT
     * ========================
     */
    // Change password (requires old password) - PUT method
    changePassword: builder.mutation({
      query: (data) => ({
        url: `users/change-password/`,
        method: "PUT",
        body: {
          old_password: data.old_password,
          new_password: data.new_password,
          confirm_new_password: data.confirm_new_password,
        },
      }),
    }),

    // Change password - PATCH method (alternative)
    changePasswordPatch: builder.mutation({
      query: (data) => ({
        url: `users/change-password/`,
        method: "PATCH",
        body: {
          old_password: data.old_password,
          new_password: data.new_password,
          confirm_new_password: data.confirm_new_password,
        },
      }),
    }),

    /**
     * ========================
     * PASSWORD RESET (OTP FLOW)
     * For users who forgot their password
     * ========================
     */
    // Step 1: Request OTP for password reset (forgot password)
    requestPasswordResetOTP: builder.mutation({
      query: (data) => ({
        url: `users/request-reset-pass/`,
        method: "POST",
        body: {
          email: data.email,
        },
      }),
    }),

    // Step 2: Verify OTP code
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `users/verify-otp/`,
        method: "POST",
        body: {
          email: data.email,
          otp: data.otp,
        },
      }),
    }),

    // Step 3: Confirm new password (after OTP verification)
    confirmNewPassword: builder.mutation({
      query: (data) => ({
        url: `users/confirm-new-pass/`,
        method: "POST",
        body: {
          email: data.email,
          new_password: data.new_password,
          confirm_password: data.confirm_password,
        },
      }),
    }),

    // Resend OTP if user didn't receive it
    resendOTP: builder.mutation({
      query: (data) => ({
        url: `users/resend-otp/`,
        method: "POST",
        body: {
          email: data.email,
        },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useUpdateProfilePictureMutation,
  useChangePasswordMutation,
  useChangePasswordPatchMutation,
  useRequestPasswordResetOTPMutation,
  useVerifyOTPMutation,
  useConfirmNewPasswordMutation,
  useResendOTPMutation,
} = profileApi;