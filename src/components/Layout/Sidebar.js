import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useLogoutUserMutation } from "../../store/services/auth/authService";
import { userLoggedOut } from "../../store/services/auth/authSlice";
import { toast } from "react-toastify";

const menuItems = [
  { code: "dashboard", id: "dashboard", label: "Dashboard", icon: "/images/dashboard.png", whiteIcon: "/images/whitedashboard.png" },
  { code: "staffcycle", id: "staffcycle", label: "Staff Cycle", icon: "/images/myprofile2.png", whiteIcon: "/images/whiteprofile.png" },
  { code: "employees", id: "employees", label: "Employees", icon: "/images/Frame.png", whiteIcon: "/images/Frame.png" },
  { code: "leave_attendance", id: "leaves", label: "Leave & Attendance", icon: "/images/leave.png", whiteIcon: "/images/whiteleave.png" },
  { code: "performance", id: "performance", label: "Performance", icon: "/images/performance.png", whiteIcon: "/images/performance.png" },
  { code: "task", id: "tasks", label: "Task Management", icon: "/images/task.png", whiteIcon: "/images/whitetask.png" },
  { code: "pay_slips", id: "payslips", label: "Pay Slips", icon: "/images/payslip.png", whiteIcon: "/images/whitepayslip.png" },
  { code: "pay_roll", id: "payroll", label: "Payroll", icon: "/images/payslips.png", whiteIcon: "/images/payslips.png" },
  { code:"trainings", id: "trainings", label: "Trainings", icon: "/images/trainings.png", whiteIcon: "/images/trainings.png" },
  { code: "digital_cards", id: "cards", label: "Digital Cards", icon: "/images/digital_cards.png", whiteIcon: "/images/digital_cards.png" },
  { code: "announcements",id: "announcements", label: "Announcements", icon: "/images/announcements.png", whiteIcon: "/images/whiteannouncements.png" },
  { code: "settings", id: "settings", label: "Settings", icon: "/images/settings.png", whiteIcon: "/images/settings.png" },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const permissions = React.useMemo(() => {
    if (!user) return [];
    return user.role?.permissions ?? [];
  }, [user]);

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
      const loadingToast = toast.loading("Logging out...");
      await logoutUser({}).unwrap();
      dispatch(userLoggedOut());
      toast.update(loadingToast, { render: "Logged out successfully!", type: "success", isLoading: false, autoClose: 2000 });
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const activePage = pathParts.length === 1 ? "dashboard" : pathParts.pop();

  return (
    <div className="flex flex-col w-[272px] h-full border-r border-slate-100 bg-white shrink-0">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 p-2 h-24">
        <div className="flex items-end p-3 w-64 h-20">
          <img src="/images/logo.png" alt="Logo" width="180px" height="52.2px" />
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col items-start gap-2 p-4 h-16">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-9 w-[240px] bg-white">
          <img width="16.5px" height="16.5px" src="/images/search.png" alt="Search" />
          <div className="text-base text-gray-400 font-normal min-w-[160px]">Search</div>
          <img width="15px" height="15px" src="/images/command.png" alt="Command" />
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col items-start gap-2 mt-0.5 h-[calc(100%-200px)] relative pl-4 overflow-y-auto">
        {activePage && (
          <div
            className="absolute left-0 top-2.5 h-9 transition-all duration-200"
            style={{
              transform: `translateY(${
                filteredMenu.findIndex((item) => item.id === activePage) * (36 + 8) + 28
              }px)`,
            }}
          >
            <div className="w-1 h-8 bg-teal-500 rounded-r-full"></div>
          </div>
        )}

        <div className="flex items-center gap-2 p-1 px-3 h-7 w-[240px]">
          <div className="text-sm text-neutral-900/60 font-medium">Main Menu</div>
        </div>

        <div className="flex flex-col items-start gap-2 w-60">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className={`flex items-center cursor-pointer gap-2 p-2 px-3 rounded-lg h-9 w-[240px] relative ${
                activePage === item.id ? "bg-teal-500 text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => navigate(`/dashboard/${item.id === "dashboard" ? "" : item.id}`)}
            >
              <img
                width="20px"
                height="20px"
                src={activePage === item.id ? item.whiteIcon : item.icon}
                alt={item.label}
              />
              <div className="text-base font-normal">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="mt-auto w-full border-t border-slate-200">
        <div className="flex items-center p-3 pl-8 gap-2 cursor-pointer" onClick={handleLogout}>
          <img width="30px" height="30px" src="/images/logout.png" alt="Logout" />
          <span className="font-inter text-lg text-teal-500 font-normal">Logout</span>
        </div>
      </div>
    </div>
  );
}