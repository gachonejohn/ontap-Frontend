import Select from 'react-select';

const PaymentMethodDetails = ({ register, errors, setValue }) => {
  const handleMethodChange = (selected) => {
    if (selected) setValue('payment.method', selected.value);
  };

  const paymentOptions = [
    { value: 'BANK', label: 'Bank Account' },
    { value: 'MOBILE_MONEY', label: 'Mobile Money' },
    { value: 'CASH', label: 'Cash' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h3 className="text-sm font-semibold">Payment Method</h3>

      {/* Method */}
      <div>
        <label className="block text-[12px] font-medium mb-1">
          Method <span className="text-red-500">*</span>
        </label>
        <Select
          options={paymentOptions}
          onChange={handleMethodChange}
          placeholder="Select method"
          menuPortalTarget={document.body}
          menuPlacement="auto"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base) => ({
              ...base,
              minHeight: '36px',
              borderColor: '#d1d5db',
              boxShadow: 'none',
              '&:hover': { borderColor: '#9ca3af' },
              backgroundColor: '#F3F4F6',
            }),
          }}
        />
        {errors.payment?.method && (
          <p className="text-red-500 text-[12px] mt-1">{errors.payment.method.message}</p>
        )}
      </div>

      {/* Details */}
      <div>
        <label className="block text-[12px] font-medium mb-1">Account Number</label>
        <input
          type="text"
          {...register('payment.account_number')}
          className="w-full py-2 px-3 rounded-md border text-[12px] bg-white focus:outline-none focus:border-primary"
          placeholder="e.g. 0123456789"
        />
      </div>

      <div>
        <label className="block text-[12px] font-medium mb-1">Bank Name</label>
        <input
          type="text"
          {...register('payment.bank_name')}
          className="w-full py-2 px-3 rounded-md border text-[12px] bg-white focus:outline-none focus:border-primary"
          placeholder="e.g. Equity Bank"
        />
      </div>

      <div>
        <label className="block text-[12px] font-medium mb-1">Mobile Number</label>
        <input
          type="text"
          {...register('payment.mobile_number')}
          className="w-full py-2 px-3 rounded-md border text-[12px] bg-white focus:outline-none focus:border-primary"
          placeholder="e.g. +254712345678"
        />
      </div>

      <div>
        <label className="block text-[12px] font-medium mb-1">Notes</label>
        <textarea
          {...register('payment.notes')}
          className="w-full py-2 px-3 rounded-md border text-[12px] bg-white focus:outline-none focus:border-primary"
          placeholder="Optional notes"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          {...register('payment.is_primary')}
          className="h-4 w-4 border rounded"
        />
        <label className="text-[12px]">Set as primary payment method</label>
      </div>
    </div>
  );
};

export default PaymentMethodDetails;
