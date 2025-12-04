import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCurrencyWithSymbol } from '@utils/formatCurrency';

const styles = StyleSheet.create({
  page: {
    padding: 27,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#333',
  },

  logo: {
    width: 70,
    height: 70,
    marginBottom: 8,
    alignSelf: 'center',
  },

  orgName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },

  section: {
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  label: {
    color: '#6b7280',
    fontSize: 10,
  },

  value: {
    color: '#111',
    fontWeight: 'semibold',
    fontSize: 10,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 6,
  },

  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#059669',
  },

  bigLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  infoColumn: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 8,
  },

  infoLabel: {
    color: '#6b7280',
    fontSize: 9,
    marginBottom: 3,
    textTransform: 'uppercase',
  },

  infoValue: {
    color: '#111',
    fontWeight: 'semibold',
    fontSize: 10,
  },
});

const PayslipPDF = ({ payslip }) => {
  const employee = payslip.payroll_record.employee;
  const period = payslip.payroll_record.period;
  const organization = employee.organization;

  const orgName = organization?.name?.toUpperCase() || 'ORGANIZATION';
  const orgAddress = organization?.address || '';
  const orgRegNo = organization?.registration_number || '';
  const orgNo = organization?.organization_no || '';

  const baseGross = parseFloat(payslip.gross_salary);
  const overtime = parseFloat(payslip.overtime || 0);
  const totalGross = baseGross + overtime;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {organization?.company_logo && (
          <Image src={organization.company_logo} style={styles.logo} />
        )}

        {/* ORGANIZATION NAME */}
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.orgName}>{orgName}</Text>

          {(orgAddress || orgRegNo || orgNo) && (
            <View style={{ textAlign: 'center', marginBottom: 10 }}>
              {orgAddress && (
                <Text style={{ fontSize: 9, color: '#555' }}>Address: {orgAddress}</Text>
              )}
              {orgRegNo && (
                <Text style={{ fontSize: 9, color: '#555' }}>Registration No: {orgRegNo}</Text>
              )}
              {orgNo && (
                <Text style={{ fontSize: 9, color: '#555' }}>Organization No: {orgNo}</Text>
              )}
            </View>
          )}

          {/* TITLE */}
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Payslip - {period.period_label}
          </Text>
        </View>
        <View style={styles.divider} />
        {/* EMPLOYEE INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Employee</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.infoValue}>{employee.full_name}</Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Employee No</Text>
              <Text style={styles.infoValue}>{employee.employee_no}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{employee.department}</Text>
            </View>

            <View style={styles.infoColumn}>
              <Text style={styles.infoLabel}>Position</Text>
              <Text style={styles.infoValue}>{employee?.position || 'No Position'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.bigLabel}>Net Pay:</Text>
            <Text style={styles.totalAmount}>{formatCurrencyWithSymbol(payslip.net_salary)}</Text>
          </View>

          <View style={styles.divider} />
        </View>

        {/* GROSS EARNINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gross Earnings Breakdown</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Base Salary</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(baseGross)}</Text>
          </View>

          {payslip.allowances.map((a) => (
            <View style={styles.row} key={a.id}>
              <Text style={styles.label}>{a.allowance_name}</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(a.amount)}</Text>
            </View>
          ))}

          {overtime && (
            <View style={styles.row}>
              <Text style={styles.label}>Overtime</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(overtime)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.bigLabel}>Total Gross Salary</Text>
            <Text style={styles.totalAmount}>{formatCurrencyWithSymbol(totalGross)}</Text>
          </View>

          <View style={styles.divider} />
        </View>

        {/* STATUTORY DEDUCTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statutory Deductions</Text>
          <View style={styles.divider} />

          {/* NSSF */}
          <View style={{ marginBottom: 10 }}>
            <View style={styles.row}>
              <Text style={styles.label}>NSSF (6%)</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.nssf_employee)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total NSSF Remittance</Text>
              <Text style={styles.value}>
                {formatCurrencyWithSymbol(payslip.nssf_employee * 2)}
              </Text>
            </View>
          </View>

          {/* SHIF */}
          <View style={{ marginBottom: 10 }}>
            <View style={styles.row}>
              <Text style={styles.label}>SHIF (2.75%)</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.shif)}</Text>
            </View>
          </View>

          {/* AHL */}
          <View>
            <View style={styles.row}>
              <Text style={styles.label}>AHL (1.5%)</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.housing_levy)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Total AHL Remittance</Text>
              <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.housing_levy * 2)}</Text>
            </View>
          </View>

          <View style={styles.divider} />
        </View>

        {/* PAYE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PAYE Tax Calculation</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Tax Before Relief</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.paye_before_relief)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Personal Relief</Text>
            <Text style={[styles.value, { color: 'red' }]}>
              - {formatCurrencyWithSymbol(Math.abs(payslip.personal_relief))}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.bigLabel}>Final PAYE</Text>
            <Text style={styles.totalAmount}>
              {formatCurrencyWithSymbol(payslip.paye_after_relief)}
            </Text>
          </View>

          <View style={styles.divider} />
        </View>

        {/* NET PAY SUMMARY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Net Pay Summary</Text>
          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.label}>Gross Salary</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(totalGross)}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.bigLabel}>Total Deductions</Text>

          <View style={styles.row}>
            <Text style={styles.label}>PAYE</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.paye_after_relief)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>NSSF</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.nssf_employee)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>SHIF</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.shif)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>AHL</Text>
            <Text style={styles.value}>{formatCurrencyWithSymbol(payslip.housing_levy)}</Text>
          </View>

          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.bigLabel}>NET PAY</Text>
            <Text style={styles.totalAmount}>{formatCurrencyWithSymbol(payslip.net_salary)}</Text>
          </View>

          <View style={styles.divider} />
        </View>
      </Page>
    </Document>
  );
};

export default PayslipPDF;
