import React from "react";
import { useAppSelector } from "../../store/hooks";
import { useLocation } from "react-router-dom";
import EmployeePayslipContent from "./EmployeePayslipContent";
import MainPayslipContent from "./mainPayslipContent";

export default function PayslipContent() {
  const { user } = useAppSelector(state => state.auth);
  const location = useLocation();
  const isPayslipRoute = location.pathname.includes('/payslips');

  const payslipPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "pay_slips"
  );

  const canViewAll = payslipPermissions?.can_view_all;
  const canView = payslipPermissions?.can_view;

  if (canViewAll) {
    return (
      <div className="flex flex-col gap-6">
        <MainPayslipContent />
      </div>
    );
  } else if (canView) {
    return (
      <div className="flex flex-col gap-6">
        <EmployeePayslipContent />
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