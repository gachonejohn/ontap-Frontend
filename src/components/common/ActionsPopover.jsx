import React, { useState, useRef, useEffect } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

const ButtonDropdown = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [positionUp, setPositionUp] = useState(false);
  const buttonRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdownRef.current?.offsetHeight || 200;

    if (buttonRect.bottom + dropdownHeight > viewportHeight) {
      setPositionUp(true);
    } else {
      setPositionUp(false);
    }
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <FiMoreHorizontal size={18} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 bg-white border w-full min-w-[186px] p-2 border-gray-200
             rounded-lg shadow-lg overflow-hidden z-50
    ${positionUp ? 'bottom-full mb-2' : 'mt-2'} min-w-max`}
        >
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: (...args) => {
                child.props.onClick?.(...args);
                setOpen(false);
              },
              className: `${
                child.props.className || ''
              } w-full text-left px-4 py-3 hover:bg-gray-100`,
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonDropdown;
