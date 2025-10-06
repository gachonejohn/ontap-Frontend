import React, { useState, useEffect } from "react";
import { useAppSelector } from "../../store/hooks";
import { useGetEmployeeByUserQuery } from "../../store/services/employees/employeesService";
import ViewProfileModal from "../../dashboards/employee/components/ViewProfileModal";

export default function Header() {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good Morning");

  const { user } = useAppSelector((state) => state.auth);
  console.log("user", user);
  // Fetch employee details from backend using user.id
  const { data: employee } = useGetEmployeeByUserQuery(user?.id, {
    skip: !user?.id,
  });

  const userName = user?.first_name || "User";
  const userDepartment = employee?.department?.name || "General";
  const userPosition = employee?.position?.title || "—";

  // Greeting logic
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
    <>
      <div className="fixed top-0 left-[272px] flex justify-between items-center px-8 py-3 w-[calc(100vw-272px)] bg-white z-50">
        {/* Greeting */}
        <div className="flex flex-col gap-2 w-96">
          <div className="text-[22px] text-neutral-900 font-semibold">
            {greeting} {userName}! 👋
          </div>
          <div className="text-sm text-neutral-500 font-normal">
            {userDepartment} · {userPosition}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Date */}
          <div
            className="flex items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 min-w-[88px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() =>
              alert(`Today's date is ${new Date().toDateString()}`)
            }
          >
            <div className="h-4">
              <img
                width="13px"
                height="14.3px"
                src="/images/calendar.png"
                alt="Calendar icon"
              />
            </div>
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
                 <ViewProfileModal
              isOpen={isProfileModalOpen}
              onClose={() => setIsProfileModalOpen(false)}
            />
              </div>
           
          </div>
        </div>
      </div>

      {/* Line below header */}
      <div className="fixed top-[85px] left-[260px] w-[calc(100vw-272px)] flex justify-center z-60">
        <div className="h-px bg-gray-200 w-[96%]"></div>
      </div>
    </>
  );
}
