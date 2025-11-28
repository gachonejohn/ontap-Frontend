export const DocumentsStep = ({ register, errors }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documents & Emergency Contact</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Required Documents</h3>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('hasIdentityProof')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Identity Proof (Passport/ID Card) *</span>
            </label>
            {errors.hasIdentityProof && (
              <p className="ml-7 text-sm text-red-600">{errors.hasIdentityProof.message}</p>
            )}

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('hasAddressProof')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Address Proof *</span>
            </label>
            {errors.hasAddressProof && (
              <p className="ml-7 text-sm text-red-600">{errors.hasAddressProof.message}</p>
            )}

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('hasEducationCertificates')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Education Certificates *</span>
            </label>
            {errors.hasEducationCertificates && (
              <p className="ml-7 text-sm text-red-600">{errors.hasEducationCertificates.message}</p>
            )}

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register('hasPreviousEmployment')}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Previous Employment Records (if applicable)</span>
            </label>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Emergency Contact</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                {...register('emergencyContactName')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter emergency contact name"
              />
              {errors.emergencyContactName && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                {...register('emergencyContactPhone')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
              {errors.emergencyContactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relationship *
              </label>
              <input
                {...register('emergencyContactRelation')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Spouse, Parent, Sibling"
              />
              {errors.emergencyContactRelation && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelation.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};