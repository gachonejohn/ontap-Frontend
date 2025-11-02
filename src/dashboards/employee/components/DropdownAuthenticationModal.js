import React, { useState } from 'react';

const DropdownAuthenticationModal = ({ isOpen, onClose, onAuthenticate, position }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate(password);
    setPassword('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        top: `${position.top + 30}px`,
        right: `${window.innerWidth - position.right}px`,
      }}
    >
      <div className="bg-white rounded-lg p-4 w-[300px] shadow-xl border border-gray-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <img width="16px" height="16px" src="/images/password.png" alt="Password icon" />
            <div className="text-sm font-medium text-neutral-900">Enter Password</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-xs text-zinc-500 font-medium mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 pr-10 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <img
                    width="16px"
                    height="16px"
                    src={showPassword ? '/images/eye-slash.png' : '/images/eye.png'}
                    alt={showPassword ? 'Hide password' : 'Show password'}
                  />
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs bg-teal-500 text-white rounded hover:bg-teal-600"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DropdownAuthenticationModal;
