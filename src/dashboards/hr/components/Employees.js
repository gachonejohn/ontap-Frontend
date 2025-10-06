// pages/Employees.js
import React, { useState, useEffect } from 'react';
import NewEmployeeModal from './NewEmployeeModal';
import { useGetEmployeesQuery } from  '../../../store/services/employees/employeesService';

export default function Employees() {
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 4;
const {data, isLoading, error, refetch} = useGetEmployeesQuery({},
  { refetchOnMountOrArgChange: true,}
)
console.log("data",data)
  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
   
      
      // Handle different response formats
      let employeesData = [];
      
      
      console.log('Employees data:', employeesData); // Debug log
      setEmployees(employeesData);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to load employees. Please try again.');
      setEmployees([]); // Ensure employees is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeAdded = (newEmployee) => {
    // Add the new employee to the beginning of the list
    setEmployees(prev => [newEmployee, ...prev]);
  };

  // Filter employees based on search term - with safe array check
  const filteredEmployees = Array.isArray(employees) ? employees.filter(emp =>
    emp?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Safe counting functions
  const getActiveCount = () => {
    return Array.isArray(employees) ? employees.filter(emp => emp?.status === 'active').length : 0;
  };

  const getOnLeaveCount = () => {
    return Array.isArray(employees) ? employees.filter(emp => emp?.status === 'on_leave').length : 0;
  };

  const getDepartmentCount = () => {
    if (!Array.isArray(employees)) return 0;
    const departments = employees.map(emp => emp.department?.name).filter(Boolean);
    return new Set(departments).size;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            Employee Management
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your organization's workforce.
          </div>
        </div>

        {/* Add Employee Button */}
        <button 
          onClick={() => setShowNewEmployeeModal(true)}
          className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
        >
          <img src="/images/add_employees.png" alt="Add Employee" className="h-5 w-5" />
          Add Employee
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Employees Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Total Employees</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {Array.isArray(employees) ? employees.length : 0}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/total_employees.png"
                alt="Total Employees icon"
              />
            </div>
          </div>
        </div>

        {/* Active Employees Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Active</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {getActiveCount()}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/active_dot.png"
                alt="Active Employees icon"
              />
            </div>
          </div>
        </div>

        {/* On Leave Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">On Leave</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {getOnLeaveCount()}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-orange-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/onleave_dot.png"
                alt="On Leave icon"
              />
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Departments</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {getDepartmentCount()}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/departments_dot.png"
                alt="Departments icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img
              width="16.5px"
              height="16.5px"
              src="/images/search.png"
              alt="Search icon"
            />
          </div>
          <input
            type="text"
            placeholder="Search employees"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-row justify-center items-center gap-2">
          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[150px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex flex-row items-center gap-0.9">
              <div className="flex justify-center items-center h-5">
                <img
                  width="16.3px"
                  height="16.3px"
                  src="/images/filter.png"
                  alt="Filter icon"
                />
              </div>
              <div className="text-xs text-neutral-900 font-semibold">
                All Departments
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img
                width="9.5px"
                height="5.1px"
                src="/images/dropdown.png"
                alt="Dropdown icon"
              />
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[120px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="text-xs text-neutral-900 font-semibold">
              All Status
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img
                width="9.5px"
                height="5.1px"
                src="/images/dropdown.png"
                alt="Dropdown icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="flex flex-col justify-start items-center rounded-xl shadow-sm bg-white overflow-hidden w-full">
        {/* Table Header */}
        <div className="flex flex-row justify-between items-center p-4 w-full h-14 border-b border-neutral-200">
          <div className="text-lg font-medium text-neutral-900 leading-tight whitespace-nowrap min-w-[225px]">
            Employee Management
          </div>
        </div>

        {/* Table Content */}
        <div className="flex flex-col w-full">
          {/* Column Headers */}
          <div className="flex flex-row w-full bg-slate-50 border-b border-neutral-200">
            <div className="flex-1 min-w-[400px] p-4 text-xs font-medium text-gray-500">Employee</div>
            <div className="w-[200px] p-4 text-xs font-medium text-gray-500 text-center">Role</div>
            <div className="w-[200px] p-4 text-xs font-medium text-gray-500 text-center">Department</div>
            <div className="w-[152px] p-4 text-xs font-medium text-gray-500 text-center">Status</div>
            <div className="w-[152px] p-4 text-xs font-medium text-gray-500 text-center">Actions</div>
          </div>

          {/* {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-gray-500">Loading employees...</div>
            </div>
          ) : currentEmployees.length === 0 ? (
            <div className="flex justify-center items-center p-8">
              <div className="text-gray-500">No employees found</div>
            </div>
          ) : (
            currentEmployees.map((emp, index) => (
              <div key={emp.id || index} className="flex flex-row w-full border-b border-neutral-200 h-[100px]">
             
                <div className="flex-1 flex items-center gap-3 p-4 min-w-[400px]">
                  <img
                    src={emp.profile_picture || "/images/profilepic.png"}
                    alt={emp.first_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-gray-800 whitespace-nowrap">
                      {emp.first_name} {emp.last_name}
                    </div>
                    <div className="text-sm text-gray-600 whitespace-nowrap">{emp.email}</div>
                  </div>
                </div>

                <div className="w-[200px] flex items-center justify-center text-sm text-gray-800">
                  {emp.role?.name || emp.position?.title || 'N/A'}
                </div>

            
                <div className="w-[200px] flex items-center justify-center text-sm text-gray-800">
                  {emp.department?.name || 'N/A'}
                </div>

                <div className="w-[152px] flex items-center justify-center">
                  <div className={`h-6 px-3 rounded-2xl flex items-center justify-center ${
                    emp.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <div className={`text-[10px] font-medium leading-snug ${
                      emp.status === 'active' ? 'text-green-800' : 'text-neutral-900'
                    }`}>
                      {emp.status ? emp.status.replace('_', ' ').toUpperCase() : 'N/A'}
                    </div>
                  </div>
                </div>

                
                <div className="w-[152px] flex items-center justify-center">
                  <button className="text-gray-600 text-xl">⋯</button>
                </div>
              </div>
            ))
          )} */}
        </div>
{/* 
        {filteredEmployees.length > 0 && (
          <div className="flex flex-row justify-between items-center p-4 w-full h-[68px]">
            <div className="text-sm text-neutral-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} entries
            </div>

            <div className="flex items-center gap-2">
            
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex justify-center items-center h-8 px-3 rounded-lg border border-neutral-200 ${
                  currentPage === 1 ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-semibold text-neutral-900">Previous</span>
              </button>

          
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`flex justify-center items-center w-7 h-8 rounded-lg border border-neutral-200 text-xs font-semibold ${
                      currentPage === pageNum ? 'bg-teal-500 text-white' : 'bg-white text-neutral-900'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className={`flex justify-center items-center h-8 px-3 rounded-lg border border-neutral-200 ${
                  currentPage >= totalPages ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-xs font-semibold text-neutral-900">Next</span>
              </button>
            </div>
          </div>
        )} */}
      </div>

      {/* New Employee Modal */}
      <NewEmployeeModal
        isOpen={showNewEmployeeModal}
        onClose={() => setShowNewEmployeeModal(false)}
        onEmployeeAdded={handleEmployeeAdded}
      />
    </div>
  );
}