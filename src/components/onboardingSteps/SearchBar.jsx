import React from 'react';
import { AiOutlineSearch } from "react-icons/ai";
import Select from 'react-select';
import { onboardingStepsStatusOptions } from '../../constants/onboardingSteps';

const SearchBar = ({ search, setSearch, statusFilter, setStatusFilter }) => {
  const selectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    control: (base) => ({
      ...base,
      minHeight: "40px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af",
      },
      backgroundColor: "#F8FAFC",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "#e5e7eb" 
        : state.isFocused 
        ? "#f3f4f6" 
        : "white",
      color: "#374151",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#e5e7eb",
      },
    }),
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    ...onboardingStepsStatusOptions
  ];

  const handleStatusChange = (selectedOption) => {
    setStatusFilter(selectedOption ? selectedOption.value : '');
  };

  const selectedStatus = statusOptions.find(option => option.value === statusFilter);

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex-1 min-w-64 relative">
        <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      <div className="min-w-[200px]">
        <Select
          value={selectedStatus}
          onChange={handleStatusChange}
          options={statusOptions}
          menuPortalTarget={document.body}
          menuPlacement="auto"
          styles={selectStyles}
          placeholder="Filter by status..."
          // isClearable
        />
      </div>
    </div>
  );
};

export default SearchBar;