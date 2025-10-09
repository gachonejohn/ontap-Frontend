import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useGetPermissionsQuery } from "../store/services/auth/authService";
import { userLoggedIn } from "../store/services/auth/authSlice";
import Cookies from "js-cookie";

export const usePermissions = () => {
  const dispatch = useAppDispatch();
  const { user, accessToken, loading } = useAppSelector((state) => state.auth);
  const previousPermissionsRef = useRef(null);

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
      const newPermissions = permissionsData.permissions || [];
      
      // Compare with previous permissions to avoid unnecessary updates
      const permissionsString = JSON.stringify(newPermissions);
      if (previousPermissionsRef.current === permissionsString) {
        return;
      }

      previousPermissionsRef.current = permissionsString;

      // Get the active role from profile.roles
      const activeRole = permissionsData.profile?.roles?.find(r => r.name === permissionsData.role) 
        || permissionsData.profile?.roles?.[0];

      dispatch(
        userLoggedIn({
          accessToken,
          refreshToken: Cookies.get("refreshToken") || "",
          user: {
            ...user,
            ...permissionsData.profile, // Merge profile data
            role: {
              name: permissionsData.role,
              permissions: newPermissions,
              profile: permissionsData.profile, // Keep full profile for role switching
              ...activeRole, // Merge active role details
            },
          },
        })
      );
    }
  }, [permissionsData, accessToken, dispatch]);

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