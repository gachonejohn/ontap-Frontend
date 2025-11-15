import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Signin from "./auth/Signin";
import Staffcycle from "./dashboards/hr/components/Staffcycle";
import Employees from "./components/employees";
import EmployeeDetails from "./components/employees/EmployeeDetails";
import LeaveContent from "./components/leaves";
import Performance from "./components/performance";
import Payroll from "./dashboards/hr/components/Payroll";
import Payslip from "./dashboards/employee/components/Payslip";
import HRTrainings from "./dashboards/hr/components/Trainings";
import CardsContent from "./components/cards"; 
import Announcements from "./components/announcements";
import Settings from "./components/settings";
import ProfileContent from "./components/myprofile";
import DashboardLayout from "./components/Layout/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import RolesDetails from "./components/roles/RoleDetails";
import Dashboard from "./components/dashboard";
import TaskContent from "./components/tasks";

import MainOnboardingDashboardContent from "@components/staffcycle/onboarding/mainOnboarding";
import OnboardingList from "@components/staffcycle/onboarding/onboardingList";
import Templates from "@components/staffcycle/onboarding/templates/templateList";
import TemplateDetails from "@components/staffcycle/onboarding/templates/templateDetails";
import Steps from "@components/staffcycle/onboarding/steps";
import AttendacePage from "@components/attendance";

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

            <Route path="onboarding" element={<MainOnboardingDashboardContent />}>
              <Route index element={<OnboardingList />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/:id" element={<TemplateDetails />} />
              <Route path="steps" element={<Steps />} />
            </Route>

            <Route path="staffcycle" element={<Staffcycle />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="leaves" element={<LeaveContent />} />
            <Route path="attendance" element={<AttendacePage />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="performance" element={<Performance />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="payslips" element={<Payslip />} />
            <Route path="trainings" element={<HRTrainings />} />
            <Route path="cards" element={<CardsContent />} />
            <Route path="announcements" element={<Announcements />} />

            {/* Settings */}
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