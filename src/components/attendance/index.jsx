import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import EmployeeAttendanceDashboardContent from "./EmployeeAttendanceDashboardContent";


export default function AttendacePage() {
  const { user, loading } = useAppSelector(state => state.auth);
  const location = useLocation();
  


  
  const attendancePermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === "attendance"
  );


  const canViewAll = attendancePermissions?.can_view_all;
  const canView = attendancePermissions?.can_view;


if (loading) {
    return (
      <div > 
     <ContentSpinner />
      </div>
    );
  }


  if (canView) {
    return (
      <div className="flex flex-col gap-6">
      
          <EmployeeAttendanceDashboardContent />
      
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