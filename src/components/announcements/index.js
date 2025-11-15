import React from "react";
import { useAppSelector } from "../../store/hooks";
import AnnouncementsContent from "./AnnouncementsContent";

export default function Announcements() {
  const { user } = useAppSelector(state => state.auth);
  
  const announcementsPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "announcements"
  );
  
  const canViewAll = announcementsPermissions?.can_view_all;
  const canView = announcementsPermissions?.can_view;
  
  if (canViewAll || canView) {
    return (
      <div className="flex flex-col gap-6">
        <AnnouncementsContent />
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
