import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetPermissionsQuery } from "../store/services/auth/authService";
import { userLoggedIn } from "../store/services/auth/authSlice";
import Cookies from "js-cookie";

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);

  const needsPermissions =
    accessToken &&
    user &&
    (!user.role?.permissions || user.role.permissions.length === 0);

  const {
    data: permissionsData,
    isLoading: isLoadingPermissions,
    error: permissionsError,
    refetch,
  } = useGetPermissionsQuery(undefined, {
    skip: !needsPermissions,
  });

  console.log("permissionsData", permissionsData);

  useEffect(() => {
    if (permissionsData && accessToken && user) {
      const currentPermissions = user.role?.permissions || [];
      const newPermissions = permissionsData.permissions || [];

      // Only update if permissions actually changed
      const isDifferent =
        currentPermissions.length !== newPermissions.length ||
        currentPermissions.some(
          (p, i) =>
            p.feature_code !== newPermissions[i]?.feature_code ||
            p.can_view !== newPermissions[i]?.can_view
        );

      if (isDifferent) {
        dispatch(
          userLoggedIn({
            accessToken,
            refreshToken: Cookies.get("refreshToken") || "",
            user: {
              ...user,
              role: {
                ...user.role,
                ...permissionsData,
              },
            },
          })
        );
      }
    }
  }, [permissionsData, accessToken, dispatch, user]);

  const retryPermissions = useCallback(() => {
    if (permissionsError && needsPermissions) {
      refetch();
    }
  }, [permissionsError, needsPermissions, refetch]);

  return {
    permissions: user?.role?.permissions || [],
    isLoadingPermissions: isLoadingPermissions || (loading && needsPermissions),
    permissionsError,
    retryPermissions,
    hasPermissions: user?.role?.permissions && user.role.permissions.length > 0,
  };
};
