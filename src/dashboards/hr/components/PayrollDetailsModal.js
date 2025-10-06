function PayrollDetailsModal({ payroll, onClose }) {
  if (!payroll) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 w-[400px] relative shadow-lg">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="font-bold text-lg text-gray-900">Payroll Details - {payroll.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Monthly breakdown of salary, bonuses and deductions.
        </p>

        {/* Profile Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={payroll.image}
            alt={payroll.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">{payroll.name}</p>
            <p className="text-sm text-gray-600">{payroll.department}</p>
            <p className="text-xs text-gray-400">ID: EMP0{payroll.id}</p>
          </div>
          <span
  className="ml-auto px-2 py-1 text-xs rounded-full text-white"
  style={{ backgroundColor: payroll.status === 'Processed' ? '#17ae93' : '#facc15', color: payroll.status === 'Processed' ? '#fff' : '#000' }}
>
  {payroll.status}
</span>

        </div>

        {/* Salary Breakdown  */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div>
            <p className="text-gray-500">Base Salary</p>
            <p className="font-bold">{payroll.basicSalary || "$8,500"}</p>
          </div>
          <div>
            <p className="text-gray-500">Deductions</p>
            <p className="font-bold text-red-600">- $80</p>
          </div>
          <div>
            <p className="text-gray-500">Overtime</p>
            <p className="font-bold">{payroll.overtime || "$200"}</p>
          </div>

          <div>
            <p className="text-gray-500">Work Days</p>
            <p className="font-bold">22 Days</p>
          </div>
          <div>
            <p className="text-gray-500">Bonus</p>
            <p className="font-bold">{payroll.bonus || "$150"}</p>
          </div>
          

          <div className="bg-[#e6f7f3] p-3 rounded-md inline-block">
       <p className="text-black text-sm">Net Pay</p>
       <p className="text-[#17ae93] font-bold text-xl">{payroll.netpay || "$9,000"}</p>
    </div>

          
        </div>

        

        
          {/* Divider */}
          <hr className="border-t border-gray-200 mb-4" />

        {/* Download Button */}
        <div className="flex justify-end mt-2">
  <button
    onClick={() => alert("Download Payslip clicked!")}
    className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 flex justify-center items-center gap-2"
  >
    <img
      src="/images/new_download.png"
      alt="Download Payslip"
      className="w-4 h-4"
    />
    Download Payslip
  </button>
</div>

      </div>
    </div>
  );
}

export default PayrollDetailsModal;
