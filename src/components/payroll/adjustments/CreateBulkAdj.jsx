import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { adjustmentTypesOptions } from '@constants/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBulkAdjustmentSchema } from '@schemas/payroll.Schema';
import {
  useCreateBulkAdjustmentMutation,
  useGetPayrollPeriodsQuery,
} from '@store/services/payroll/Payroll.Service';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';

export const CreateCompanyAdjForm = ({ onClose, refetchData }) => {
  const [createBulkAdjustment, { isLoading: isCreating }] = useCreateBulkAdjustmentMutation();

  const { data: payrollPeriodsData } = useGetPayrollPeriodsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(createBulkAdjustmentSchema),
  });

   const handlePayrollPeriodChange = (selected) => {
    if (selected && selected.value) {
      const item_id = Number(selected.value);
      setValue('period', item_id);
    }
  };

  const handleAdjustmenChange = (selected) => {
    if (selected && selected.value) {
      setValue('adjustment_type', selected.value);
    } else {
      setValue('adjustment_type', '');
    }
  };
  const handleInternalClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (formData) => {
    try {
      const result = await createBulkAdjustment(formData).unwrap();
        const created = result?.summary?.created;
        const skipped = result?.summary?.skipped_duplicates;
        const ids = result?.created_ids;
        toast.success(
  `Bulk adjustment complete: ${result.summary.created} created, ${result.summary.skipped_duplicates} skipped.`
);

      handleInternalClose();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error creating adjustments payroll.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Payroll period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="">
          <label className="block text-sm font-medium mb-2">Payroll Period</label>
          <Select
            options={payrollPeriodsData?.map((item) => ({
              value: item.id,
              label: `${item.period_label}`,
            }))}
            menuPortalTarget={document.body}
            menuPlacement="auto"
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                minHeight: '40px',
                borderColor: '#d1d5db',
                boxShadow: 'none',
                '&:hover': { borderColor: '#9ca3af' },
                '&:focus-within': { borderColor: '#9ca3af', boxShadow: 'none' },
                backgroundColor: '#F8FAFC',
              }),
            }}
            onChange={handlePayrollPeriodChange}
          />
          {errors.period && <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Adjustment Type <span className="text-red-500">*</span>
          </label>
          <Select
            options={adjustmentTypesOptions}
            onChange={handleAdjustmenChange}
            placeholder="Select type"
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
          {errors.adjustment_type && (
            <p className="text-red-500 text-[12px] mt-1">{errors.adjustment_type.message}</p>
          )}
        </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Reason For Adjustment<span className="text-red-500">*</span>
        </label>
        <textarea
          rows={4}
          cols={5}
          placeholder="Reason For Adjustment"
          {...register('reason')}
          className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
        />
        {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Amount<span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="0.0"
          {...register('amount')}
          className="w-full py-2 px-4 rounded-md border
           border-gray-400 focus:outline-none focus:border-primary[#1E9FF2] focus:bg-white placeholder:text-sm"
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>
      </div>

      {/* Buttons */}
      <div className="sticky bottom-0 bg-white z-40 flex gap-4 md:justify-between items-center pt-3">
        <button
          type="button"
          onClick={handleInternalClose}
          className="border border-red-500 bg-white shadow-sm text-red-500 py-2 text-sm px-4 rounded-lg w-full min-w-[150px] md:w-auto hover:bg-red-500 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isCreating}
          className="bg-primary text-white py-2 hover:bg-primary-700 text-sm px-3 md:px-4 rounded-md w-full min-w-[150px] md:w-auto"
        >
          {isSubmitting || isCreating ? (
            <span className="flex items-center">
              <SubmitSpinner />
              <span>Creating...</span>
            </span>
          ) : (
            <span>Create</span>
          )}
        </button>
      </div>
    </form>
  );
};
