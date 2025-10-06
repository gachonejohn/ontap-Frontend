import React, { useState, useRef, useEffect } from 'react';

const ActionsDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="text-gray-500 hover:text-gray-900 focus:outline-none"
      >
        •••
      </button>

      {/*  visible dropdown */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
          <button
            className="w-full  px-4 py-2 text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-black-600"
            onClick={() => {
              console.log('Issue card clicked');
              setDropdownOpen(false);
            }}
          >
            <img src="/images/issued_card.png" alt="Issued card" className="w-4 h-4" />
            Issue Card
          </button>
          <button
  className="w-full px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 text-left text-red-600"
  onClick={() => {
    console.log('Revoke card clicked');
    setDropdownOpen(false);
  }}
>
  <img src="/images/revoke_card.png" alt="Revoke Icon" className="w-4 h-4" />
  <span>Revoke Card</span>
</button>

        </div>
      )}
    </div>
  );
};

export default ActionsDropdown;
