// BusinessCardModal.js
import React from 'react';

const BusinessCardModal = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="flex flex-col justify-center items-center rounded-2xl w-full max-w-[450px] bg-white p-6">
        <div className="flex flex-col justify-start items-start gap-6 w-full">
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="text-lg text-neutral-900 font-semibold">Card Preview</div>
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full transition-colors"
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

          {/* Card Preview */}
          <div className="flex flex-col justify-start items-start gap-4 w-full">
            <div
              className={`flex flex-col justify-center items-center rounded-xl w-full p-4 ${card?.bgColor || 'bg-red-700'}`}
            >
              <div className="flex flex-col justify-start items-start gap-4 w-full">
                <div className="flex flex-row justify-between items-start w-full">
                  <div className="flex flex-row justify-center items-center gap-3">
                    <img
                      className="rounded-full border-2 border-white overflow-hidden"
                      src="/images/avatar1.png"
                      alt="Profile"
                      width="47px"
                      height="47px"
                    />
                    <div className="flex flex-col justify-start items-start gap-0.5">
                      <div className="text-sm text-white font-bold">
                        {card?.name || 'Victor Smith'}
                      </div>
                      <div className="text-xs text-green-100 font-medium">
                        {card?.position || 'Product Designer'}
                      </div>
                      <div className="text-xs text-green-100 font-medium">OnTap Technologies</div>
                    </div>
                  </div>
                  <div className="flex justify-center items-center rounded-md w-12 h-12 bg-white/20">
                    <img
                      width="32.9px"
                      height="32.9px"
                      src="/images/qrcode.png"
                      alt="QR Code icon"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="flex flex-col justify-start items-start gap-2 w-full">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="14.9px"
                          height="11.7px"
                          src="/images/email2.png"
                          alt="Email icon"
                        />
                      </div>
                      <div className="text-xs text-white font-medium">victor@ontap.com</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="14.9px"
                          height="14.9px"
                          src="/images/phone1.png"
                          alt="Phone icon"
                        />
                      </div>
                      <div className="text-xs text-white font-medium">+1 (555) 123-4567</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <img
                        width="17px"
                        height="17px"
                        src="/images/location.png"
                        alt="Location icon"
                      />
                      <div className="text-xs text-white font-medium">San Francisco, CA</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-4">
                        <img
                          width="13.8px"
                          height="13.8px"
                          src="/images/web.png"
                          alt="Website icon"
                        />
                      </div>
                      <div className="text-xs text-white font-medium">www.ontap.com</div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                      <div className="flex justify-center items-center h-3">
                        <img
                          width="12px"
                          height="9.8px"
                          src="/images/linkedin.png"
                          alt="LinkedIn icon"
                        />
                      </div>
                      <div className="text-[10px] text-white font-medium">LinkedIn</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1 h-3.5">
                      <div className="flex justify-center items-center h-3">
                        <img
                          width="12px"
                          height="9.8px"
                          src="/images/twitter.png"
                          alt="Twitter icon"
                        />
                      </div>
                      <div className="text-[10px] text-white font-medium">Twitter</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center items-center rounded-lg w-full p-4 bg-gray-50">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-col justify-start items-center gap-0.5">
                  <div className="text-sm text-neutral-900 font-semibold">{card?.scans || 245}</div>
                  <div className="text-xs text-gray-500 font-medium">Total Scans</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-0.5">
                  <div className="text-sm text-neutral-900 font-semibold">
                    {card?.connections || 18}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Connections</div>
                </div>
                <div className="flex flex-col justify-center items-center gap-0.5">
                  <div className="text-sm text-teal-500 font-semibold">
                    {card?.status || 'Active'}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-3 w-full">
            <button className="flex flex-row justify-center items-center gap-2 p-3 rounded-lg border border-neutral-200 w-full h-11 hover:bg-gray-50 transition-colors">
              <img width="24px" height="24px" src="/images/copy.png" alt="Copy icon" />
              <div className="text-base text-neutral-900 font-normal">Copy</div>
            </button>
            <button className="flex flex-row justify-center items-center gap-2 p-3 rounded-lg w-full h-11 bg-teal-500 hover:bg-teal-600 transition-colors">
              <div className="flex justify-center items-center h-5">
                <img width="18px" height="18px" src="/images/share.png" alt="Share icon" />
              </div>
              <div className="text-base text-white font-normal">Share</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCardModal;
