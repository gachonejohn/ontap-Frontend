import React, { useState } from 'react';
import AttendanceRecords from './AttendanceRecords';
import LeavesRecords from './LeavesRecords';
// import OffboardedRecords from './OffboardedRecords'; 
import { exportToPDF } from '../../utils/exportToPDF';
import { toast } from "react-toastify";
import CreateUpdateButton from '../common/Buttons/CreateUpdateButton';
import { FiDownload, FiRefreshCcw } from 'react-icons/fi';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const RecordsPage = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [resetTrigger, setResetTrigger] = useState(0);


   // Temporary local store for fetched data from each tab
  const [tableData, setTableData] = useState({
    attendance: { results: [], filters: {} },
    leaves: { results: [], filters: {} },
  });

  const tabs = [
    { id: 'attendance', label: 'Attendance Records' },
    { id: 'leaves', label: 'Leave Records' },
    { id: 'offboarded', label: 'Offboarded Employees' },
  ];

  // Clear filters when tab changes
  useEffect(() => {
    navigate({ search: '' }, { replace: true });
    
    setResetTrigger(prev => prev + 1);
    
    setTableData(prev => ({
      ...prev,
      [activeTab]: { results: [], filters: {} }
    }));
  }, [activeTab, navigate]);

  const handleResetFilters = () => {
    navigate({ search: '' }, { replace: true });
    
    setResetTrigger(prev => prev + 1);
    
    setTableData(prev => ({
      ...prev,
      [activeTab]: { results: [], filters: {} }
    }));

    toast.info("Filters reset successfully");
  };

  const handleExport = () => {
    const current = tableData[activeTab];
    if (!current || !current.results?.length) {
    toast.error("No data available to export.");
      return;
    }

    // Convert data depending on tab
    let title = '';
    let columns = [];
    let rows = [];

    if (activeTab === 'attendance') {
      title = 'Attendance Records';
      columns = ['Employee', 'Department', 'Date', 'Clock In', 'Clock Out', 'Hours', 'Status'];
      rows = current.results.map((r) => [
        `${r.employee.user.first_name} ${r.employee.user.last_name}`,
        r.employee.department?.name ?? '',
        r.date ?? '',
        r.clock_in ?? '',
        r.clock_out ?? '',
        r.hours_worked ?? '',
        r.status ?? '',
      ]);
    } else if (activeTab === 'leaves') {
      title = 'Leave Records';
      columns = ['Employee', 'Department', 'Type', 'Start', 'End', 'Days', 'Status'];
      rows = current.results.map((r) => [
        `${r.user.first_name} ${r.user.last_name}`,
        r.department ?? '',
        r.leave_type_name ?? '',
        r.start_date ?? '',
        r.end_date ?? '',
        r.days ?? '',
        r.status ?? '',
      ]);
    }

    exportToPDF({
      title,
      columns,
      rows,
      filename: `${activeTab}_records.pdf`,
      filters: current.filters,
    });
  };

  const renderActiveTab = () => {
    switch (activeTab) {
        case 'attendance':
        return (
          <AttendanceRecords
            key={`attendance-${resetTrigger}`}
            onDataUpdate={(results, filters) =>
              setTableData((prev) => ({ ...prev, attendance: { results, filters } }))
            }
          />
        );
      case 'leaves':
        return (
          <LeavesRecords
            key={`leaves-${resetTrigger}`}
            onDataUpdate={(results, filters) =>
              setTableData((prev) => ({ ...prev, leaves: { results, filters } }))
            }
          />
        );
      default:
        return (
          <div className="bg-white rounded-xl shadow-md border p-6 text-gray-600 text-sm">
            Offboarded employee records coming soon...
          </div>
        );
    }
    // {
    //   case 'attendance':
    //     return <AttendanceRecords />;
    //   case 'leaves':
    //     return <LeavesRecords />;
    //   case 'offboarded':
    //     // return <OffboardedRecords />;
    //     return (
    //       <div className="bg-white rounded-xl shadow-md border p-6 text-gray-600 text-sm">
    //         Offboarded employee records coming soon...
    //       </div>
    //     );
    //   default:
    //     return null;
    // }
  };
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Record Management</h1>
          <p className="text-sm text-gray-500">
            View, filter, and export employee records
          </p>
        </div>

        <div className="flex gap-2">
          {/* <button className="border border-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-100">
            Reset Filters
          </button> */}
           <CreateUpdateButton
            onClick={handleResetFilters}
            title="Reset Filters"
            label="Reset Filters"
            icon={<FiRefreshCcw className="w-4 h-4" />}
            className=" text-primary-500 px-4 py-2
            hover:bg-gray-100 focus:ring-primary-500 rounded-md border border-primary-500  transition-all duration-200 shadow-sm hover:shadow-md  focus:ring-offset-1"
        />
          <CreateUpdateButton
            onClick={handleExport}
            title="Export Records"
            label="Export Records"
            icon={<FiDownload className="w-4 h-4" />}
            className="bg-primary text-white px-4 py-2
            hover:bg-primary-600 focus:ring-primary-500 rounded-md  transition-all duration-200 shadow-sm hover:shadow-md  focus:ring-offset-1"
        />
        </div>
      </div>

      <div className="flex gap-1 bg-gray-200 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>{renderActiveTab()}</div>
    </div>
  );
};

export default RecordsPage;
