import { useLocation } from "react-router-dom";
import { useGetEmployeesQuery } from "../../store/services/employees/employeesService";
import { useGetDepartmentsQuery } from "@store/services/companies/companiesService";
import { useMemo } from "react";

const EmployeeLayoutWrapper = ({ children, customTitle, customDescription, customActions }) => {
  const location = useLocation();
  const isEmployeeDetails = location.pathname.includes('/employees/') && location.pathname !== '/dashboard/employees';
  
  // Get employee statistics
  const { data: employeesData } = useGetEmployeesQuery(
    { page: 1, page_size: 1000 }, // Get all for stats
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: departmentsData } = useGetDepartmentsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!employeesData) return { total: 0, active: 0, onLeave: 0, departments: 0 };
    
    const employees = employeesData.results || [];
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'ACTIVE').length;
    const onLeave = employees.filter(emp => emp.status === 'ON_LEAVE').length;
    const departments = departmentsData?.length || 0;
    
    return { total, active, onLeave, departments };
  }, [employeesData, departmentsData]);

  // Default content based on page type
  const defaultContent = {
    title: isEmployeeDetails ? "Employee Management" : "Employee Management",
    description: isEmployeeDetails 
      ? "Manage your organization's workforce." 
      : "Manage your organization's workforce."
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            {customTitle || defaultContent.title}
          </div>
          <div className="text-sm text-gray-600 font-normal">
            {customDescription || defaultContent.description}
          </div>
        </div>

        {/* Custom actions or default */}
        {customActions && (
          <div>
            {customActions}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Total Employees Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">
                Total Employees
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {metrics.total}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-md h-8 w-8 bg-blue-600 shadow-sm">
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
                {metrics.active}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-md h-8 w-8 bg-green-100 shadow-sm">
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
                {metrics.onLeave}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-md h-8 w-8 bg-orange-100 shadow-sm">
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
              <div className="text-sm text-gray-600 font-medium">
                Departments
              </div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">
                {metrics.departments}
              </div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-md h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/departments_dot.png"
                alt="Departments icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default EmployeeLayoutWrapper;