import { CreateBreak } from "@components/attendance/breaks/CreateBreak";
import { useGetEmployeeBreaksQuery } from "@store/services/policies/policyService";
import { useState } from "react";
import Countdown from "react-countdown";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeaveModal from "../../dashboards/employee/components/LeaveModal";
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetTodayAttendaceQuery,
} from "../../store/services/attendance/attendanceService";
import { formatClockTime, formatHoursWorked } from "../../utils/dates";
import ActionModal from "../common/Modals/ActionModal";
import { isBreakActive } from "@utils/isBreakActive";

const EmployLeaveDashboardContent = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("leaveManagement");
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const {
    data: attendanceData,
    isLoading: loadingData,
    error,
    refetch,
  } = useGetTodayAttendaceQuery({}, { refetchOnMountOrArgChange: true });

  const {
    data: breakData,
    isLoading: loadingBreakData,
    error: breakError,
    refetch: refetchBreak,
  } = useGetEmployeeBreaksQuery({}, { refetchOnMountOrArgChange: true });

  const [checkIn, { isLoading: isClockingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isClockingOut }] = useCheckOutMutation();

  const [isNavigating, setIsNavigating] = useState(false);
  console.log("attendanceData", attendanceData);
  const clockIn = attendanceData?.clock_in;
  const clockOut = attendanceData?.clock_out;

  const openClockInModal = () => {
    setModalType("clockIn");
    setIsModalOpen(true);
  };
  console.log("breakData", breakData);
  const openClockOutModal = (id) => {
    console.log("Clicked ID:", id);
    setSelectedItem(id);
    setModalType("clockOut");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const refetchInfo = () => {
    refetch();
    refetchBreak();
  };
  const handleClockIn = async () => {
    try {
      const res = await checkIn().unwrap();
      const msg = res?.message || "Clocked in successfully!";
      toast.success(msg);

      setIsNavigating(true);
      await refetch();

      setTimeout(() => {
        navigate("/dashboard/tasks");
      }, 300);
    } catch (error) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || "Error clocking in!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
      closeModal();
      setIsNavigating(false);
    }
  };
  const handleCheckOut = async () => {
    console.log("selectedItem", selectedItem);
    try {
      const res = await checkOut(selectedItem).unwrap();
      const msg = res?.message || "Clocked out successfully!";
      toast.success(msg);
      setSelectedItem(null);
    } catch (error) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = error.data;
        console.log("errorData", errorData);
        toast.error(errorData.error || "Error clocking out!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    } finally {
      closeModal();
      refetch();
    }
  };
  const calculateBreakEndTime = (breakEndTime) => {
    // breakEndTime: e.g. "16:15:00"
    const [hours, minutes, seconds] = breakEndTime.split(":").map(Number);

    const now = new Date();
    const end = new Date(now);
    end.setHours(hours, minutes, seconds, 0);

    // If end time is already passed (e.g., API from earlier), return now
    if (end < now) return now;

    return end;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Leave Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            Leave & Attendance
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage your leave requests and track attendance
          </div>
        </div>
        <div
          className="flex justify-center items-center rounded-md w-[180px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
          onClick={() => setIsLeaveModalOpen(true)}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-center items-center w-5 h-5">
              <img
                width="15.4px"
                height="15.3px"
                src="/images/addtask.png"
                alt="Apply Leave icon"
              />
            </div>
            <div className="text-sm text-white font-medium">
              Apply for Leave
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 w-full items-center">
        {/* Today's Status with Sticker */}
        <div
          className="relative flex items-center p-4 rounded-xl min-h-[120px]  shadow-sm
         text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md overflow-hidden"
        >
          {/* Sticker Image as Background */}
          <img
            src="/images/card1.png"
            alt="Sticker background"
            className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
          />

          {/* Content */}
          <div className="flex flex-col justify-center h-full w-full relative z-10">
            {/* Status Text & Clock Icon */}
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col">
                <div className="text-sm font-medium">Today's Status</div>
                <div className="text-lg font-semibold">
                  {clockIn
                    ? `Clocked In: ${formatClockTime(clockIn)}`
                    : "Not clocked In"}
                </div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8  shadow-md">
                {/* <img
                  width="23"
                  height="23"
                  src="/images/clock.png"
                  alt="Clock Icon"
                /> */}
                <FiClock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Hours Today Card */}
        <div
          className="flex flex-col justify-between p-4 rounded-xl min-h-[120px]  shadow-sm
         bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">Hours Today</div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                width="20px"
                height="18px"
                src="/images/payday.png"
                alt="Payday icon"
              />
            </div>
          </div>
          <div className="text-lg text-neutral-900 font-semibold">
            {formatHoursWorked(attendanceData?.hours_worked)}
          </div>
        </div>

        {/* Status Card */}
        <div
          className="flex flex-col justify-between p-4 rounded-xl min-h-[120px]  shadow-sm
         bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 font-medium">Status</div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                width="20px"
                height="18px"
                src="/images/greenclock.png"
                alt="Status icon"
              />
            </div>
          </div>
          <div className="text-lg text-teal-500 font-semibold">
            {attendanceData?.status || "Unknown"}
          </div>
        </div>

        {/* Clock Out Button */}
        {/* <div className="flex justify-center items-center">
     
          {!clockIn ? (
            <button
              onClick={openClockInModal}
              className="flex justify-center items-center rounded-md w-[260px] h-[60px] bg-primary cursor-pointer hover:bg-primary-600 transition-colors text-white shadow-md"
            >
              Clock In
            </button>
          ) : clockIn && !attendanceData.clock_out ? (

            <button
              onClick={() => openClockOutModal(attendanceData.id)}
              className="flex justify-center items-center rounded-md w-[260px] h-[60px] bg-danger-600 cursor-pointer hover:bg-red-700 transition-colors text-white shadow-md"
            >
              Clock Out
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-amber-50 min-h-[120px]  shadow-sm rounded-xl p-4 border ">
              <div className="flex items-center gap-2 text-teal-600">
                <span className="text-base font-medium text-amber-700">
                  Clocked out at
                </span>
                <FiClock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-amber-700">
                {formatClockTime(attendanceData.clock_out)}
              </span>
            </div>
          )}
        </div> */}
        {/* Clock & Break Controls */}
        <div className="flex flex-col justify-center items-center gap-3">
          {/* If user hasn't clocked in yet */}
          {!clockIn ? (
            <button
              onClick={openClockInModal}
              className="w-[260px] h-[60px] bg-primary text-white rounded-md shadow-md hover:bg-primary-600 transition-colors"
            >
              Clock In
            </button>
          ) : clockIn && !attendanceData.clock_out ? (
            <>
              {/* If on break */}
              {breakData ? (
                isBreakActive(breakData.break_end) ? (
                  <div className="flex flex-col items-center gap-2 bg-blue-50 rounded-xl p-4 border shadow-sm">
                    <div className="text-blue-800 font-semibold">
                      On Break — Ends in:
                    </div>

                    <Countdown
                      key={breakData.id}
                      date={
                        new Date(
                          new Date().setHours(
                            ...breakData.break_end.split(":").map(Number)
                          )
                        )
                      }
                      renderer={({ minutes, seconds, completed }) => {
                        if (completed) {
                          return (
                            <span className="text-red-600 font-semibold">
                              Break ended
                            </span>
                          );
                        }
                        return (
                          <span className="text-lg font-semibold text-blue-700">
                            {String(minutes).padStart(2, "0")}:
                            {String(seconds).padStart(2, "0")}
                          </span>
                        );
                      }}
                    />

                    {/* <button
        // onClick={handleEndBreak}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        End Break
      </button> */}
                  </div>
                ) : (
                  <>
                    <CreateBreak refetchData={refetchInfo} />
                    <button
                      onClick={() => openClockOutModal(attendanceData.id)}
                      className="w-[150px] h-[50px] text-red-500 rounded-md shadow-md hover:bg-red-100 border border-red-500 transition-colors"
                    >
                      Clock Out
                    </button>
                  </>
                )
              ) : (
                <>
                  <CreateBreak refetchData={refetchInfo} />
                  <button
                    onClick={() => openClockOutModal(attendanceData.id)}
                    className="w-[150px] h-[50px] text-red-500 rounded-md shadow-md hover:bg-red-100 border border-red-500 transition-colors"
                  >
                    Clock Out
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-amber-50 rounded-xl p-4 border shadow-sm">
              <span className="text-base text-amber-700 font-medium">
                Clocked out at
              </span>
              <span className="text-2xl font-bold text-amber-700">
                {formatClockTime(attendanceData.clock_out)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "leaveManagement" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("leaveManagement")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "leaveManagement" ? "font-semibold" : "font-medium"
            }`}
          >
            Leave Management
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "leaveBalance" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("leaveBalance")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "leaveBalance" ? "font-semibold" : "font-medium"
            }`}
          >
            Leave Balance
          </div>
        </div>
      </div>

      {activeTab === "leaveManagement" ? (
        /* Leave Requests Table */
        <div className="flex flex-col rounded-xl w-full shadow-sm bg-white overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-row justify-between items-center p-4 w-full h-20 border-b border-neutral-200">
            <div className="text-lg text-neutral-900 font-medium">
              My Leave Requests
            </div>
            <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[75px] h-11 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-1">
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
            </div>
          </div>

          {/* Table Content */}
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Type
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Duration
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Days
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Status
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Applied On
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Approver
                  </th>
                  <th className="p-4 text-xs text-gray-500 font-medium text-left">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Row 1 - Annual Leave */}
                <tr className="border-b border-neutral-200">
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-blue-50 min-w-[90px]">
                      <div className="text-xs text-blue-900 font-medium">
                        Annual Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to
                      2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">15</div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-yellow-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/pending.png"
                            alt="Pending icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-yellow-800 font-medium">
                          Pending
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">HR</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-red-600 font-medium">
                          Cancel
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 2 - Sick Leave */}
                <tr className="border-b border-neutral-200">
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-orange-50 min-w-[90px]">
                      <div className="text-xs text-yellow-800 font-medium">
                        Sick Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to
                      2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">2</div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-green-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/approved.png"
                            alt="Approved icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-green-800 font-medium">
                          Approved
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">HR</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Row 3 - Personal Leave */}
                <tr>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg h-9 bg-purple-50 min-w-[90px]">
                      <div className="text-xs text-purple-900 font-medium">
                        Personal Leave
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-normal">
                      <span className="font-medium">2025-08-25</span> to
                      2025-09-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-800 font-medium">2</div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg w-[90px] h-9 bg-red-100">
                      <div className="flex items-center gap-1">
                        <div className="flex justify-center items-center w-4 h-4">
                          <img
                            width="16"
                            height="16"
                            src="/images/denied.png"
                            alt="Denied icon"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-orange-800 font-medium">
                          Denied
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">
                      2025-08-10
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-gray-800 font-medium">HR</div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center gap-2.5 py-1 px-5 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="text-xs text-gray-800 font-medium">
                          View
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Leave Balance Content */
        <div className="flex flex-col justify-between items-center gap-6 w-full">
          {/* Leave Balance Cards */}
          <div className="flex flex-row justify-between items-center gap-3 w-full h-[123px]">
            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Annual Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      8/25
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">Used</div>
                  <div className="text-xs text-neutral-900 font-medium">
                    8 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "32%" }}
                  ></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    17 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Sick Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      3/10
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">Used</div>
                  <div className="text-xs text-neutral-900 font-medium">
                    3 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    7 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Personal Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 w-8 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      2/5
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">Used</div>
                  <div className="text-xs text-neutral-900 font-medium">
                    2 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    3 days
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">
                  Maternity Leave
                </div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      0/90
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-1.5 h-[53px] w-full">
                <div className="flex flex-row justify-between items-center w-full h-4">
                  <div className="text-xs text-gray-600 font-medium">Used</div>
                  <div className="text-xs text-neutral-900 font-medium">
                    0 days
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-pink-500 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full h-3.5">
                  <div className="text-xs text-gray-600 font-medium">
                    Remaining
                  </div>
                  <div className="text-xs text-teal-500 font-medium">
                    90 days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Policy Section */}
          <div className="flex flex-col justify-start items-start gap-6 h-[334px] w-full">
            <div className="flex flex-row justify-start items-center gap-4 py-4 h-14 w-full">
              <div className="text-lg text-neutral-900 font-medium">
                Leave Policy
              </div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 h-64 w-full">
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-blue-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-blue-900 font-medium">
                    Annual leave
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    You are entitled to 25 days of annual leave per year. Unused
                    leave can be carried forward to the next year (maximum 5
                    days).
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-orange-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-yellow-800 font-medium">
                    Sick leave
                  </div>
                  <div className="text-xs text-orange-700 font-medium">
                    You can take up to 10 days of sick leave per year. Medical
                    certificate required for leaves longer than 2 consecutive
                    days.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-purple-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-purple-900 font-medium">
                    Personal Leave
                  </div>
                  <div className="text-xs text-purple-700 font-medium">
                    You are entitled to 5 days of personal leave per year for
                    urgent personal matters that cannot be scheduled outside
                    work hours.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <LogTaskModal
  isOpen={isTaskModalOpen}
  onClose={() => setIsTaskModalOpen(false)}
  onSubmit={onSubmit} 
  isHR={false} 
/> */}
      {/* Leave Modal */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        // onSubmit={handleLeaveSubmit}
      />
      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        actionType={modalType === "clockIn" ? "submit" : "delete"}
        onDelete={modalType === "clockIn" ? handleClockIn : handleCheckOut}
        isDeleting={isClockingIn || isClockingOut}
        title={
          modalType === "clockIn" ? "Confirm Clock In" : "Confirm Clock Out"
        }
        confirmationMessage={
          modalType === "clockIn"
            ? "Are you sure you want to clock in now?"
            : "Are you sure you want to clock out now?"
        }
        extraInfo={
          modalType === "clockOut"
            ? {
                pending: attendanceData?.pending_tasks ?? 0,
                inProgress: attendanceData?.in_progress_tasks ?? 0,
                link: "/dashboard/tasks",
                linkText: "Go to Tasks Dashboard",
              }
            : null
        }
        deleteMessage="This action will update your attendance records."
        actionText={modalType === "clockIn" ? "Clock In" : "Clock Out"}
      />
    </div>
  );
};

export default EmployLeaveDashboardContent;
