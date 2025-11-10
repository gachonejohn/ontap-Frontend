import React from "react";
import { useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import EmployLeaveDashboardContent from "./EmployeeLeavesDashboardContent";
import MainLeaveDashboardContent from "./mainLeaveDashboardContent";

export default function LeaveContent() {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  
  const isLeaveRoute = location.pathname.includes('/leaves');

  const leavePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "leaves"
  );
  
  const canViewAll = leavePermissions?.can_view_all;
  const canView = leavePermissions?.can_view;


  if (canViewAll) {
    return (
      <div className="flex flex-col gap-6">
        <MainLeaveDashboardContent />
      </div>
    );
  } else if (canView) {
    return (
      <div className="flex flex-col gap-6">
        <EmployLeaveDashboardContent />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-gray-600">Nothing to show</p>
      </div>
    );
  }
}