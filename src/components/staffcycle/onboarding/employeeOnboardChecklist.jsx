import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { useGetEmployeeOnboardingCheckListQuery } from '@store/services/staffcylce/onboardingService';
import { useState } from 'react';
import { FiList, FiUser, FiClock, FiCalendar } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineCircle, MdCheckCircle } from 'react-icons/md';

export const EmployeeCheckList = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetEmployeeOnboardingCheckListQuery(id, {
    skip: !isOpen,
  });

  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => setIsOpen(false);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return <span className="text-xs px-2 py-0.5 bg-red-50 text-red-600 rounded">high</span>;
      case 'MEDIUM':
        return (
          <span className="text-xs px-2 py-0.5 bg-orange-50 text-orange-600 rounded">medium</span>
        );
      case 'LOW':
        return <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">low</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded capitalize">
            Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="text-xs px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded capitalize">
            Pending
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded capitalize">
            In Progress
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded capitalize">
            {status.toLowerCase()}
          </span>
        );
    }
  };

  const getProfilePicture = (user) => {
    let profilePic = user?.profile_picture;

    if (profilePic && !profilePic.startsWith('http')) {
      profilePic = `${API_BASE_URL}${profilePic}`;
    }

    if (!profilePic) {
      profilePic = defaultProfile;
    }

    return profilePic;
  };

  const getProgressPercent = () => {
    if (!data?.steps || data.steps.length === 0) return 0;
    const completed = data.steps.filter((item) => item.status === 'COMPLETED').length;
    return Math.round((completed / data.steps.length) * 100);
  };

  const employee = data?.employee;
  const steps = data?.steps || [];

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="flex items-center gap-2 text-sm px-3 py-1.5 border rounded hover:bg-gray-50 whitespace-nowrap"
      >
        <FiList className="w-4 h-4" />
        <span className="text-xs font-light">View Checklist</span>
      </button>

      {isOpen && (
        <div
          className="relative z-50"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          />

          <div className="fixed inset-0 z-50 w-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start p-6 border-b">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Onboarding Timeline {employee ? `- ${employee.full_name}` : ''}
                  </h2>
                  {employee && (
                    <div className="flex items-center gap-3 mt-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                        <img
                          src={getProfilePicture(employee.user)}
                          alt={employee.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = defaultProfile;
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{employee.full_name}</p>
                        <p className="text-xs text-gray-500">
                          {employee.position || employee.department}
                        </p>
                        {steps.length > 0 && (
                          <p className="text-xs text-gray-400">Start Date: {steps[0].start_date}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {steps.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Overall Progress</span>
                        <span className="font-semibold text-gray-900">{getProgressPercent()}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full transition-all"
                          style={{ width: `${getProgressPercent()}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="ml-4 text-gray-400 hover:text-gray-600"
                >
                  <IoCloseOutline size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div>
                    <ContentSpinner />
                  </div>
                ) : steps.length > 0 ? (
                  <div className="space-y-3">
                    {steps.map((item) => {
                      let profilePic =
                        item?.onboarding_template_step?.onboarding_step?.assignee?.user
                          ?.profile_picture;

                      if (profilePic && !profilePic.startsWith('http')) {
                        profilePic = `${API_BASE_URL}${profilePic}`;
                      }

                      if (!profilePic) {
                        profilePic = defaultProfile;
                      }
                      return (
                        <div
                          key={item.id}
                          className="flex gap-3 p-4 border rounded-lg hover:bg-gray-50 transition"
                        >
                          {/* Status Icon */}
                          <div className="flex-shrink-0 mt-0.5">
                            {item.status === 'COMPLETED' ? (
                              <MdCheckCircle className="w-5 h-5 text-teal-600" />
                            ) : (
                              <MdOutlineCircle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 text-sm">
                                {item.onboarding_template_step.onboarding_step.title}
                              </h3>
                              {getPriorityBadge(
                                item.onboarding_template_step.onboarding_step.priority
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                              {item.onboarding_template_step.onboarding_step.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                                  <img
                                    src={profilePic}
                                    alt={`${item?.onboarding_template_step?.onboarding_step?.assignee?.user?.first_name} ${item?.onboarding_template_step?.onboarding_step?.assignee?.user?.last_name}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.src = defaultProfile;
                                    }}
                                  />
                                </div>
                                <span>
                                  {item.onboarding_template_step.onboarding_step.assignee.full_name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5" />
                                <span>Start: {item.calculated_start_date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5" />
                                <span>Due: {item.calculated_due_date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5" />
                                <span>
                                  {item.onboarding_template_step.onboarding_step.duration_in_days}{' '}
                                  days
                                </span>
                              </div>
                            </div>

                            <div className="mt-2">{getStatusBadge(item.status)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FiList className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No checklist items found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
