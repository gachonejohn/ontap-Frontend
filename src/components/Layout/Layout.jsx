import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAppSelector } from "../../store/hooks";
import { usePermissions } from "../../hooks/getPermissions";
import PageLoadingSpinner from "../common/spinners/pageLoadingSpinner";

export default function DashboardLayout() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isLoadingPermissions } = usePermissions();

  const [sidebarOpen, setSidebarOpen] = useState(false); // <-- add this

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
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar (role aware) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main area */}
      <div
        className={`flex flex-col flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#F9F9FA] transition-all duration-300 ${
          sidebarOpen ? "ml-[272px]" : "ml-[64px]"
        }`}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 px-8 pt-[45px] mt-[62px] pb-8 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
