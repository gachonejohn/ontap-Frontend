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
  const isOverdue = detail.is_overdue || task.is_overdue;

  const priorityMap = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
    URGENT: "Urgent",
  };

  // Priority flag images
  const priorityFlags = {
    LOW: "/images/lowflag.png",
    MEDIUM: "/images/mediumflag.png",
    HIGH: "/images/highflag.png",
    URGENT: "/images/urgentflag.png",
  };

  const statusColors = {
    TO_DO: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    UNDER_REVIEW: "bg-purple-100 text-purple-800",
    CANCELLED: "bg-red-100 text-red-800",
    ON_HOLD: "bg-gray-100 text-gray-800",
  };

  // Check if task is overdue and not completed
  const showOverdueBadge = isOverdue && status !== "COMPLETED";

  return (
    <div
      key={task.id}
      className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200"
      onClick={() => onClick(detail)}
    >
      {/* Title and Priority Flag */}
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm text-neutral-900 font-semibold flex-1">{title}</div>
        <div className="flex flex-col items-end gap-1">
          {showOverdueBadge && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Overdue
            </span>
          )}
          {/* Priority Flag */}
          <img 
            src={priorityFlags[priority] || priorityFlags.MEDIUM} 
            alt={`${priorityMap[priority] || priority} priority`}
            width="20"
            height="20"
            className="object-contain"
            title={`${priorityMap[priority] || priority} Priority`}
          />
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
        {description}
      </div>

      {/* Dates + Priority */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1">
          <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
          <div className={`text-[10px] font-medium ${
            showOverdueBadge ? "text-red-600" : "text-gray-600"
          }`}>
            {dueDate ? new Date(dueDate).toLocaleDateString() : "No due date"}
            {showOverdueBadge && " • Overdue"}
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

// Blue rectangle component for column headers
const ColumnHeader = ({ icon, title, count, bgColor = "bg-blue-500" }) => (
  <div className={`flex flex-col justify-center items-center gap-2.5 pr-2 pl-2 rounded-lg h-12 shadow-sm ${bgColor}`}>
    <div className="flex flex-row justify-between items-center gap-9 w-full h-5">
      <div className="flex flex-row justify-start items-start gap-1">
        <img
          width="18px"
          height="18px"
          src="/images/taskstatus.png"
          alt={`${title} icon`}
        />
        <div className="flex flex-row justify-center items-center gap-2.5 w-11 h-5">
          <div className="font-inter text-base min-w-[45px] whitespace-nowrap text-white text-opacity-100 leading-tight font-medium">
            {title}
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center rounded border-neutral-200 border-t border-b border-l border-r border-solid border w-5 h-5">
        <div className="flex flex-row justify-center items-center gap-1 h-4">
          <div className="font-inter text-xs min-w-[8px] whitespace-nowrap text-white text-opacity-100 leading-snug tracking-normal font-semibold">
            {count}
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  // Fetch tasks from backend with increased page size to get all tasks for counting
  const { 
    data: tasksData, 
    isLoading: tasksLoading, 
    error: tasksError, 
    refetch: refetchTasks 
  } = useGetMyTasksQuery({
    page_size: 100, // Get all tasks to count properly
  });
  
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

  // Group tasks by status - limit to 2 latest for display, but count all
  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "TO_DO").slice(0, 2), // Limit to 2 latest for display
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").slice(0, 2), // Limit to 2 latest for display
    completed: tasks.filter((task) => task.status === "COMPLETED").slice(0, 2), // Limit to 2 latest for display
  };

  // Get total counts for display (using actual counts from all tasks)
  const totalCounts = {
    todo: tasks.filter((task) => task.status === "TO_DO").length,
    inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    completed: tasks.filter((task) => task.status === "COMPLETED").length,
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

      // 🔥 FIX: Extract user ID correctly - check if currentUser has nested user object
      const userId = currentUser?.user?.id || currentUser?.id;
      
      if (!userId) {
        console.error("Cannot determine user ID from currentUser:", currentUser);
        toast.error("Failed to create task: User ID not found");
        return;
      }

      // Create FormData object for file upload
      const formDataObj = new FormData();
      
      // Append all task data
      formDataObj.append("title", formData.title || "");
      formDataObj.append("description", formData.description || "");
      formDataObj.append("status", formData.status || "TO_DO");
      formDataObj.append("priority", formData.priority || "MEDIUM");
      
      // Use the extracted user ID
      formDataObj.append("assignee", userId);
      
      if (formData.department) {
        formDataObj.append("department", formData.department);
      }
      
      const startDate = formatDate(formData.start_date || formData.startDate);
      const dueDate = formatDate(formData.due_date || formData.dueDate);
      
      if (startDate) formDataObj.append("start_date", startDate);
      if (dueDate) formDataObj.append("due_date", dueDate);
      
      formDataObj.append("progress_percentage", formData.progress_percentage || formData.progressPercentage || 0);
      
      if (formData.estimated_hours || formData.estimatedHours) {
        formDataObj.append("estimated_hours", 
          parseFloat(formData.estimated_hours || formData.estimatedHours)
        );
      }
      
      formDataObj.append("is_urgent", Boolean(formData.is_urgent || formData.isUrgent));
      formDataObj.append("requires_approval", Boolean(
        formData.requires_approval || formData.requiresApproval
      ));

      // Append files if any
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataObj.append("files", file);
        });
      }

      // DEBUG: Log what we're sending
      console.log("Creating task with user ID:", userId);
      console.log("Full currentUser object:", currentUser);
      console.log("Form data received:", formData);

      // Use the FormData object for the API call
      await createTask(formDataObj).unwrap();
      toast.success("Task created successfully!");
      setIsLogTaskModalOpen(false);
      refetchTasks();
    } catch (err) {
      console.error("Task creation failed:", err);
      console.error("Error details:", err?.data);
      
      // Show specific error message if available
      if (err?.data?.assignee) {
        toast.error(`Assignee error: ${err.data.assignee[0]}`);
      } else if (err?.data?.detail) {
        toast.error(err.data.detail);
      } else {
        toast.error("Failed to create task");
      }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
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
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="To Do"
              count={totalCounts.todo}
              bgColor="bg-blue-500"
            />

            {/* Task Cards - Limited to 2 latest */}
            <div className="flex flex-col gap-4">
              {groupedTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.todo.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks to do
                </div>
              )}
              {totalCounts.todo > 2 && (
                <div className="text-center text-teal-600 text-sm py-2 font-medium">
                  +{totalCounts.todo - 2} more tasks in Task Management
                </div>
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col gap-4">
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="In Progress"
              count={totalCounts.inProgress}
              bgColor="bg-yellow-500"
            />

            {/* Task Cards - Limited to 2 latest */}
            <div className="flex flex-col gap-4">
              {groupedTasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.inProgress.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks in progress
                </div>
              )}
              {totalCounts.inProgress > 2 && (
                <div className="text-center text-teal-600 text-sm py-2 font-medium">
                  +{totalCounts.inProgress - 2} more tasks in Task Management
                </div>
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div className="flex flex-col gap-4">
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="Completed"
              count={totalCounts.completed}
              bgColor="bg-green-500"
            />

            {/* Task Cards - Limited to 2 latest */}
            <div className="flex flex-col gap-4">
              {groupedTasks.completed.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.completed.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No completed tasks
                </div>
              )}
              {totalCounts.completed > 2 && (
                <div className="text-center text-teal-600 text-sm py-2 font-medium">
                  +{totalCounts.completed - 2} more tasks in Task Management
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
              