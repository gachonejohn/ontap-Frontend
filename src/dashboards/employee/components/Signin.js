import React, { useState } from 'react';

const Signin = ({ onLogin }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col justify-center items-center gap-6">
        {/* Logo and Welcome Section */}
        <div className="flex flex-col justify-start items-center gap-3">
          <img src="/images/logo.png" alt="Logo" width="150px" height="61px" />
          <div className="flex flex-col justify-center items-center gap-2">
            <div className="text-xl text-neutral-900 font-semibold">Welcome to OnTap</div>
            <div className="flex flex-col justify-start items-center gap-1">
              <div className="text-base text-gray-600 font-medium">
                Unified Workforce Management Portal
              </div>
              <div className="text-base text-gray-600 font-normal">
                Access your dashboard based on your role and permissions
              </div>
            </div>
          </div>
        </div>

        {/* Signin Form */}
        <div className="flex flex-col justify-start items-center gap-8 p-8 rounded-2xl w-[550px] bg-white shadow-md">
          <div className="flex flex-col justify-start items-center gap-2">
            <div className="text-lg text-center text-neutral-900 font-semibold">
              Sign In to Your Account
            </div>
            <div className="text-sm text-gray-600 font-normal">
              Enter your credentials to access your personalized dashboard
            </div>
          </div>

          <form
            onSubmit={handleLogin}
            className="flex flex-col justify-start items-start gap-5 w-full"
          >
            {/* Email and Password Inputs */}
            <div className="flex flex-col justify-start items-start gap-6 w-full">
              <div className="flex flex-col justify-start items-end gap-4 w-full">
                {/* Email Input */}
                <div className="flex justify-center items-center w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-4 rounded-lg border border-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="flex flex-col justify-start items-start gap-0.5 w-full">
                  <div className="h-[70px] rounded-lg border border-gray-100 shadow-sm bg-white gap-[10px] flex flex-row justify-start items-center py-[27px] px-[14px] w-full">
                    <div className="flex flex-row justify-between items-center gap-[12px] w-full">
                      <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        placeholder="Password"
                        className="font-inter text-m w-full whitespace-nowrap text-neutral-500 leading-[140%] tracking-[-0.01em] font-normal outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <div
                        className="flex justify-center items-center h-[16px] cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        <img
                          width="20px"
                          height="20px"
                          src={isPasswordVisible ? '/images/eye-slash.png' : '/images/eye.png'}
                          alt={isPasswordVisible ? 'Hide password' : 'Show password'}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-start items-center gap-1">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="w-5 h-5 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                  />
                  <label htmlFor="remember-me" className="text-sm text-zinc-500 font-medium">
                    Remember me
                  </label>
                </div>
                <button type="button" className="text-sm text-teal-500 font-semibold">
                  Forgot Password ?
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 p-4 rounded-lg bg-teal-500 text-white font-normal hover:bg-teal-600 transition-colors"
            >
              <img width="17.1px" height="14.4px" src="/images/arrow.png" alt="Arrow icon" />
              Access Dashboard
            </button>
          </form>

          {/* Demo Accounts Section */}
          <div className="flex flex-col justify-start items-center gap-3">
            <div className="flex flex-row justify-start items-center gap-4 w-full">
              <div className="flex-grow border-t border-gray-200"></div>
              <div className="text-xs text-zinc-500 font-normal">Try Demo Accounts</div>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="text-sm text-center text-gray-600 font-normal">
              Quick access with pre-configured demo accounts
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="flex flex-col justify-start items-start gap-5 w-full">
            {/* Administrative Access */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-center items-start gap-1">
                  <img width="17.1px" height="17.1px" src="/images/admin.png" alt="Admin icon" />
                  <div className="text-sm text-neutral-900 font-medium">Administrative Access</div>
                </div>
                <img width="20px" height="20px" src="/images/chevron.png" alt="Chevron down" />
              </div>

              {/* HR Admin */}
              <div className="flex flex-row justify-start items-center gap-2.5 p-3 rounded-lg border border-teal-500 w-full bg-white">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <img
                      width="17.1px"
                      height="17.6px"
                      src="/images/adminaccess.png"
                      alt="HR icon"
                    />
                    <div className="text-sm text-teal-500 font-medium">HR Admin</div>
                  </div>
                  <div className="text-xs text-teal-500 font-medium">Admin@Ontap.com</div>
                </div>
              </div>

              {/* Department Head */}
              <div className="flex flex-row justify-start items-center gap-2.5 p-3 rounded-lg border border-teal-500 w-full bg-white">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <img
                      width="17.1px"
                      height="17.6px"
                      src="/images/adminaccess.png"
                      alt="Department icon"
                    />
                    <div className="text-sm text-teal-500 font-medium">Department Head</div>
                  </div>
                  <div className="text-xs text-teal-500 font-medium">Head@Ontap.com</div>
                </div>
              </div>
            </div>

            {/* Employee Access */}
            <div className="flex flex-col justify-start items-start gap-4 w-full">
              <div className="flex flex-row justify-between items-center w-full">
                <div className="flex flex-row justify-center items-start gap-1">
                  <img
                    width="18.4px"
                    height="17.1px"
                    src="/images/employee.png"
                    alt="Employee icon"
                  />
                  <div className="text-sm text-neutral-900 font-medium">Employee Access</div>
                </div>
                <img width="20px" height="20px" src="/images/chevron.png" alt="Chevron down" />
              </div>

              {/* Employee Demo */}
              <div className="flex flex-row justify-start items-center gap-2.5 p-3 rounded-lg border border-orange-400 w-full bg-white">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <img
                      width="17.1px"
                      height="17.6px"
                      src="/images/employeedemo.png"
                      alt="Demo icon"
                    />
                    <div className="text-sm text-orange-400 font-medium">Employee Demo</div>
                  </div>
                  <div className="text-xs text-orange-400 font-medium">Demo@Ontap.com</div>
                </div>
              </div>

              {/* Employee Demo 2 */}
              <div className="flex flex-row justify-start items-center gap-2.5 p-3 rounded-lg border border-orange-400 w-full bg-white">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-start items-center gap-1.5">
                    <img
                      width="17.1px"
                      height="17.6px"
                      src="/images/employeedemo.png"
                      alt="Demo icon"
                    />
                    <div className="text-sm text-orange-400 font-medium">Employee Demo</div>
                  </div>
                  <div className="text-xs text-orange-400 font-medium">Demo@Ontap.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Access Portal Info */}
          <div className="flex justify-center items-center p-4 rounded-lg border border-teal-500 w-full bg-teal-500/5">
            <div className="flex flex-col justify-between items-start gap-4 w-full">
              <div className="flex flex-row justify-center items-start gap-1">
                <img width="19.5px" height="19.5px" src="/images/unified.png" alt="Unified icon" />
                <div className="text-base text-neutral-900 font-medium">Unified Access Portal</div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 ml-7">
                <div className="flex flex-col justify-start items-start gap-1.5">
                  <div className="text-xs text-gray-600 font-medium">
                    <span className="text-neutral-900">Admin Users: </span>
                    Comprehensive system control, user management, performance metrics
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    <span className="text-neutral-900">Employees: </span>
                    My Dashboard, task management, vacation requests, skill development
                  </div>
                </div>
                <div className="flex justify-center items-center p-2 rounded-lg border border-gray-100 w-full bg-white">
                  <div className="text-xs text-neutral-900 font-medium">
                    🔐Your access level is automatically determined by your credentials
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col justify-start items-center gap-3">
          <div className="flex flex-row justify-start items-center gap-5">
            <div className="flex flex-row justify-start items-center gap-0.5">
              <img width="14.6px" height="15.1px" src="/images/footer.png" alt="Security icon" />
              <div className="text-sm text-gray-600 font-normal">Enterprise Security</div>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex flex-row justify-start items-center gap-0.5">
              <img width="14.6px" height="15.1px" src="/images/footer.png" alt="SSO icon" />
              <div className="text-sm text-gray-600 font-normal">SSO Ready</div>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex flex-row justify-start items-center gap-0.5">
              <img width="14.6px" height="15.1px" src="/images/footer.png" alt="Role icon" />
              <div className="text-sm text-gray-600 font-normal">Multi-Role Access</div>
            </div>
          </div>
          <div className="text-base text-center text-gray-600 font-medium">
            Secure workforce management platform
          </div>
          <div className="text-s text-center text-gray-600 font-normal">
            © 2025 OnTap Technologies. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
