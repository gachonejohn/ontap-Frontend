import React from "react";

const CardPreviewModal = ({ isOpen, onClose, card }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col justify-center items-center rounded-2xl w-[450px] h-auto bg-white p-4">
        <div className="flex flex-col justify-start items-end gap-6 w-full">
          {/* Header */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="font-inter text-lg text-neutral-900 font-semibold">Card Preview</div>
            <button
              onClick={onClose}
              className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
                <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Red Card */}
          <div className="flex flex-col rounded-xl w-full bg-red-700 p-4 text-white gap-3">
            {/* Profile and  QR section) */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <img
                  className="rounded-md border border-red-500"
                  src="/images/profile_image.png"
                  alt="Profile"
                  width="70"
                  height="70"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="font-inter text-base font-bold">Victor Smith</div>
                  <div className="font-inter text-sm text-rose-200">Product Designer</div>
                  <div className="font-inter text-sm text-rose-200">ID: 1003E84155</div>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-md">
                <img width="33" height="33" src="/images/code.png" alt="QR Code" />
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-1 text-sm mt-1">
              <div className="flex items-center gap-2">
                <img src="/images/email_icon.png" alt="Email" className="w-4 h-4" />
                <span>victor@ontap.com</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/phone.png" alt="Phone" className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/location.png" alt="Location" className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="/images/website.png" alt="Website" className="w-4 h-4" />
                <a
                  href="https://ontapke.com"
                  className="underline text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.ontap.com
                </a>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-white border-opacity-30 my-2" />

            {/* Social Media */}
            <div className="flex gap-4 text-sm">
              <a
                href="https://linkedin.com/in/victorsmith"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <img src="/images/linkedin.png" className="w-4 h-4" alt="LinkedIn" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com/victorsmith"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <img src="/images/twitter.png" className="w-4 h-4" alt="Twitter" />
                Twitter
              </a>
            </div>

          {/* Stats: Scans, Connections, Status */}
          <div className="border border-gray-300 rounded-lg p-6 mt-4" style={{backgroundColor:'#f9fafb'}}>
<div className="flex justify-between w-full mt-3 px-2">
  {/* Total Scans */}
  <div className="flex flex-col items-center justify-center w-[110px]">
    <div className="text-sm font-semibold text-black">245</div>
    <div className="text-xs font-medium" style={{ color: 'grey' }}>Total Scans</div>
  </div>

  {/* Connections */}
  <div className="flex flex-col items-center justify-center w-[110px]">
    <div className="text-sm font-semibold text-black">18</div>
    <div className="text-xs font-medium" style={{ color: 'grey' }}>Connections</div>
  </div>

  {/* Status */}
  <div className="flex flex-col items-center justify-center w-[110px]">
    <div className="text-sm font-semibold" style={{ color: '#17ae9e' }}>Active</div>
    <div className="text-xs font-medium" style={{ color: 'grey' }}>Status</div>
  </div>
</div>
</div>
</div>



          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center gap-3 w-full">
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg border border-neutral-200 w-[200px] h-11 cursor-pointer">
              <img width="24" height="24" src="/images/copy.png" alt="Copy icon" />
              <div className="font-inter text-base text-neutral-900">Copy</div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 px-3 rounded-lg w-[200px] h-11 bg-teal-500 cursor-pointer">
              <img width="18" height="18" src="/images/share.png" alt="Share icon" />
              <div className="font-inter text-base text-white">Share</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreviewModal;
