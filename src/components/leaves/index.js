import React from "react";
import { useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import EmployLeaveDashboardContent from "./EmployeeLeavesDashboardContent";
import EmployeeAttendanceDashboardContent from "./EmployeeAttendanceDashboardContent";
import MainLeaveDashboardContent from "./mainLeaveDashboardContent";
import MainAttendanceDashboardContent from "./mainAttendanceDashboardContent";

export default function LeaveContent() {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  
  const isLeaveRoute = location.pathname.includes('/leaves');
  const isAttendanceRoute = location.pathname.includes('/attendance');

  const leavePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "leave"
  );
  
  const attendancePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "attendance"
  );

  const permissions = isLeaveRoute ? leavePermissions : attendancePermissions;
  const canViewAll = permissions?.can_view_all;
  const canView = permissions?.can_view;

  const hasRouteAccess = (isLeaveRoute && leavePermissions?.can_view) || 
                        (isAttendanceRoute && attendancePermissions?.can_view);

  if (!hasRouteAccess) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  if (canViewAll) {
    return (
      <div className="flex flex-col gap-6">
        {isLeaveRoute ? (
          <MainLeaveDashboardContent />
        ) : (
          <MainAttendanceDashboardContent />
        )}
      </div>
    );
  } else if (canView) {
    return (
      <div className="flex flex-col gap-6">
        {isLeaveRoute ? (
          <EmployLeaveDashboardContent />
        ) : (
          <EmployeeAttendanceDashboardContent />
        )}
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