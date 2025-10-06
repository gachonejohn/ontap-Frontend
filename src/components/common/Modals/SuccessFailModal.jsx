import { MdClose, MdOutlineCheck, MdOutlineClose } from "react-icons/md";

const SuccessFailModal = ({ message, onClose, isError = false }) => {
  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        ></div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300 sm:max-w-lg pointer-events-auto z-10"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <MdClose className="h-5 w-5" />
          </button>

          <div className="px-6 py-8 flex flex-col">
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                  isError ? "bg-red-100" : "bg-green-100"
                }`}
              >
                {isError ? (
                  <MdOutlineClose className="h-8 w-8 text-red-600" />
                ) : (
                  <MdOutlineCheck className="h-8 w-8 text-green-600" />
                )}
              </div>

              <h3
                className={`mb-2 text-xl font-bold ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {isError ? "Error" : "Success"}
              </h3>

              <p className="mb-6 text-gray-700 break-words whitespace-normal">
                {message}
              </p>

              <button
                onClick={onClose}
                className={`inline-flex justify-center rounded-md border border-transparent px-6 py-2 text-base font-medium text-white shadow-sm focus:outline-none ${
                  isError
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isError ? "Close" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessFailModal;
