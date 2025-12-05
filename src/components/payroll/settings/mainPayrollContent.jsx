import React, { useState } from "react";
import PAYETax from "./PAYETax";
import NSSF from "./NSSF";
import SHIF from "./SHIF";
import AHL from "./AHL";

import Allowances from "./Allowances";
import Deductions from "./Deductions";
import AdjustmentRates from "../AdjustmentRates";
import OvertimePayroll from "../OvertimePayroll";
import PayrollRules from "../PayrollRules";


export default function MainPayrollContent() {
  const [activeTab, setActiveTab] = useState("paye");
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-6">
      {/* Main Header */}
      <div className="flex justify-between items-center gap-[540px] pr-8 pl-8 w-full">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="font-inter text-lg text-neutral-900 leading-snug tracking-normal font-semibold">
            Payroll Settings
          </div>
          <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-normal">
            Configure statutory deductions and payroll rules
          </div>
        </div>
      </div>

      {/* Kenya Statutory Compliance Notice */}
      <div className="flex flex-col justify-start items-start pt-4 pl-4 pr-8 mx-8 rounded-xl border-teal-100 border bg-green-50 h-28">
        <div className="flex flex-row justify-start items-start gap-3 w-full">
          <div className="flex flex-row justify-center items-center rounded-lg w-10 h-10 bg-green-100">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#059669"/>
            </svg>
          </div>
          <div className="flex flex-col justify-start items-start gap-1 flex-1">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="font-inter text-base text-gray-900 leading-6 tracking-normal font-semibold">
                Kenya Statutory Compliance
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="font-inter text-sm text-gray-600 leading-5 tracking-normal font-normal">
              All settings below are configured according to Kenya Revenue Authority (KRA) regulations. You can adjust rates to comply with future tax law changes. Changes are logged for audit purposes.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex flex-col justify-start items-start gap-2.5 w-full px-8">
        <div className="flex flex-row justify-center items-center rounded-lg border-slate-100 border bg-slate-50 overflow-hidden w-full">
          {/* PAYE Tax Tab */}
          <button
            onClick={() => handleTabChange("paye")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 rounded-lg border-slate-100 border-r border-solid w-44 h-10 ${
              activeTab === "paye" ? "bg-white" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs min-w-[56px] whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                PAYE Tax
              </div>
            </div>
          </button>

          {/* Overtime Payroll Tab */}
          <button
            onClick={() => handleTabChange("overtime")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "overtime" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Overtime Payroll
              </div>
            </div>
          </button>

          {/* NSSF Tab */}
          <button
            onClick={() => handleTabChange("nssf")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "nssf" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs min-w-[33px] whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                NSSF
              </div>
            </div>
          </button>

          {/* SHIF Tab */}
          <button
            onClick={() => handleTabChange("shif")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "shif" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs min-w-[28px] whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                SHIF
              </div>
            </div>
          </button>

          {/* AHL Tab */}
          <button
            onClick={() => handleTabChange("ahl")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "ahl" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs min-w-[25px] whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                AHL
              </div>
            </div>
          </button>

          {/* Payroll Rules Tab */}
          <button
            onClick={() => handleTabChange("payrollRules")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "payrollRules" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Payroll Rules
              </div>
            </div>
          </button>

          {/* Allowances Tab */}
          <button
            onClick={() => handleTabChange("allowances")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "allowances" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Allowances
              </div>
            </div>
          </button>

          {/* Deductions Tab */}
          {/* <button
            onClick={() => handleTabChange("deductions")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "deductions" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Deductions
              </div>
            </div>
          </button> */}

          {/* Statutory Deductions Tab */}
          {/* <button
            onClick={() => handleTabChange("statutory")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "statutory" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Statutory Deductions
              </div>
            </div>
          </button> */}

          {/* Adjustment Rates Tab */}
          <button
            onClick={() => handleTabChange("adjustmentRates")}
            className={`flex flex-row justify-center items-center gap-2 pt-2 pr-4 pb-2 pl-4 w-44 h-10 ${
              activeTab === "adjustmentRates" ? "bg-white rounded-lg" : ""
            }`}
          >
            <div className="flex flex-row justify-center items-center gap-1 h-4">
              <div className="font-inter text-xs whitespace-nowrap text-neutral-900 text-opacity-100 leading-normal tracking-wide font-semibold">
                Adjustment Rates
              </div>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "paye" && (
          <PAYETax currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "overtime" && (
          <OvertimePayroll currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "nssf" && (
          <NSSF currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "shif" && (
          <SHIF currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "ahl" && (
          <AHL currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "payrollRules" && (
          <PayrollRules currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "allowances" && (
          <Allowances currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {/* {activeTab === "deductions" && (
          <Deductions currentPage={currentPage} onPageChange={handlePageChange} />
        )}
        {activeTab === "statutory" && (
          <StatutoryDeductions currentPage={currentPage} onPageChange={handlePageChange} />
        )} */}
        {activeTab === "adjustmentRates" && (
          <AdjustmentRates currentPage={currentPage} onPageChange={handlePageChange} />
        )}
      </div>
    </div>
  );
}