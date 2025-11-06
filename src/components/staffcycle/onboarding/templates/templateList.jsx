import Pagination from '@components/common/pagination';
import { PAGE_SIZE } from '@constants/constants';
import { useFilters } from '@hooks/useFIlters';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo, useState } from 'react';
import { FiClock, FiEye, FiTrash2 } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ButtonDropdown from '@components/common/ActionsPopover';
import ActionModal from '@components/common/Modals/ActionModal';
import NoDataFound from '@components/common/NoData';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import {
  useDeleteTemplateMutation,
  useGetOnboardingTemplatesQuery,
} from '@store/services/staffcylce/onboardingService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { toast } from 'react-toastify';
import { EditTemplate } from './Edit';
import { NewTemplate } from './NewTemplate';
const Templates = () => {
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const navigate = useNavigate();

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
  const { data, isLoading, error, refetch } = useGetOnboardingTemplatesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
    }
  );
  console.log('data', data);
  const [deleteTemplate, { isLoading: deleting }] = useDeleteTemplateMutation();

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
      await deleteTemplate(selectedItem).unwrap();
      toast.success('Template  deleted successfully!');
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error deleting template.');
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

  return (
    <>
      <div className="flex flex-col gap-4  rounded-xl  bg-white  border shadow-md ">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex flex-col gap-1">
            <div className="text-lg text-neutral-900 font-semibold">Onboarding Templates</div>
            <div className="text-sm text-gray-600 font-normal mt-3"></div>
          </div>

          <NewTemplate refetchData={refetch} />
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
            {data?.results?.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between
             items-start md:items-center gap-4 border rounded-lg p-4 hover:shadow-sm transition"
              >
                {/* Left section */}

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border">
                      {item.department.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{item?.steps?.length ?? 0} tasks</span>
                    </div>
                    <div className="text-gray-500">Last modified: {item.updated_at}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" />
                      <span>{item?.duration_in_days ?? 0} day(s)</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <span className="border-b font-inter font-light text-sm pb-1 ">Actions</span>
                  <ButtonDropdown>
                    <EditTemplate template={item} refetchData={refetch} />
                    {/* <button
                      className="flex items-center space-x-2 font-inter
  "
                      onClick={() => navigate(`/dashboard/onboarding/templates/${item.id}`)}
                      title="View Tasks"
                    >
                      <FiEye className="text-sm text-gray-600" />
                      <span className="text-sm">View Steps</span>
                    </button> */}
                    <button
                      className="flex items-center space-x-2 font-inter"
                      onClick={() => openDeleteModal(item.id)}
                      title="Delete Template"
                    >
                      <FiTrash2 className="text-sm text-red-500" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </ButtonDropdown>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <NoDataFound message="No Attendace Records Found" />
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
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this Template?"
        deleteMessage="Deleting this Template cannot be undone."
        title="Delete Template"
        actionText="Delete"
      />
    </>
  );
};

export default Templates;
