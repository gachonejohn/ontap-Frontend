import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAppSelector } from "../../store/hooks";
import { usePermissions } from "../../hooks/getPermissions";
import PageLoadingSpinner from "../common/spinners/pageLoadingSpinner";
 

export default function DashboardLayout() {
  const { user, loading } = useAppSelector((state) => state.auth);
    const { isLoadingPermissions, permissionsError, retryPermissions } = usePermissions();

  // Show loading if auth is loading or permissions are loading
  const isLoading = loading || isLoadingPermissions;

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PageLoadingSpinner />
      </div>
    );
  }
  return (
<<<<<<< Updated upstream
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar (role aware) */}
      <Sidebar />

      {/* Main area */}
     <div className="flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#F9F9FA] z-10">
  <Header />
  <div className="flex-1 px-8 pt-[45px] mt-20 pb-8 mt-[62px] bg-white">
  <Outlet />
</div>

</div>

=======
    <div className="flex w-full min-h-screen overflow-y-auto">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`flex flex-col flex-1 w-full overflow-y-hidden bg-[#F9F9FA] transition-all duration-300 ${
          sidebarOpen ? "ml-[272px]" : "ml-[64px]"
        }`}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 px-4 mt-15 py-8 bg-white">
          <Outlet />
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
