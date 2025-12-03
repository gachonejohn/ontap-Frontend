import React, { useState } from 'react';
import { FiX, FiDownload, FiEye } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import { pdf } from '@react-pdf/renderer';
import PayslipPDF from './PayslipPDF';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';
import SubmitSpinner from '@components/common/spinners/submitSpinner';
const PayslipDetailsModal = ({ payslip }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const employee = payslip?.payroll_record?.employee;
  const period = payslip?.payroll_record?.period;

  const baseGrossSalary = parseFloat(payslip?.gross_salary);
  const overtimeAmount = parseFloat(payslip?.overtime || 0);
  const totalGrossSalary = baseGrossSalary + overtimeAmount;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const blob = await pdf(<PayslipPDF payslip={payslip} />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `Payslip_${payslip.id}.pdf`;
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenModal = () => setIsOpen(true);
  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <FiEye className="w-4 h-4" />
      </button>
      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
            aria-hidden="true"
          />

          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform justify-center animate-fadeIn max-h-[90vh]
               overflow-y-auto rounded-2xl bg-white text-left shadow-xl transition-all   
               w-full sm:max-w-c-600 lg:max-w-c-600 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Payroll Breakdown - {employee.full_name}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500">
                    Detailed salary calculation for {period.period_label}
                  </p>
                </div>
                <IoCloseOutline
                  size={24}
                  className="cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={handleCloseModal}
                />
              </div>

              <div className="p-4 md:p-6 space-y-6">
                {/* Employee Information */}
                <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900">
                      Employee Information
                    </h2>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Net Pay</div>
                      <div className="text-base md:text-lg font-bold text-emerald-600">
                        {formatCurrencyWithSymbol(payslip.net_salary)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Employee Name</div>
                      <div className="font-medium text-gray-900">{employee.full_name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Employee ID</div>
                      <div className="font-medium text-gray-900">{employee.employee_no}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Department</div>
                      <div className="font-medium text-gray-900">{employee.department}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Position</div>
                      <div className="font-medium text-gray-900">
                        {employee.position || employee.department}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gross Earnings Breakdown */}
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Gross Earnings Breakdown
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base Salary</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrencyWithSymbol(baseGrossSalary)}
                      </span>
                    </div>

                    {payslip.allowances.map((allowance) => (
                      <div key={allowance.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{allowance.allowance_name}</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrencyWithSymbol(allowance.amount)}
                        </span>
                      </div>
                    ))}

                    {overtimeAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Overtime</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrencyWithSymbol(overtimeAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total Gross Salary</span>
                      <span className="font-semibold text-emerald-600">
                        {formatCurrencyWithSymbol(totalGrossSalary)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statutory Deductions */}
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-orange-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      Statutory Deductions
                    </h3>
                  </div>

                  {/* NSSF */}
                  <div className="mb-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        NSSF (National Social Security Fund)
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatCurrencyWithSymbol(payslip.nssf_employee)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Employee Contribution (6%)</span>
                      <span>{formatCurrencyWithSymbol(payslip.nssf_employee)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200">
                      <span className="font-medium">Total NSSF Remittance</span>
                      <span className="font-medium">
                        {formatCurrencyWithSymbol(parseFloat(payslip.nssf_employee) * 2)}
                      </span>
                    </div>
                  </div>

                  {/* SHIF */}
                  <div className="mb-4 bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        SHIF (Social Health Insurance Fund)
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatCurrencyWithSymbol(payslip.shif)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Employee Contribution (2.75% of gross)</span>
                      <span>{formatCurrencyWithSymbol(payslip.shif)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Calculation: {formatCurrencyWithSymbol(totalGrossSalary)} × 2.75% ={' '}
                      {formatCurrencyWithSymbol(payslip.shif)}
                    </div>
                  </div>

                  {/* AHL */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900 text-sm">
                        AHL (Affordable Housing Levy)
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatCurrencyWithSymbol(payslip.housing_levy)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Employee Contribution (1.5%)</span>
                      <span>{formatCurrencyWithSymbol(payslip.housing_levy)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1 pt-1 border-t border-gray-200">
                      <span className="font-medium">Total AHL Remittance</span>
                      <span className="font-medium">
                        {formatCurrencyWithSymbol(parseFloat(payslip.housing_levy) * 2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-2xl shadow-sm p-4 md:p-6 mt-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Taxable Income Calculation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Gross Salary</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrencyWithSymbol(totalGrossSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Less: NSSF Contribution</span>
                        <span className="font-medium">
                          - {formatCurrencyWithSymbol(payslip.nssf_employee)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-200">
                        <span className="font-bold text-gray-900">Taxable Income</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrencyWithSymbol(payslip.taxable_income)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PAYE Calculation */}
                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 border">
                  <div className="flex items-center gap-2 mb-4">
                    <svg
                      className="w-5 h-5 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      PAYE Tax Calculation (Progressive Rates)
                    </h3>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Total Tax (Before Relief)</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrencyWithSymbol(payslip.paye_before_relief)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm bg-green-100 -mx-4 px-4 py-2">
                      <span className="text-gray-700">Less: Personal Relief</span>
                      <span className="font-medium text-green-700">
                        - {formatCurrencyWithSymbol(Math.abs(parseFloat(payslip.personal_relief)))}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200">
                      <span className="font-bold text-gray-900">Final PAYE (Net Tax)</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrencyWithSymbol(payslip.paye_after_relief)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Pay Summary */}
                <div className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                    Net Pay Calculation
                  </h3>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border-2 border-emerald-200">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Gross Salary</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrencyWithSymbol(totalGrossSalary)}
                        </span>
                      </div>

                      <div className="border-t border-emerald-200 pt-3">
                        <div className="font-medium text-gray-700 mb-2">Total Deductions:</div>
                        <div className="space-y-1.5 text-sm pl-3">
                          <div className="flex justify-between text-gray-600">
                            <span>• PAYE</span>
                            <span>{formatCurrencyWithSymbol(payslip.paye_after_relief)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>• NSSF</span>
                            <span>{formatCurrencyWithSymbol(payslip.nssf_employee)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>• SHIF</span>
                            <span>{formatCurrencyWithSymbol(payslip.shif)}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>• AHL</span>
                            <span>{formatCurrencyWithSymbol(payslip.housing_levy)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-red-600 pt-1 border-t border-emerald-200">
                            <span>Total</span>
                            <span>- {formatCurrencyWithSymbol(payslip.total_deductions)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t-2 border-emerald-300">
                        <span className="text-lg font-bold text-gray-900">NET PAY</span>
                        <span className="text-xl md:text-2xl font-bold text-emerald-600">
                          {formatCurrencyWithSymbol(payslip.net_salary)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                </div>
              </div>
              <div
                className="mt-6 bottom-2 bg-white  sticky
               flex flex-col md:flex-row gap-3 p-4  md:gap-5"
              >
                <button
                  onClick={handleCloseModal}
                  className="w-full md:min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full md:min-w-[150px] px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isDownloading ? (
                    <>
                      <SubmitSpinner />
                      <span className="text-sm">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload />
                      <span className="text-sm">Download</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayslipDetailsModal;
