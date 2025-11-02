import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import {
  useDeleteTemplateStepMutation,
  useGetOnboardingTemplatesDetailsQuery,
} from '@store/services/staffcylce/onboardingService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useState } from 'react';
import { FiArrowLeft, FiCalendar, FiTrash2, FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AttachStep } from './steps/attachStep';
import ActionModal from '@components/common/Modals/ActionModal';

const TemplateDetails = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { id } = useParams();
  console.log('template id =====', id);

  const { data, isLoading, error, refetch } = useGetOnboardingTemplatesDetailsQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  console.log('data', data);
  const [deleteTemplateStep, { isLoading: deleting }] = useDeleteTemplateStepMutation();

  const openDeleteModal = (id) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDelete = async () => {
    console.log('selectedItem', selectedItem);
    try {
      await deleteTemplateStep(selectedItem).unwrap();
      toast.success('Step Removed successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting document type.');
      toast.error(message);
    }
  };
  if (isLoading)
    return (
      <div>
        <ContentSpinner />
      </div>
    );
  if (error) return <div className="text-red-600">Error fetching template details.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div
        onClick={() => navigate('/dashboard/onboarding/templates')}
        className="flex cursor-pointer w-fit items-center space-x-2 mb-4 "
      >
        <FiArrowLeft />
        <span>Back</span>
      </div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">{data?.name ?? 'Template Details'}</h2>
        {/* <button className="flex px-3.5 py-2.5 items-center gap-2 border border-primary rounded-md text-primary">
        <FiPlus className="text-sm" />
        <span className="text-sm">Attach Step</span>
      </button> */}
        <AttachStep data={data} refetchData={refetch} />
      </div>
      <p className="text-gray-700 mb-2">{data?.description}</p>
      <p className="text-sm text-gray-500 mb-4">Duration: {data?.duration_in_days} days</p>

      <h3 className="text-lg font-semibold mb-2">Steps</h3>
      {data?.steps?.length > 0 ? (
        <div className="space-y-4">
          {data.steps.map((step, index) => {
            // const step = step.onboarding_step;
            console.log('step', step);
            return (
              <div
                key={index}
                className="flex justify-between items-start gap-4 border rounded-lg p-5 bg-gray-50 hover:shadow-sm transition"
              >
                {/* Left side: step details */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-base">
                      {step?.onboarding_step?.title}
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      Step {step.step_order}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{step?.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mt-1">
                    <div className="flex items-center gap-1.5">
                      <FiUser className="w-4 h-4" />
                      <span>{step?.onboarding_step?.assignee?.full_name ?? 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="w-4 h-4" />
                      <span>{step?.onboarding_step?.duration_in_days ?? 0} days</span>
                    </div>
                  </div>
                </div>

                {/* Right side: actions */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                      step?.onboarding_step?.priority === 'HIGH'
                        ? 'bg-red-100 text-red-700'
                        : step?.onboarding_step?.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {step?.onboarding_step?.priority ?? 'MEDIUM'}
                  </span>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => openDeleteModal(step.id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                      title="Delete Step"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      <span className="text-sm">Remove</span>
                    </button>
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
            confirmationMessage="Are you sure you want to remove this step from this template?"
            deleteMessage="Removing this step  cannot be undone."
            title="Remove Step"
            actionText="Delete"
          />
        </div>
      ) : (
        <p className="text-gray-500">No steps found for this template.</p>
      )}
    </div>
  );
};

export default TemplateDetails;
