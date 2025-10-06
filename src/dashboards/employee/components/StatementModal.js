import React from "react";

const StatementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Container */}
      <div className="flex flex-col rounded-2xl w-[560px] max-h-[630px] bg-white p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg text-neutral-900 font-semibold">
            Payslip - Aug 1 - Aug 31, 2025
          </div>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row justify-start items-center gap-4 mb-4">
          <button className="flex flex-row items-center gap-1 py-1 px-5 rounded-lg border border-neutral-200 h-9 hover:bg-gray-50 transition-colors">
            <img width="14" height="11" src="/images/email1.png" alt="Email icon" />
            <span className="text-xs text-gray-800 font-medium">Email</span>
          </button>
          <button className="flex flex-row items-center gap-1 py-1 px-5 rounded-lg border border-neutral-200 h-9 hover:bg-gray-50 transition-colors">
            <img width="13" height="13" src="/images/download2.png" alt="Download icon" />
            <span className="text-xs text-gray-800 font-medium">Download</span>
          </button>
        </div>

        {/* Employee Info */}
        <div className="flex flex-col gap-2 mb-4 p-4 rounded-lg border border-neutral-200 bg-white">
          <div className="text-base text-neutral-900 font-medium">Employee Information</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Employee Name</div>
              <div className="text-sm text-neutral-900 font-medium">Victor Emefo</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Employee ID</div>
              <div className="text-sm text-neutral-900 font-medium">EMP0035</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Position</div>
              <div className="text-sm text-neutral-900 font-medium">Product Designer</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Department</div>
              <div className="text-sm text-neutral-900 font-medium">Design Team</div>
            </div>
          </div>
        </div>

        {/* Pay Period Info */}
        <div className="flex flex-col gap-2 mb-4 p-4 rounded-lg border border-neutral-200 bg-white">
          <div className="text-base text-neutral-900 font-medium">Pay Period Information</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Pay Period</div>
              <div className="text-sm text-neutral-900 font-medium">Aug 1 - Aug 31, 2025</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Issue Date</div>
              <div className="text-sm text-neutral-900 font-medium">Aug 31, 2025</div>
            </div>
          </div>
        </div>

        {/* Earnings and Deductions */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          {/* Earnings */}
          <div className="flex flex-col justify-start gap-2 p-4 rounded-lg border border-neutral-200 bg-white w-full md:w-[260px]">
            <div className="text-base text-green-700 font-medium">Earnings</div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm text-gray-600"><span>Basic Salary</span><span className="text-neutral-900">Ksh. 20,000.00</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Overtime</span><span className="text-neutral-900">Ksh. 400.00</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Allowances</span><span className="text-neutral-900">Ksh. 0.00</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Bonus</span><span className="text-neutral-900">Ksh. 0.00</span></div>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-200 text-sm text-green-700 font-medium">
              <span>Total Earnings</span>
              <span>Ksh. 20,400.00</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="flex flex-col justify-start gap-2 p-4 rounded-lg border border-neutral-200 bg-white w-full md:w-[260px]">
            <div className="text-base text-red-700 font-medium">Deductions</div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-sm text-gray-600"><span>Income Tax</span><span className="text-red-600">Ksh. 150</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Social Security</span><span className="text-red-600">Ksh. 150</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Health Insurance</span><span className="text-red-600">Ksh. 150</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Retirement</span><span className="text-red-600">Ksh. 150</span></div>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-200 text-sm text-red-700 font-medium">
              <span>Total Deductions</span>
              <span>Ksh. 600</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="flex justify-center items-center p-4 rounded-lg border border-green-200 bg-green-50">
          <div className="flex flex-col items-center gap-1">
            <div className="text-base text-green-600 font-medium">NET PAY</div>
            <div className="text-lg text-green-700 font-semibold">Ksh. 20,140.00</div>
            <div className="text-sm text-green-600 font-medium">Amount deposited to your account</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementModal;
