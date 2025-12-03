import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { MdTune } from "react-icons/md";
import { CreateCompanyAdjForm } from './CreateBulkAdj';
import { CreateDepartmentAdjForm } from './CreateDeptAdj';
import { CreateSingleAdjForm } from './CreateSingleAdj';

export const CreateAdjustments = ({ refetchData }) => {
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
      <button 
        onClick={handleOpen}
        className="flex items-center border border-yellow-500 gap-2 px-3.5 py-2.5
         bg-yellow-50 whitespace-nowrap text-yellow-500 rounded-md text-sm"
      >
        <MdTune className="w-5 h-5" />
        <span className="text-sm">Create Adjustment</span>
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
              className="relative transform animate-fadeIn 
              max-h-[90vh] overflow-y-auto 
                rounded-2xl bg-white text-left shadow-xl transition-all w-full 
                sm:max-w-c-600 md:max-w-c-600 px-3 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header + tabs */}
              <div className="sticky top-0 bg-white z-40 px-4 pt-4 pb-3 border-b">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm md:text-lg font-semibold">Create Payroll Adjustments</p>
                  <IoCloseOutline size={20} className="cursor-pointer" onClick={handleClose} />
                </div>

                <div className="flex gap-2 border rounded-lg p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveTab('single')}
                    className={`flex-1 py-2 text-sm rounded-md transition
                      ${activeTab === 'single'
                        ? 'bg-white text-primary font-semibold shadow-sm'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Single Adjustment
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('company')}
                    className={`flex-1 py-2 text-sm rounded-md transition
                      ${activeTab === 'company'
                        ? 'bg-white text-primary font-semibold shadow-sm'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Company-wise Adjustment
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('department')}
                    className={`flex-1 py-2 text-sm rounded-md transition
                      ${activeTab === 'department'
                        ? 'bg-white text-primary font-semibold shadow-sm'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Department-wise Adjustment
                  </button>
                </div>
              </div>

              {/* Tab content - REMOVED overflow-y-auto and max-h */}
              <div className="p-4 min-h-[240px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'single' && (
                    <motion.div
                      key="single"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <CreateSingleAdjForm onClose={handleClose} refetchData={refetchData} />
                    </motion.div>
                  )}
                  {activeTab === 'company' && (
                    <motion.div
                      key="company"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <CreateCompanyAdjForm onClose={handleClose} refetchData={refetchData} />
                    </motion.div>
                  )}
                  {activeTab === 'department' && (
                    <motion.div
                      key="department"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <CreateDepartmentAdjForm onClose={handleClose} refetchData={refetchData} />
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