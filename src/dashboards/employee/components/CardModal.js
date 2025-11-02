// CardModal.js
import React from 'react';

const CardModal = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center rounded-2xl w-[450px] h-[589px] bg-white">
        <div className="flex flex-col justify-start items-end gap-6 h-[525px]">
          {/* Header with Close Button */}
          <div className="flex flex-row justify-between items-center w-[418px] h-7">
            <div className="font-inter text-lg text-neutral-900 font-semibold">Card Preview</div>
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
                <path
                  d="M12 4L4 12"
                  stroke="#4B5563"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 4L12 12"
                  stroke="#4B5563"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Card Content */}
          <div className="flex flex-col justify-start items-start gap-4 h-[403px]">
            <div className="flex justify-center items-center rounded-xl w-[418px] h-[213px] bg-red-700">
              <div className="flex flex-col justify-start items-start gap-2 h-[181px]">
                <div className="flex flex-row justify-between items-start gap-28 w-[386px] h-10">
                  <div className="flex flex-col justify-start items-start gap-1 w-[195px] h-10">
                    <div className="font-inter text-sm text-rose-200 font-semibold">
                      OnTap Technologies
                    </div>
                    <div className="font-inter text-xs text-rose-200 font-medium">
                      Employee License DXB Virtual Card
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-start w-8 h-12">
                    <div className="font-inter text-sm text-rose-200 font-semibold">Staff</div>
                    <img
                      className="ml-px"
                      width="28"
                      height="28"
                      src="/images/code.png"
                      alt="QR Code icon"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-between items-start gap-[140px] w-[386px] h-20">
                  <div className="flex flex-row justify-center items-center gap-3 w-[205px]">
                    <img
                      className="rounded-md border border-red-500"
                      src="/images/cardprofile.png"
                      alt="Profile"
                      width="80"
                      height="80"
                    />
                    <div className="flex flex-col gap-0.5">
                      <div className="font-inter text-base text-white font-bold">Victor Smith</div>
                      <div className="font-inter text-sm text-rose-200 font-medium">
                        Product Designer
                      </div>
                      <div className="font-inter text-sm text-rose-200 font-medium">
                        ID: 1003E84155
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center p-2 rounded-md w-12 h-12 bg-white/20">
                    <img width="33" height="33" src="/images/code1.png" alt="QR Code Large" />
                  </div>
                </div>

                <div className="flex flex-row justify-between items-center w-[315px] h-11">
                  <div className="flex flex-col items-center gap-1 w-20 h-11">
                    <div className="font-inter text-sm text-rose-200 font-medium">Issue Date</div>
                    <div className="font-inter text-sm text-white">01/01/2025</div>
                  </div>
                  <div className="flex flex-col items-center gap-1 w-20 h-11">
                    <div className="font-inter text-sm text-rose-200 font-medium">Expiry Date</div>
                    <div className="font-inter text-sm text-white">02/01/2026</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership Details */}
            <div className="flex justify-center items-center rounded-xl w-[418px] h-44 bg-gray-50">
              <div className="flex flex-col gap-4 h-36">
                <div className="font-inter text-base text-neutral-900 font-semibold">
                  Membership Details
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row justify-between w-[350px] h-11">
                    <div className="flex flex-col gap-1.5">
                      <div className="font-inter text-sm text-gray-600 font-medium">Member ID</div>
                      <div className="font-inter text-sm text-neutral-900 font-medium">
                        1004M92847
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="font-inter text-sm text-gray-600 font-medium">Status</div>
                      <div className="font-inter text-sm text-teal-500 font-medium">Active</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between w-[350px] h-11">
                    <div className="flex flex-col gap-1.5">
                      <div className="font-inter text-sm text-gray-600 font-medium">Department</div>
                      <div className="font-inter text-sm text-neutral-900 font-medium">
                        Design & UX
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="font-inter text-sm text-gray-600 font-medium">
                        Access Level
                      </div>
                      <div className="font-inter text-sm text-neutral-900 font-medium">Senior</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-3 w-[418px] h-11">
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg border border-neutral-200 w-[200px] h-11">
              <img width="24" height="24" src="/images/copy.png" alt="Copy icon" />
              <div className="font-inter text-base text-neutral-900">Copy</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg w-[200px] h-11 bg-teal-500">
              <img width="18" height="18" src="/images/share.png" alt="Share icon" />
              <div className="font-inter text-base text-white">Share</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
