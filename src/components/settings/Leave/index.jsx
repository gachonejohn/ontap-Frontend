import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "react-toastify";
import { LuArchiveX } from "react-icons/lu";
import { PAGE_SIZE } from "@constants/constants";
import { useFilters } from "@hooks/useFIlters";

import ActionModal from "@components/common/Modals/ActionModal";
import DataTable from "@components/common/DataTable";
import Pagination from "@components/common/pagination";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import ButtonDropdown from "@components/common/ActionsPopover";
import NoDataFound from "@components/common/NoData";
import { CustomDate } from "@utils/dates";
import { getApiErrorMessage } from "@utils/errorHandler";

import { CreateLeavePolicy } from "./NewLeavePolicy";
import { EditLeavePolicy } from "./EditLeavePolicy";

import {
  useGetLeavePoliciesQuery,
  useDeleteLeavePolicyMutation,
} from "@store/services/leaves/leaveService";

const LeavePolicies = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentPageParam = parseInt(searchParams.get("page") || "1", 10);

  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {},
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: [],
  });

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      ...filters,
    }),
    [currentPage, filters]
  );

  const {
    isLoading: loadingData,
    data: leaveData,
    refetch,
    error,
  } = useGetLeavePoliciesQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteLeavePolicy, { isLoading: deleting }] =
    useDeleteLeavePolicyMutation();

  const openDeleteModal = (id) => {
    setSelectedPolicy(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedPolicy(null);
  };

  const handleDelete = async () => {
    try {
      await deleteLeavePolicy(selectedPolicy).unwrap();
      toast.success("Leave policy deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error deleting leave policy.");
      toast.error(message);
    }
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (item) => <span className="text-sm font-medium">{item.name}</span>,
    },
    {
      header: "Description",
      accessor: "description",
      cell: (item) => (
        <span className="text-xs font-medium">{item.description}</span>
      ),
    },
    {
      header: "Days Allowed",
      accessor: "default_days",
      cell: (item) => (
        <span className="text-xs font-medium">{item.default_days}</span>
      ),
    },
    {
      header: "Carry Forward",
      accessor: "can_carry_forward",
      cell: (item) => (
        <span className={`text-xs font-medium ${item.can_carry_forward ? "text-green-600" : "text-red-600"}`}>
          {item.can_carry_forward ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Date Created",
      accessor: "created_at",
      cell: (item) => (
        <span className="text-xs font-medium">
          {CustomDate(item.created_at)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (item) => (
        <ButtonDropdown>
          <EditLeavePolicy data={item} refetchData={refetch} />
          <button
            onClick={() => openDeleteModal(item.id)}
            className="flex items-center space-x-2"
          >
            <LuArchiveX className="text-lg text-red-500" />
            <span className="text-red-600">Delete</span>
          </button>
        </ButtonDropdown>
      ),
    },
  ];

  return (
    <div className="rounded-xl shadow-sm bg-white w-full">
      {/* Table Header */}
      <div className="flex flex-row justify-end items-center p-4 w-full h-14 border-b border-neutral-200">
        <div>
          <CreateLeavePolicy refetchData={refetch} />
        </div>
      </div>

      {/* Table Content */}
      {loadingData ? (
        <div className="flex justify-center py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          {"status" in error && error.data?.error
            ? error.data.error
            : "An error occurred while fetching leave policies."}
        </div>
      ) : leaveData && leaveData.results.length > 0 ? (
        <DataTable
          data={leaveData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <NoDataFound message="No leave policies found." />
      )}

      {/* Pagination */}
      {leaveData && leaveData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={leaveData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Modal */}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this Leave Policy?"
        deleteMessage="Deleting this Leave Policy cannot be undone."
        title="Delete Leave Policy"
        actionText="Delete"
      />
    </div>
  );
};

export default LeavePolicies;