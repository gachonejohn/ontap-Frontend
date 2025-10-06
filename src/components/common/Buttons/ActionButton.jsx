import SubmitSpinner from "../spinners/submitSpinner";


const SubmitCancelButtons = ({
  onCancel,
  isSubmitting,
  isProcessing,
}) => {
  return (
    <div className="sticky bottom-0 bg-white z-40 flex  gap-4 md:justify-between items-center py-3">
      <button
        type="button"
        onClick={onCancel}
        className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[150px] md:w-auto hover:bg-red-500 hover:text-white"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting || isProcessing}
        className="bg-primary text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[150px] md:w-auto"
      >
        {isSubmitting || isProcessing ? (
          <span className="flex items-center">
            <SubmitSpinner />
            <span>Saving...</span>
          </span>
        ) : (
          <span>Save</span>
        )}
      </button>
    </div>
  );
};
export default SubmitCancelButtons;