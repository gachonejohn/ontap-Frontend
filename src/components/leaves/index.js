import React, { useState, useRef, useEffect } from "react";


import { useAppSelector } from "../../store/hooks";
import EmployLeaveDashboardContent from "./EmployeeLeavesDashboardContent";
import MainLeaveAttendanceDashboardContent from "./mainLeaveDashboardContent";
export default function LeaveContent() {

   const { user } = useAppSelector(state => state.auth);
  console.log("user", user)
  // Get dashboard permission
  const leaveAttendacePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "leave_attendance"
  );
  console.log("leaveAttendacePermissions",leaveAttendacePermissions)
 const canViewAll = leaveAttendacePermissions?.can_view_all;
  const canView = leaveAttendacePermissions?.can_view;


  return (
    <div className="flex flex-col gap-6">

      {canViewAll ? (
       <div>
        <MainLeaveAttendanceDashboardContent />
       </div>
     ) : canView ? (
        <div>
            <EmployLeaveDashboardContent />
        </div>
      ) : (
        <p className="text-gray-600">Nothing to show</p>
      )}
     
     
    </div>
  );
}