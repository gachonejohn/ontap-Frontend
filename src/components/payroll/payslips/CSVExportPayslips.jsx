import { Parser } from "@json2csv/plainjs";
import { formatCurrencyWithSymbol } from "@utils/formatCurrency";
import { useDispatch } from "react-redux";

import { useState } from "react";
import SubmitSpinner from "@components/common/spinners/submitSpinner";
import { FiDownload } from "react-icons/fi";
import { apiSlice } from "@store/api/apiSlice";

const CSVExportPayslips = ({ departmentId, filters, filename = "payslips.csv" }) => {
  const dispatch = useDispatch();
  const [isExporting, setIsExporting] = useState(false);
    console.log("departmentId",departmentId)
    console.log("filters",filters)
    console.log("",filename)
  const handleExport = async () => {
    if (!departmentId) return;

    try {
      setIsExporting(true); 

      let allPayslips = [];
      let page = 1;
      const pageSize = 100;
      let totalCount = 0;

      do {
        const result = await dispatch(
          apiSlice.endpoints.getDepartmentPaySlips.initiate({
            id:departmentId,
            page,
            page_size: pageSize,
            status: filters.status || "",
            period: filters.period || "",
            search: filters.search || ""
          })
        ).unwrap();

        if (result.results?.length) {
          allPayslips = [...allPayslips, ...result.results];
        }

        totalCount = result.count ?? 0;
        page++;
      } while (allPayslips.length < totalCount);

      if (allPayslips.length === 0) {
        setIsExporting(false);
        return;
      }

      // Collect allowance names
      const allowanceNames = Array.from(
        new Set(allPayslips.flatMap(item => item.allowances?.map(a => a.allowance_name) || []))
      );

      // Flatten data
      const flatData = allPayslips.map(item => {
        const base = {
          "Employee Name": item.payroll_record.employee.full_name,
          "Employee No": item.payroll_record.employee.employee_no,
          "Email": item.payroll_record.employee.email,
          "Department": item.payroll_record.employee.department,
          "Period": item.payroll_record.period.period_label,
          "Gross Salary": formatCurrencyWithSymbol(item.gross_salary),
          "NSSF Employee": formatCurrencyWithSymbol(item.nssf_employee),
          "NSSF Employer": formatCurrencyWithSymbol(item.nssf_employer),
          "SHIF": formatCurrencyWithSymbol(item.shif),
          "Housing Levy": formatCurrencyWithSymbol(item.housing_levy),
          "Taxable Income": formatCurrencyWithSymbol(item.taxable_income),
          "PAYE After Relief": formatCurrencyWithSymbol(item.paye_after_relief),
          "Total Deductions": formatCurrencyWithSymbol(item.total_deductions),
          "Net Salary": formatCurrencyWithSymbol(item.net_salary),
          "Overtime": formatCurrencyWithSymbol(item.overtime),
          "Status": item.status,
        };

        allowanceNames.forEach(name => {
          const allowance = item.allowances?.find(a => a.allowance_name === name);
          base[name] = allowance ? formatCurrencyWithSymbol(allowance.amount) : formatCurrencyWithSymbol(0);
        });

        return base;
      });

      // TOTAL NET ROW
      const totalNet = allPayslips.reduce((sum, item) => sum + Number(item.net_salary || 0), 0);

      const totalRow = {
        "Employee Name": "TOTAL NET",
        "Employee No": "",
        "Email": "",
        "Department": "",
        "Period": "",
        "Gross Salary": "",
        "NSSF Employee": "",
        "NSSF Employer": "",
        "SHIF": "",
        "Housing Levy": "",
        "Taxable Income": "",
        "PAYE After Relief": "",
        "Total Deductions": "",
        "Net Salary": formatCurrencyWithSymbol(totalNet),
        "Overtime": "",
        "Status": "",
      };
      allowanceNames.forEach(name => (totalRow[name] = ""));
      flatData.push(totalRow);

      const fields = [
        "Employee Name",
        "Employee No",
        "Email",
        "Department",
        "Period",
        "Gross Salary",
        "NSSF Employee",
        "NSSF Employer",
        "SHIF",
        "Housing Levy",
        "Taxable Income",
        "PAYE After Relief",
        "Total Deductions",
        "Net Salary",
        "Overtime",
        ...allowanceNames,
        "Status",
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(flatData);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();

    } catch (err) {
      console.error("Failed to export CSV:", err);
    } finally {
      setIsExporting(false); 
    }
  };

  return (
   <button
  onClick={handleExport}
  disabled={isExporting}
  className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap rounded-lg transition-colors text-white
    ${isExporting ? "bg-gray-500 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
>
  {isExporting ? (
    <>
      <SubmitSpinner />
     <span className="text-xs">Preparing CSV…</span>
    </>
  ) : (
    <>
      <FiDownload className="text-sm" />
      <span className="text-xs">Export CSV</span>
    </>
  )}
</button>


  );
};

export default CSVExportPayslips;
