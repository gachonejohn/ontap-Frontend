import React, { useState, useEffect, useMemo, useRef } from "react";
import { toast } from "react-toastify";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";
import NoDataFound from "@components/common/NoData";
import { CustomDate } from "../../utils/dates";
import { PAGE_SIZE } from "@constants/constants";

export default function MainPayslipContent() {
  const [activeTab, setActiveTab] = useState("allPayslips");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [selectedPayslips, setSelectedPayslips] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [allPayslips, setAllPayslips] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setAllPayslips([]);
      setHasMore(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    setAllPayslips([]);
    setHasMore(true);
  }, [statusFilter, debouncedSearchTerm]);

  const statusMap = {
    "All": "All Status",
    "DRAFT": "Draft",
    "GENERATED": "Generated",
    "SENT": "Sent",
    "VIEWED": "Viewed",
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));

  // Placeholder data for now
  const [isFetching, setIsFetching] = useState(false);
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

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setIsStatusDropdownOpen(false);
  };

  const handleSelectPayslip = (payslipId) => {
    setSelectedPayslips(prev =>
      prev.includes(payslipId)
        ? prev.filter(id => id !== payslipId)
        : [...prev, payslipId]
    );
  };

  const handleSelectAll = () => {
    if (selectedPayslips.length === allPayslips.length) {
      setSelectedPayslips([]);
    } else {
      setSelectedPayslips(allPayslips.map(p => p.id));
    }
  };

  const handleExportPayslips = async () => {
    if (selectedPayslips.length === 0) {
      toast.error("Please select payslips to export");
      return;
    }
    toast.info("Export functionality coming soon!");
    // TODO: Implement export when API is ready
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "DRAFT":
        return "border-gray-200 bg-gray-100 text-gray-800";
      case "GENERATED":
        return "border-blue-200 bg-blue-100 text-blue-800";
      case "SENT":
        return "border-green-200 bg-green-100 text-green-800";
      case "VIEWED":
        return "border-purple-200 bg-purple-100 text-purple-800";
      default:
        return "border-gray-200 bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case "DRAFT":
        return "Draft";
      case "GENERATED":
        return "Generated";
      case "SENT":
        return "Sent";
      case "VIEWED":
        return "Viewed";
      default:
        return status;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header section */}
      <div className="flex justify-between items-center mb-1 py-1">
        <div className="flex flex-col gap-1">
          <div className="text-lg text-neutral-900 font-semibold">
            Payslips Management
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Generate, send and manage employee payslips.
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Generated Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Generated
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {allPayslips.filter(p => p.status === "GENERATED").length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/generated.png"
                alt="Generated icon"
              />
            </div>
          </div>
        </div>

        {/* Sent Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Sent
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {allPayslips.filter(p => p.status === "SENT").length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/sent.png"
                alt="Sent icon"
              />
            </div>
          </div>
        </div>

        {/* Viewed Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Viewed
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {allPayslips.filter(p => p.status === "VIEWED").length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-purple-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/viewed.png"
                alt="Viewed icon"
              />
            </div>
          </div>
        </div>

        {/* Total Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-sm border bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Total
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {payslipsData?.count || allPayslips.length}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-lg h-7 w-7 bg-teal-500 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/payslip.png"
                alt="Total Payslip icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col justify-center items-center rounded-xl w-full p-4 shadow-sm bg-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full">
          {/* Search Bar */}
          <div className="flex flex-row justify-start items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-sm bg-white flex-1 max-w-2xl">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.5px"
                height="16.5px"
                src="/images/search.png"
                alt="Search Icon"
              />
            </div>
            <input
              type="text"
              placeholder="Search by employee name..."
              className="font-inter text-xs w-full bg-transparent border-none outline-none text-gray-400 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter and Export Buttons */}
          <div className="flex flex-row justify-start items-center gap-2 flex-wrap">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <div
                className="gap-2 flex flex-row justify-center items-center p-2 rounded-lg border border-neutral-200 h-11 bg-white min-w-[125px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <div className="flex flex-row justify-start items-center gap-1">
                  <div className="flex justify-center items-center h-5">
                    <img
                      width="16.3px"
                      height="16.3px"
                      src="/images/filter.png"
                      alt="Filter Icon"
                    />
                  </div>
                  <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-semibold">
                    {statusMap[statusFilter] || "All Status"}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center w-4 h-4">
                  <img
                    width="9.5px"
                    height="5.1px"
                    src="/images/dropdown.png"
                    alt="Dropdown Icon"
                  />
                </div>
              </div>

              {/* Status Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                  {statusOptions.map(({ key, value }) => (
                    <div
                      key={key}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                        statusFilter === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                      }`}
                      onClick={() => handleStatusFilterChange(key)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportPayslips}
              disabled={selectedPayslips.length === 0 || isExporting}
              className="flex justify-center items-center gap-2 rounded-lg h-11 px-4 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 transition-colors"
            >
              <div className="flex justify-center items-center h-5">
                <img
                  width="16px"
                  height="16px"
                  src="/images/export.png"
                  alt="Export Icon"
                />
              </div>
              <div className="font-inter text-xs whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-semibold">
                {isExporting ? "Exporting..." : `Export (${selectedPayslips.length})`}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {isFetching && allPayslips.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <ContentSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {/* Payslips Table */}
          <div className="flex flex-col rounded-xl border border-neutral-200 bg-white overflow-hidden w-full">
            {/* Table Header */}
            <div className="flex flex-row justify-between items-center gap-4 p-4 border-b border-neutral-200 bg-gray-50">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPayslips.length === allPayslips.length && allPayslips.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
              </div>
              <div className="flex-1 font-inter text-xs font-semibold text-gray-700">
                Employee
              </div>
              <div className="flex-1 font-inter text-xs font-semibold text-gray-700">
                Period
              </div>
              <div className="flex-1 font-inter text-xs font-semibold text-gray-700">
                Net Salary
              </div>
              <div className="flex-1 font-inter text-xs font-semibold text-gray-700">
                Status
              </div>
              <div className="w-24 font-inter text-xs font-semibold text-gray-700 text-center">
                Actions
              </div>
            </div>

            {/* Table Body */}
            {allPayslips && allPayslips.length > 0 ? (
              <>
                {allPayslips.map((payslip) => (
                  <div key={payslip.id} className="flex flex-row justify-between items-center gap-4 p-4 border-b border-neutral-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedPayslips.includes(payslip.id)}
                        onChange={() => handleSelectPayslip(payslip.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 font-inter text-sm text-gray-900">
                      {payslip.employee_name || "Unknown"}
                    </div>
                    <div className="flex-1 font-inter text-sm text-gray-600">
                      {payslip.payroll_period || "N/A"}
                    </div>
                    <div className="flex-1 font-inter text-sm font-semibold text-teal-600">
                      {formatCurrency(parseFloat(payslip.net_salary) || 0)}
                    </div>
                    <div className="flex-1">
                      <div className={`inline-flex justify-center items-center py-1 px-3 rounded-lg border text-xs font-medium ${getStatusStyles(payslip.status)}`}>
                        {formatStatus(payslip.status)}
                      </div>
                    </div>
                    <div className="w-24 flex justify-center gap-2">
                      <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                        <img
                          width="16px"
                          height="16px"
                          src="/images/view.png"
                          alt="View"
                        />
                      </button>
                      <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                        <img
                          width="16px"
                          height="16px"
                          src="/images/download.png"
                          alt="Download"
                        />
                      </button>
                    </div>
                  </div>
                ))}

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
                <NoDataFound message="No payslips found." />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}