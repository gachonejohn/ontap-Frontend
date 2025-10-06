import { IoCheckmarkCircleOutline, IoCloseOutline } from "react-icons/io5";
import { PiSpinnerGap } from "react-icons/pi";
import { FaExclamation } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const ActionModal = ({
  isOpen,
  onClose,
  onDelete,
  confirmationMessage,
  deleteMessage,
  isDeleting,
  title,
  actionText,
  actionType = "delete",
  extraInfo 
}) => {
   const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <>
      <div
        className="relative z-50 animate-fadeIn"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fadeIn"
          aria-hidden="true"
        ></div>

        <div className="fixed inset-0 z-9999 w-screen overflow-y-auto font-nunito">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-lg p-6">
              <div className="flex items-center mb-4">
                <div
                  className={`flex-shrink-0 rounded-full p-2 mr-3 ${
                    actionType === "delete"
                      ? "bg-red-100"
                      : actionType === "cancel"
                      ? "bg-red-100"
                      : actionType === "update"
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  {actionType === "delete" || actionType === "cancel" ? (
                    <FaExclamation className="h-6 w-6 text-red-600" />
                  ) : actionType === "update" ? (
                    <IoCheckmarkCircleOutline className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <IoCheckmarkCircleOutline className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {title ||
                    (actionType === "delete"
                      ? "Confirm Deletion"
                      : "Confirm Action")}
                </h3>

                <div
                  className="absolute top-4 right-4 cursor-pointer"
                  onClick={onClose}
                >
                  <IoCloseOutline
                    size={20}
                    className="text-gray-500 hover:text-gray-500 transition-colors"
                  />
                </div>
              </div>

              <div className="px-6 py-4 mb-5 text-sm md:text-lg font-light font-inter">
                <p className=" ">
                  {confirmationMessage}
                  <span className="">{deleteMessage}</span>
                </p>
              </div>
                    {extraInfo && (
                <div className="mx-6 mb-4 p-4 bg-primary-50 border border-primary-100 rounded-lg">
                  <div className="flex items-start mb-3">
                    <div className="flex-shrink-0 mr-3">
                      <IoCheckmarkCircleOutline className="h-5 w-5 text-primary mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Task Summary
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Pending Tasks</span>
                          <span className="font-medium text-gray-900 bg-white px-2 py-0.5 rounded">
                            {extraInfo.pending}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">In Progress Tasks</span>
                          <span className="font-medium text-gray-900 bg-white px-2 py-0.5 rounded">
                            {extraInfo.inProgress}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                 <button
                    onClick={() => navigate(extraInfo.link)}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-700 transition-colors"
                  >
                    {extraInfo.linkText || "View / update tasks"}
                    <svg
                      className="ml-1.5 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex justify-between space-x-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 bg-white border border-gray-300 min-w-[170px] rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  disabled={isDeleting}
                  type="button"
                  className={`px-4 py-3 border border-transparent min-w-[170px] rounded-md text-sm font-medium text-white transition-colors disabled:opacity-75 ${
                    actionType === "delete" || actionType === "cancel"
                      ? "bg-red-600 hover:bg-red-700"
                      : actionType === "update"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isDeleting ? (
                    <span className="flex items-center">
                      <PiSpinnerGap className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      {actionText
                        ? `${actionText}ing...`
                        : actionType === "delete"
                        ? "Deleting..."
                        : actionType === "cancel"
                        ? "Cancelling..."
                        : actionType === "submit"
                        ? "Submitting..."
                        : actionType === "create"
                        ? "Creating..."
                        : "Updating..."}
                    </span>
                  ) : (
                    actionText ||
                    (actionType === "cancel"
                      ? "Cancel"
                      : actionType === "submit"
                      ? "Submit"
                      : actionType === "create"
                      ? "Create"
                      : actionType === "update"
                      ? "Update"
                      : actionType === "delete"
                      ? "Delete"
                      : "Save")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ActionModal;
