import SubmitSpinner from '@components/common/spinners/submitSpinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { singlePayrollSchema } from '@schemas/payroll.Schema';
import {
  useGenerateSinglePayrollMutation,
  useGetPayrollPeriodsQuery,
} from '@store/services/payroll/Payroll.Service';
import { getApiErrorMessage } from '@utils/errorHandler';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast } from 'react-toastify';


export const GenerateSinglePayrollForm = ({
  onClose,
  refetchData,
}) => {
  const [generateSinglePayroll, { isLoading: isCreating }] = useGenerateSinglePayrollMutation();

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
    resolver: zodResolver(singlePayrollSchema),
  });

  const handlePayrollPeriodChange = (selected) => {
    if (selected) {
      const item_id = Number(selected.value);
      setValue('period', item_id);
    }
  };

  const handleInternalClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (formData) => {
    try {
      await generateSinglePayroll(formData).unwrap();
      toast.success('Payroll generated successfully!');
      handleInternalClose();
      refetchData();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Error generating payroll.');
      toast.error(message);
    } finally {
      refetchData();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Employee no */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Employee No<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter a valid employee no"
          {...register('employee_no')}
          className="w-full py-2 px-4 rounded-md border
           border-gray-400 focus:outline-none focus:border-primary[#1E9FF2] focus:bg-white placeholder:text-sm"
        />
        {errors.employee_no && (
          <p className="text-red-500 text-sm">{errors.employee_no.message}</p>
        )}
      </div>

      {/* Payroll period */}
      <div className="md:col-span-2">
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
        {errors.period && (
          <p className="text-red-500 text-sm mt-1">{errors.period.message}</p>
        )}
      </div>

      {/* Buttons (use parent onClose) */}
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
              <span>Generating...</span>
            </span>
          ) : (
            <span>Generate</span>
          )}
        </button>
      </div>
    </form>
  );
};