import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLoginMutation } from '../store/services/auth/authService';
import { loginSchema } from '../schemas/authSchema';

const Signin = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    console.log('data', data);
    try {
      const response = await login(data).unwrap();
      console.log('response', response);
      const successMessage = response?.message || 'Login successful';
      toast.success(successMessage);
      navigate('/dashboard');
    } catch (error) {
      console.log('error', error);

      if (error?.data?.detail) {
        console.log('Error Message:', error.data.errror);
        toast.error(error.data.detail);
      } else {
        toast.error('Failed to Login. Please try again.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center items-center mt-8 gap-5">
        {/* Logo and Welcome Section */}
        <div className="flex flex-col justify-start items-center gap-2">
          <img
            src="/images/logo.png"
            alt="Logo"
            width="130px"
            height="55px"
            className="object-cover"
          />
          <div className="flex flex-col justify-center items-center gap-1">
            <div className="text-lg text-neutral-900 font-semibold">Welcome to OnTap</div>
            <div className="text-sm text-gray-600 font-medium">
              Unified Workforce Management Portal
            </div>
            <div className="text-sm text-gray-600 font-normal text-center">
              Access your dashboard based on your role and permissions
            </div>
          </div>
        </div>

        {/* Signin Form */}
        <div className="flex flex-col justify-start items-center gap-6 p-6 rounded-2xl w-[450px] bg-white shadow-md">
          <div className="flex flex-col justify-start items-center gap-1">
            <div className="text-base text-center text-neutral-900 font-semibold">
              Sign In to Your Account
            </div>
            <div className="text-sm text-gray-600 font-normal text-center">
              Enter your credentials to access your personalized dashboard
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {String(errors.email.message)}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="Password"
                className="w-full p-3 rounded-lg border border-gray-100 shadow-sm text-sm text-neutral-500 outline-none focus:ring-2 focus:ring-teal-500"
                {...register('password')}
                disabled={isLoading}
              />
              <img
                width="20px"
                height="20px"
                src={isPasswordVisible ? '/images/eye-slash.png' : '/images/eye.png'}
                alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {String(errors.password.message)}
                </p>
              )}
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-1 text-zinc-500 font-medium">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                />
                Remember me
              </label>
              <button type="button" className="text-teal-500 font-semibold" disabled={isLoading}>
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 p-3 rounded-lg bg-teal-500 text-white font-normal hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  <img width="17" height="14" src="/images/arrow.png" alt="Arrow" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="flex flex-col justify-start items-center gap-2">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-grow border-t border-gray-200"></div>
              <div className="text-xs text-zinc-500 font-normal">Try Demo Accounts</div>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="text-sm text-center text-gray-600">
              Quick access with pre-configured demo accounts
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-start items-center gap-2 mt-4">
          <div className="flex flex-row justify-start items-center gap-4">
            <div className="flex items-center gap-1">
              <img width="14" height="15" src="/images/footer.png" alt="Security" />
              <span className="text-sm text-gray-600">Enterprise Security</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <img width="14" height="15" src="/images/footer.png" alt="SSO" />
              <span className="text-sm text-gray-600">SSO Ready</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <img width="14" height="15" src="/images/footer.png" alt="Roles" />
              <span className="text-sm text-gray-600">Multi-Role Access</span>
            </div>
          </div>
          <div className="text-sm text-center text-gray-600 font-medium">
            Secure workforce management platform
          </div>
          <div className="text-xs text-center text-gray-600">
            © 2025 OnTap Technologies. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
