import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Select, { components } from 'react-select';

// Custom dropdown indicator with your own icon
const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    {/* <img
      src="/images/dropdown.png"
      alt="Dropdown"
      width="9.5"
      height="5.1"
      style={{ display: 'block' }}
    /> */}
    <FiChevronDown size={16} className="text-gray-500 "/> 
  </components.DropdownIndicator>
);

const FilterSelect = ({
  options,
  value,
  onChange,
  placeholder,
  defaultLabel,
  className = 'w-full md:w-auto md:min-w-[180px]',
}) => {
  return (
    <Select
      options={[{ value: '', label: defaultLabel || '' }, ...options]}
      value={value || { value: '', label: placeholder }}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      classNamePrefix="react-select"
      isSearchable={true}
      menuPortalTarget={document.body}
      menuPlacement="auto"
      components={{ DropdownIndicator }}
      styles={{
        menuPortal: (base) => ({
          ...base,
          zIndex: 9999,
        }),
        control: (base) => ({
          ...base,
          minHeight: '36px',
          minWidth: '90px',
          borderColor: '#d1d5db',
          boxShadow: 'none',
          paddingLeft: '0.5rem',
          fontSize: '0.875rem',
          cursor: 'pointer',
          '&:hover': {
            borderColor: '#9ca3af',
          },
          '&:focus-within': {
            borderColor: '#9ca3af',
            boxShadow: 'none',
          },
        }),
        indicatorSeparator: () => ({
          display: 'none',
        }),
        dropdownIndicator: (base) => ({
          ...base,
          paddingRight: '0.5rem',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center',
        }),
        placeholder: (base) => ({
          ...base,
          color: '#9ca3af',
          fontSize: '0.875rem',
        }),
        option: (base, state) => ({
          ...base,
          fontSize: '0.875rem',
          color: state.isSelected ? '#ffffff' : '#333333',
          cursor: 'pointer',
          backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#e5e7eb' : '#ffffff',
          '&:hover': {
            backgroundColor: '#e5e7eb',
          },
          padding: '8px 12px',
        }),
        singleValue: (base) => ({
          ...base,
          fontSize: '0.875rem',
          color: '#333333',
        }),
        menu: (base) => ({
          ...base,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.375rem',
          width: 'auto',
          minWidth: '100%',
        }),
        menuList: (base) => ({
          ...base,
          padding: '5px',
          // maxHeight: "300px",
        }),
        container: (base) => ({
          ...base,
          width: '100%',
        }),
        valueContainer: (base) => ({
          ...base,
          padding: '2px 8px',
        }),
      }}
    />
  );
};

export default FilterSelect;
