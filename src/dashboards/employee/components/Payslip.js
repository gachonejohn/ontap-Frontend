import React, { useState } from 'react';
import StatementModal from './StatementModal.js';
import ViewProfileModal from './ViewProfileModal.js';

const Payslip = () => {
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('payslipHistory');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    // Render the actual payslip content after authentication
    return (
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-center w-full h-[53px]">
          <div className="flex flex-col justify-start items-start gap-1.5">
            <div className="text-lg text-neutral-900 font-semibold">Payslips</div>
            <div className="text-sm text-gray-600 font-normal">
              View and download your salary statements
            </div>
          </div>
          <button
            className="flex flex-row justify-center items-center gap-1.5 rounded-md h-12 bg-teal-500 px-4 hover:bg-teal-600 transition-colors"
            onClick={() => setIsStatementModalOpen(true)}
          >
            <img width="20px" height="20px" src="/images/statement.png" alt="statement icon" />
            <div className="text-sm text-white font-medium">Download Salary Statement</div>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Current Month Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg text-white bg-teal-500 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
            {/* Top Row: Title + Date + Icon */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col">
                <div className="text-sm font-medium">Current Month</div>
                <div className="text-xs font-normal">August 26, 2025</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-white">
                <img width="21" height="21" src="/images/current.png" alt="Current month icon" />
              </div>
            </div>

            {/* Bottom Row: Value + View Icon */}
            <div className="flex flex-row justify-between items-end w-full">
              <div className="text-lg font-semibold">*****</div>
              <img width="16" height="14" src="/images/vieww.png" alt="View icon" />
            </div>
          </div>

          {/* YTD Earnings Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
            {/* Top Row: Title + Date + Icon */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">YTD Earnings</div>
                <div className="text-xs text-gray-600 font-normal">August 26, 2025</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-teal-100">
                <img width="20" height="18" src="/images/trend.png" alt="Trend icon" />
              </div>
            </div>

            {/* Bottom Row: Value + View Icon */}
            <div className="flex flex-row justify-between items-end w-full">
              <div className="text-lg text-neutral-900 font-semibold">*****</div>
              <img width="16" height="14" src="/images/view.png" alt="View icon" />
            </div>
          </div>

          {/* Average Monthly Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
            {/* Top Row: Title + Date + Icon */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">Average Monthly</div>
                <div className="text-xs text-gray-600 font-normal">Last 6 months</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-blue-100">
                <img width="20" height="18" src="/images/average.png" alt="Average icon" />
              </div>
            </div>

            {/* Bottom Row: Value + View Icon */}
            <div className="flex flex-row justify-between items-end w-full">
              <div className="text-lg text-neutral-900 font-semibold">*****</div>
              <img width="16" height="14" src="/images/view.png" alt="View icon" />
            </div>
          </div>

          {/* Overtime YTD Card */}
          <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
            {/* Top Row: Title + Date + Icon */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">Overtime YTD</div>
                <div className="text-xs text-gray-600 font-normal">24 hours total</div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-violet-100">
                <img width="20" height="20" src="/images/overtime.png" alt="Overtime icon" />
              </div>
            </div>

            {/* Bottom Row: Value + View Icon */}
            <div className="flex flex-row justify-between items-end w-full">
              <div className="text-lg text-neutral-900 font-semibold">*****</div>
              <img width="16" height="14" src="/images/view.png" alt="View icon" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden w-full">
          <div
            className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'payslipHistory' ? 'bg-white' : ''}`}
            onClick={() => setActiveTab('payslipHistory')}
          >
            <div
              className={`text-xs text-neutral-900 ${activeTab === 'payslipHistory' ? 'font-semibold' : 'font-medium'}`}
            >
              Payslip History
            </div>
          </div>
          <div
            className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'deductions' ? 'bg-white' : ''}`}
            onClick={() => setActiveTab('deductions')}
          >
            <div
              className={`text-xs text-neutral-900 ${activeTab === 'deductions' ? 'font-semibold' : 'font-medium'}`}
            >
              Deductions
            </div>
          </div>
        </div>

        {activeTab === 'payslipHistory' ? (
          <>
            {/* Search and Filter */}
            <div className="flex flex-row justify-between items-center w-full h-12 gap-4">
              {/* Search Bar */}
              <div className="flex flex-row items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md min-w-[800px] transition-transform duration-200 hover:-translate-y-1 bg-white flex-1">
                <div className="h-5 flex items-center">
                  <img width="16.5" height="16.5" src="/images/search.png" alt="Search icon" />
                </div>
                <div className="text-xs text-gray-400 font-normal">Search payslips</div>
              </div>

              {/* Filter Section */}
              <div className="flex flex-row justify-end items-center gap-3">
                {/* Year Dropdown */}
                <div className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-10 bg-white">
                  <div className="text-xs text-neutral-900 font-semibold">2025</div>
                  <div className="flex justify-center items-center w-4 h-4">
                    <img width="9.5" height="5.1" src="/images/dropdown.png" alt="Dropdown icon" />
                  </div>
                </div>

                {/* Filter Dropdown */}
                <div className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-10 bg-white">
                  <div className="flex justify-center items-center h-5">
                    <img width="16.3" height="16.3" src="/images/filter.png" alt="Filter icon" />
                  </div>
                  <div className="text-xs text-neutral-900 font-semibold">Filter</div>
                  <div className="flex justify-center items-center w-4 h-4">
                    <img width="9.5" height="5.1" src="/images/dropdown.png" alt="Dropdown icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payslip History Table */}
            <div className="flex flex-col justify-between items-center rounded-xl w-full shadow-sm bg-white overflow-hidden">
              <div className="flex flex-row justify-start items-center gap-4 p-4 w-full h-14 border-b border-neutral-200">
                <div className="text-lg text-neutral-900 font-medium">Payslips History</div>
              </div>

              {/* Table Header */}
              <div className="flex flex-row justify-start items-center w-full">
                {/* Pay Period Column */}
                <div className="flex flex-col justify-start items-start w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Pay Period</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">August 2025</span> Aug 1 - Aug 31
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">September 2025</span> Sep 1 - Sep 30
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">October 2025</span> Oct 1 - Oct 31
                    </div>
                  </div>
                </div>

                {/* Gross Pay Column */}
                <div className="flex flex-col justify-start items-start w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Gross Pay</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-gray-800 font-medium">Ksh. 20,000</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-gray-800 font-medium">Ksh. 20,000</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="text-sm text-gray-800 font-medium">Ksh. 20,000</div>
                  </div>
                </div>

                {/* Deductions Column */}
                <div className="flex flex-col justify-start items-start w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Deductions</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>
                </div>

                {/* Net Pay Column */}
                <div className="flex flex-col justify-start items-start w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Net Pay</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-green-600 font-medium">Ksh. 19,850</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-sm text-green-600 font-medium">Ksh. 19,850</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="text-sm text-green-600 font-medium">Ksh. 19,850</div>
                  </div>
                </div>

                {/* Overtime Column */}
                <div className="flex flex-col justify-start items-center w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Overtime</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-xs text-green-600 font-medium">
                      <span className="text-xs text-gray-800">8h</span>
                      <br />
                      Ksh. 1000
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="text-xs text-green-600 font-medium">
                      <span className="text-xs text-gray-800">4h</span>
                      <br />
                      Ksh. 500
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="text-xs text-green-600 font-medium">
                      <span className="text-xs text-gray-800">4h</span>
                      <br />
                      Ksh. 500
                    </div>
                  </div>
                </div>

                {/* Status Column */}
                <div className="flex flex-col justify-center items-center w-[150px]">
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Status</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="flex flex-row justify-center items-center gap-2.5 p-1 px-5 rounded-lg h-9 bg-green-100">
                      <img width="12.2px" height="12.2px" src="/images/paid.png" alt="Check icon" />
                      <div className="text-xs text-green-800 font-medium">Paid</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <div className="flex flex-row justify-center items-center gap-2.5 p-1 px-5 rounded-lg h-9 bg-green-100">
                      <img width="12.2px" height="12.2px" src="/images/paid.png" alt="Check icon" />
                      <div className="text-xs text-green-800 font-medium">Paid</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-3 p-4 h-[100px] w-full">
                    <div className="flex flex-row justify-center items-center gap-2.5 p-1 px-5 rounded-lg h-9 bg-green-100">
                      <img width="12.2px" height="12.2px" src="/images/paid.png" alt="Check icon" />
                      <div className="text-xs text-green-800 font-medium">Paid</div>
                    </div>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex flex-col justify-start items-start w-[204px]">
                  <div className="flex flex-row justify-start items-center gap-3 p-4 border-b border-neutral-200 h-10 bg-slate-50 w-full">
                    <div className="text-xs text-gray-500 font-medium">Actions</div>
                  </div>
                  {/* Rows */}
                  <div className="flex flex-row justify-center items-center gap-2 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <img width="16px" height="16px" src="/images/eye.png" alt="View icon" />
                      <div className="text-xs text-gray-800 font-medium">View</div>
                    </button>
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="13px"
                          height="13px"
                          src="/images/download.png"
                          alt="Download icon"
                        />
                      </div>
                      <div className="text-xs text-gray-800 font-medium">Download</div>
                    </button>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2 p-4 border-b border-neutral-200 h-[100px] w-full">
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <img width="16px" height="16px" src="/images/eye.png" alt="View icon" />
                      <div className="text-xs text-gray-800 font-medium">View</div>
                    </button>
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="13px"
                          height="13px"
                          src="/images/download.png"
                          alt="Download icon"
                        />
                      </div>
                      <div className="text-xs text-gray-800 font-medium">Download</div>
                    </button>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-2 p-4 h-[100px] w-full">
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <img width="16px" height="16px" src="/images/eye.png" alt="View icon" />
                      <div className="text-xs text-gray-800 font-medium">View</div>
                    </button>
                    <button className="flex flex-row justify-center items-center gap-1 p-1 px-5 rounded-lg border border-neutral-200 h-9">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="13px"
                          height="13px"
                          src="/images/download.png"
                          alt="Download icon"
                        />
                      </div>
                      <div className="text-xs text-gray-800 font-medium">Download</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-row justify-between items-center p-4 h-[68px] w-full">
                <div className="text-sm text-neutral-500 font-normal">Showing 3 to 12</div>
                <div className="flex flex-row justify-between items-center gap-4 w-[275px] h-8">
                  <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white">
                    <div className="text-xs text-neutral-900 font-semibold">Previous</div>
                  </button>
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <div className="flex flex-row justify-center items-center rounded-lg border border-neutral-200 w-7 h-8 bg-teal-500">
                      <div className="text-xs text-white font-semibold">1</div>
                    </div>
                    <div className="flex flex-row justify-center items-center rounded-lg border border-neutral-200 w-7 h-8 bg-white">
                      <div className="text-xs text-neutral-900 font-semibold">2</div>
                    </div>
                    <div className="flex flex-row justify-center items-center rounded-lg border border-neutral-200 w-7 h-8 bg-white">
                      <div className="text-xs text-neutral-900 font-semibold">3</div>
                    </div>
                  </div>
                  <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white">
                    <div className="text-xs text-neutral-900 font-semibold">Next</div>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Deductions Content */
          <div className="flex flex-col w-full gap-6">
            {/* Top Grid: Current Month Deductions + Tax Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Current Month Deductions */}
              <div className="flex flex-col justify-start items-start gap-4 rounded-xl w-full shadow-sm bg-white p-6">
                <div className="text-lg text-neutral-900 font-medium">Current Month Deductions</div>

                <div className="flex flex-col w-full gap-3">
                  {/* Income Tax */}
                  <div className="flex justify-between items-center p-4 rounded bg-gray-50 w-full h-16">
                    <div className="flex flex-col">
                      <div className="text-sm text-neutral-900 font-medium">Income Tax</div>
                      <div className="text-xs text-gray-600 font-medium">Monthly deduction</div>
                    </div>
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>

                  {/* Social Security */}
                  <div className="flex justify-between items-center p-4 rounded bg-gray-50 w-full h-16">
                    <div className="flex flex-col">
                      <div className="text-sm text-neutral-900 font-medium">Social Security</div>
                      <div className="text-xs text-gray-600 font-medium">Monthly deduction</div>
                    </div>
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>

                  {/* Health Insurance */}
                  <div className="flex justify-between items-center p-4 rounded bg-gray-50 w-full h-16">
                    <div className="flex flex-col">
                      <div className="text-sm text-neutral-900 font-medium">Health Insurance</div>
                      <div className="text-xs text-gray-600 font-medium">Monthly deduction</div>
                    </div>
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>

                  {/* Retirement */}
                  <div className="flex justify-between items-center p-4 rounded bg-gray-50 w-full h-16">
                    <div className="flex flex-col">
                      <div className="text-sm text-neutral-900 font-medium">Retirement</div>
                      <div className="text-xs text-gray-600 font-medium">Monthly deduction</div>
                    </div>
                    <div className="text-sm text-red-600 font-medium">-Ksh. 150</div>
                  </div>
                </div>

                {/* Total Deductions */}
                <div className="flex justify-between items-center pt-4 w-full h-14 border-t border-neutral-200">
                  <div className="text-lg text-neutral-900 font-medium">Total Deductions</div>
                  <div className="text-lg text-red-600 font-medium">-Ksh. 600</div>
                </div>
              </div>

              {/* Tax Information */}
              <div className="flex flex-col justify-start items-start gap-4 rounded-xl w-full shadow-sm bg-white p-6">
                <div className="text-lg text-neutral-900 font-medium">Tax Information</div>

                {/* YTD Tax Withheld */}
                <div className="flex justify-start items-center p-4 rounded-lg w-full h-[120px] bg-blue-50">
                  <div className="flex flex-col">
                    <div className="text-sm text-blue-900 font-medium">YTD Tax Withheld</div>
                    <div className="text-[22px] text-blue-600 font-semibold">Ksh. 1,500</div>
                    <div className="text-sm text-blue-600 font-medium">Federal and state taxes</div>
                  </div>
                </div>

                {/* Tax Rates */}
                <div className="flex flex-col w-full gap-3">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-neutral-900 font-medium">Federal Tax Rate</div>
                    <div className="text-sm text-neutral-900 font-medium">22%</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-neutral-900 font-medium">State Tax Rate</div>
                    <div className="text-sm text neutral-900 font-medium">22%</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-neutral-900 font-medium">Social Security</div>
                    <div className="text-sm text-neutral-900 font-medium">22%</div>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="text-sm text-neutral-900 font-medium">Medicare</div>
                    <div className="text-sm text-neutral-900 font-medium">22%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full">
              {/* Health Insurance */}
              <div className="flex flex-col justify-center items-start p-4 rounded-lg w-full h-28 bg-white border border-gray-200">
                <div className="text-sm text-gray-600 font-medium">Health Insurance</div>
                <div className="text-lg text-neutral-900 font-semibold">Ksh. 80/month</div>
                <div className="text-sm text-gray-600 font-medium">Medical & Dental coverage</div>
              </div>

              {/* Retirement */}
              <div className="flex flex-col justify-center items-start p-4 rounded-lg w-full h-28 bg-white border border-gray-200">
                <div className="text-sm text-gray-600 font-medium">Retirement (401k)</div>
                <div className="text-lg text-neutral-900 font-semibold">Ksh. 20/month</div>
                <div className="text-sm text-gray-600 font-medium">3% contribution</div>
              </div>

              {/* Life Insurance */}
              <div className="flex flex-col justify-center items-start p-4 rounded-lg w-full h-28 bg-white border border-gray-200">
                <div className="text-sm text-gray-600 font-medium">Life Insurance</div>
                <div className="text-lg text-neutral-900 font-semibold">Ksh. 0/month</div>
                <div className="text-sm text-gray-600 font-medium">Company provided</div>
              </div>
            </div>
          </div>
        )}

        {/* Statement Modal */}
        <StatementModal
          isOpen={isStatementModalOpen}
          onClose={() => setIsStatementModalOpen(false)}
        />
      </div>
    );
  }

  // Render authentication screen
  return (
    <div className="flex flex-col gap-6">
      {/* Authentication Content */}
      <div className="flex flex-col justify-center items-center gap-6 h-full">
        <div className="flex flex-col justify-center items-center gap-3 h-[125px]">
          <div className="gap-5 flex flex-row justify-center items-center pt-2 pr-2 pb-2 pl-2 w-[60px] h-[60px] rounded-[30px] bg-red-500 overflow-hidden">
            <div className="flex justify-center items-center w-9 h-9">
              <img
                width="26.1px"
                height="33.3px"
                src="/images/secure.png"
                alt="Secure Access icon"
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-1 w-[234px] h-[53px]">
            <div className="text-lg text-neutral-900 font-semibold">Secure Access Required</div>
            <div className="text-base text-gray-600 font-normal">Payslips & Salary Information</div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex flex-col justify-start items-center rounded-lg border border-amber-200 border-solid h-[183px] bg-amber-50">
          <div className="flex flex-col justify-between items-end pb-1 gap-3 w-[400px] h-[164px]">
            {/* Header */}
            <div className="flex flex-row justify-start items-center gap-2 pt-3 pr-4 pl-4 h-9 min-w-[400px]">
              <div className="flex justify-center items-center h-6">
                <img
                  width="20"
                  height="20"
                  src="/images/protected.png"
                  alt="Protected Information Icon"
                />
              </div>
              <div className="font-inter text-base min-w-[174px] whitespace-nowrap text-yellow-900 text-opacity-100 leading-normal tracking-wide font-medium">
                Protected Information
              </div>
            </div>

            {/* Body - Aligned with the text above */}
            <div className="flex flex-col justify-start items-start gap-3 h-[116px] ml-8">
              <div className="font-inter text-xs w-[355px] text-amber-800 text-opacity-100 leading-snug tracking-normal font-normal">
                This page contains sensitive financial and payroll information that requires
                additional security verification to protect your privacy.
              </div>

              {/* Bullet List */}
              <div className="flex flex-col justify-start items-start gap-1.5 w-[307px] h-[74px]">
                <div className="font-inter text-[10px] min-w-[307px] whitespace-nowrap text-amber-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  • Session will automatically expire after 10 minutes of access
                </div>
                <div className="font-inter text-[10px] minimal-w-[307px] whitespace-nowrap text-amber-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  • Your access is logged for security purposes
                </div>
                <div className="font-inter text-[10px] min-w-[307px] whitespace-nowrap text-amber-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  • Do not share your credentials with others
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="flex justify-center items-center rounded-lg w-[400px] h-[120px] shadow-sm bg-white">
          <div className="flex flex-col justify-center items-center gap-2 w-[320px] text-center">
            <div className="text-base text-gray-800 font-medium">Payslips & Salary Information</div>
            <div className="text-xs text-gray-600 font-normal">
              Access your salary statements, tax documents, and earnings history
            </div>
          </div>
        </div>

        {/* Password Form */}
        <div className="flex justify-center items-center rounded-lg w-[400px] h-[204px] shadow-sm bg-white">
          <div className="flex flex-col justify-start items-start gap-4 h-44">
            <div className="flex flex-row justify-start items-center gap-2 w-[368px]">
              <div className="flex flex-col justify-center items-center h-5">
                <img
                  width="19.3px"
                  height="19.2px"
                  src="/images/password.png"
                  alt="Password icon"
                />
              </div>
              <div className="text-base text-neutral-900 font-medium">Enter Password</div>
            </div>
            <div className="flex flex-col justify-start items-start gap-2 h-[74px]">
              <div className="text-sm text-zinc-500 font-medium">Password</div>
              <div className="flex flex-col justify-center items-center rounded-lg w-[368px] h-11 bg-gray-100">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[344px] h-5 bg-transparent text-sm text-neutral-900/70 focus:outline-none"
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div
              className="flex flex-row justify-center items-center gap-2 pt-2 pr-3 pb-2 pl-3 rounded-lg h-12 bg-teal-500 min-w-[368px] cursor-pointer hover:bg-teal-600 transition-colors"
              onClick={handleAuthentication}
            >
              <div className="text-base text-white font-normal">Authenticate & Continue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statement Modal */}
      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
      />
    </div>
  );
};

export default Payslip;
