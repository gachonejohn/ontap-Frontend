import React from 'react';
import Sidebar from './Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-grow overflow-auto p-6">

        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Add more routes here  */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </main>
    </div>
  );
}
