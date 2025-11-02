import { FiUser } from 'react-icons/fi';
import { EditPersonalInfo } from './EditPersonalInfo';
export const PersonalDetails = ({ data: employeeData, refetch }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 mb-4">
          <FiUser className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
        </div>
        <div>
          <EditPersonalInfo data={employeeData} refetchData={refetch} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First Name</label>
          <p className="text-gray-900">{employeeData.user?.first_name}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Last Name</label>
          <p className="text-gray-900">{employeeData.user?.last_name}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Gender</label>
          <p className="text-gray-900">{employeeData?.user?.gender ?? 'Not specified'}</p>
        </div>

        {/* <div>
                    <label className="block text-sm text-gray-600 mb-1">Work ID</label>
                    <p className="text-gray-900">{employeeData.work_id || 'Not specified'}</p>
                  </div> */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
          <p className="text-gray-900">{employeeData?.user?.date_of_birth ?? 'Not specified'}</p>
        </div>
        {/* <div>
                    <label className="block text-sm text-gray-600 mb-1">Bank Name</label>
                    <p className="text-gray-900">{employeeData.bank_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Bank Account Number</label>
                    <p className="text-gray-900">{employeeData.bank_account_number || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Routing Number</label>
                    <p className="text-gray-900">{employeeData.routing_number || 'Not specified'}</p>
                  </div> */}
      </div>
    </div>
  );
};
