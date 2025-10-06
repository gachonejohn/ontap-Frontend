import React from "react";
import ContentSpinner from "../common/spinners/dataLoadingSpinner";

function renderCellValue(value) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === null || value === undefined) {
    return "-";
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return JSON.stringify(value);
}

const DataTable = ({
  data,
  columns,
  isLoading,
  error,
  rowBgColor,
  columnBgColor,
  columnTextColor,
  stripedRows = false,
  stripeColor = "bg-gray-50",
}) => {
  const getRowBgColor = (index) => {
    if (stripedRows) {
      return index % 2 === 0 ? "bg-white" : stripeColor;
    }
    return rowBgColor || "bg-white";
  };

  return (
    <div className="relative overflow-x-auto md:overflow-x-visible bg-white rounded-md border mt-5">
      <table className="w-full table-auto">
        <thead>
          <tr
            className={`
              text-gray-600 uppercase border-b text-xs font-medium font-inter 
              border-gray-200 leading-normal 
              ${columnBgColor || "bg-white"} 
              ${columnTextColor || "text-gray-600"}
            `}
          >
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-4 py-3 text-xs text-left font-medium"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-inter">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                <ContentSpinner />
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-red-500">
                Error loading data
              </td>
            </tr>
          ) : data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b text-sm font-normal border-gray-200 hover:bg-gray-100 ${getRowBgColor(
                  rowIndex
                )}`}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 py-2 text-left text-sm font-inter font-normal whitespace-normal break-words"
                  >
                    {column.cell ? column.cell(row) : renderCellValue(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center font-inter py-4">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
