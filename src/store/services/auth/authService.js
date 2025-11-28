import Cookies from 'js-cookie';
import { userLoading, userLoggedIn, userLoginFailed, userLoggedOut } from './authSlice';
import { apiSlice } from '../../api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // login: builder.mutation({
    //   query: ({ email, password }) => ({
    //     url: `users/device-login/`,
    //     method: 'POST',
    //     body: { email, password },
    //   }),
    //   async onQueryStarted(arg, { queryFulfilled, dispatch }) {
    //     try {
    //       dispatch(userLoading());
    //       const result = await queryFulfilled;

    //       Cookies.set('accessToken', result.data.access);
    //       Cookies.set('refreshToken', result.data.refresh);

    //       try {
    //         const permissionsData = await dispatch(
    //           authApi.endpoints.getPermissions.initiate()
    //         ).unwrap();

    //         // Get the active role from profile.roles or use the first role
    //         const activeRole = permissionsData.profile?.roles?.[0];

    //         dispatch(
    //           userLoggedIn({
    //             accessToken: result.data.access,
    //             refreshToken: result.data.refresh,
    //             user: {
    //               ...result.data.user,
    //               ...permissionsData.profile, // Merge profile data
    //               role: {
    //                 name: permissionsData.role,
    //                 permissions: permissionsData.permissions || [],
    //                 profile: permissionsData.profile, // Keep full profile for role switching
    //                 ...activeRole, // Merge active role details
    //               },
    //             },
    //           })
    //         );
    //       } catch (permissionError) {
    //         console.error('Failed to fetch permissions:', permissionError);

    //         dispatch(
    //           userLoggedIn({
    //             accessToken: result.data.access,
    //             refreshToken: result.data.refresh,
    //             user: result.data.user,
    //           })
    //         );
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   },
    // }),
    login: builder.mutation({
      query: ({ email, password, device_identifier }) => ({
        url: `users/device-login/`,
        method: "POST",
        body: { email, password, device_identifier }
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          const result = await queryFulfilled;

          // if OTP is required, do not try to save tokens yet(not in response)
          if (result.data.detail === "OTP_REQUIRED") {
            return; 
          }
          // save tokens normally for trusted devices
          Cookies.set("accessToken", result.data.access);
          Cookies.set("refreshToken", result.data.refresh);

          const permissionsData = await dispatch(
            authApi.endpoints.getPermissions.initiate()
          ).unwrap();

          const activeRole = permissionsData.profile?.roles?.[0];

          dispatch(
            userLoggedIn({
              accessToken: result.data.access,
              refreshToken: result.data.refresh,
              user: {
                ...result.data.user,
                ...permissionsData.profile,
                role: {
                  name: permissionsData.role,
                  permissions: permissionsData.permissions || [],
                  profile: permissionsData.profile,
                  ...activeRole
                }
              }
            })
          );
        } catch (error) {
          dispatch(userLoginFailed(error));
        }
      }
    }),


  verifyDeviceOtp: builder.mutation({
    query: ({ email, code, device_identifier }) => ({
      url: `users/verify-device-otp/`,
      method: "POST",
      body: { email, code, device_identifier }
    }),
    async onQueryStarted(arg, { queryFulfilled, dispatch }) {
      try {
        dispatch(userLoading());
        const result = await queryFulfilled;

        Cookies.set("accessToken", result.data.access);
        Cookies.set("refreshToken", result.data.refresh);
        const permissionsData = await dispatch(
          authApi.endpoints.getPermissions.initiate()
        ).unwrap();

        const activeRole = permissionsData.profile?.roles?.[0];

        dispatch(
          userLoggedIn({
            accessToken: result.data.access,
            refreshToken: result.data.refresh,
            user: {
              ...result.data.user,
              ...permissionsData.profile,
              role: {
                name: permissionsData.role,
                permissions: permissionsData.permissions || [],
                profile: permissionsData.profile,
                ...activeRole
              }
            }
          })
        );
      } catch (error) {
        dispatch(userLoginFailed(error));
      }
    }
  }),


    logoutUser: builder.mutation({
      query: () => {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token found');
        }

        return {
          url: `users/logout/`,
          method: 'POST',
          body: { refresh: refreshToken },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          await queryFulfilled;

          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log('An unknown error occurred.');
          }
        }
      },
    }),

    getPermissions: builder.query({
      query: () => ({
        url: `users/permissions/`,
        method: 'GET',
      }),
    }),

    switchRole: builder.mutation({
      query: (data) => ({
        url: `users/switch-role/`,
        method: 'POST',
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          const currentState = getState();
          const currentUser = currentState.auth.user;

          const accessToken = Cookies.get('accessToken');
          const refreshToken = Cookies.get('refreshToken');

          // Fetch fresh permissions after role switch
          const permissionsData = await dispatch(
            authApi.endpoints.getPermissions.initiate(undefined, { forceRefetch: true })
          ).unwrap();

          console.log('Fresh permissions after switch:', permissionsData);

          // Get the active role from profile.roles
          const activeRole =
            permissionsData.profile?.roles?.find((r) => r.name === permissionsData.role) ||
            permissionsData.profile?.roles?.[0];

          // Update user with new role data and permissions
          dispatch(
            userLoggedIn({
              accessToken: accessToken,
              refreshToken: refreshToken,
              user: {
                ...currentUser,
                ...permissionsData.profile, // Update profile data
                role: {
                  name: permissionsData.role,
                  permissions: permissionsData.permissions || [],
                  profile: permissionsData.profile, // Keep full profile for role switching
                  ...activeRole, // Merge active role details
                },
              },
            })
          );
        } catch (error) {
          console.error('Failed to switch role:', error);
          throw error;
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutUserMutation,
  useGetPermissionsQuery,
  useSwitchRoleMutation,
  useVerifyDeviceOtpMutation,
} = authApi;
