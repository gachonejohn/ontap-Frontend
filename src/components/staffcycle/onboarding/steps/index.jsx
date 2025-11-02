import NoDataFound from '@components/common/NoData';
import Pagination from '@components/common/pagination';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo, useState } from 'react';
import { FiCalendar, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ButtonDropdown from '@components/common/ActionsPopover';
import ActionModal from '@components/common/Modals/ActionModal';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import {
  useDeleteOnboardingStepMutation,
  useGetOnboardingStepsQuery,
} from '@store/services/staffcylce/onboardingService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { toast } from 'react-toastify';
import { EditStep } from './EditStep';
import { NewStep } from './NewStep';

const Steps = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

  const { filters, currentPage, handleFilterChange, handlePageChange } = useFilters({
    initialFilters: {
      search: searchParams.get('search') || '',
      department: searchParams.get('department') || '',
      date: searchParams.get('date') || '',
      from_date: searchParams.get('from_date') || '',
      to_date: searchParams.get('to_date') || '',
      status: searchParams.get('status') || '',
    },
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: ['search'],
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );
  const { data, isLoading, error, refetch } = useGetOnboardingStepsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log('data', data);
  const [deleteOnboardingStep, { isLoading: deleting }] = useDeleteOnboardingStepMutation();

  const openDeleteModal = (id) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    try {
      await deleteOnboardingStep(selectedItem).unwrap();
      toast.success('Onboarding Task deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting task.');
      toast.error(message);
    }
  };
  const departmentsOptions =
    departmentsData?.map((item) => ({
      value: item.id,
      label: `${item.name}`,
    })) || [];

  const handleDepartmentChange = (selectedOption) => {
    handleFilterChange({
      department: selectedOption ? selectedOption.value : '',
    });
  };

  const handleStatusChange = (selectedOption) => {
    handleFilterChange({
      status: selectedOption ? selectedOption.value : '',
    });
  };

  const defaultProfile = '/images/avatar/default-avatar.jpg';
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;

  return (
    <>
      <div className="flex flex-col gap-4  rounded-xl  bg-white  border shadow-md ">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold">Onboarding Stpes Overview</div>
            <div className="text-sm text-gray-600 font-normal mt-3">
              Track and manage assigned onboarding steps
            </div>
          </div>

          {/* <button
          className="flex justify-center items-center gap-2 px-4 py-2.5 
          rounded-md text-primary border border-primary text-sm transition-colors"
        >
          + New Step
        </button> */}
          <NewStep refetchData={refetch} />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <ContentSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
            {'status' in error && error.data?.error
              ? error.data.error
              : 'An error occurred while fetching data.'}
          </div>
        ) : data && data.results.length > 0 ? (
          <div className="space-y-4 p-4">
            {data?.results?.map((task) => {
              let profilePic = task?.assignee?.user?.profile_picture;

              if (profilePic && !profilePic.startsWith('http')) {
                profilePic = `${API_BASE_URL}${profilePic}`;
              }

              if (!profilePic) {
                profilePic = defaultProfile;
              }
              return (
                <div
                  key={task.id}
                  className="flex gap-4 border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="w-full flex justify-between gap-4">
                    {/* Task info */}
                    <div className="flex-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">{task?.description}</p>

                      <div className="flex items-center gap-6 mt-2">
                        {/* Assignee */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Assignee
                          </span>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-full py-1 px-3 border border-gray-200">
                            <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-white">
                              <img
                                src={profilePic}
                                alt={`${task.assignee.user.first_name} ${task.assignee.user.last_name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = defaultProfile;
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {task?.assignee?.full_name}
                            </span>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Duration
                          </span>
                          <div className="flex items-center gap-2 bg-gray-50 rounded-md py-1.5 px-3 border border-gray-200">
                            <FiCalendar className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">
                              {task.duration_in_days} {task.duration_in_days === 1 ? 'Day' : 'Days'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Priority + Buttons */}
                    <div className="flex flex-col gap-3 items-end justify-between">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide
                ${
                  task.priority === 'HIGH'
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : task.priority === 'MEDIUM'
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                }`}
                      >
                        {task.priority}
                      </span>

                      <ButtonDropdown>
                        <EditStep data={task} refetchData={refetch} />
                        <button
                          className="flex items-center space-x-2 font-inter"
                          title="Delete Template"
                          onClick={() => openDeleteModal(task.id)}
                        >
                          <FiTrash2 className="text-sm text-red-500" />
                          <span className="text-sm">Delete</span>
                        </button>
                      </ButtonDropdown>
                    </div>
                  </div>
                </div>
              );
            })}
            <ActionModal
              isOpen={isDeleteModalOpen}
              onClose={closeDeleteModal}
              onDelete={handleDelete}
              isDeleting={deleting}
              confirmationMessage="Are you sure you want to delete this Onboarding Step?"
              deleteMessage="Deleting this Onboarding Step cannot be undone."
              title="Delete Onboarding Step"
              actionText="Delete"
            />
          </div>
        ) : (
          <NoDataFound message="No Onboarding steps found" />
        )}

        {data && data?.count > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={data?.count}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
};

export default Steps;
