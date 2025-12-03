import { useRef } from 'react';

const AttachmentModal = ({ isOpen, onClose, onSelectType }) => {
  const modalRef = useRef(null);

  const attachmentTypes = [
    {
      id: 'photo',
      label: 'Photos',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      accept: 'image/*',
    },
    {
      id: 'video',
      label: 'Video',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600',
      accept: 'video/*',
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      accept: 'audio/*',
    },
    {
      id: 'document',
      label: 'Document',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx',
    },
  ];

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleTypeSelect = (type) => {
    onSelectType(type);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 transform transition-all animate-scale-in"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Send</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
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

        <div className="grid grid-cols-2 gap-4">
          {attachmentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeSelect(type)}
              className={`flex flex-col items-center justify-center p-6 rounded-xl ${type.color} ${type.hoverColor} text-white transition-all transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="mb-3">{type.icon}</div>
              <span className="font-medium text-sm">{type.label}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Select the type of file you want to send
        </p>
      </div>
    </div>
  );
};

export default AttachmentModal;