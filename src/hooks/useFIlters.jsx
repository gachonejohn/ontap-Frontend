import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useNavigate } from 'react-router-dom';

export function useFilters({
  initialFilters = {},
  initialPage = 1,
  debounceTime = 300,
  debouncedFields = [],
}) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [previousFilters, setPreviousFilters] = useState(initialFilters);

  // Sync URL params with filters and page
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    navigate(`?${params.toString()}`, { replace: true }); // Update URL without reloading
  }, [filters, currentPage, navigate]);

  // Reset to page 1 if filters change
  useEffect(() => {
    const filtersChanged = Object.entries(filters).some(
      ([key, value]) => previousFilters[key] !== value
    );

    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1);
    }

    if (filtersChanged) {
      setPreviousFilters({ ...filters });
    }
  }, [filters, currentPage, previousFilters]);

  // Debounced filter handler for performance
  const handleDebouncedFilter = useDebouncedCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, debounceTime);

  // Handle input changes (supports debounce for specified fields)
  const handleFilterChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      if (debouncedFields.includes(name)) {
        handleDebouncedFilter(name, value);
      } else {
        setFilters((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      // Allow programmatic updates with an object
      setFilters((prev) => ({ ...prev, ...e }));
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return {
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    handleFilterChange,
    handleDebouncedFilter,
    handlePageChange,
  };
}
