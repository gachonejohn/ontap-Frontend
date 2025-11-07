import { Outlet, useLocation } from 'react-router-dom';
import StaffOnboardingLayout from './layout';

export default function MainOnboardingDashboardContent() {
  const location = useLocation();
  const isTemplatesView = location.pathname.includes('/templates');
  // const isStepsView = location.pathname.includes('steps');
  return (
    <StaffOnboardingLayout 
    isTemplatesView={isTemplatesView} 
    // isStepsView={isStepsView}
    >
      <Outlet />
    </StaffOnboardingLayout>
  );
}
