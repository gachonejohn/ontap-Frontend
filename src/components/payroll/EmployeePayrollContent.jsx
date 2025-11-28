import React, { useState, useEffect, useMemo, useRef } from "react";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import { CustomDate } from "../../utils/dates";
import { PAGE_SIZE } from "@constants/constants";

const EmployeePayrollContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPayrollRecords, setAllPayrollRecords] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const [activeTab, setActiveTab] = useState("payrollHistory");
  const [searchTerm, setSearchTerm] = useState("");

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      search: searchTerm || undefined,
    }),
    [currentPage, searchTerm]
  );

  // Placeholder data for now
  const [payrollData, setPayrollData] = useState({ count: 0, next: null, results: [] });
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Remove this when API is ready
  useEffect(() => {
    // Placeholder for API integration
  }, [payrollData, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetching]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-orange-500';
      case 'approved':
        return 'bg-green-600';
      case 'processed':
        return 'bg-purple-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            My Payroll
          </div>
          <div className="text-sm text-gray-600 font-normal">
            View your payroll history and details
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "payrollHistory" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("payrollHistory")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "payrollHistory" ? "font-semibold" : "font-medium"
            }`}
          >
            Payroll History
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "payrollDetails" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("payrollDetails")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "payrollDetails" ? "font-semibold" : "font-medium"
            }`}
          >
            Payroll Details
          </div>
        </div>
      </div>

      {activeTab === "payrollHistory" ? (
        /* Payroll History Content */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white overflow-hidden">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-col justify-start items-start gap-1.5">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                Payroll Records
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                All your payroll records organized by period
              </div>
            </div>
          </div>

          {/* Payroll Records Content */}
          {isLoading && allPayrollRecords.length === 0 ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : allPayrollRecords && allPayrollRecords.length > 0 ? (
            <>
              <div className="flex flex-col justify-start items-center gap-5 p-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {allPayrollRecords.map((record) => (
                    <div key={record.id} className="flex flex-col justify-start items-start rounded-xl border border-neutral-200 bg-white overflow-hidden">
                      <div className="flex flex-col justify-start items-start gap-4 p-6 w-full">
                        {/* Period Header */}
                        <div className="flex flex-row justify-between items-start w-full">
                          <div className="flex flex-col justify-start items-start">
                            <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold">
                              {record.payroll_period || 'Payroll Period'}
                            </div>
                            <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                              {record.month}/{record.year}
                            </div>
                          </div>
                          <div className={`flex justify-center items-center rounded-lg px-3 py-1 ${getStatusColor(record.status)}`}>
                            <div className="font-inter text-xs whitespace-nowrap text-white text-opacity-100 leading-4 font-medium">
                              {record.status?.charAt(0).toUpperCase() + record.status?.slice(1).toLowerCase()}
                            </div>
                          </div>
                        </div>

                        {/* Payroll Details */}
                        <div className="flex flex-col justify-start items-start p-3 rounded-lg w-full bg-gray-50 gap-3">
                          <div className="flex flex-row justify-between items-center w-full">
                            <div className="font-inter text-sm text-gray-700 font-medium">
                              Gross Salary
                            </div>
                            <div className="font-inter text-sm text-neutral-900 font-semibold">
                              {formatCurrency(parseFloat(record.gross_salary) || 0)}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-center w-full border-t border-gray-200 pt-3">
                            <div className="font-inter text-sm text-gray-700 font-medium">
                              Deductions
                            </div>
                            <div className="font-inter text-sm text-red-500 font-semibold">
                              -{formatCurrency(parseFloat(record.total_deductions) || 0)}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-center w-full border-t border-gray-200 pt-3">
                            <div className="font-inter text-sm text-gray-700 font-medium">
                              Net Salary
                            </div>
                            <div className="font-inter text-sm text-teal-500 font-semibold">
                              {formatCurrency(parseFloat(record.net_salary) || 0)}
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col justify-start items-start gap-2 pt-4 border-t border-neutral-200 w-full">
                          <div className="flex justify-start items-center w-full">
                            <div className="font-inter text-xs whitespace-nowrap text-gray-500 text-opacity-100 leading-4 font-normal">
                              Processed on {CustomDate(record.created_at)}
                            </div>
                          </div>
                          <button className="w-full flex justify-center items-center rounded-lg border border-teal-500 h-8 bg-white hover:bg-teal-50 transition-colors">
                            <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-medium">
                              View Details
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infinite Scroll Observer Target */}
              <div
                ref={observerTarget}
                className="w-full h-10 flex items-center justify-center"
              >
                {isFetching && hasMore && (
                  <div className="text-sm text-gray-500 py-4">Loading more payroll records...</div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <NoDataFound message="No payroll records found." />
            </div>
          )}
        </div>
      ) : (
        /* Payroll Details Content */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white overflow-hidden">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-col justify-start items-start gap-1.5">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                Payroll Details
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                Breakdown of your latest payroll
              </div>
            </div>
          </div>

          {isLoading && allPayrollRecords.length === 0 ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : allPayrollRecords && allPayrollRecords.length > 0 ? (
            <div className="flex flex-col justify-start items-start gap-4 p-6 w-full">
              {allPayrollRecords[0] && (
                <>
                  <div className="flex flex-col gap-4 w-full">
                    <h3 className="text-base font-semibold text-neutral-900">
                      Period: {allPayrollRecords[0].payroll_period}
                    </h3>

                    {/* Earnings Section */}
                    <div className="flex flex-col gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900">Earnings</h4>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Base Salary</span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(parseFloat(allPayrollRecords[0].base_salary) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-green-200">
                        <span className="text-gray-700">Allowances</span>
                        <span className="font-semibold text-green-700">
                          {formatCurrency(parseFloat(allPayrollRecords[0].total_allowances) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-green-200 font-semibold text-lg">
                        <span className="text-green-900">Gross Salary</span>
                        <span className="text-green-700">
                          {formatCurrency(parseFloat(allPayrollRecords[0].gross_salary) || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-900">Deductions</h4>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-700">Tax</span>
                        <span className="font-semibold text-red-700">
                          -{formatCurrency(parseFloat(allPayrollRecords[0].tax) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-red-200">
                        <span className="text-gray-700">Insurance</span>
                        <span className="font-semibold text-red-700">
                          -{formatCurrency(parseFloat(allPayrollRecords[0].insurance) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-red-200 font-semibold text-lg">
                        <span className="text-red-900">Total Deductions</span>
                        <span className="text-red-700">
                          -{formatCurrency(parseFloat(allPayrollRecords[0].total_deductions) || 0)}
                        </span>
                      </div>
                    </div>

                    {/* Net Salary Section */}
                    <div className="flex flex-col gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="flex justify-between font-semibold text-lg">
                        <span className="text-teal-900">Net Salary (Take Home)</span>
                        <span className="text-teal-700 text-xl">
                          {formatCurrency(parseFloat(allPayrollRecords[0].net_salary) || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full">
              <NoDataFound message="No payroll details available." />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeePayrollContent;