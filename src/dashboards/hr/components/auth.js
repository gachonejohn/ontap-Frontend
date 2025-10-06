import React, { useState } from 'react';
import { FaEye, FaEyeSlash} from 'react-icons/fa';

const Auth = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const demoUsers = [
    { email: 'admin@ontap.com', password: 'password123' },
    { email: 'head@ontap.com', password: 'password123' },
    { email: 'demo@ontap.com', password: 'password123' },
    { email: 'demo2@ontap.com', password: 'password123' },
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }

    // validate the credentials to match a demo user
    const validUser = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (validUser) {
      onLoginSuccess(email);
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  flex flex-col items-center gap-2 justify-center px-4">
      <div className="text-center mb-6">
        <img src="images/logo.png" alt="OnTap Logo" className="mx-auto mt-2"
        width="150px"
        height="120px" />
        <p className="text-black font-semibold text-xl mb-4 mt-4">Welcome to OnTap</p>
        <p className="text-base text-gray-600 font-medium">Unified Workforce Management Portal</p>
        <p className="text-base text-gray-600 font-normal">Access your dashboard based on your role and permissions</p>
      </div>

      {/* White shadow container section */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">  
              {/* Login Form */}
              <div className="text-center">
  <h4 className="font-bold">Sign in To your Account</h4>
  <p className='text-base text-gray-500 mb-4'>Enter your credentials to access your personalized dashboard</p>
</div>

<form className="space-y-4" onSubmit={handleSubmit}> 
  <input
    type="email"
    placeholder="Enter your email"
    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
    value={email}                    
    onChange={(e) => setEmail(e.target.value)}  
    required
  />

  {/* Password Field section */}
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      placeholder="Password"
      className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
      value={password}                  
      onChange={(e) => setPassword(e.target.value)}  
      required
    />
    <div
      onClick={togglePasswordVisibility}
      className="absolute right-3 top-2.5 h-5 w-5 cursor-pointer text-gray-600 flex items-center"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? <FaEye /> : <FaEyeSlash />}
    </div>
  </div>

  <div className="flex items-center justify-between text-sm">
    <label className="flex items-center space-x-2">
      <input type="checkbox" className="accent-teal-600" />
      <span>Remember me</span>
    </label>
    <a href="#" className="text-teal-600 hover:underline">
      Forgot Password?
    </a>
  </div>
          <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 p-4 rounded-lg bg-teal-500 text-white font-normal hover:bg-teal-600 transition-colors"
            >
              <img
                width="17.1px"
                height="14.4px"
                src="/images/arrow.png"
                alt="Arrow icon"
              />
              Access Dashboard
            </button>
        </form>

        {/* Demo Accounts section */}
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <p className="mx-4 text-center text-sm text-gray-500 whitespace-nowrap">Try Demo Accounts</p>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <p className="text-center text-xs text-gray-400 mb-6">Quick access with pre-configured demo accounts</p>

          <div className="space-y-3 text-sm">
            {/* Administrative Access Section */}
            <div className="flex items-center mt-6 mb-2">
  <img
    height="15.5px"
    width="15.5px"
    src="images/employee.png"
    alt="Employee Icon"
  />
  <span className="font-semibold text-gray-900 ml-2">
    Administrative Access
  </span>
  <div className="ml-auto">
    <img
    width="15.5px"
    height="15.5px"
    src="images/info.png"
    alt="info" />
  </div>
</div>

            <div className="border border-teal-400 rounded-md p-3 flex justify-between items-center text-teal-600  cursor-pointer">
              <div className="flex items-center space-x-2">
                <img
                width="15.5px"
                height="15.5px"
                src="/images/Vector.png" />
                <span className="font-medium">HR Admin</span>
              </div>
              <span className="text-teal-600 text-xs">Admin@ontap.com</span>
            </div>

            <div className="border border-teal-400 rounded-md p-3 flex justify-between items-center text-teal-600  cursor-pointer">
              <div className="flex items-center space-x-2">
              <img
                width="15.5px"
                height="15.5px"
                src="/images/Vector.png" />
                <span className="font-medium">Department Head</span>
              </div>
              <span className="text-teal-600 text-xs">Head@ontap.com</span>
            </div>

            {/* Employee Access Section */}
            <div className="flex items-center mt-6 mb-2">
  <img
    height="15.5px"
    width="15.5px"
    src="images/employee.png"
    alt="Employee Icon"
  />
  <span className="font-semibold text-gray-900 ml-2">
    Employee Access
  </span>
  <div className="ml-auto">
    <img
    width="15.5px"
    height="15.5px"
    src="images/info.png"
    alt="info" />
  </div>
</div>


            <div className="border border-orange-400 rounded-md p-3 flex justify-between items-center text-orange-600 cursor-pointer">
              <div className="flex items-center space-x-2">
                <img
                height="19.4px"
                width="19.4px"
                src="images/employee_demo.png"/>
                <span className="font-medium">Employee Demo</span>
              </div>
              <span className="text-orange-600 text-xs">Demo@ontap.com</span>
            </div>

            <div className="border border-orange-400 rounded-md p-3 flex justify-between items-center text-orange-600 cursor-pointer">
              <div className="flex items-center space-x-2">
              <img
                height="19.4px"
                width="19.4px"
                src="images/employee_demo.png"/>
                <span className="font-medium">Employee Demo</span>
              </div>
              <span className="text-orange-600 text-xs">Demo2@ontap.com</span>
            </div>
          </div>
        </div>

        {/* Unified Access Portal Section */}
        <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200">
          <div className="flex items-center space-x-2 mb-2 text-black-600 font-semibold">
          <img
                  width="19.5px"
                  height="19.5px"
                  src="/images/Frame.png"
                  alt="Unified icon"
                />
            <span>Unified Access Portal</span>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Admin Users:</strong> Comprehensive system control, user management, performance metrics
            </p>
            <p>
              <strong>Employees:</strong> My Dashboard, task management, vacation requests, skill development
            </p>
          </div>
          <div className="flex justify-center items-center p-2 rounded-lg border border-gray-100 w-full bg-white mt-3">
                  <div className="text-xs text-neutral-900 font-medium">
                    🔐Your access level is automatically determined by your credentials
                  </div>
                </div>
        </div>
      </div>

      {/* Footer  */}
      <div className="mt-10 flex justify-center items-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-1">
          <img
          width="15.4px"
          height="15.4px"
          src="images/enterprise.png"
          alt="enterprise" 
          />
          <span>Enterprise Security</span>
        </div>
        <span>|</span>
        <div className="flex items-center space-x-1">
        <img
          width="15.4px"
          height="15.4px"
          src="images/enterprise.png"
          alt="enterprise" 
          />
          <span>SSO Ready</span>
        </div>
        <span>|</span>
        <div className="flex items-center space-x-1">
        <img
          width="15.4px"
          height="15.4px"
          src="images/enterprise.png"
          alt="enterprise" 
          />
          <span>Multi-Role Access</span>
        </div>
      </div>

      <p className="mt-4 mb-6 text-center text-base text-gray-600 font-medium">Secure workforce management platform</p>
      <div className="text-s text-center text-gray-600 font-normal mb-5">
      © 2025 OnTap Technologies. All rights reserved.
      </div>
    </div>
  );
};

export default Auth;

