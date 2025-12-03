const MessageAttachment = ({ message, isOwnMessage }) => {
  const { message_type, file_url, file_name, file_size } = message;

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file_url;
    link.download = file_name || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Image attachment
  if (message_type === 'image') {
    return (
      <div className="max-w-sm">
        <div className="relative group rounded-lg overflow-hidden">
          <img
            src={file_url}
            alt={file_name}
            className="w-full h-auto rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => window.open(file_url, '_blank')}
          />
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
        {message.message && (
          <p className="mt-2 text-sm break-words">{message.message}</p>
        )}
      </div>
    );
  }

  // Video attachment
  if (message_type === 'video') {
    return (
      <div className="max-w-sm">
        <div className="relative group rounded-lg overflow-hidden bg-black">
          <video
            src={file_url}
            controls
            className="w-full h-auto rounded-lg"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
        {message.message && (
          <p className="mt-2 text-sm break-words">{message.message}</p>
        )}
      </div>
    );
  }

  // Audio attachment
  if (message_type === 'audio') {
    return (
      <div className="max-w-sm">
        <div className={`flex items-center gap-3 p-3 rounded-lg ${
          isOwnMessage ? 'bg-slate-500' : 'bg-gray-100'
        }`}>
          <div className={`flex-shrink-0 p-2 rounded-full ${
            isOwnMessage ? 'bg-slate-600' : 'bg-green-100'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
              isOwnMessage ? 'text-white' : 'text-green-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <audio src={file_url} controls className="w-full" preload="metadata">
              Your browser does not support the audio tag.
            </audio>
            {file_name && (
              <p className={`text-xs mt-1 truncate ${
                isOwnMessage ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {file_name}
              </p>
            )}
          </div>
          <button
            onClick={handleDownload}
            className={`flex-shrink-0 p-2 rounded-full hover:bg-opacity-80 transition-colors ${
              isOwnMessage ? 'hover:bg-slate-600' : 'hover:bg-gray-200'
            }`}
            title="Download"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
              isOwnMessage ? 'text-white' : 'text-gray-600'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
        {message.message && (
          <p className="mt-2 text-sm break-words">{message.message}</p>
        )}
      </div>
    );
  }

  // Document attachment
  if (message_type === 'file') {
    const getFileExtension = (filename) => {
      if (!filename) return '';
      return filename.split('.').pop().toUpperCase();
    };

    const extension = getFileExtension(file_name);

    return (
      <div className="max-w-sm">
        <div
          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
            isOwnMessage ? 'bg-slate-500' : 'bg-gray-100'
          }`}
          onClick={handleDownload}
        >
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
            isOwnMessage ? 'bg-slate-600' : 'bg-blue-100'
          }`}>
            <span className={`text-xs font-bold ${
              isOwnMessage ? 'text-white' : 'text-blue-600'
            }`}>
              {extension}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${
              isOwnMessage ? 'text-white' : 'text-gray-800'
            }`}>
              {file_name}
            </p>
            {file_size && (
              <p className={`text-xs ${
                isOwnMessage ? 'text-gray-200' : 'text-gray-500'
              }`}>
                {formatFileSize(file_size)}
              </p>
            )}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 flex-shrink-0 ${
            isOwnMessage ? 'text-white' : 'text-gray-600'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </div>
        {message.message && (
          <p className="mt-2 text-sm break-words">{message.message}</p>
        )}
      </div>
    );
  }

  return null;
};

export default MessageAttachment;