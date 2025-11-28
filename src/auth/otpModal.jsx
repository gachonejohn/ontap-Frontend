import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerifyDeviceOtpMutation } from "../store/services/auth/authService";
import { toast } from "react-toastify";

export default function OtpModal({ isOpen, onClose, otpData }) {
  const [code, setCode] = useState("");
  const [verifyOtp] = useVerifyDeviceOtpMutation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleVerify = async () => {
    try {
      const response = await verifyOtp({
        email: otpData.email,
        code,
        device_identifier: otpData.device_identifier
      }).unwrap();

      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-lg font-semibold mb-3">OTP verification</h2>
        <p className="text-sm text-gray-600 mb-4">
          Enter the OTP sent to <b>{otpData.email}</b>
        </p>

        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Enter OTP..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-teal-600 text-white py-2 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
