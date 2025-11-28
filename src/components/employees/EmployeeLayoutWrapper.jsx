import { useLocation } from 'react-router-dom';
import { useGetEmployeesMetricisQuery } from '@store/services/employees/employeesService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useMemo } from 'react';
import { FiUmbrella, FiUserCheck } from 'react-icons/fi';
import { MdApartment } from "react-icons/md";
import { FaDotCircle } from "react-icons/fa";
import StatCard from '@components/common/statsCard';
import ContentSpinner from '@components/common/spinners/dataLoadingSpinner';
const EmployeeLayoutWrapper = ({ children, customTitle, customDescription, customActions }) => {
  const location = useLocation();
  const isEmployeeDetails =
    location.pathname.includes('/employees/') && location.pathname !== '/dashboard/employees';

 
  const { data: metrics, isLoading, error } = useGetEmployeesMetricisQuery(
    {}, 
    { refetchOnMountOrArgChange: true }
  );

 
  const defaultContent = {
    title: isEmployeeDetails ? 'Employee Management' : 'Employee Management',
    description: isEmployeeDetails
      ? "Manage your organization's workforce."
      : "Manage your organization's workforce.",
  };
    const cards = metrics
      ? [
          {
            title: 'Total Employees',
            value: metrics.total_employees ?? 0,
            icon: FiUserCheck,
            iconColor: 'text-white',
            iconBgColor: 'bg-blue-600',
          },
          {
            title: 'Active',
            value: metrics.active_employees ?? 0,
            icon: FaDotCircle,
            iconColor: 'text-green-500',
            iconBgColor: 'bg-green-100',
          },
           {
            title: 'On Leave',
            value: metrics.on_leave ?? 0,
            icon: FiUmbrella,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
          },
          {
            title: 'Departments',
            value: metrics.total_departments ?? 0,
            icon: MdApartment,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
          },
         
        ]
      : [];

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
        {customActions && <div>{customActions}</div>}
      </div>

     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
             {isLoading ? (
               <div className="col-span-4 text-center text-gray-500 py-6">
                 <ContentSpinner />
               </div>
             ) : error ? (
               <div className="col-span-4 text-center text-red-500 py-6">Error loading metrics.</div>
             ) : (
               cards.map((card, i) => <StatCard key={i} {...card} />)
             )}
           </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default EmployeeLayoutWrapper;
