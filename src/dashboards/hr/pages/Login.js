import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const demoUsers = [
    { email: 'admin@ontap.com', password: 'password123' },
    { email: 'head@ontap.com', password: 'password123' },
    { email: 'demo@ontap.com', password: 'password123' },
    { email: 'demo2@ontap.com', password: 'password123' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const validUser = demoUsers.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (validUser) {
      onLogin(); 
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
      <h2 className="text-lg font-bold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
