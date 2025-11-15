import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../store/hooks';
import { usePermissions } from '../../hooks/getPermissions';
import PageLoadingSpinner from '../common/spinners/pageLoadingSpinner';

export default function DashboardLayout() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isLoadingPermissions } = usePermissions();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isLoading = loading || isLoadingPermissions;

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PageLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main area and Navbar */}
      <div
        className={`flex flex-col flex-1 min-w-0 bg-[#F9F9FA] transition-all duration-300 ${
          sidebarOpen ? 'ml-[272px]' : 'ml-[64px]'
        }`}
      >
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 px-4 pt-[45px] mt-[40px] pb-8 bg-gray-100/50 overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}