import React from "react";
import { useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import EmployeePayrollContent from "./EmployeePayrollContent";
import MainPayrollContent from "./mainPayrollContent";

export default function PayrollContent() {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  const isPayrollRoute = location.pathname.includes('/payroll');

  const payrollPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "pay_roll"
  );

  const canViewAll = payrollPermissions?.can_view_all;
  const canView = payrollPermissions?.can_view;

  if (canViewAll) {
    return (
      <div className="flex flex-col gap-6">
        <MainPayrollContent />
      </div>
    );
  } else if (canView) {
    return (
      <div className="flex flex-col gap-6">
        <EmployeePayrollContent />
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