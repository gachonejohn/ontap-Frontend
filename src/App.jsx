import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Signin from './auth/Signin';

import MainOnboardingDashboardContent from '@components/staffcycle/onboarding/mainOnboarding';
import Dashboard from './components/dashboard/index';
import EmployeeDetails from './components/employees/EmployeeDetails/index';
import Employees from './components/employees/index';
import DashboardLayout from './components/Layout/Layout';
import LeaveContent from './components/leaves/index';
import Settings from './components/settings/index';
import TaskContent from './components/tasks/index';
import Payslip from './dashboards/employee/components/Payslip';
import AnnouncementsHR from './dashboards/hr/components/Announcements';
import CardsHR from './dashboards/hr/components/Cards';
import Payroll from './dashboards/hr/components/Payroll';
import Performance from './dashboards/hr/components/Performance';
import HRProfile from './dashboards/hr/components/Profile';
import HRTrainings from './dashboards/hr/components/Trainings';
import ProtectedRoute from './hooks/ProtectedRoute';
import OnboardingList from '@components/staffcycle/onboarding/onboardingList';
import Templates from '@components/staffcycle/onboarding/templates/templateList';
import Steps from '@components/staffcycle/onboarding/steps';
import TemplateDetails from '@components/staffcycle/onboarding/templates/templateDetails';
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
            <Route path="onboarding" element={<MainOnboardingDashboardContent />}>
              <Route index element={<OnboardingList />} />
              <Route path="templates" element={<Templates />} />
              <Route path="templates/:id" element={<TemplateDetails />} />
              <Route path="steps" element={<Steps />} />
            </Route>
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="leaves" element={<LeaveContent />} />
            <Route path="tasks" element={<TaskContent />} />
            <Route path="performance" element={<Performance />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="payslips" element={<Payslip />} />
            <Route path="trainings" element={<HRTrainings />} />
            <Route path="cards" element={<CardsHR />} />
            <Route path="announcements" element={<AnnouncementsHR />} />

            {/* Settings list and details */}
            <Route path="settings" element={<Settings />} />
            <Route path="settings/:id" element={<Settings />} />

            {/* Profile */}
            <Route path="profile" element={<HRProfile />} />
          </Route>
        </Route>

        {/* Redirect root to sign-in */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
