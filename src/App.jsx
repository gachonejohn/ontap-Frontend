import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./auth/Signin";
import Staffcycle from "./dashboards/hr/components/Staffcycle";
import Employees from "./components/employees/index";
import LeaveContent from "./components/leaves/index";
import Performance from "./dashboards/hr/components/Performance";
import Payroll from "./dashboards/hr/components/Payroll";
import Payslip from "./dashboards/employee/components/Payslip";
import HRTrainings from "./dashboards/hr/components/Trainings";
import CardsContent from "./components/cards/index"; 
import AnnouncementsHR from "./dashboards/hr/components/Announcements";
import Settings from "./components/settings/index";
import ProfileContent from "./components/myprofile/index";
import DashboardLayout from "./components/Layout/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import RolesDetails from "./components/roles/RoleDetails";
import Dashboard from "./components/dashboard/index"
import TaskContent from "./components/tasks/index";
import EmployeeDetails from "./components/employees/EmployeeDetails/index"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/signin" element={<Signin />} />
        
        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Default dashboard content at /dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Dashboard child routes */}
            <Route path="staffcycle" element={<Staffcycle />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="leaves" element={<LeaveContent />} />
            <Route path="attendance" element={<LeaveContent />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="performance" element={<Performance />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="payslips" element={<Payslip />} />
            <Route path="trainings" element={<HRTrainings />} />
            <Route path="cards" element={<CardsContent />} /> 
            <Route path="announcements" element={<AnnouncementsHR />} />
            
            {/* Settings list and details */}
            <Route path="settings" element={<Settings />} />
            <Route path="settings/:id" element={<Settings />} />
            
            {/* Profile */}
            <Route path="profile" element={<ProfileContent />} />
          </Route>
        </Route>
        
        {/* Redirect root to sign-in */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;