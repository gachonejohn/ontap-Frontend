import { SetTimezone } from "@components/settings/timezone/EditTimezone";
import { useAppSelector } from "@store/hooks";
import { useGetProfileInfoQuery } from "@store/services/employees/employeesService";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import AccountMenu from "./ProfileMenu";

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  const { user } = useAppSelector((state) => state.auth);

  const { data: profileInfo, refetch } = useGetProfileInfoQuery({}, {refetchOnMountOrArgChange: true});
 

  console.log("profileInfo================:", profileInfo);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 22) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    const updateGreeting = () => setGreeting(getGreeting());
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  const defaultProfile = "/images/avatar/default-avatar.jpg";
  const API_BASE_URL = process.env.REACT_APP_SERVER_URI;
  let profilePic = user?.profile_picture;

  if (profilePic && !profilePic.startsWith("http")) {
    profilePic = `${API_BASE_URL}${profilePic}`;
  }
  if (!profilePic) {
    profilePic = defaultProfile;
  }

  return (
    <div
      className={`fixed top-0 right-0 flex font-inter justify-between border-b shadow-sm items-center 
        px-5 py-2 bg-white z-50 transition-all duration-300
        ${sidebarOpen ? "left-[272px]" : "left-[64px]"}
      `}
    >
      <div className="flex items-center gap-4 w-96">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FiMenu className="text-2xl text-gray-700" />
        </button>

        <div className="flex flex-col gap-1">
          <div className="text-md  font-semibold">
            {greeting}, {profileInfo?.first_name || "Guest"  }!
          </div>
          <div className="text-xs  font-light">
            {profileInfo?.employee_profile?.department_name || "General"} · {profileInfo?.employee_profile?.position?.title || "—"}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* <div className="flex items-center gap-2 cursor-pointer font-montserrat group">
          <FiGlobe className="text-gray-500 text-base group-hover:text-gray-700 transition-colors" />
          <div className="text-sm text-gray-600 font-medium group-hover:text-gray-800 transition-colors">
            {profileInfo?.timezone || "UTC"}
          </div>
        </div> */}
        <div>
        <SetTimezone refetchData={refetch} buttonText={profileInfo?.timezone || "Set Timezone"} />
        </div>

        <div className="flex items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 min-w-[88px] cursor-pointer hover:bg-gray-100 transition-colors">
          <img
            width="13"
            height="14"
            src="/images/calendar.png"
            alt="Calendar icon"
          />
          <div className="text-xs text-neutral-900 font-semibold">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Notifications + Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-4 flex items-center justify-center">
            <img
              width="21.5"
              height="21.5"
              src="/images/notification.png"
              alt="Notification icon"
            />
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
            onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
          >
            <img
              className="w-full h-full object-cover"
              src={profilePic}
              alt={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
            />
          </div>

          <div>
            <AccountMenu
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
