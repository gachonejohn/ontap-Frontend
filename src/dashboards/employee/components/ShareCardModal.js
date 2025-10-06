// ShareCardModal.js
import React from "react";

const ShareCardModal = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center rounded-2xl w-[560px] h-[423px] bg-white">
        <div className="flex flex-col justify-start items-start gap-6 h-[359px]">
          {/* Header with Close Button */}
          <div className="flex flex-row justify-between items-center w-[528px] h-7">
            <div className="font-inter text-lg font-semibold text-neutral-900">
              Share Card
            </div>
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Share Options */}
          <div className="flex flex-col justify-start items-start gap-3 h-[237px]">
            {/* QR Code Option */}
            <div className="flex items-center pl-4 rounded-lg border border-neutral-200 w-[528px] h-[71px] bg-white">
              <div className="flex flex-row items-center gap-3">
                <div className="flex justify-center items-center w-12 h-12 rounded-md bg-emerald-50">
                  <img width="32" height="32" src="/images/qrcodeshare.png" alt="QR Code icon" />
                </div>
                <div className="flex flex-col">
                  <div className="font-inter text-base font-semibold text-neutral-900">
                    Share via QR Code
                  </div>
                  <div className="font-inter text-xs font-medium text-gray-600">
                    Generate QR Code for easy sharing
                  </div>
                </div>
              </div>
            </div>

            {/* NFC Option */}
            <div className="flex items-center pl-4 rounded-lg border border-neutral-200 w-[528px] h-[71px] bg-white">
              <div className="flex flex-row items-center gap-3">
                <div className="flex justify-center items-center w-12 h-12 rounded-md bg-emerald-50">
                  <img width="18" height="30" src="/images/nfc.png" alt="NFC icon" />
                </div>
                <div className="flex flex-col">
                  <div className="font-inter text-base font-semibold text-neutral-900">
                    NFC Tap
                  </div>
                  <div className="font-inter text-xs font-medium text-gray-600">
                    Share by tapping devices together
                  </div>
                </div>
              </div>
            </div>

            {/* Widget Link Option */}
            <div className="flex items-center pl-4 rounded-lg border border-neutral-200 w-[528px] h-[71px] bg-white">
              <div className="flex flex-row items-center gap-3">
                <div className="flex justify-center items-center w-12 h-12 rounded-md bg-emerald-50">
                  <img width="28" height="28" src="/images/widget.png" alt="Link icon" />
                </div>
                <div className="flex flex-col">
                  <div className="font-inter text-base font-semibold text-neutral-900">
                    Widget Link
                  </div>
                  <div className="font-inter text-xs font-medium text-gray-600">
                    Copy shareable link
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-3 w-[528px] h-11">
            <div
              onClick={onClose}
              className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg border border-neutral-200 w-64 h-11 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="font-inter text-base text-neutral-900">Cancel</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg w-64 h-11 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors">
              <img width="18" height="18" src="/images/share.png" alt="Download icon" />
              <div className="font-inter text-base text-white">Download</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCardModal;
