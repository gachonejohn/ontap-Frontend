import React from 'react';
import { useNavigate } from 'react-router-dom';

const Pagination = ({ currentPage, totalItems, pageSize, onPageChange, className = '' }) => {
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalItems / pageSize);

  const getPaginationRange = (currentPage, totalPages) => {
    const delta = 1;
    const range = [];
    range.push(1);

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }
    return [...new Set(range)].sort((a, b) => a - b);
  };

  if (totalPages <= 1) return null;

  const handlePageChange = (page) => {
    onPageChange(page);
    navigate(`?page=${page}`); // Navigate to the new page
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6 ${className}`}
    >
      <div className="text-sm text-gray-700 mb-2 md:mb-0">
        Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
        <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 py-1 text-sm rounded-md ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Previous
        </button>

        {getPaginationRange(currentPage, totalPages).map((page, i, array) => (
          <div key={page} className="flex items-center">
            {i > 0 && array[i - 1] !== page - 1 && (
              <span className="px-2 py-1 text-gray-500 select-none">...</span>
            )}
            <button
              onClick={() => handlePageChange(page)}
              className={`min-w-[32px] px-2 py-1 text-sm rounded-md ${
                currentPage === page
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {page}
            </button>
          </div>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-2 py-1 text-sm rounded-md ${
            currentPage >= totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
