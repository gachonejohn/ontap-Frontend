import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import DropdownAuthenticationModal from "../../dashboards/employee/components/DropdownAuthenticationModal";
import LeaveModal from "../../dashboards/employee/components/LeaveModal.js";
import LogTaskModal from "../tasks/LogTaskModal";
import TaskModal from "../tasks/TaskModal";
import {
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useGetTaskDetailQuery,
} from "../../store/services/tasks/tasksService";
import {
  useGetTodayAttendaceQuery,
  useCheckInMutation,
  useCheckOutMutation,
} from "../../store/services/attendance/attendanceService";
import { formatClockTime } from "../../utils/dates";
import ActionModal from "../common/Modals/ActionModal";
import ContentSpinner from "@components/common/spinners/dataLoadingSpinner";

// Component for individual task card
const TaskCard = ({ task, onClick }) => {
  // Fetch full details including description
  const { data: taskDetail } = useGetTaskDetailQuery(task.id);
  const detail = taskDetail || task;

  const description = detail.description || "No description provided";
  const title = detail.title || task.title;
  const dueDate = detail.due_date || task.due_date;
  const priority = detail.priority || task.priority;
  const assigneeName = detail.assignee_name || task.assignee_name || "Unassigned";
  const progress = detail.progress_percentage || task.progress_percentage || 0;
  const status = detail.status || task.status;
  const createdByName = detail.created_by_name || task.created_by_name || "System";

  const priorityMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  const statusColors = {
    TO_DO: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    UNDER_REVIEW: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
    ON_HOLD: "bg-gray-100 text-gray-800",
  };

  return (
    <div
      key={task.id}
      className="flex flex-col gap-3 p-4 rounded-xl
       bg-slate-50/80 cursor-pointer hover:bg-slate-100/
        transition-colors border border-transparent
         hover:border-slate-200"
      onClick={() => onClick(detail)}
    >
      {/* Title and Status */}
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm text-neutral-900 font-semibold flex-1">{title}</div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
          {status?.replace('_', ' ') || 'Unknown'}
        </span>
      </div>

      {/* Description */}
      <div className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
        {description}
      </div>

      {/* Dates + Priority */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1">
          <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
          <div className="text-[10px] text-gray-600 font-medium">
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
          </div>
        </div>
        <div
          className={`flex items-center justify-center py-0.5 px-2 rounded-md ${
            priority === "HIGH" || priority === "URGENT"
              ? "bg-red-100"
              : priority === "MEDIUM"
              ? "bg-yellow-100"
              : "bg-green-100"
          }`}
        >
          <div
            className={`text-[10.5px] font-semibold ${
              priority === "HIGH" || priority === "URGENT"
                ? "text-pink-800"
                : priority === "MEDIUM"
                ? "text-yellow-800"
                : "text-green-800"
            }`}
          >
            {priorityMap[priority] || priority}
          </div>
        </div>
      </div>

      {/* Assigned by */}
      <div className="pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-1">
          <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
          <div className="text-[10px] text-gray-600 font-medium">
            Assigned by {createdByName}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Your Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-teal-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmployeeDashboardContent = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAmountVisible, setIsAmountVisible] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [actualAmount, setActualAmount] = useState("$1,250.00");
  const [eyeIconPosition, setEyeIconPosition] = useState({ top: 0, right: 0 });
  const [modalType, setModalType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get logged-in user
  const currentUser = useSelector((state) => state.auth.user);

  // Get task permissions
  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(
      (p) => p.feature_code === "task" || p.feature_code === "task_management"
    );
  });

  const canCreateTask = taskPermissions?.can_create;

  // Fetch tasks from backend
  const { data: tasksData, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useGetMyTasksQuery();
  
  // Fetch attendance data from backend
  const {
    data: attendanceData,
    isLoading: attendanceLoading,
    error: attendanceError,
    refetch: refetchAttendance,
  } = useGetTodayAttendaceQuery({}, { refetchOnMountOrArgChange: true });

  const [createTask] = useCreateTaskMutation();
  const [checkIn, { isLoading: isClockingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isClockingOut }] = useCheckOutMutation();

  const tasks = tasksData?.results || [];
  const clockIn = attendanceData?.clock_in;
  const clockOut = attendanceData?.clock_out;

  // Group tasks by status
  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "TO_DO"),
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS"),
    completed: tasks.filter((task) => task.status === "COMPLETED"),
  };

  const toggleAmountVisibility = () => {
    setIsAmountVisible((prev) => !prev);
  };

  const handleAuthentication = (enteredPassword) => {
    if (enteredPassword.length >= 5) {
      setIsAuthenticated(true);
      setIsAuthModalOpen(false);
      setIsAmountVisible(true);
    } else {
      alert("Password must be at least 5 characters long. Please try again.");
    }
  };

  const handleViewAmountClick = (e) => {
    if (isAuthenticated) {
      toggleAmountVisibility();
    } else {
      const rect = e.target.getBoundingClientRect();
      setEyeIconPosition({
        top: rect.top,
        right: rect.right
      });
      setIsAuthModalOpen(true);
    }
  };

  const handleLeaveSubmit = (formData) => {
    console.log("Leave application submitted:", formData);
  };

  // Handle new task creation
  const handleCreateTask = async (formData) => {
    try {
      const formatDate = (date) =>
        date ? new Date(date).toISOString().split("T")[0] : null;

      const payload = {
        title: formData.title,
        description: formData.description || "",
        status: formData.status || "TO_DO",
        priority: formData.priority || "MEDIUM",
        assignee: currentUser?.id,
        department: formData.department || null,
        start_date: formatDate(formData.startDate),
        due_date: formatDate(formData.dueDate),
        progress_percentage: formData.progressPercentage || 0,
        estimated_hours: formData.estimatedHours || null,
        is_urgent: formData.isUrgent || false,
        requires_approval: formData.requiresApproval || false,
      };

      await createTask(payload).unwrap();
      toast.success("Task created successfully!");
      setIsLogTaskModalOpen(false);
      refetchTasks();
    } catch (err) {
      console.error("Task creation failed:", err);
      toast.error("Failed to create task");
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Clock in/out functions
  const openClockInModal = () => {
    setModalType("clockIn");
    setIsModalOpen(true);
  };

  const openClockOutModal = (id) => {
    setSelectedItem(id);
    setModalType("clockOut");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClockIn = async () => {
    try {
      const res = await checkIn().unwrap();
      const msg = res?.message || "Clocked in successfully!";
      toast.success(msg);
    } catch (error) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || "Error clocking in!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    } finally {
      closeModal();
      refetchAttendance();
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await checkOut(selectedItem).unwrap();
      const msg = res?.message || "Clocked out successfully!";
      toast.success(msg);
      setSelectedItem(null);
    } catch (error) {
      console.log("error", error);
      if (error && typeof error === "object" && "data" in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || "Error clocking out!.");
      } else {
        toast.error("Unexpected Error occured. Please try again.");
      }
    } finally {
      closeModal();
      refetchAttendance();
    }
  };

  if (tasksLoading || attendanceLoading) {
    return (
     <ContentSpinner />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 
      sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Today's Status with Sticker */}
        <div className="relative flex items-center p-4 rounded-xl h-[120px] shadow-lg text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
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
                <div className="mt-2 text-lg font-semibold">
                  {clockIn
                    ? `Clocked In: ${formatClockTime(clockIn)}`
                    : "Not clocked In"}
                </div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-white">
                <img
                  width="23"
                  height="23"
                  src="/images/clock.png"
                  alt="Clock Icon"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Next Payday Card */}
        <div className="flex items-center p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex flex-col justify-between w-full h-full">
            {/* Top Row: Title + Date + Payday Icon */}
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col gap-0.5">
                <div className="font-inter text-sm text-gray-600 leading-snug tracking-normal font-medium">
                  Next Payday
                </div>
                <div className="font-inter text-xs text-gray-600 leading-snug tracking-normal font-normal">
                  August 26, 2025
                </div>
              </div>
              <div className="flex items-center justify-center p-1 rounded-2xl h-7 w-7 bg-blue-100">
                <img
                  width="20px"
                  height="18px"
                  src="/images/payday.png"
                  alt="Payday icon"
                />
              </div>
            </div>

            {/* Bottom Row: Amount + View Button */}
            <div className="flex flex-row justify-between items-center w-full mt-2">
              <div className="font-inter text-lg text-neutral-900 leading-tight font-semibold">
                {isAmountVisible ? actualAmount : "*****"}
              </div>
              <div
                className="flex items-center justify-center h-4 cursor-pointer"
                onClick={handleViewAmountClick}
              >
                <img
                  width="20px"
                  height="20px"
                  src={isAmountVisible ? "/images/eye-slash.png" : "/images/eye.png"}
                  alt={isAmountVisible ? "Hide amount" : "Show amount"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ID Card - Teal Version */}
        <div className="relative flex flex-col justify-start items-start p-4 rounded-xl h-[120px] shadow-lg text-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
          {/* Teal Background */}
          <div className="absolute inset-0 w-full h-full bg-teal-500 rounded-xl z-0"></div>

          {/* Content */}
          <div className="relative z-10 w-full h-full">
            {/* Top Section: Company & QR Code */}
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col justify-start items-start gap-1">
                <div className="text-xs font-bold">OnTap Technologies</div>
                <div className="text-[10px] text-teal-100 font-medium">Employee ID</div>
              </div>
              <div className="flex justify-center items-center rounded-md w-7 h-7 bg-white/40 hover:bg-white/60 transition-colors duration-200">
                <img
                  width="18px"
                  height="18px"
                  src="/images/qrcode.png"
                  alt="QR Code icon"
                />
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex flex-row justify-start items-center gap-2 mt-2">
              <img
                className="rounded-full border-2 border-emerald-300 overflow-hidden"
                src="/images/avatar.png"
                alt="Profile"
                width="35px"
                height="35px"
              />
              <div className="flex flex-col justify-start items-start gap-0.5">
                <div className="text-xs font-bold">
                  {currentUser?.first_name} {currentUser?.last_name}
                </div>
                <div className="text-[10px] text-teal-100 font-medium">
                  {/* Safely handle role which might be an object */}
                  {currentUser?.role ? (
                    typeof currentUser.role === 'string' ? currentUser.role : 
                    currentUser.role.name || currentUser.role.title || "Employee"
                  ) : "Employee"}
                </div>
                <div className="text-[10px] text-teal-100 font-medium">
                  ID: {currentUser?.employee_id || "N/A"}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute bottom-3 right-3 flex justify-center items-center rounded-lg px-2 h-5 bg-white">
              <div className="text-[10px] text-teal-500 font-medium">Active</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 justify-center h-[120px] w-full">
          {/* Clock In/Out Button */}
          {!clockIn ? (
            <button
              onClick={openClockInModal}
              className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] bg-teal-500 text-white text-sm font-normal hover:bg-teal-600 transition-colors"
            >
              Clock In
            </button>
          ) : clockIn && !attendanceData?.clock_out ? (
            <button
              onClick={() => openClockOutModal(attendanceData.id)}
              className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] bg-red-500 text-white text-sm font-normal hover:bg-red-600 transition-colors"
            >
              Clock Out
            </button>
          ) : (
            <button
              onClick={openClockInModal}
              className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] bg-teal-500 text-white text-sm font-normal hover:bg-teal-600 transition-colors"
            >
              Clock In
            </button>
          )}
          
          {/* Permission-based Log Task Button */}
          {canCreateTask && (
            <button
              onClick={() => setIsLogTaskModalOpen(true)}
              className="flex justify-center items-center rounded-md h-10 w-full max-w-[120px] shadow-sm bg-white text-neutral-900 text-sm font-normal hover:bg-gray-100 transition-colors"
            >
              Log Task
            </button>
          )}
        </div>
      </div>

      {/* My Tasks Section */}
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex justify-between items-center h-8">
          <div className="text-lg text-neutral-900 font-semibold">My Tasks</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* To Do Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/todo.png" alt="To Do icon" />
                <div className="text-base text-neutral-900 font-medium">To Do</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">{groupedTasks.todo.length}</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {groupedTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.todo.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks to do
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/inprogress.png" alt="In Progress" />
                <div className="text-base text-neutral-900 font-medium">In Progress</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">{groupedTasks.inProgress.length}</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {groupedTasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.inProgress.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks in progress
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/completed.png" alt="Completed" />
                <div className="text-base text-neutral-900 font-medium">Completed</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">{groupedTasks.completed.length}</div>
              </div>
            </div>

            {/* Task Cards */}
            <div className="flex flex-col gap-4">
              {groupedTasks.completed.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.completed.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No completed tasks
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements & Trainings Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Announcements */}
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white">
          <div className="text-lg text-neutral-900 font-semibold">
            Announcements
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  Company Holiday: Labor Day Schedule
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 26, 2025
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  Office Relocation Update
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 28, 2025
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 rounded bg-gray-50">
              <div className="flex flex-col">
                <div className="text-sm text-neutral-900 font-medium">
                  New Remote Work Policy
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  Aug 28, 2025
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trainings */}
        <div className="flex flex-col gap-4 p-4 rounded-xl shadow-lg bg-white">
          <div className="text-lg text-neutral-900 font-semibold">
            Trainings
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  Effective Communication Skills
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  65%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  Hands-on Manager
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  83%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-sm text-neutral-900 font-medium">
                  New Staff Onboarding
                </div>
                <div className="text-xs text-neutral-900 font-normal">
                  95%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-teal-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
      />

      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        refetch={refetchTasks}
      />

      <DropdownAuthenticationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthentication}
        position={eyeIconPosition}
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
        deleteMessage="This action will update your attendance records."
        actionText={modalType === "clockIn" ? "Clock In" : "Clock Out"}
      />
    </div>
  );
};

export default EmployeeDashboardContent;