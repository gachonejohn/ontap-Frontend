import { apiSlice } from "../../api/apiSlice";

export const payrollApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Overtime Settings Queries
    getOvertimeSettings: builder.query({
      query: () => ({
        url: `payroll/settings/overtime-settings/`,
        method: "GET",
      }),
      providesTags: ["OvertimeSettings"],
    }),

    getOvertimeSettingById: builder.query({
      query: (id) => ({
        url: `payroll/settings/overtime-settings/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "OvertimeSettings", id }],
    }),

    // Overtime Settings Mutations
    createOvertimeSetting: builder.mutation({
      query: (data) => ({
        url: `payroll/settings/overtime-settings/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["OvertimeSettings"],
    }),

    updateOvertimeSetting: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/settings/overtime-settings/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["OvertimeSettings"],
    }),

    patchOvertimeSetting: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/settings/overtime-settings/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["OvertimeSettings"],
    }),

    deleteOvertimeSetting: builder.mutation({
      query: (id) => ({
        url: `payroll/settings/overtime-settings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["OvertimeSettings"],
    }),

    // Payroll Period Settings Queries
    getPayrollPeriodSettings: builder.query({
      query: () => ({
        url: `payroll/settings/payroll-period-settings/`,
        method: "GET",
      }),
      providesTags: ["PayrollPeriodSettings"],
    }),

    getPayrollPeriodSettingById: builder.query({
      query: (id) => ({
        url: `payroll/settings/payroll-period-settings/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PayrollPeriodSettings", id }],
    }),

    // Payroll Period Settings Mutations
    createPayrollPeriodSetting: builder.mutation({
      query: (data) => ({
        url: `payroll/settings/payroll-period-settings/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PayrollPeriodSettings"],
    }),

    updatePayrollPeriodSetting: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/settings/payroll-period-settings/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PayrollPeriodSettings"],
    }),

    patchPayrollPeriodSetting: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/settings/payroll-period-settings/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PayrollPeriodSettings"],
    }),

    deletePayrollPeriodSetting: builder.mutation({
      query: (id) => ({
        url: `payroll/settings/payroll-period-settings/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayrollPeriodSettings"],
    }),

    // Payroll Adjustment Rates Queries
    getPayrollAdjustmentRates: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `payroll/adjustments/rates/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PayrollAdjustmentRates"],
    }),

    getPayrollAdjustmentRateById: builder.query({
      query: (id) => ({
        url: `payroll/adjustments/rates/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PayrollAdjustmentRates", id }],
    }),

    // Payroll Adjustment Rates Mutations
    createPayrollAdjustmentRate: builder.mutation({
      query: (data) => ({
        url: `payroll/adjustments/rates/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PayrollAdjustmentRates"],
    }),

    updatePayrollAdjustmentRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/adjustments/rates/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PayrollAdjustmentRates"],
    }),

    patchPayrollAdjustmentRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/adjustments/rates/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PayrollAdjustmentRates"],
    }),

    deletePayrollAdjustmentRate: builder.mutation({
      query: (id) => ({
        url: `payroll/adjustments/rates/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayrollAdjustmentRates"],
    }),

    getAllowances: builder.query({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        try {
          const allowances = [];
          let currentId = 1;
          let consecutiveFailures = 0;
          const maxConsecutiveFailures = 5; 
          const maxAttempts = 100; 

          while (consecutiveFailures < maxConsecutiveFailures && currentId <= maxAttempts) {
            try {
              const result = await baseQuery({
                url: `payroll/allowance/${currentId}/`,
                method: "GET",
              });

              if (result.data) {
                allowances.push({
                  ...result.data,
                  id: currentId
                });
                consecutiveFailures = 0; 
              } else if (result.error) {
                consecutiveFailures++;
              }
            } catch (error) {
              consecutiveFailures++;
            }

            currentId++;
          }

          allowances.sort((a, b) => (b.id || 0) - (a.id || 0));

          return { 
            data: { 
              results: allowances, 
              count: allowances.length,
              next: null 
            } 
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Allowances"],
    }),

    getAllowanceById: builder.query({
      query: (id) => ({
        url: `payroll/allowance/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Allowances", id }],
    }),

    getDeductions: builder.query({
      query: ({ page, page_size, search, status } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (search) params.append("search", search);
        if (status) params.append("status", status);

        return {
          url: `payroll/deductions/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Deductions"],
    }),

    getAllDeductionsWithIds: builder.query({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        try {
          const deductions = [];
          let currentId = 1;
          let consecutiveFailures = 0;
          const maxConsecutiveFailures = 5; 
          const maxAttempts = 100; 

          while (consecutiveFailures < maxConsecutiveFailures && currentId <= maxAttempts) {
            try {
              const result = await baseQuery({
                url: `payroll/deductions/${currentId}/`,
                method: "GET",
              });

              if (result.data) {
                deductions.push({
                  ...result.data,
                  id: currentId
                });
                consecutiveFailures = 0;
              } else if (result.error) {
                consecutiveFailures++;
              }
            } catch (error) {
              consecutiveFailures++;
            }

            currentId++;
          }

          deductions.sort((a, b) => (b.id || 0) - (a.id || 0));

          return { 
            data: { 
              results: deductions, 
              count: deductions.length,
              next: null 
            } 
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Deductions"],
    }),

    getDeductionById: builder.query({
      query: (id) => ({
        url: `payroll/deductions/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Deductions", id }],
    }),

    getAllStatutoryDeductionsWithIds: builder.query({
      queryFn: async (args, api, extraOptions, baseQuery) => {
        try {
          const statutoryDeductions = [];
          let currentId = 1;
          let consecutiveFailures = 0;
          const maxConsecutiveFailures = 5; 
          const maxAttempts = 100; 

          while (consecutiveFailures < maxConsecutiveFailures && currentId <= maxAttempts) {
            try {
              const result = await baseQuery({
                url: `payroll/statutory-deductions/${currentId}/`,
                method: "GET",
              });

              if (result.data) {
                statutoryDeductions.push({
                  ...result.data,
                  id: currentId
                });
                consecutiveFailures = 0; 
              } else if (result.error) {
                consecutiveFailures++;
              }
            } catch (error) {
              consecutiveFailures++;
            }

            currentId++;
          }

          statutoryDeductions.sort((a, b) => (b.id || 0) - (a.id || 0));

          return { 
            data: { 
              results: statutoryDeductions, 
              count: statutoryDeductions.length,
              next: null 
            } 
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["StatutoryDeductions"],
    }),

    getStatutoryDeductionById: builder.query({
      query: (id) => ({
        url: `payroll/statutory-deductions/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "StatutoryDeductions", id }],
    }),

    getHousingLevyRates: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `paye/housing-levy-rate/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["HousingLevyRates"],
    }),

    getHousingLevyRateById: builder.query({
      query: (id) => ({
        url: `paye/housing-levy-rate/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "HousingLevyRates", id }],
    }),

    getNssfTiers: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `paye/nssf-tier/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["NssfTiers"],
    }),

    getNssfTierById: builder.query({
      query: (id) => ({
        url: `paye/nssf-tier/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "NssfTiers", id }],
    }),

    getTaxBands: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `paye/tax-band/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["TaxBands"],
    }),

    getTaxBandById: builder.query({
      query: (id) => ({
        url: `paye/tax-band/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "TaxBands", id }],
    }),

    getShifRates: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `paye/shif-rate/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["ShifRates"],
    }),

    getShifRateById: builder.query({
      query: (id) => ({
        url: `paye/shif-rate/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ShifRates", id }],
    }),

    getPersonalReliefs: builder.query({
      query: ({ page, page_size } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);

        return {
          url: `paye/personal-relief/list/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PersonalReliefs"],
    }),

    getPersonalReliefById: builder.query({
      query: (id) => ({
        url: `paye/personal-relief/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "PersonalReliefs", id }],
    }),

    getPayroll: builder.query({
      query: ({ page, page_size, search, status, month, year } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (month) params.append("month", month);
        if (year) params.append("year", year);

        return {
          url: `payroll/payroll/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payroll"],
    }),

    getPayrollById: builder.query({
      query: (id) => ({
        url: `payroll/payroll/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payroll", id }],
    }),

    getPayrollSummary: builder.query({
      query: ({ month, year } = {}) => {
        const params = new URLSearchParams();
        if (month) params.append("month", month);
        if (year) params.append("year", year);

        return {
          url: `payroll/payroll-summary/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["PayrollSummary"],
    }),

    getPayslips: builder.query({
      query: ({ page, page_size, search, status, employee_id } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (page_size) params.append("page_size", page_size);
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (employee_id) params.append("employee_id", employee_id);

        return {
          url: `payroll/payslip/?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Payslips"],
    }),

    getPayslipById: builder.query({
      query: (id) => ({
        url: `payroll/payslip/${id}/`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Payslips", id }],
    }),

    createAllowance: builder.mutation({
      query: (data) => ({
        url: `payroll/allowance/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Allowances"],
    }),

    updateAllowance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/allowance/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Allowances"],
    }),

    patchAllowance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/allowance/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Allowances"],
    }),

    deleteAllowance: builder.mutation({
      query: (id) => ({
        url: `payroll/allowance/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Allowances"],
    }),

    createDeduction: builder.mutation({
      query: (data) => ({
        url: `payroll/deductions/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Deductions"],
    }),

    updateDeduction: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/deductions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Deductions"],
    }),

    patchDeduction: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/deductions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Deductions"],
    }),

    deleteDeduction: builder.mutation({
      query: (id) => ({
        url: `payroll/deductions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deductions"],
    }),

    createStatutoryDeduction: builder.mutation({
      query: (data) => ({
        url: `payroll/statutory-deductions/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StatutoryDeductions"],
    }),

    updateStatutoryDeduction: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/statutory-deductions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StatutoryDeductions"],
    }),

    patchStatutoryDeduction: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/statutory-deductions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["StatutoryDeductions"],
    }),

    deleteStatutoryDeduction: builder.mutation({
      query: (id) => ({
        url: `payroll/statutory-deductions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["StatutoryDeductions"],
    }),

    createHousingLevyRate: builder.mutation({
      query: (data) => ({
        url: `paye/housing-levy-rate/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["HousingLevyRates"],
    }),

    updateHousingLevyRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/housing-levy-rate/update/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HousingLevyRates"],
    }),

    patchHousingLevyRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/housing-levy-rate/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["HousingLevyRates"],
    }),

    deleteHousingLevyRate: builder.mutation({
      query: (id) => ({
        url: `paye/housing-levy-rate/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["HousingLevyRates"],
    }),

    createNssfTier: builder.mutation({
      query: (data) => ({
        url: `paye/nssf-tier/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["NssfTiers"],
    }),

    updateNssfTier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/nssf-tier/update/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["NssfTiers"],
    }),

    patchNssfTier: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/nssf-tier/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NssfTiers"],
    }),

    deleteNssfTier: builder.mutation({
      query: (id) => ({
        url: `paye/nssf-tier/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["NssfTiers"],
    }),

    createTaxBand: builder.mutation({
      query: (data) => ({
        url: `paye/tax-band/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["TaxBands"],
    }),

    updateTaxBand: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/tax-band/update/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["TaxBands"],
    }),

    patchTaxBand: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/tax-band/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TaxBands"],
    }),

    deleteTaxBand: builder.mutation({
      query: (id) => ({
        url: `paye/tax-band/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TaxBands"],
    }),

    createShifRate: builder.mutation({
      query: (data) => ({
        url: `paye/shif-rate/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ShifRates"],
    }),

    updateShifRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/shif-rate/update/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["ShifRates"],
    }),

    patchShifRate: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/shif-rate/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ShifRates"],
    }),

    deleteShifRate: builder.mutation({
      query: (id) => ({
        url: `paye/shif-rate/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShifRates"],
    }),

    createPersonalRelief: builder.mutation({
      query: (data) => ({
        url: `paye/personal-relief/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PersonalReliefs"],
    }),

    updatePersonalRelief: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/personal-relief/update/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PersonalReliefs"],
    }),

    patchPersonalRelief: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `paye/personal-relief/update/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["PersonalReliefs"],
    }),

    deletePersonalRelief: builder.mutation({
      query: (id) => ({
        url: `paye/personal-relief/delete/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["PersonalReliefs"],
    }),

    createPayroll: builder.mutation({
      query: (data) => ({
        url: `payroll/payroll/create/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payroll", "Payslips"],
    }),

    updatePayroll: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/payroll/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Payroll", "PayrollSummary"],
    }),

    patchPayroll: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `payroll/payroll/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Payroll", "PayrollSummary"],
    }),

    // approvePayroll: builder.mutation({
    //   query: (id) => ({
    //     url: `payroll/payroll/${id}/approve/`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Payroll", "PayrollSummary", "Payslips"],
    // }),

    // processPayroll: builder.mutation({
    //   query: (id) => ({
    //     url: `payroll/payroll/${id}/process/`,
    //     method: "PATCH",
    //   }),
    //   invalidatesTags: ["Payroll", "PayrollSummary", "Payslips"],
    // }),

    rejectPayroll: builder.mutation({
      query: (id) => ({
        url: `payroll/payroll/${id}/reject/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payroll", "PayrollSummary"],
    }),

    deletePayroll: builder.mutation({
      query: (id) => ({
        url: `payroll/payroll/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payroll", "PayrollSummary", "Payslips"],
    }),

    generatePayslips: builder.mutation({
      query: (payrollId) => ({
        url: `payroll/payslip/generate/`,
        method: "POST",
        body: { payroll_id: payrollId },
      }),
      invalidatesTags: ["Payslips"],
    }),

    sendPayslip: builder.mutation({
      query: (id) => ({
        url: `payroll/payslip/${id}/send/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Payslips"],
    }),

    downloadPayslip: builder.mutation({
      query: (id) => ({
        url: `payroll/payslip/${id}/download/`,
        method: "GET",
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `payslip_${id}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      invalidatesTags: ["Payslips"],
    }),

    exportPayslips: builder.mutation({
      query: (payslipIds) => ({
        url: `payroll/payslip/export/`,
        method: "POST",
        body: { payslip_ids: payslipIds },
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `payslips_${Date.now()}.zip`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(url);
          return { success: true };
        },
      }),
      invalidatesTags: ["Payslips"],
    }),
  }),
});

export const {
  // Overtime Settings Queries
  useGetOvertimeSettingsQuery,
  useGetOvertimeSettingByIdQuery,

  // Overtime Settings Mutations
  useCreateOvertimeSettingMutation,
  useUpdateOvertimeSettingMutation,
  usePatchOvertimeSettingMutation,
  useDeleteOvertimeSettingMutation,

  // Payroll Period Settings Queries
  useGetPayrollPeriodSettingsQuery,
  useGetPayrollPeriodSettingByIdQuery,

  // Payroll Period Settings Mutations
  useCreatePayrollPeriodSettingMutation,
  useUpdatePayrollPeriodSettingMutation,
  usePatchPayrollPeriodSettingMutation,
  useDeletePayrollPeriodSettingMutation,

  // Payroll Adjustment Rates Queries
  useGetPayrollAdjustmentRatesQuery,
  useGetPayrollAdjustmentRateByIdQuery,

  // Payroll Adjustment Rates Mutations
  useCreatePayrollAdjustmentRateMutation,
  useUpdatePayrollAdjustmentRateMutation,
  usePatchPayrollAdjustmentRateMutation,
  useDeletePayrollAdjustmentRateMutation,

  // Allowance Queries
  useGetAllowancesQuery,
  useGetAllowanceByIdQuery,

  // Deduction Queries
  useGetDeductionsQuery,
  useGetAllDeductionsWithIdsQuery,
  useGetDeductionByIdQuery,

  // Statutory Deduction Queries
  useGetAllStatutoryDeductionsWithIdsQuery,
  useGetStatutoryDeductionByIdQuery,

  // Housing Levy Rate Queries
  useGetHousingLevyRatesQuery,
  useGetHousingLevyRateByIdQuery,

  // NSSF Tier Queries
  useGetNssfTiersQuery,
  useGetNssfTierByIdQuery,

  // Tax Band Queries
  useGetTaxBandsQuery,
  useGetTaxBandByIdQuery,

  // SHIF Rate Queries
  useGetShifRatesQuery,
  useGetShifRateByIdQuery,

  // Personal Relief Queries
  useGetPersonalReliefsQuery,
  useGetPersonalReliefByIdQuery,

  // Payroll Queries
  useGetPayrollQuery,
  useGetPayrollByIdQuery,
  useGetPayrollSummaryQuery,

  // Payslip Queries
  useGetPayslipsQuery,
  useGetPayslipByIdQuery,

  // Allowance Mutations
  useCreateAllowanceMutation,
  useUpdateAllowanceMutation,
  usePatchAllowanceMutation,
  useDeleteAllowanceMutation,

  // Deduction Mutations
  useCreateDeductionMutation,
  useUpdateDeductionMutation,
  usePatchDeductionMutation,
  useDeleteDeductionMutation,

  // Statutory Deduction Mutations
  useCreateStatutoryDeductionMutation,
  useUpdateStatutoryDeductionMutation,
  usePatchStatutoryDeductionMutation,
  useDeleteStatutoryDeductionMutation,

  // Housing Levy Rate Mutations
  useCreateHousingLevyRateMutation,
  useUpdateHousingLevyRateMutation,
  usePatchHousingLevyRateMutation,
  useDeleteHousingLevyRateMutation,

  // NSSF Tier Mutations
  useCreateNssfTierMutation,
  useUpdateNssfTierMutation,
  usePatchNssfTierMutation,
  useDeleteNssfTierMutation,

  // Tax Band Mutations
  useCreateTaxBandMutation,
  useUpdateTaxBandMutation,
  usePatchTaxBandMutation,
  useDeleteTaxBandMutation,

  // SHIF Rate Mutations
  useCreateShifRateMutation,
  useUpdateShifRateMutation,
  usePatchShifRateMutation,
  useDeleteShifRateMutation,

  // Personal Relief Mutations
  useCreatePersonalReliefMutation,
  useUpdatePersonalReliefMutation,
  usePatchPersonalReliefMutation,
  useDeletePersonalReliefMutation,

  // Payroll Mutations
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  usePatchPayrollMutation,
  // useApprovePayrollMutation,
  // useProcessPayrollMutation,
  // useRejectPayrollMutation,
  useDeletePayrollMutation,

  // Payslip Mutations
  useGeneratePayslipsMutation,
  useSendPayslipMutation,
  useDownloadPayslipMutation,
  useExportPayslipsMutation,
} = payrollApi;