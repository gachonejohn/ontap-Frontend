// src/components/cards/index.js
import React from "react";
import { useAppSelector } from "../../store/hooks";
import EmployeeCardContent from "./employeecard";
import MainCardContent from "./maincard";

export default function CardsContent() {
  const { user } = useAppSelector(state => state.auth);
  
  console.log("Cards user", user);

  // Get digital cards permission
  const digitalCardsPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "digital_cards"
  );
  
  console.log("digitalCardsPermissions", digitalCardsPermissions);

  const canViewAll = digitalCardsPermissions?.can_view_all;
  const canView = digitalCardsPermissions?.can_view;

  return (
    <div className="flex flex-col gap-6">
      {canViewAll ? (
        <div>
          <MainCardContent />
        </div>
      ) : canView ? (
        <div>
          <EmployeeCardContent />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">You don't have permission to view digital cards</p>
        </div>
      )}
    </div>
  );
}