import React, { useState } from "react";
import ViewProfileModal from "./ViewProfileModal.js";

const Announcements = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Announcements Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            Company Announcements
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Stay updated with the latest company news and important information.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 w-full">
            {/* Total Announcements Card with Sticker Background */}
            <div className="relative flex items-center p-4 rounded-xl h-[120px] shadow-lg text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
              {/* Sticker Image as Background */}
              <img
                src="/images/card1.png" // 👈 replace with your actual sticker image
                alt="Sticker background"
                className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
              />

              {/* Content */}
              <div className="flex flex-col justify-between h-full w-full relative z-10">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium">Total Announcements</div>
                    <div className="mt-2 text-lg font-semibold">24</div>
                    <div className="mt-1 text-xs font-medium">This Month</div>
                  </div>
                  <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-white shadow-sm">
                    <img
                      className="h-5 w-5 object-contain"
                      src="/images/megaphone.png"
                      alt="Total Announcements icon"
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* This Week Card */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    This Week
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    6
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    New announcements
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/week.png"
                    alt="This Week icon"
                  />
                </div>
              </div>
            </div>

            {/* Important Updates Card */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    Important Updates
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    3
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    This Week
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-yellow-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/updates.png"
                    alt="Important Updates icon"
                  />
                </div>
              </div>
            </div>

            {/* Read Rate Card */}
            <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <div className="text-sm text-gray-600 font-medium">
                    Avg. Read Rate
                  </div>
                  <div className="mt-2 text-lg text-neutral-900 font-semibold">
                    87%
                  </div>
                  <div className="mt-1 text-xs text-gray-600 font-normal">
                    This Week
                  </div>
                </div>
                <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
                  <img
                    className="h-5 w-5 object-contain"
                    src="/images/readrate.png"
                    alt="Read Rate icon"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Card */}
          <div className="flex justify-between items-center p-4 rounded-xl w-full shadow-sm bg-white">
            <div className="flex flex-row items-center gap-2 rounded-lg border border-slate-100 h-10 shadow-sm bg-white flex-1">
              <div className="flex justify-center items-center h-5 pl-3">
                <img
                  width="16.5px"
                  height="16.5px"
                  src="/images/search.png"
                  alt="Search icon"
                />
              </div>
              <div className="text-xs text-gray-400 font-normal flex-1 pl-2">
                Search announcement
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[120px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors ml-4">
              <div className="flex flex-row items-center gap-1">
                <div className="flex justify-center items-center h-5">
                  <img
                    width="16.3px"
                    height="16.3px"
                    src="/images/filter.png"
                    alt="Filter icon"
                  />
                </div>
                <div className="text-xs text-neutral-900 font-semibold">
                  Filter
                </div>
              </div>
              <div className="flex flex-col justify-center items-center w-4 h-4">
                <img
                  width="9.5px"
                  height="5.1px"
                  src="/images/dropdown.png"
                  alt="Dropdown icon"
                />
              </div>
            </div>
          </div>

          {/* Announcements List */}
          <div className="flex flex-col gap-4">
            {/* Announcement 1 */}
            <div className="flex flex-col p-4 rounded-xl w-full shadow-sm bg-white">
              <div className="flex justify-between items-start mb-3">
                {/* Title + Labels */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    General Tech Meeting
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-yellow-100">
                      <div className="text-[10px] text-yellow-800 font-medium">Medium</div>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-gray-100">
                      <div className="text-[10px] text-gray-800 font-medium">General</div>
                    </div>
                  </div>
                </div>
                {/* Read More */}
                <div className="px-4 py-1 rounded-lg border border-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <div className="text-xs text-gray-800 font-medium">Read More</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-normal mb-3 line-clamp-2">
                We're excited to welcome five new team members in January! Please greet them warmly during their first week: - Sarah Johnson (Marketing) - Mike Chen (Engineering) - Lisa Rodriguez (Sales) - David Kim (Product) - Emma Wilson (Design). Take a moment to introduce yourselves and offer any assistance as they settle in...
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
                <div>By: Management Team</div>
                <div>Published: 2025-08-29</div>
                <div className="flex items-center gap-1">
                  <img width="14px" height="14px" src="/images/readcount.png" alt="Read Count icon" />
                  <span>142/156 read (91%)</span>
                </div>
              </div>
            </div>

            {/* Announcement 2 */}
            <div className="flex flex-col p-4 rounded-xl w-full shadow-sm bg-white">
              <div className="flex justify-between items-start mb-3">
                {/* Title + Labels */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    General Tech Meeting
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-yellow-100">
                      <div className="text-[10px] text-yellow-800 font-medium">Medium</div>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-gray-100">
                      <div className="text-[10px] text-gray-800 font-medium">General</div>
                    </div>
                  </div>
                </div>
                {/* Read More */}
                <div className="px-4 py-1 rounded-lg border border-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <div className="text-xs text-gray-800 font-medium">Read More</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-normal mb-3 line-clamp-2">
                We're excited to welcome five new team members in January! Please greet them warmly during their first week: - Sarah Johnson (Marketing) - Mike Chen (Engineering) - Lisa Rodriguez (Sales) - David Kim (Product) - Emma Wilson (Design). Take a moment to introduce yourselves and offer any assistance as they settle in...
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
                <div>By: Management Team</div>
                <div>Published: 2025-08-29</div>
                <div className="flex items-center gap-1">
                  <img width="14px" height="14px" src="/images/readcount.png" alt="Read Count icon" />
                  <span>142/156 read (91%)</span>
                </div>
              </div>
            </div>

            {/* Announcement 3 */}
            <div className="flex flex-col p-4 rounded-xl w-full shadow-sm bg-white">
              <div className="flex justify-between items-start mb-3">
                {/* Title + Labels */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Security System Maintenance
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-red-100">
                      <div className="text-[10px] text-amber-700 font-medium">High</div>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-gray-100">
                      <div className="text-[10px] text-gray-800 font-medium">General</div>
                    </div>
                  </div>
                </div>
                {/* Read More */}
                <div className="px-4 py-1 rounded-lg border border-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <div className="text-xs text-gray-800 font-medium">Read More</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-normal mb-3 line-clamp-2">
                We're excited to welcome five new team members in January! Please greet them warmly during their first week: - Sarah Johnson (Marketing) - Mike Chen (Engineering) - Lisa Rodriguez (Sales) - David Kim (Product) - Emma Wilson (Design). Take a moment to introduce yourselves and offer any assistance as they settle in...
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
                <div>By: Facilities Team</div>
                <div>Published: 2025-08-29</div>
                <div className="flex items-center gap-1">
                  <img width="14px" height="14px" src="/images/readcount.png" alt="Read Count icon" />
                  <span>142/156 read (91%)</span>
                </div>
              </div>
            </div>

            {/* Announcement 4 */}
            <div className="flex flex-col p-4 rounded-xl w-full shadow-sm bg-white">
              <div className="flex justify-between items-start mb-3">
                {/* Title + Labels */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Security System Maintenance
                  </div>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 rounded-md bg-red-100">
                      <div className="text-[10px] text-amber-700 font-medium">High</div>
                    </div>
                    <div className="px-2 py-1 rounded-md bg-gray-100">
                      <div className="text-[10px] text-gray-800 font-medium">General</div>
                    </div>
                  </div>
                </div>
                {/* Read More */}
                <div className="px-4 py-1 rounded-lg border border-neutral-200 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <div className="text-xs text-gray-800 font-medium">Read More</div>
                </div>
              </div>
              <div className="text-xs text-gray-600 font-normal mb-3 line-clamp-2">
                We're excited to welcome five new team members in January! Please greet them warmly during their first week: - Sarah Johnson (Marketing) - Mike Chen (Engineering) - Lisa Rodriguez (Sales) - David Kim (Product) - Emma Wilson (Design). Take a moment to introduce yourselves and offer any assistance as they settle in...
              </div>
              <div className="flex items-center gap-6 text-xs text-gray-600 font-medium">
                <div>By: Facilities Team</div>
                <div>Published: 2025-08-29</div>
                <div className="flex items-center gap-1">
                  <img width="14px" height="14px" src="/images/readcount.png" alt="Read Count icon" />
                  <span>142/156 read (91%)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;