import React from "react";

const EditCardModal = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center rounded-2xl w-[560px] h-[630px] bg-white">
        <div className="flex flex-col justify-start items-start gap-6 h-[566px]">
          {/* Header with Close Button */}
          <div className="flex flex-row justify-between items-center w-[528px] h-7">
            <div className="font-inter text-lg font-semibold text-neutral-900">
              Edit ID Card
            </div>
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Template Section */}
          <div className="flex flex-col justify-start items-start gap-5 h-[421px]">
            {/* Tabs */}
            <div className="flex flex-row justify-start items-center rounded-lg border border-slate-100 w-[528px] h-10 bg-slate-50">
              <div className="flex flex-row justify-center items-center gap-2 px-4 rounded-lg border-r border-slate-100 w-44 h-10 bg-white">
                <div className="font-inter text-xs text-neutral-900 font-semibold tracking-wide">
                  Templates
                </div>
              </div>
            </div>

            {/* Template Options */}
            <div className="flex flex-col justify-start items-start gap-4 h-[360px]">
              <div className="font-inter text-sm text-neutral-900 font-medium">
                Choose Template
              </div>

              <div className="flex flex-col justify-start items-start gap-3 h-[324px]">
                {[1, 2, 3].map((row) => (
                  <div key={row} className="flex flex-row justify-between items-center gap-6 w-[528px] h-[100px]">
                    {[1, 2].map((col) => (
                      <div key={col} className="flex justify-center items-center rounded-lg border border-red-700 w-64 h-[100px]">
                        <div className="flex flex-row justify-start items-center gap-2 w-48">
                          <div className="rounded-lg w-8 h-8 bg-red-700"></div>
                          <div className="flex flex-col justify-start items-start gap-1">
                            <div className="font-inter text-base font-semibold text-neutral-900 whitespace-nowrap">
                              Modern Professional
                            </div>
                            <div className="font-inter text-xs font-medium text-gray-600 whitespace-nowrap">
                              Traditional business layout
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-row justify-between items-center gap-3 w-[528px] h-11">
            <div
              onClick={onClose}
              className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg border border-neutral-200 w-64 h-11 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="font-inter text-base text-neutral-900">Cancel</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg w-64 h-11 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors">
              <img width="20px" height="25px" src="/images/updatecard.png" alt="Update icon" />
              <div className="font-inter text-base text-white">Update</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCardModal;
