import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../../store/services/auth/authService";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { userLoggedOut } from "../../../store/services/auth/authSlice";
import { usePermissions } from "../../../hooks/getPermissions";
import { toast } from "react-toastify";
import ClickOutside from "@hooks/ClickOutside";

const ViewProfileModal = ({ isOpen, onClose, exceptionRef }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isLoadingPermissions } = usePermissions();

  
  const isLoadingUser = loading || isLoadingPermissions;

  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading("Logging out...");

      await logoutUser({}).unwrap();

      dispatch(userLoggedOut());
      toast.update(loadingToast, {
        render: "Logged out successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <ClickOutside onClick={onClose} exceptionRef={exceptionRef}>
      <div
        className="absolute top-16 right-5 flex   
          border flex-col justify-start items-start gap-2 pt-2 rounded-lg min-h-16 shadow-md bg-white overflow-hidden z-50"
      >
        {/* User Info */}
        <div className="flex flex-col gap-0.5 px-3 min-w-40 min-h-16 w-full">
          <div className="font-inter text-base text-neutral-900 font-medium whitespace-nowrap">
            {user?.first_name ?? ""} {user?.last_name ?? ""}
          </div>

          <div className="font-inter text-xs text-gray-600 font-normal whitespace-normal break-works">
            {user?.email ?? ""}
          </div>
          <div className="font-inter text-xs mt-3 py-2 px-3 rounded-2xl shadow-sm bg-primary-50 text-primary w-fit font-normal whitespace-normal break-works">
            {user?.position?.name ?? ""}
          </div>
        </div>

        {/* Logout */}
        <div
          onClick={handleLogout}
          disabled={isLoading}
          className="flex flex-col justify-start items-center h-9 cursor-pointer hover:bg-gray-50 w-full"
        >
          <div className="flex flex-row justify-start items-center gap-2 px-3 w-full h-9">
            {isLoading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
            ) : (
              <img
                width="17"
                height="17"
                src="/images/logout.png"
                alt="Logout Icon"
              />
            )}
            {isLoading ? "Logging out..." : "Log out"}
          </div>
        </div>
      </div>
    </ClickOutside>
  );
};

export default ViewProfileModal;
