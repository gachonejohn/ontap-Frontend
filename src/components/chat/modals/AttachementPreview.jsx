import { useEffect, useState } from 'react';

const AttachmentPreview = ({ file, onRemove, onCaptionChange, caption }) => {
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (!file) return;

    const type = file.type.split('/')[0];
    setFileType(type);

    // Generate preview for images and videos
    if (type === 'image' || type === 'video') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [file]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (fileType === 'audio') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Preview Section */}
        <div className="flex-shrink-0">
          {fileType === 'image' && preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
            />
          ) : fileType === 'video' && preview ? (
            <div className="relative w-24 h-24 rounded-lg border-2 border-gray-200 overflow-hidden">
              <video
                src={preview}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-gray-200">
              {getFileIcon()}
            </div>
          )}
        </div>

        {/* File Info Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 truncate">
                {file.name}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="flex-shrink-0 p-1.5 hover:bg-red-50 rounded-full transition-colors group"
              title="Remove attachment"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 group-hover:text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Caption Input */}
          <div className="mt-3">
            <input
              type="text"
              placeholder="Add a caption (optional)..."
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttachmentPreview;