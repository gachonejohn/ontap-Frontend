import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useRequestPasswordResetOTPMutation,
  useVerifyOTPMutation,
  useConfirmNewPasswordMutation,
  useResendOTPMutation,
} from "../../store/services/profile/profileService";

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [requestOTP, { isLoading: isRequestingOTP }] = useRequestPasswordResetOTPMutation();
  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();
  const [confirmPassword, { isLoading: isConfirming }] = useConfirmNewPasswordMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      await requestOTP({ email }).unwrap();
      toast.success("OTP sent to your email address!");
      setStep(2);
    } catch (error) {
      console.error("Failed to request OTP:", error);
      const errorMessage = error?.data?.detail || error?.data?.email?.[0] || "Failed to send OTP";
      setErrors({ email: errorMessage });
      toast.error(errorMessage);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: "OTP is required" });
      return;
    }

    if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    try {
      await verifyOTP({ email, otp }).unwrap();
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      const errorMessage = error?.data?.detail || error?.data?.otp?.[0] || "Invalid OTP";
      setErrors({ otp: errorMessage });
      toast.error(errorMessage);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!passwords.new_password) {
      setErrors({ new_password: "New password is required" });
      return;
    }

    if (passwords.new_password.length < 8) {
      setErrors({ new_password: "Password must be at least 8 characters" });
      return;
    }

    if (!passwords.confirm_password) {
      setErrors({ confirm_password: "Please confirm your password" });
      return;
    }

    if (passwords.new_password !== passwords.confirm_password) {
      setErrors({ confirm_password: "Passwords do not match" });
      return;
    }

    try {
      await confirmPassword({
        email,
        new_password: passwords.new_password,
        confirm_password: passwords.confirm_password,
      }).unwrap();

      toast.success("Password reset successfully!");
      handleClose();
    } catch (error) {
      console.error("Failed to reset password:", error);
      
      if (error?.data) {
        const backendErrors = {};
        Object.keys(error.data).forEach(key => {
          backendErrors[key] = Array.isArray(error.data[key]) 
            ? error.data[key][0] 
            : error.data[key];
        });
        setErrors(backendErrors);
        
        const firstError = Object.values(backendErrors)[0];
        toast.error(firstError);
      } else {
        toast.error("Failed to reset password");
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendOTP({ email }).unwrap();
      toast.success("New OTP sent to your email!");
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      toast.error("Failed to resend OTP");
    }
  };

  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setPasswords({ new_password: "", confirm_password: "" });
    setErrors({});
    onClose();
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleRequestOTP} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 mb-2">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-900">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isRequestingOTP}
              className="w-full px-4 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isRequestingOTP ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 mb-2">
              We've sent a 6-digit OTP to <strong>{email}</strong>. The code expires in 10 minutes.
            </p>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-900">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(value);
                }}
                maxLength={6}
                className={`w-full px-4 py-3 rounded-lg border text-center text-2xl tracking-widest font-semibold ${
                  errors.otp
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-teal-500"
                } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                placeholder="000000"
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp}</p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={isVerifyingOTP}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isVerifyingOTP}
                className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifyingOTP ? "Verifying..." : "Verify OTP"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isResending}
              className="text-sm text-teal-500 hover:text-teal-600 font-medium"
            >
              {isResending ? "Resending..." : "Didn't receive the code? Resend"}
            </button>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleSetNewPassword} className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 mb-2">
              Create a new password for your account.
            </p>

            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-900">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwords.new_password}
                  onChange={(e) => setPasswords(prev => ({ ...prev, new_password: e.target.value }))}
                  className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                    errors.new_password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-teal-500"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-500">{errors.new_password}</p>
              )}
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-900">
                Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwords.confirm_password}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirm_password: e.target.value }))}
                  className={`w-full pl-4 pr-10 py-3 rounded-lg border ${
                    errors.confirm_password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-teal-500"
                  } focus:outline-none focus:ring-2 focus:ring-teal-500/20`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-red-500">{errors.confirm_password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isConfirming}
              className="w-full px-4 py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isConfirming ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}