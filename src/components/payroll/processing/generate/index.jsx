import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { AnimatePresence, motion } from 'framer-motion';
import { RiRestartLine } from 'react-icons/ri';
import { GenerateBulkPayrollForm } from './GenerateBulkPayroll';
import { GenerateSinglePayrollForm } from './GenerateSinglePayroll';

export const GeneratePayroll = ({ refetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('single');

  const handleOpen = () => {
    setActiveTab('single');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Single trigger button */}

      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-primary whitespace-nowrap text-white rounded-md text-sm"
      >
        <RiRestartLine className="w-5 h-5" />
        <span className="text-sm">Run Payroll</span>
      </button>

      {isOpen && (
        <div
          className="relative z-50 animate-fadeIn"
          aria-labelledby="generate-payroll-modal"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={handleClose}
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer"
          />

          {/* Modal */}
          <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center overflow-y-auto p-2 md:p-3 pointer-events-none">
            <div
              className="relative transform animate-fadeIn max-h-[90vh] overflow-y-auto 
                rounded-2xl bg-white text-left shadow-xl transition-all w-full 
                sm:max-w-c-600 md:max-w-c-600 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header + tabs */}
              <div className="sticky top-0 bg-white z-40 px-4 pt-4 pb-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm md:text-lg font-semibold">Generate Payroll</p>
                  <IoCloseOutline size={20} className="cursor-pointer" onClick={handleClose} />
                </div>

                <div className="flex gap-2 border rounded-lg p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 py-2 text-sm rounded-md transition
                      ${
                        activeTab === 'single'
                          ? 'bg-white text-primary font-semibold shadow-sm'
                          : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Single Payroll
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('bulk')}
                    className={`flex-1 py-2 text-sm rounded-md transition
                      ${
                        activeTab === 'bulk'
                          ? 'bg-white text-primary font-semibold shadow-sm'
                          : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Bulk Payroll
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-4 min-h-[240px] max-h-[70vh] overflow-y-auto">
                <AnimatePresence mode="wait">
                  {activeTab === 'single' ? (
                    <motion.div
                      key="single"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <GenerateSinglePayrollForm onClose={handleClose} refetchData={refetchData} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bulk"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <GenerateBulkPayrollForm onClose={handleClose} refetchData={refetchData} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
