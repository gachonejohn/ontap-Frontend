import React from "react";
import { useAppSelector } from "../../store/hooks";
import PerformanceContent from "./PerformanceContent";

export default function Performance() {
  const { user } = useAppSelector(state => state.auth);
  
  const performancePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "performance"
  );
  
  const canViewAll = performancePermissions?.can_view_all;
  const canView = performancePermissions?.can_view;
  
  if (canViewAll || canView) {
    return (
      <div className="flex flex-col gap-6">
        <PerformanceContent />
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