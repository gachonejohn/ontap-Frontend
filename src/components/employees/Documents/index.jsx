import ActionModal from "@components/common/Modals/ActionModal";
import { useDeleteDocumentMutation } from "@store/services/employees/employeesService";
import { CustomDate, YearMonthCustomDate } from "@utils/dates";
import { getApiErrorMessage } from "@utils/errorHandler";
import { useState } from "react";
import { CgFileDocument } from "react-icons/cg";
import { FiDownload, FiEye, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import AddDocument from "./Upload";
export const Documents = ({ data: employeeData, refetch }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteDocumentMutation();
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
      await deleteDocument(selectedItem).unwrap();
      toast.success("Document Deleted successfully!");
      closeDeleteModal();
      refetch();
    } catch (error) {
      const message = getApiErrorMessage(error, "Error deleting document.");
      toast.error(message);
    } finally {
      closeDeleteModal();
      refetch();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CgFileDocument className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">
            Documents & Compliance
          </h3>
        </div>
        <div>
          <AddDocument refetchData={refetch} data={employeeData} />
        </div>
      </div>

      {employeeData.documents?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {employeeData.documents.map((doc) => (
            <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {doc.document_type.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-green-600 rounded-full px-3 py-1 bg-green-100">
                    {doc.document_type.category.name}
                  </span>
                </div>
              </div>

              {/* File Info */}
              <div className="text-sm text-gray-600 mb-3">
                {doc.file ? (
                  <a
                    href={doc.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {doc.file.split("/").pop()}
                  </a>
                ) : (
                  `No file for ${doc.document_type}`
                )}
              </div>

              {/* Expiry Date */}
              <div className="text-xs text-gray-500 mb-3">
                {doc.expiry_date
                  ? `Expires on ${YearMonthCustomDate(doc.expiry_date)}`
                  : "No expiry date"}
              </div>

              {/* Uploaded By */}
              {doc.uploaded_by && (
                <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                  <img
                    src={doc.uploaded_by.profile_picture}
                    alt={doc.uploaded_by.first_name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>
                    Uploaded by {doc.uploaded_by.first_name}{" "}
                    {doc.uploaded_by.last_name}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex  items-center justify-between">
                <div className="text-xs text-gray-500 ">
                  {doc.created_at
                    ? `Uploaded on ${CustomDate(doc.created_at)}`
                    : ""}
                </div>
                <div className="flex  items-center gap-2">
                  <button
                    className={`p-1 ${
                      doc.file
                        ? "text-gray-400 hover:text-gray-600"
                        : "text-gray-400 opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!doc.file}
                  >
                    <FiEye className="h-4 w-4" />
                  </button>
                  <a
                    href={doc.file}
                    download
                    className={`p-1 ${
                      doc.file
                        ? "text-gray-400 hover:text-gray-600"
                        : "text-gray-400 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <FiDownload className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => openDeleteModal(doc.id)}
                    className={`p-1 ${
                      doc.file
                        ? "text-red-400 hover:text-red-600"
                        : "text-red-400 opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!doc.file}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No documents uploaded</p>
      )}
      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        confirmationMessage="Are you sure you want to Delete this Document ?"
        deleteMessage="This action cannot be undone."
        title="Delete document"
        actionText="Delete"
      />
    </div>
  );
};
