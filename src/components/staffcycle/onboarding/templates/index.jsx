import StaffOnboardingLayout from '../layout';
import Templates from './templateList';

export default function TemplatesPage() {
  return (
    <StaffOnboardingLayout
      title="Onboarding Templates"
      subtitle="Manage and edit onboarding templates"
    >
      <Templates />
    </StaffOnboardingLayout>
  );
}
