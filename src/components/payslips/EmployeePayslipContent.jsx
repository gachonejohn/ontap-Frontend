import React, { useState, useEffect, useMemo, useRef } from "react";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import { CustomDate } from "../../utils/dates";
import { PAGE_SIZE } from "@constants/constants";
import { toast } from "react-toastify";

const EmployeePayslipContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allPayslips, setAllPayslips] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const observerTarget = useRef(null);

  const [activeTab, setActiveTab] = useState("payslips");
  const [searchTerm, setSearchTerm] = useState("");

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [payslipsData, setPayslipsData] = useState({ count: 0, next: null, results: [] });

  // TODO: Remove this when API is ready
  useEffect(() => {
    // Placeholder for API integration
  }, [payslipsData, currentPage]);

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
      case 'generated':
        return 'bg-blue-500';
      case 'sent':
        return 'bg-green-600';
      case 'viewed':
        return 'bg-purple-600';
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

  const handleDownloadPayslip = async (payslipId) => {
    setDownloadingId(payslipId);
    toast.info("Download functionality coming soon!");
    // TODO: Implement download when API is ready
    setDownloadingId(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            My Payslips
          </div>
          <div className="text-sm text-gray-600 font-normal">
            View and download your payslips
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {/* Latest Payslip Card */}
        {allPayslips && allPayslips.length > 0 && (
          <>
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    Latest Period
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {allPayslips[0].payroll_period || "N/A"}
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/calendar.png"
                    alt="Latest icon"
                  />
                </div>
              </div>
            </div>

            {/* Latest Net Salary Card */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    Net Salary
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {formatCurrency(parseFloat(allPayslips[0].net_salary) || 0)}
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-teal-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/money.png"
                    alt="Salary icon"
                  />
                </div>
              </div>
            </div>

            {/* Total Payslips Card */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    Total Payslips
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    {payslipsData?.count || allPayslips.length}
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-500 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/payslip.png"
                    alt="Payslip icon"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "payslips" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("payslips")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "payslips" ? "font-semibold" : "font-medium"
            }`}
          >
            My Payslips
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "summary" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("summary")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "summary" ? "font-semibold" : "font-medium"
            }`}
          >
            Annual Summary
          </div>
        </div>
      </div>

      {activeTab === "payslips" ? (
        /* My Payslips Content */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white overflow-hidden">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-col justify-start items-start gap-1.5">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                Payslip List
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                All your payslips organized by period
              </div>
            </div>
          </div>

          {/* Payslips Content */}
          {isLoading && allPayslips.length === 0 ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : allPayslips && allPayslips.length > 0 ? (
            <>
              <div className="flex flex-col justify-start items-center gap-5 p-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {allPayslips.map((payslip) => (
                    <div key={payslip.id} className="flex flex-col justify-start items-start rounded-xl border border-neutral-200 bg-white overflow-hidden">
                      <div className="flex flex-col justify-start items-start gap-4 p-6 w-full">
                        {/* Period Header */}
                        <div className="flex flex-row justify-between items-start w-full">
                          <div className="flex flex-col justify-start items-start">
                            <div className="font-inter text-base whitespace-nowrap text-gray-900 text-opacity-100 leading-6 tracking-normal font-semibold">
                              {payslip.payroll_period || 'Payslip'}
                            </div>
                            <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-5 tracking-normal font-normal">
                              {CustomDate(payslip.created_at)}
                            </div>
                          </div>
                          <div className={`flex justify-center items-center rounded-lg px-3 py-1 ${getStatusColor(payslip.status)}`}>
                            <div className="font-inter text-xs whitespace-nowrap text-white text-opacity-100 leading-4 font-medium">
                              {payslip.status?.charAt(0).toUpperCase() + payslip.status?.slice(1).toLowerCase()}
                            </div>
                          </div>
                        </div>

                        {/* Payslip Summary */}
                        <div className="flex flex-col justify-start items-start p-3 rounded-lg w-full bg-gray-50 gap-3">
                          <div className="flex flex-row justify-between items-center w-full">
                            <div className="font-inter text-sm text-gray-700 font-medium">
                              Gross Salary
                            </div>
                            <div className="font-inter text-sm text-neutral-900 font-semibold">
                              {formatCurrency(parseFloat(payslip.gross_salary) || 0)}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-center w-full border-t border-gray-200 pt-3">
                            <div className="font-inter text-sm text-gray-700 font-medium">
                              Deductions
                            </div>
                            <div className="font-inter text-sm text-red-500 font-semibold">
                              -{formatCurrency(parseFloat(payslip.total_deductions) || 0)}
                            </div>
                          </div>
                          <div className="flex flex-row justify-between items-center w-full border-t border-gray-200 pt-3 font-semibold">
                            <div className="font-inter text-sm text-teal-900">
                              Net Salary
                            </div>
                            <div className="font-inter text-sm text-teal-600">
                              {formatCurrency(parseFloat(payslip.net_salary) || 0)}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 w-full pt-4 border-t border-neutral-200">
                          <button
                            onClick={() => handleDownloadPayslip(payslip.id)}
                            disabled={downloadingId === payslip.id}
                            className="flex-1 flex justify-center items-center gap-2 rounded-lg h-9 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 transition-colors"
                          >
                            <img
                              width="16px"
                              height="16px"
                              src="/images/download.png"
                              alt="Download"
                            />
                            <div className="font-inter text-sm whitespace-nowrap text-white text-opacity-100 leading-5 tracking-normal font-medium">
                              {downloadingId === payslip.id ? "Downloading..." : "Download"}
                            </div>
                          </button>
                          <button className="flex-1 flex justify-center items-center gap-2 rounded-lg border border-teal-500 h-9 bg-white hover:bg-teal-50 transition-colors">
                            <img
                              width="16px"
                              height="16px"
                              src="/images/view.png"
                              alt="View"
                            />
                            <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-5 tracking-normal font-medium">
                              View
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
                  <div className="text-sm text-gray-500 py-4">Loading more payslips...</div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full">
              <NoDataFound message="No payslips found yet." />
            </div>
          )}
        </div>
      ) : (
        /* Annual Summary Content */
        <div className="flex flex-col justify-between items-center rounded-xl border border-neutral-200 w-full bg-white overflow-hidden">
          <div className="flex flex-row justify-start items-center gap-4 p-4 w-full border-b border-neutral-200">
            <div className="flex flex-col justify-start items-start gap-1.5">
              <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                Annual Summary
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                Your annual earnings summary
              </div>
            </div>
          </div>

          {isLoading && allPayslips.length === 0 ? (
            <div className="flex justify-center items-center py-12 w-full">
              <ContentSpinner />
            </div>
          ) : allPayslips && allPayslips.length > 0 ? (
            <div className="flex flex-col justify-start items-start gap-4 p-6 w-full">
              {/* Annual Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="flex flex-col gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900">Total Gross Salary</h4>
                  <div className="font-inter text-2xl font-bold text-green-700">
                    {formatCurrency(
                      allPayslips.reduce((sum, p) => sum + (parseFloat(p.gross_salary) || 0), 0)
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900">Total Deductions</h4>
                  <div className="font-inter text-2xl font-bold text-red-700">
                    -{formatCurrency(
                      allPayslips.reduce((sum, p) => sum + (parseFloat(p.total_deductions) || 0), 0)
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200">
                  <h4 className="font-semibold text-teal-900">Total Net Salary</h4>
                  <div className="font-inter text-2xl font-bold text-teal-700">
                    {formatCurrency(
                      allPayslips.reduce((sum, p) => sum + (parseFloat(p.net_salary) || 0), 0)
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900">Payslips Count</h4>
                  <div className="font-inter text-2xl font-bold text-blue-700">
                    {allPayslips.length}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <NoDataFound message="No payslip data available for summary." />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeePayslipContent;