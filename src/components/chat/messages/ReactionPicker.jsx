import { useRef, useEffect } from 'react';

const ReactionPicker = ({ isOpen, onClose, onSelectReaction, position = 'top' }) => {
  const pickerRef = useRef(null);

  const reactions = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'laugh', emoji: '😂', label: 'Laugh' },
    { type: 'wow', emoji: '😮', label: 'Wow' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'angry', emoji: '😠', label: 'Angry' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
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

  return (
    <div
      ref={pickerRef}
      className={`absolute ${
        position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
      } left-0 bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-1 z-50 animate-scale-in`}
    >
      {reactions.map((reaction) => (
        <button
          key={reaction.type}
          onClick={() => {
            onSelectReaction(reaction.type);
            onClose();
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all transform hover:scale-125 active:scale-110"
          title={reaction.label}
        >
          <span className="text-2xl">{reaction.emoji}</span>
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;