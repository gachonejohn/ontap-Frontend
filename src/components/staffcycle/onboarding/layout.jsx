import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import StatCard from '@components/common/statsCard';
import { useGetOnboardingMetricsQuery } from '@store/services/staffcylce/onboardingService';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FiClock, FiTrendingUp, FiUserPlus } from 'react-icons/fi';
import { IoArrowBack, IoSettingsOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
export default function StaffOnboardingLayout({ children, isTemplatesView, isStepsView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, isLoading, error, refetch } = useGetOnboardingMetricsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const isDetailView = /\/templates\/\d+|\/steps\/\d+/.test(location.pathname);
  const cards = data
    ? [
        {
          title: 'Active Onboarding',
          value: data.active_onboardings ?? 0,
          subtext: `${data.avg_progress ?? '0%'} avg progress`,
          icon: FiUserPlus,
          iconColor: 'text-white',
          iconBgColor: 'bg-green-600',
        },
        {
          title: 'Pending Tasks',
          value: data.pending_tasks ?? 0,
          subtext: `${data.avg_progress ?? '0%'} avg progress`,
          icon: AiOutlineExclamationCircle,
          iconColor: 'text-white',
          iconBgColor: 'bg-orange-600',
        },
        {
          title: 'Avg Completion Time',
          value: data.avg_completion_time ?? '0 Days',
          subtext: `${data.comparison_vs_last_month ?? '0%'} vs last month`,
          icon: FiClock,
          iconColor: 'text-white',
          iconBgColor: 'bg-indigo-600',
        },
        {
          title: 'Completed Onboarding',
          value: data.completed_onboardings ?? 0,
          subtext: `${data.comparison_vs_last_month ?? '0%'} vs last month`,
          icon: FiTrendingUp,
          iconColor: 'text-white',
          iconBgColor: 'bg-blue-600',
        },
      ]
    : [];
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center mb-3 py-2">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            {isTemplatesView
              ? 'Onboarding Templates'
              : isStepsView
                ? 'Onboarding Steps'
                : 'Staff Onboarding'}
          </div>
          <div className="text-sm text-gray-600 font-normal">
            {isTemplatesView
              ? 'Manage and edit onboarding templates'
              : isStepsView
                ? 'Manage Onboarding Steps'
                : 'Manage staff Onboarding'}
          </div>
        </div>

        <div className="flex gap-2">
          {!isTemplatesView && !isStepsView && (
            <>
              <button
                onClick={() => navigate('/dashboard/onboarding/templates')}
                className="flex justify-center items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md text-sm"
              >
                <IoSettingsOutline className="w-5 h-5" />
                <span>Manage Templates</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/onboarding/steps')}
                className="flex justify-center items-center gap-2 px-4 py-2.5
                 text-primary border border-primary rounded-md text-sm"
              >
                <IoSettingsOutline className="w-5 h-5" />
                <span>Manage Steps</span>
              </button>
            </>
          )}
          {(isTemplatesView || isStepsView) && !isDetailView && (
            <button
              onClick={() => navigate('/dashboard/onboarding')}
              className="flex justify-center items-center gap-2 px-4 py-2.5 text-primary rounded-md text-sm"
            >
              <IoArrowBack className="w-5 h-5" />
              <span>Back to Onboarding</span>
            </button>
          )}
        </div>
      </div>

      {!isTemplatesView && !isStepsView && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {isLoading ? (
            <div className="col-span-4 text-center text-gray-500 py-6">
              <ContentSpinner />
            </div>
          ) : error ? (
            <div className="col-span-4 text-center text-red-500 py-6">Failed to load metrics.</div>
          ) : (
            cards.map((card, i) => <StatCard key={i} {...card} />)
          )}
        </div>
      )}

      <div>{children}</div>
    </div>
  );
}
