import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
import { useGetLeavePoliciesQuery, useCreateLeaveRequestMutation } from '@store/services/leaves/leaveService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useSelector } from 'react-redux';

const ApplyLeave = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPolicyPage, setCurrentPolicyPage] = useState(1);
  const [allPolicies, setAllPolicies] = useState([]);
  const [hasMorePolicies, setHasMorePolicies] = useState(true);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [debouncedPolicySearch, setDebouncedPolicySearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const policyScrollContainerRef = useRef(null);
  const policyDropdownContainerRef = useRef(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPolicySearch(policySearchQuery);
      setCurrentPolicyPage(1);
      setAllPolicies([]);
      setHasMorePolicies(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [policySearchQuery]);

  useEffect(() => {
    if (isOpen) {
      setCurrentPolicyPage(1);
      setAllPolicies([]);
      setHasMorePolicies(true);
      setPolicySearchQuery("");
      setDebouncedPolicySearch("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  const { 
    data: policiesData, 
    isLoading: loadingPolicies,
    isFetching: isFetchingPolicies 
  } = useGetLeavePoliciesQuery(
    { 
      page: currentPolicyPage, 
      page_size: 10,
      search: debouncedPolicySearch || undefined,
      is_active: true 
    },
    { 
      skip: !isOpen,
      refetchOnMountOrArgChange: true 
    }
  );

  const [createLeaveRequest] = useCreateLeaveRequestMutation();

  useEffect(() => {
    if (policiesData?.results?.length) {
      console.log('📦 Policies data received:', {
        page: currentPolicyPage,
        resultsCount: policiesData.results.length,
        totalCount: policiesData.count,
        hasNext: !!policiesData.next,
        nextUrl: policiesData.next
      });

      if (currentPolicyPage === 1) {
        console.log('✅ First page - replacing policies');
        setAllPolicies(policiesData.results);
      } else {
        console.log('➕ Subsequent page - appending policies');
        setAllPolicies(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const newPolicies = policiesData.results.filter(
            p => !existingIds.has(p.id)
          );
          console.log(`   Added ${newPolicies.length} new policies`);
          return [...prev, ...newPolicies];
        });
      }
      
      const hasMore = policiesData.next !== null;
      console.log('🔍 Has more pages:', hasMore);
      setHasMorePolicies(hasMore);
    }
  }, [policiesData, currentPolicyPage]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const scrollContainer = policyScrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = ((scrollTop + clientHeight) / scrollHeight) * 100;
      
      console.log('📊 Policy Scroll:', {
        scrollTop,
        clientHeight,
        scrollHeight,
        scrollPercentage: scrollPercentage.toFixed(2) + '%',
        hasMore: hasMorePolicies,
        isFetching: isFetchingPolicies,
        currentPage: currentPolicyPage,
        totalPolicies: allPolicies.length
      });

      if (scrollPercentage >= 80 && hasMorePolicies && !isFetchingPolicies) {
        console.log('🔄 Loading next page of policies:', currentPolicyPage + 1);
        setCurrentPolicyPage(prev => prev + 1);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isDropdownOpen, hasMorePolicies, isFetchingPolicies, currentPolicyPage, allPolicies.length]);

  const filteredPolicies = allPolicies.filter(policy => {
    if (!policySearchQuery) return true;
    const searchLower = policySearchQuery.toLowerCase();
    return policy.name.toLowerCase().includes(searchLower);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePolicySelect = (policyId) => {
    setFormData(prev => ({
      ...prev,
      leave_type_id: policyId
    }));
    setIsDropdownOpen(false);
    setPolicySearchQuery("");
  };

  const getSelectedPolicyName = () => {
    if (!formData.leave_type_id) return "Select leave type";
    const selectedPolicy = allPolicies.find(p => p.id === parseInt(formData.leave_type_id));
    return selectedPolicy ? selectedPolicy.name : "Select leave type";
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; 
    return days.toFixed(2); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      toast.error('User information not available. Please log in again.');
      return;
    }

    if (!formData.leave_type_id) {
      toast.error('Please select a leave type');
      return;
    }
    if (!formData.start_date) {
      toast.error('Please select a start date');
      return;
    }
    if (!formData.end_date) {
      toast.error('Please select an end date');
      return;
    }
    if (!formData.reason) {
      toast.error('Please provide a reason');
      return;
    }

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('End date must be after start date');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        employee: user.id,
        leave_type: formData.leave_type_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
        days: calculateDays(formData.start_date, formData.end_date)
      };

      console.log('Submitting payload:', payload);

      const result = await createLeaveRequest(payload).unwrap();
      console.log('API Response:', result);
      
      toast.success('Leave request submitted successfully!');
      
      setFormData({
        leave_type_id: '',
        start_date: '',
        end_date: '',
        reason: ''
      });
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
      
      if (error?.data?.employee) {
        toast.error('Employee field error: ' + error.data.employee[0]);
      } else if (error?.data?.leave_type) {
        toast.error('Leave type error: ' + error.data.leave_type[0]);
      } else if (error?.data?.days) {
        toast.error('Days calculation error: ' + error.data.days[0]);
      } else {
        const message = getApiErrorMessage(error, 'Error submitting leave request.');
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDateChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      start_date: value,
      end_date: prev.end_date && new Date(prev.end_date) < new Date(value) ? value : prev.end_date
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        policyDropdownContainerRef.current &&
        !policyDropdownContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="flex flex-col rounded-2xl w-full max-w-[560px] bg-white max-h-[90vh] overflow-hidden">
        {/* Fixed Header - Won't scroll */}
        <div className="flex-shrink-0 flex flex-row justify-between items-start p-6 border-b border-neutral-200 bg-white">
          <div className="flex flex-row justify-start items-center gap-1.5">
            <div className="flex flex-row justify-center items-center rounded-full w-10 h-10 bg-green-100 overflow-hidden">
              <img
                width="20px"
                height="20px"
                src="/images/applyleave.png"
                alt="Leave Icon"
              />
            </div>
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                Apply for Leave
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col justify-start items-start gap-6 p-6">
            <form onSubmit={handleSubmit} className="flex flex-col justify-start items-start gap-5 w-full">
              <div className="flex flex-col justify-start items-center gap-4 w-full">
                {/* Leave Type with Infinite Scroll Dropdown */}
                <div className="flex flex-col justify-start items-start gap-2 w-full" ref={policyDropdownContainerRef}>
                  <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    Leave type <span className="text-red-500">*</span>
                  </div>
                  
                  {loadingPolicies && currentPolicyPage === 1 ? (
                    <div className="w-full h-11 flex items-center justify-center border border-neutral-200 rounded-lg bg-gray-50">
                      <ContentSpinner />
                    </div>
                  ) : (
                    <div className="relative w-full">
                      {/* Dropdown Button */}
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex flex-row justify-between items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      >
                        <span className={`text-sm ${formData.leave_type_id ? 'text-neutral-900' : 'text-gray-400'}`}>
                          {getSelectedPolicyName()}
                        </span>
                        <svg 
                          width="12" 
                          height="8" 
                          viewBox="0 0 12 8" 
                          fill="none"
                          className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        >
                          <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {/* Search Input */}
                          <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-20">
                            <div className="flex items-center gap-2 px-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 21l-4.35-4.35" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <input
                                type="text"
                                value={policySearchQuery}
                                onChange={(e) => setPolicySearchQuery(e.target.value)}
                                placeholder="Search leave types..."
                                className="flex-1 text-xs text-neutral-900 outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Scrollable Options */}
                          <div 
                            ref={policyScrollContainerRef}
                            className="max-h-60 overflow-y-auto"
                          >
                            {filteredPolicies.length > 0 ? (
                              <>
                                {filteredPolicies.map((policy) => (
                                  <button
                                    key={policy.id}
                                    type="button"
                                    onClick={() => handlePolicySelect(policy.id)}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-50 last:border-b-0 ${
                                      formData.leave_type_id === policy.id.toString()
                                        ? 'bg-teal-50 text-teal-700 font-medium'
                                        : 'text-gray-900'
                                    }`}
                                  >
                                    {policy.name}
                                  </button>
                                ))}
                                
                                {/* Loading Indicator */}
                                {isFetchingPolicies && hasMorePolicies && (
                                  <div className="px-3 py-3 text-center border-t">
                                    <div className="flex items-center justify-center gap-2">
                                      <svg className="animate-spin h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                      </svg>
                                      <span className="text-xs text-gray-500">Loading more...</span>
                                    </div>
                                  </div>
                                )}

                                {/* End of List Indicator */}
                                {!hasMorePolicies && allPolicies.length > 0 && (
                                  <div className="px-3 py-2 text-xs text-gray-500 text-center border-t bg-gray-50">
                                    {allPolicies.length} leave type(s).
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                {isFetchingPolicies ? "Loading leave types..." : "No leave types found"}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Date Range */}
                <div className="flex flex-row justify-between items-center gap-4 w-full">
                  <div className="flex flex-col justify-start items-start gap-2 flex-1">
                    <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                      Start Date <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleStartDateChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex flex-col justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      required
                    />
                  </div>
                  <div className="flex flex-col justify-start items-start gap-2 flex-1">
                    <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                      End Date <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      min={formData.start_date || new Date().toISOString().split('T')[0]}
                      className="flex flex-col justify-center items-center rounded-lg border border-neutral-200 w-full h-11 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                      required
                    />
                  </div>
                </div>

                {/* Days Calculation Display */}
                {formData.start_date && formData.end_date && (
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                      Duration
                    </div>
                    <div className="flex flex-col justify-center items-center rounded-lg border border-teal-200 w-full h-11 bg-teal-50 px-4">
                      <div className="font-inter text-sm text-teal-700 font-medium">
                        {calculateDays(formData.start_date, formData.end_date)} days
                      </div>
                    </div>
                  </div>
                )}

                {/* Reason */}
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                    Reason <span className="text-red-500">*</span>
                  </div>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={3}
                    className="flex justify-start items-center rounded-lg border border-neutral-200 w-full bg-white p-4 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    placeholder="Please provide a reason for your leave.."
                    required
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="flex flex-col justify-start items-center rounded-lg border-l-4 border-teal-500 h-auto bg-green-50 w-full p-4">
                <div className="flex justify-start items-center w-full">
                  <div className="font-inter text-sm text-gray-700 text-opacity-100 leading-5 tracking-normal font-normal">
                    Your leave request will be sent to your manager for approval.
                    You will receive a notification once your request has been
                    reviewed.
                  </div>
                </div>
              </div>

              {/* Submit Button - Fixed at bottom of scrollable area */}
              <div className="flex-shrink-0 w-full">
                <button
                  type="submit"
                  disabled={isSubmitting || loadingPolicies || !user}
                  className="flex flex-row justify-center items-center gap-2 rounded-lg h-12 bg-teal-500 w-full cursor-pointer hover:bg-teal-600 transition-colors disabled:bg-teal-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <div className="font-inter text-base whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-normal">
                        Submitting...
                      </div>
                    </div>
                  ) : (
                    <div className="font-inter text-base whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-normal">
                      Submit Request
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;