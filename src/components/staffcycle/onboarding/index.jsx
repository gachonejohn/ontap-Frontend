import { useAppSelector } from '../../store/hooks';
import MainOnboardingDashboardContent from './mainOnboarding';
export default function OnboardingContent() {
  const { user } = useAppSelector((state) => state.auth);
  console.log('user', user);
  // Get dashboard permission
  const onboardingPermissions = user?.role?.permissions?.find(
    (p) => p.feature_code === 'onboarding_offboarding'
  );
  console.log('onboardingPermissions', onboardingPermissions);
  const canViewAll = onboardingPermissions?.can_view_all;
  const canView = onboardingPermissions?.can_view;

  return (
    <div className="flex flex-col gap-6">
      {canViewAll ? (
        <div>
          <MainOnboardingDashboardContent />
        </div>
      ) : canView ? (
        <div>individual employee onboarding</div>
      ) : (
        <p className="text-gray-600">Nothing to show</p>
      )}
    </div>
  );
}
