// src/components/myprofile/index.js
import React from "react";
import { useAppSelector } from "../../store/hooks";
import MyProfileContent from "./MyProfileContent";

export default function ProfileContent() {
  const { user } = useAppSelector(state => state.auth);
  
  console.log("Profile user", user);

  // Get profile permission
  const profilePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "my_profile"
  );
  
  console.log("profilePermissions", profilePermissions);

  const canView = profilePermissions?.can_view;
  const canEdit = profilePermissions?.can_edit;

  return (
    <div className="flex flex-col gap-6">
      {canView ? (
        <div>
          <MyProfileContent 
            canEdit={canEdit}
            user={user}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600">You don't have permission to view your profile</p>
        </div>
      )}
    </div>
  );
}