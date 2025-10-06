
import Cookies from "js-cookie";
import { userLoading, userLoggedIn, userLoggedOut } from "./authSlice";
import { apiSlice } from "../../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({email,password}) => ({
        url: `users/login/`,
        method: "POST",
        body: {email,password},
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          const result = await queryFulfilled;
          console.log("result", result);

          Cookies.set("accessToken", result.data.access);
          Cookies.set("refreshToken", result.data.refresh);

          try {
            const permissions = await dispatch(
              authApi.endpoints.getPermissions.initiate()
            ).unwrap();

            console.log("permissions", permissions);

            dispatch(
              userLoggedIn({
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                user: {
                  ...result.data.user,
                  role: {
                    ...result.data.user.role,
                    permissions: permissions.role?.permissions || [],
                  },
                },
              })
            );
          } catch (permissionError) {
            console.error("Failed to fetch permissions:", permissionError);

            dispatch(
              userLoggedIn({
                accessToken: result.data.access,
                refreshToken: result.data.refresh,
                user: result.data.user,
              })
            );
          }
        } catch (error) {
          console.log(error);
        }
      },
    }),

    logoutUser: builder.mutation({
      query: () => {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        return {
          url: `users/logout/`,
          method: "POST",
          body: { refresh: refreshToken },
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoading());
          await queryFulfilled;

          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          dispatch(userLoggedOut());
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
          } else {
            console.log("An unknown error occurred.");
          }
        }
      },
    }),

    getPermissions: builder.query({
      query: () => ({
        url: `users/permissions/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutUserMutation,
  useGetPermissionsQuery,
} = authApi;
