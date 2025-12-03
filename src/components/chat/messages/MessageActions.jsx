import { useRef, useEffect } from 'react';

const MessageActions = ({ 
  isOpen, 
  onClose, 
  onReply, 
  onEdit, 
  onReact,
  isOwnMessage,
  position = 'right' 
}) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'react',
      label: 'React',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: onReact,
      show: true,
    },
    {
      id: 'reply',
      label: 'Reply',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      onClick: onReply,
      show: true,
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      onClick: onEdit,
      show: isOwnMessage,
    },
  ];

  const visibleActions = actions.filter(action => action.show);

  return (
    <div
      ref={menuRef}
      className={`absolute ${
        position === 'right' ? 'left-full ml-2' : 'right-full mr-2'
      } top-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px] animate-scale-in`}
    >
      {visibleActions.map((action, index) => (
        <button
          key={action.id}
          onClick={() => {
            action.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
            index !== visibleActions.length - 1 ? 'border-b border-gray-100' : ''
          }`}
        >
          <span className="text-gray-500">{action.icon}</span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MessageActions;