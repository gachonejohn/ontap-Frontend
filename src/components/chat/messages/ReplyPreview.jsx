const ReplyPreview = ({ replyTo, onCancel }) => {
  if (!replyTo) return null;

  const getPreviewText = () => {
    if (replyTo.message_type === 'text') {
      return replyTo.message;
    }
    
    const typeLabels = {
      image: '📷 Photo',
      video: '🎥 Video',
      audio: '🎵 Audio',
      file: '📄 Document',
    };
    
    return typeLabels[replyTo.message_type] || 'Attachment';
  };

  return (
    <div className="px-8 py-3 bg-blue-50 border-l-4 border-primary">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-xs font-semibold text-primary">
              Replying to {replyTo.user.first_name} {replyTo.user.last_name}
            </span>
          </div>
          <p className="text-sm text-gray-700 truncate">
            {getPreviewText()}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReplyPreview;