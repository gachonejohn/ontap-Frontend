const RepliedMessageDisplay = ({ repliedTo, isOwnMessage, onJumpToMessage }) => {
  if (!repliedTo) return null;

  const getPreviewText = () => {
    if (repliedTo.message_type === 'text') {
      return repliedTo.message || repliedTo.content || 'Message';
    }
    
    const typeLabels = {
      image: '📷 Photo',
      video: '🎥 Video',
      audio: '🎵 Audio',
      file: '📄 Document',
    };
    
    return typeLabels[repliedTo.message_type] || 'Attachment';
  };

  const getUserName = () => {
    if (repliedTo.user) {
      return `${repliedTo.user.first_name || ''} ${repliedTo.user.last_name || ''}`.trim();
    }
    if (repliedTo.sender) {
      return `${repliedTo.sender.first_name || ''} ${repliedTo.sender.last_name || ''}`.trim();
    }
    return 'Unknown User';
  };

  return (
    <div
      onClick={() => onJumpToMessage && onJumpToMessage(repliedTo.id || repliedTo.message_id)}
      className={`mb-2 pl-3 py-2 border-l-2 cursor-pointer hover:bg-opacity-80 transition-colors ${
        isOwnMessage
          ? 'border-slate-300 bg-slate-500'
          : 'border-gray-400 bg-gray-50'
      }`}
    >
      <p className={`text-xs font-semibold mb-1 ${
        isOwnMessage ? 'text-slate-200' : 'text-primary'
      }`}>
        {getUserName()}
      </p>
      <p className={`text-xs truncate ${
        isOwnMessage ? 'text-slate-100' : 'text-gray-600'
      }`}>
        {getPreviewText()}
      </p>
    </div>
  );
};

export default RepliedMessageDisplay;