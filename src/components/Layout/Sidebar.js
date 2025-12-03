import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useLogoutUserMutation } from "../../store/services/auth/authService";
import { userLoggedOut } from "../../store/services/auth/authSlice";
import { useGetUnreadCountQuery } from "../../store/services/chat/chatService";
import { toast } from "react-toastify";

const menuItems = [
  {
    code: "dashboard",
    id: "dashboard",
    label: "Dashboard",
    icon: "/images/dashboard.png",
    whiteIcon: "/images/whitedashboard.png",
  },
  {
    code: "chat",
    id: "chat",
    label: "My Chats",
    icon: "/images/myprofile2.png",
    whiteIcon: "/images/whiteprofile.png",
    showBadge: true,
  },
  {
    code: "onboard",
    id: "onboarding",
    label: "Staff Onboarding",
    icon: "/images/myprofile2.png",
    whiteIcon: "/images/whiteprofile.png",
  },
  {
    code: "attendance",
    id: "attendance",
    label: "Attendance",
    icon: "/images/attendance.png",
    whiteIcon: "/images/whiteattendance.png",
  },
  {
    code: "attendance_management",
    id: "attendance_management",
    label: "Attendance Management",
    icon: "/images/attendance.png",
    whiteIcon: "/images/whiteattendance.png",
  },
  {
    code: "task",
    id: "tasks",
    label: "Task Management",
    icon: "/images/task.png",
    whiteIcon: "/images/whitetask.png",
  },
  {
    code: "calendar",
    id: "calendar",
    label: "Unified Calendar",
    icon: "/images/unified_calendar.png",
    whiteIcon: "/images/unified_calendar.png",
  },
  {
    code: "records",
    id: "records",
    label: "Records",
    icon: "/images/records.png",
    whiteIcon: "/images/records.png",
  },
  {
    code: "trainings",
    id: "trainings",
    label: "Trainings",
    icon: "/images/trainings.png",
    whiteIcon: "/images/trainings.png",
  },
  {
    code: "leaves",
    id: "leaves",
    label: "Leave",
    icon: "/images/leave.png",
    whiteIcon: "/images/whiteleave.png",
  },
  {
    code: "pay_slips",
    id: "payslips",
    label: "Pay Slips",
    icon: "/images/payslip.png",
    whiteIcon: "/images/whitepayslip.png",
  },
  {
    code: "digital_cards",
    id: "cards",
    label: "My Cards",
    icon: "/images/digital_cards.png",
    whiteIcon: "/images/digital_cards.png",
  },
  {
    code: "announcements",
    id: "announcements",
    label: "Announcements",
    icon: "/images/announcements.png",
    whiteIcon: "/images/whiteannouncements.png",
  },
  {
    code: "staffcycle",
    id: "staffcycle",
    label: "Staff Cycle",
    icon: "/images/myprofile2.png",
    whiteIcon: "/images/whiteprofile.png",
  },
  {
    code: "employees",
    id: "employees",
    label: "Employees",
    icon: "/images/Frame.png",
    whiteIcon: "/images/Frame.png",
  },
  {
    code: "performance",
    id: "performance",
    label: "Performance Modules",
    icon: "/images/performance.png",
    whiteIcon: "/images/performance.png",
  },
  {
    code: "pay_roll",
    id: "payroll",
    label: "Payroll Settings",
    icon: "/images/payslips.png",
    whiteIcon: "/images/payslips.png",
  },
  {
    code: "my_profile",
    id: "profile",
    label: "My Profile",
    icon: "/images/myprofile2.png",
    whiteIcon: "/images/whiteprofile.png",
  },
  {
    code: "settings",
    id: "settings",
    label: "Settings",
    icon: "/images/settings.png",
    whiteIcon: "/images/settings.png",
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

   // Fetch unread message count
  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 60000, // Poll every 1 minute
    refetchOnMountOrArgChange: true,
  });

  const unreadCount = unreadData?.total_unread_count || 0;

  const permissions = React.useMemo(() => user?.role?.permissions ?? [], [user]);
  const allowedCodes = React.useMemo(
    () =>
      new Set(
        permissions
          .filter((p) => p?.can_view)
          .map((p) => p?.feature_code)
          .filter(Boolean)
      ),
    [permissions]
  );
  const filteredMenu = React.useMemo(
    () => menuItems.filter((item) => allowedCodes.has(item.code)),
    [allowedCodes]
  );

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      await logoutUser({}).unwrap();
      dispatch(userLoggedOut());
      toast.update(loadingToast, {
        render: 'Logged out successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const activePage = pathParts.length === 1 ? 'dashboard' : pathParts.pop();

  return (
    <>
      {/* Overlay on mobile when sidebar is open */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-100 shrink-0 transition-all duration-300 z-50
  ${sidebarOpen ? 'w-[272px]' : 'w-[64px]'}
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
  `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-20 p-2 border-r">
          <img
            src="/images/logo.png"
            alt="Logo"
            className={`object-contain transition-all duration-300 ${
              sidebarOpen ? 'h-12 w-auto' : 'h-14 w-14'
            }`}
          />
        </div>

        {/* Menu */}
        <div className="flex flex-col items-start gap-2 mt-2 h-[calc(100%-140px)] relative pl-2 pr-1 overflow-y-auto">
          <div className={`${sidebarOpen ? 'px-3' : 'px-1'} py-1`}>
            {sidebarOpen && (
              <div className="text-sm text-neutral-900/60 font-medium mb-2">Main Menu</div>
            )}
          </div>
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-start cursor-pointer gap-3 p-2 rounded-lg transition-all duration-200 w-full
    ${activePage === item.id ? 'bg-teal-500 text-white' : 'text-gray-600 hover:bg-gray-100'}
    `}
              onClick={() => {
                if (!sidebarOpen) {
                  setSidebarOpen(true);
                } else {
                  navigate(`/dashboard/${item.id === 'dashboard' ? '' : item.id}`);
                }
              }}
            >
              <img
                width="20px"
                height="20px"
                src={activePage === item.id ? item.whiteIcon : item.icon}
                alt={item.label}
              />
              {/* Unread badge for chat - shown when sidebar is closed */}
                {item.showBadge && unreadCount > 0 && !sidebarOpen && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              {/* {React.createElement(item.icon, {
      size: 22,
      className: activePage === item.id ? "text-white" : "text-gray-600",
    })}*/}
              {sidebarOpen && <span className="text-base font-normal">{item.label}</span>}
              {/* Unread badge for chat - shown when sidebar is open */}
                  {item.showBadge && unreadCount > 0 && (
                    <span className={`flex items-center justify-center min-w-[22px] h-[22px] px-2 text-xs font-semibold rounded-full ${
                      activePage === item.id ? 'bg-white text-teal-500' : 'bg-red-500 text-white'
                    }`}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
            </div>
          ))}
        </div>

        {/* Logout */}
        <div
          className="mt-auto w-full border-t border-slate-200 p-3 flex items-center gap-3 cursor-pointer"
          onClick={handleLogout}
        >
          <img width="24px" height="24px" src="/images/logout.png" alt="Logout" />
          {sidebarOpen && <span className="font-inter text-base text-teal-500">Logout</span>}
        </div>
      </div>
    </>
  );
}
