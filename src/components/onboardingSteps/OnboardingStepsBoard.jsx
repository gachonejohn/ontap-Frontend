import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useGetOnboardStepsQuery } from '../../store/services/onboardingSteps/onboardStepsService';
import { COLUMN_CONFIG } from '../../constants/onboardingSteps';
import Column from './Column';
import ContentSpinner from '../common/spinners/dataLoadingSpinner';
import ErrorMessage from './ErrorMessage';
import StepDetailModal from './StepDetailModal';
import SearchBar from './SearchBar';

const OnboardingStepsBoard = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [page, setPage] = useState(1);
  const [allSteps, setAllSteps] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const { data, isLoading, isFetching, isError, error } = useGetOnboardStepsQuery({
    page,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  useEffect(() => {
    if (data?.results) {
      setAllSteps((prev) => {
        const newSteps = page === 1 ? data.results : [...prev, ...data.results];
        const unique = Array.from(new Map(newSteps.map((i) => [i.id, i])).values());
        return unique;
      });
      setHasMore(Boolean(data?.next));
    } else if (data && !data.next) {
      setHasMore(false);
    }

    if (isError && error?.status === 404 && page > 1) {
      setPage(1);
      setHasMore(false);
    }

    isFetchingRef.current = false;
  }, [data, page, isError, error]);

  const columns = useMemo(() => {
    const grouped = { PENDING: [], IN_PROGRESS: [], COMPLETED: [], OVER_DUE: [] };
    allSteps.forEach((step) => {
      if (grouped[step.status]) grouped[step.status].push(step);
    });
    return grouped;
  }, [allSteps]);

  const handleStepClick = (id) => setSelectedStepId(id);
  const handleCloseModal = () => setSelectedStepId(null);

  useEffect(() => {
    if (!hasMore || isFetching) return;
    const handleScroll = () => {
      if (isFetchingRef.current) return;
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
      if (nearBottom && hasMore && !isFetching) {
        isFetchingRef.current = true;
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching]);

  const hasDelayed = useMemo(() => columns.OVER_DUE.length > 0, [columns]);
  const visibleColumns = useMemo(() => {
    return hasDelayed ? COLUMN_CONFIG : COLUMN_CONFIG.filter((c) => c.key !== 'OVER_DUE');
  }, [hasDelayed]);

  if (isLoading && page === 1) return <ContentSpinner />;
  if (isError && page === 1)
    return (
      <ErrorMessage
        message={error?.data?.message || error?.message || 'Error loading data'}
      />
    );

  console.log(data)  

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-row justify-between items-center mb-6">
          <div className="flex flex-col">
            <div className="text-lg text-neutral-900 font-semibold">Task Management</div>
            <div className="text-sm text-gray-600 font-normal">
              Track and manage assigned staff cycle tasks
            </div>
          </div>

          {onBack && (
            <div
              className="flex justify-center items-center rounded-md w-[220px] h-11 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={onBack}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex justify-center items-center w-5 h-5">
                  <img
                    width="15.3px"
                    height="15.3px"
                    src="/images/task.png"
                    alt="Task Management icon"
                  />
                </div>
                <div className="text-sm text-gray-800 font-medium">View Task Management</div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <SearchBar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        <div
          className={`grid gap-6 ${
            visibleColumns.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'
          } grid-cols-1`}
        >
          {visibleColumns.map((config) => (
            <Column
              key={config.key}
              title={config.title}
              count={columns[config.key].length}
              color={config.color}
              steps={columns[config.key]}
              onStepClick={handleStepClick}
            />
          ))}
        </div>

        {allSteps.length === 0 && !isLoading && !isFetching && (
          <div className="text-center mt-10 text-gray-500 text-sm">No results found</div>
        )}

        {isFetching && (
          <div className="text-center mt-8 text-gray-500 text-sm">Loading more...</div>
        )}
      </div>

      {selectedStepId && (
        <StepDetailModal stepId={selectedStepId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OnboardingStepsBoard;
