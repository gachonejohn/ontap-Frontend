import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ActionModal from "@components/common/Modals/ActionModal";
import { toast } from "react-toastify";

import ButtonDropdown from "@components/common/ActionsPopover";
import DataTable from "@components/common/DataTable";
import Pagination from "@components/common/pagination";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import { PAGE_SIZE } from "@constants/constants";
import { useFilters } from "@hooks/useFIlters";
import {
    useDeleteBreakTypeAssignmentMutation,
    useGetBreakTypesAssignmentsQuery
} from "@store/services/policies/policyService";
import { LuArchiveX } from "react-icons/lu";
import { AssignBreakTypePolicy } from "./NewAssignment";
import { EditBreakTypePolicyAssignment } from "./EditAssignment";

const BreakTypeRuleAssignments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentPageParam = parseInt(searchParams.get("page") || "1", 10);

  const { filters, currentPage, handlePageChange } = useFilters({
    initialFilters: {},
    initialPage: currentPageParam,
    navigate,
    debounceTime: 100,
    debouncedFields: [""],
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
    data: breaktypesAssignmentData,
    refetch,
    error,
  } = useGetBreakTypesAssignmentsQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  console.log("breaktypesAssignmentData", breaktypesAssignmentData);
  const [deleteBreakTypeAssignment, { isLoading: deleting }] =
    useDeleteBreakTypeAssignmentMutation();

  const openDeleteModal = (id) => {
    setSelectedItem(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteProgram = async () => {
    try {
      await deleteBreakTypeAssignment(selectedItem).unwrap();
      toast.success("Break type policy assignment removed successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      console.log("error", error);
      if (error && typeof error === "object" && error.data) {
        toast.error(error.data.error || "Error removing policy assignment.");
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    }
  };

  const columns = [
    {
      header: "Break Type",
      accessor: "break_type",
      cell: (item) => <span>{item.break_type.name}</span>,
    },
    {
      header: "Policy",
      accessor: "break_rule",
      cell: (item) => (
        <span className="text-xs font-medium">
          {item.break_rule.name}
        </span>
      ),
    },

    {
      header: "Max Duration (Minutes)",
      accessor: "max_duration_minutes",
      cell: (item) => (
        <span className="text-xs font-medium">{item.max_duration_minutes}</span>
      ),
    },
    {
      header: "Grace Period (Minutes)",
      accessor: "grace_period_minutes",
      cell: (item) => (
        <span className="text-xs font-medium">{item.grace_period_minutes}</span>
      ),
    },
    {
      header: "Mandatory",
      accessor: "required",
      cell: (item) => (
        <span className="text-xs font-medium">{item.required === true ? "Yes" : "No"}</span>
      ),
    },
   
    {
      header: "Actions",
      accessor: "id",
      cell: (item) => (
        <>
          <ButtonDropdown>
            <button
              onClick={() => openDeleteModal(item.id)}
              className="flex items-center space-x-2"
            >
              <LuArchiveX className="text-lg text-red-500" />
              <span className="text-red-600">Delete</span>
            </button>

            <EditBreakTypePolicyAssignment data={item} refetchData={refetch} />
          </ButtonDropdown>
        </>
      ),
    },
  ];

  return (
    <div className="bg-white w-full  font-nunito">
      <div className="p-3 flex flex-col md:flex-row md:items-center gap-4 justify-end">
     
        <div>
          <AssignBreakTypePolicy refetchData={refetch} />
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center py-8">
          <ContentSpinner />
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-800 text-center">
          {"status" in error && error.data?.error
            ? error.data.error
            : "An error occurred while fetching roles."}
        </div>
      ) : breaktypesAssignmentData && breaktypesAssignmentData.results.length > 0 ? (
        <DataTable
          data={breaktypesAssignmentData.results}
          columns={columns}
          isLoading={loadingData}
          error={error}
          stripedRows={true}
          stripeColor="bg-slate-100"
        />
      ) : (
        <div className="text-center text-gray-500 py-8">No data</div>
      )}

      {breaktypesAssignmentData && breaktypesAssignmentData.count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={breaktypesAssignmentData.count}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteProgram}
        isDeleting={deleting}
        confirmationMessage="Are you sure you want to delete this Break type Policy assignment?"
        deleteMessage=".
         This action cannot be undone."
        title="Delete Break Type Policy assignment"
        actionText="Delete"
      />
    </div>
  );
};

export default BreakTypeRuleAssignments;
