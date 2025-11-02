import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function EmployeeLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar (role aware) */}
      <Sidebar role="employee" />

      {/* Main area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden bg-white z-10">
        {/* Universal header */}
        <Header />

        {/* Page content */}
        <div className="flex flex-col gap-6 px-8 pt-[45px] pb-8 max-w-[calc(100vw-272px)] mt-[62px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
