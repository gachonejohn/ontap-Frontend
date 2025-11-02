import { FiBriefcase } from 'react-icons/fi';
import { EditWorkInfo } from './EditWorkInfo';

export const WorkDetails = ({ data: employeeData, refetch }) => {
  // Check if any work info exists
  const hasWorkInfo =
    employeeData?.position ||
    employeeData?.department ||
    employeeData?.role ||
    employeeData?.status;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          <FiBriefcase className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Work Info</h3>
        </div>
        <div>
          <EditWorkInfo refetchData={refetch} data={employeeData} />
        </div>
      </div>

      {hasWorkInfo ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job Title</label>
              <p className="text-gray-900">{employeeData?.position?.title || 'Not specified'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Department</label>
              <p className="text-gray-900">{employeeData?.department?.name || 'Not specified'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <p className="text-gray-900">{employeeData?.role?.name || 'Not specified'}</p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Status</label>
              <p className="text-gray-900">{employeeData?.status || 'Not specified'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No work info available</p>
      )}
    </div>
  );
};
