import React from 'react';

const menuItems = [
  { name: 'Dashboard', key: 'dashboard', icon: '/images/dashboard_2.png' },
  {name: 'Employees', key: 'employees', icon: '/images/Frame.png'},
  { name: 'Task', key: 'task', icon: '/images/task.png' },
  { name: 'Leave & Attendance', key: 'leave', icon: '/images/leave.png' },
  { name: 'Pay Roll', key: 'payroll', icon: '/images/payslips.png' },
  { name: 'Trainings', key: 'trainings', icon: '/images/trainings.png' },
  { name: 'Digital Cards', key: 'cards', icon: '/images/digital_cards.png' },
  { name: 'Announcements', key: 'announcements', icon: '/images/announcements.png' },
  {name: 'Help & Support', key: 'help', icon: '/images/help.png'},
  { name: 'My Profile', key: 'profile', icon: '/images/my_profile.png' },
  {name: 'Settings', key: 'settings', icon: '/images/settings.png'}
];

export default function Sidebar({ activePage, setActivePage }) {
    return (
      <div className="w-[256px] h-screen bg-white shadow-md flex flex-col overflow-y-hidden">
        {/* Header / Logo */}
        <div className="flex items-center justify-center py-3 px-4 border-b border-gray-200">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-8 object-contain"
          />
        </div>
  
        {/* Search Bar */}
        <div className="px-4 py-2">
  <div className="relative w-full">
    {/* Search image on the left */}
    <img
      src="/images/search.png"
      alt="Search"
      className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
    />

    {/* Input field */}
    <input
      type="text"
      placeholder="Search"
      className="w-full pl-9 pr-9 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00B8A9]"
    />

    {/* Clear image on the right */}
    <img
      src="/images/delete.png"
      alt="Clear"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 cursor-pointer"
    />
  </div>
</div>

  
        {/* Menu Items */}
        <div className="px-4 flex-grow overflow-auto">
          <p className="text-xs text-gray-400 uppercase mb-2 tracking-wide">Main Menu</p>
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
             <li
             key={item.key}
             onClick={() => setActivePage(item.key)}
             className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition ${
               activePage === item.key
                 ? 'bg-[#00B8A9] text-white'
                 : 'text-gray-700 hover:bg-gray-100'
             }`}
           >
             <img
               src={item.icon}
               alt={`${item.name} icon`}
               className={`w-4 h-4 transition ${
                 activePage === item.key ? 'filter brightness-0 invert' : ''
               }`}
             />
             <span className="text-sm">{item.name}</span>
           </li>
           
            ))}
          </ul>
        </div>
  
        {/* Logout section */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-[#00B8A9] cursor-pointer text-sm font-medium hover:underline">
            <img
              src="/images/logout.png"
              alt="Logout icon"
              className="w-4 h-4"
            />
            Logout
          </div>
        </div>
      </div>
    );
  }
  
  
