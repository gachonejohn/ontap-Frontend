import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./auth/Signin";
import Staffcycle from "./dashboards/hr/components/Staffcycle";
import Employees from "./components/employees";
import EmployeeDetails from "./components/employees/EmployeeDetails";
import LeaveContent from "./components/leaves";
import Performance from "./components/performance";
import PayrollContent from "./components/payroll/settings";
import HRTrainings from "./dashboards/hr/components/Trainings";
import CardsContent from "./components/cards";
import Announcements from "./components/announcements";
import Settings from "./components/settings";
import ProfileContent from "./components/myprofile";
import DashboardLayout from "./components/Layout/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";
import Dashboard from "./components/dashboard";
import TaskContent from "./components/tasks";
import MainOnboardingDashboardContent from "@components/staffcycle/onboarding/mainOnboarding";
import OnboardingList from "@components/staffcycle/onboarding/onboardingList";
import Templates from "@components/staffcycle/onboarding/templates/templateList";
import TemplateDetails from "@components/staffcycle/onboarding/templates/templateDetails";
import Steps from "@components/staffcycle/onboarding/steps";
import AttendacePage from "@components/attendance";
import AttendanceManagement from "@components/attendance/management";

import UnifiedCalendar from "./components/calendar";
import RecordsPage from "./components/records/RecordsPage";
import ChatPage from "@components/chat/dashboard";
import AttendanceRecords from "./components/records/AttendanceRecords";
import LeavesRecords from "@components/records/LeavesRecords";
import CreateEmployeegWizard from "@components/employees/Onboarding";
import { CreateNewEmployee } from "@components/employees/Onboarding/CreateEmployee";
import Payroll from "@components/payroll";
import PaySlip from "@components/payslip";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/signin" element={<Signin />} />
        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Default dashboard content */}
            <Route index element={<Dashboard />} />
            {/* Staff Onboarding */}
            <Route path="onboarding" element={<MainOnboardingDashboardContent />}>
              <Route index element={<OnboardingList />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/:id" element={<TemplateDetails />} />
              <Route path="steps" element={<Steps />} />
            </Route>
            <Route path="staffcycle" element={<Staffcycle />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/new" element={<CreateNewEmployee />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="leaves" element={<LeaveContent />} />
            <Route path="attendance" element={<AttendacePage />} />
            <Route path="calendar" element={<UnifiedCalendar />} />
            <Route path="records" element={<RecordsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="attendance_management" element={<AttendanceManagement />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="performance" element={<Performance />} />
            <Route path="payroll-settings" element={<PayrollContent />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="payslips" element={<PaySlip/>} />
            <Route path="payroll/:id" element={<PayslipDetails />} />
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
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}
export default App;