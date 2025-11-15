import React from "react";

export default function PerformanceContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-semibold">
            Performance Management
          </div>
          <div className="font-inter text-sm whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
            Company-wide performance tracking and analytics
          </div>
        </div>
        <div className="flex flex-row justify-start items-center gap-3">
          <div className="flex justify-center items-center rounded-md border-teal-500 border-t border-b border-l border-r border-solid border w-44 h-12 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-row justify-start items-start gap-1.5">
              <img
                width="22px"
                height="22px"
                src="/images/KPIGoals.png"
                alt="Create KPI Goals"
              />
              <div className="font-inter text-sm whitespace-nowrap text-teal-500 text-opacity-100 leading-snug tracking-normal font-medium">
                Create KPI Goals
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center rounded-md w-44 h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors">
            <div className="flex flex-row justify-start items-start gap-2 w-40">
              <div className="flex justify-center items-center h-5">
                <img
                  width="17.9px"
                  height="17.9px"
                  src="/images/Total_days.png"
                  alt="Schedule Appraisal"
                />
              </div>
              <div className="font-inter text-sm whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-medium">
                Schedule Appraisal
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="flex flex-row justify-between items-center gap-4 w-full">
        {/* Company Average Card */}
        <div className="flex flex-col justify-center items-center rounded-lg h-[120px] shadow-sm bg-white flex-1">
          <div className="flex flex-row justify-between items-start gap-2.5 pr-3 pl-3 w-full h-20">
            <div className="flex flex-col justify-start items-start gap-4 h-20">
              <div className="flex flex-col justify-start items-start gap-0.5 h-5">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Company Average
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-0.5 h-11">
                <div className="flex flex-row justify-start items-center gap-9 h-6">
                  <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                    90%
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-1 h-4">
                  <div className="flex flex-col justify-center items-center h-3.5">
                    <img
                      width="13.9px"
                      height="8.6px"
                      src="/images/performance_up.png"
                      alt="Performance up"
                    />
                  </div>
                  <div className="font-inter text-xs whitespace-nowrap text-teal-500 text-opacity-100 leading-snug tracking-normal font-medium">
                    +12 vs last month
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 pt-2 pr-2 pb-2 pl-2 rounded-lg w-10 h-10 bg-blue-500">
              <img
                width="29.4px"
                height="29.4px"
                src="/images/company_average.png"
                alt="Company average icon"
              />
            </div>
          </div>
        </div>

        {/* Excellent Card */}
        <div className="flex flex-col justify-center items-center rounded-lg h-[120px] shadow-sm bg-white flex-1">
          <div className="flex flex-row justify-between items-start gap-2.5 pr-3 pl-3 w-full h-20">
            <div className="flex flex-col justify-start items-start gap-4 h-20">
              <div className="flex flex-col justify-start items-start gap-0.5 h-5">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Excellent
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-0.5 h-11">
                <div className="flex flex-row justify-start items-center gap-9 h-6">
                  <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                    19
                  </div>
                </div>
                <div className="flex flex-row justify-start items-center gap-1 h-4">
                  <div className="font-inter text-xs whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                    90%+ score
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 pt-2 pr-2 pb-2 pl-2 rounded-lg w-10 h-10 bg-green-500">
              <img
                width="29.4px"
                height="29.4px"
                src="/images/excellent_performance.png"
                alt="Excellent icon"
              />
            </div>
          </div>
        </div>

        {/* Good Performance Card */}
        <div className="flex flex-col justify-center items-center rounded-lg h-[120px] shadow-sm bg-white flex-1">
          <div className="flex flex-row justify-between items-start gap-2.5 pr-3 pl-3 w-full h-20">
            <div className="flex flex-col justify-start items-start gap-4 h-20">
              <div className="flex flex-col justify-start items-start gap-0.5 h-5">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Good
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-0.5 h-11">
                <div className="flex flex-row justify-start items-center gap-9 h-6">
                  <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                    8
                  </div>
                </div>
                <div className="font-inter text-xs whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  80-90% score
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 pt-2 pr-2 pb-2 pl-2 rounded-lg w-10 h-10 bg-orange-500">
              <img
                width="29.4px"
                height="29.4px"
                src="/images/good_performance.png"
                alt="Good icon"
              />
            </div>
          </div>
        </div>

        {/* Under Review Card */}
        <div className="flex flex-col justify-center items-center rounded-lg h-[120px] shadow-sm bg-white flex-1">
          <div className="flex flex-row justify-between items-start gap-2.5 pr-3 pl-3 w-full h-20">
            <div className="flex flex-col justify-start items-start gap-4 h-20">
              <div className="flex flex-col justify-start items-start gap-0.5 h-5">
                <div className="font-inter text-sm whitespace-nowrap text-neutral-900 text-opacity-100 leading-snug tracking-normal font-medium">
                  Under Review
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-0.5 h-11">
                <div className="flex flex-row justify-start items-center gap-9 h-6">
                  <div className="font-inter text-lg whitespace-nowrap text-neutral-900 text-opacity-100 leading-tight font-semibold">
                    0
                  </div>
                </div>
                <div className="font-inter text-xs whitespace-nowrap text-gray-600 text-opacity-100 leading-snug tracking-normal font-normal">
                  Needs Attention
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-2.5 pt-2 pr-2 pb-2 pl-2 rounded-lg w-10 h-10 bg-red-600">
              <img
                width="29.4px"
                height="29.4px"
                src="/images/under_review.png"
                alt="Under review icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}