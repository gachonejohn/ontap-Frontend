import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useGetMyTasksQuery,
  useCreateTaskMutation,
  useGetTaskDetailQuery,
} from "../../store/services/tasks/tasksService";
import { PAGE_SIZE } from "@constants/constants";
import LogTaskModal from "./LogTaskModal";
import TaskModal from "./TaskModal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import OnboardingStepsBoard from "../../components/onboardingSteps/OnboardingStepsBoard";

const TaskCard = ({ task, onClick }) => {
  const { data: taskDetail } = useGetTaskDetailQuery(task.id);
  const detail = taskDetail || task;

  const description = detail.description || "No description provided";
  const title = detail.title || task.title;
  const dueDate = detail.due_date || task.due_date;
  const priority = detail.priority || task.priority;
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

  const showOverdueBadge = isOverdue && status !== "COMPLETED";

  return (
    <div
      key={task.id}
      className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200"
      onClick={() => onClick(detail)}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm text-neutral-900 font-semibold flex-1">{title}</div>
        <div className="flex flex-col items-end gap-1">
          {showOverdueBadge && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Overdue
            </span>
          )}
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

      <div className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
        {description}
      </div>

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

      <div className="pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-1">
          <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
          <div className="text-[10px] text-gray-600 font-medium">
            Assigned by {createdByName}
          </div>
        </div>
      </div>

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

const EmployeeTasksDashboardContent = () => {
  const [showOnboardingDashboard, setShowOnboardingDashboard] = useState(false);
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("taskManagement");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [daysFilter, setDaysFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDaysDropdownOpen, setIsDaysDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [allTasks, setAllTasks] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setAllTasks([]);
      setHasMore(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    setAllTasks([]);
    setHasMore(true);
  }, [statusFilter, debouncedSearchTerm]);

  const statusMap = {
    "All": "All Task",
    "TO_DO": "To Do",
    "IN_PROGRESS": "In Progress",
    "COMPLETED": "Completed",
    "UNDER_REVIEW": "Under Review",
    "ON_HOLD": "On Hold",
    "CANCELLED": "Cancelled",
    "OVERDUE": "Overdue"
  };

  const daysMap = {
    "All": "All Days",
    "1": "1 Day Ago",
    "3": "3 Days Ago",
    "7": "7 Days Ago",
    "10": "10 Days Ago",
    "14": "14 Days Ago",
    "21": "21 Days Ago",
    "30": "30 Days Ago",
    "60": "60 Days Ago",
    "90": "90 Days Ago"
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));
  const daysOptions = Object.entries(daysMap).map(([key, value]) => ({ key, value }));

  const currentUser = useSelector((state) => state.auth.user);

  const taskPermissions = useSelector((state) => {
    const permissions = state.auth.user?.role?.permissions;
    return permissions?.find(p => p.feature_code === "task" || p.feature_code === "task_management");
  });

  const canCreateTask = taskPermissions?.can_create;

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      page_size: PAGE_SIZE,
      search: debouncedSearchTerm || undefined,
      status: statusFilter !== "All" && statusFilter !== "OVERDUE" ? statusFilter : undefined,
    }),
    [currentPage, debouncedSearchTerm, statusFilter]
  );

  const {
    data: tasksData,
    refetch,
    isFetching,
    isLoading,
    error,
  } = useGetMyTasksQuery(queryParams);

  const [createTask] = useCreateTaskMutation();

  useEffect(() => {
    if (tasksData?.results) {
      if (currentPage === 1) {
        setAllTasks(tasksData.results);
      } else {
        setAllTasks(prev => {
          const newTasks = tasksData.results.filter(
            newTask => !prev.some(existingTask => existingTask.id === newTask.id)
          );
          return [...prev, ...newTasks];
        });
      }
      
      setHasMore(tasksData.next !== null);
    }
  }, [tasksData, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setCurrentPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isFetching]);

  const totalTasksCount = tasksData?.count || allTasks.length;

  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    if (statusFilter === "OVERDUE") {
      filtered = filtered.filter(task => task.is_overdue && task.status !== "COMPLETED");
    }

    if (daysFilter !== "All") {
      const today = new Date();
      const filterDays = parseInt(daysFilter);
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - filterDays);

      filtered = filtered.filter(task => {
        if (!task.created_at) return false;
        const taskCreatedDate = new Date(task.created_at);
        return taskCreatedDate >= pastDate && taskCreatedDate <= today;
      });
    }

    return filtered;
  }, [allTasks, statusFilter, daysFilter]);

  const groupedTasks = useMemo(() => ({
    todo: filteredTasks.filter((task) => task.status === "TO_DO"),
    inProgress: filteredTasks.filter((task) => task.status === "IN_PROGRESS"),
    completed: filteredTasks.filter((task) => task.status === "COMPLETED"),
  }), [filteredTasks]);

  const completedCount = groupedTasks.completed.length;
  const inProgressCount = groupedTasks.inProgress.length;
  const overdueCount = allTasks.filter(t => t.is_overdue && t.status !== "COMPLETED").length;

  const handleCreateTask = async (formData) => {
    try {
      console.log("=== HANDLE CREATE TASK ===");
      console.log("Form data received:", formData);

      const formatDate = (date) => {
        if (!date) return null;
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toISOString().split("T")[0];
      };

      const formDataObj = new FormData();
      
      if (!formData.title || formData.title.trim().length === 0) {
        toast.error("Task title is required");
        return;
      }
      
      if (!formData.description || formData.description.trim().length === 0) {
        toast.error("Task description is required");
        return;
      }

      formDataObj.append("title", formData.title.trim());
      formDataObj.append("description", formData.description.trim());
      formDataObj.append("status", formData.status || "TO_DO");
      formDataObj.append("priority", formData.priority || "MEDIUM");
      
      const userId = currentUser?.user?.id || currentUser?.id;
      
      if (!userId) {
        console.error("Cannot determine user ID from currentUser:", currentUser);
        toast.error("Failed to create task: User ID not found");
        return;
      }
      
      formDataObj.append("assignee", userId);
      
      if (formData.department) formDataObj.append("department", formData.department.toString());
      
      const startDate = formatDate(formData.start_date || formData.startDate);
      const dueDate = formatDate(formData.due_date || formData.dueDate);
      
      if (startDate) formDataObj.append("start_date", startDate);
      if (dueDate) formDataObj.append("due_date", dueDate);
      
      formDataObj.append("progress_percentage", 
        parseInt(formData.progress_percentage) || 0
      );
      
      if (formData.estimated_hours || formData.estimatedHours) {
        formDataObj.append("estimated_hours", 
          parseFloat(formData.estimated_hours || formData.estimatedHours).toString()
        );
      }
      
      formDataObj.append("is_urgent", formData.is_urgent ? "true" : "false");
      formDataObj.append("requires_approval", formData.requires_approval ? "true" : "false");

      if (formData.parent_task) {
        formDataObj.append("parent_task", formData.parent_task.toString());
      }

      if (formData.files && formData.files.length > 0) {
        formData.files.forEach((file) => {
          formDataObj.append("files", file);
        });
      }

      console.log("Creating task with user ID:", userId);
      console.log("Full currentUser object:", currentUser);
      console.log("Sending task creation request...");

      const result = await createTask(formDataObj).unwrap();
      console.log("Task created successfully:", result);

      toast.success("Task created successfully!");
      setIsLogTaskModalOpen(false);
      
      setCurrentPage(1);
      setAllTasks([]);
      setHasMore(true);
      refetch();
    } catch (error) {
      console.error("Failed to create task:", error);
      console.error("Error details:", error?.data);
      
      if (error?.data?.title) {
        toast.error(`Title error: ${error.data.title[0]}`);
      } else if (error?.data?.description) {
        toast.error(`Description error: ${error.data.description[0]}`);
      } else if (error?.data?.assignee) {
        toast.error(`Assignee error: ${error.data.assignee[0]}`);
      } else if (error?.data?.detail) {
        toast.error(error.data.detail);
      } else {
        toast.error("Failed to create task");
      }
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setIsStatusDropdownOpen(false);
  };

  const handleDaysFilterChange = (days) => {
    setDaysFilter(days);
    setIsDaysDropdownOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">Loading your tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">
          Error loading tasks: {error?.data?.detail || 'Unknown error'}
        </div>
      </div>
    );
  }

  if (showOnboardingDashboard) {
    return (
      <OnboardingStepsBoard onBack={() => setShowOnboardingDashboard(false)} />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            My Tasks
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage and track your assigned tasks
          </div>
        </div>

        <div className="flex flex-row items-center gap-3">
          <div className="flex justify-center items-center rounded-md w-[220px] h-12 bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors"
            onClick={() => setShowOnboardingDashboard(true)}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex justify-center items-center w-5 h-5">
                <img
                  width="15.3px"
                  height="15.3px"
                  src="/images/task.png"
                  alt="Dashboard icon"
                />
              </div>
              <div className="text-sm text-gray-800 font-medium">
                Other Tasks
              </div>
            </div>
          </div>
          {canCreateTask && (
            <div
              className="flex justify-center items-center rounded-md w-[180px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
              onClick={() => setIsLogTaskModalOpen(true)}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex justify-center items-center w-5 h-5">
                  <img
                    width="15.3px"
                    height="15.3px"
                    src="/images/addtask.png"
                    alt="Add Task icon"
                  />
                </div>
                <div className="text-sm text-white font-medium">
                  New Task
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center gap-4 w-full">
        <div className="flex flex-row items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md transition-transform duration-200 hover:-translate-y-1 bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img
              width="16.5px"
              height="16.5px"
              src="/images/search.png"
              alt="Search icon"
            />
          </div>
          <input
            type="text"
            placeholder="Search for tasks"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative">
          <div 
            className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[150px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsDaysDropdownOpen(!isDaysDropdownOpen)}
          >
            <div className="flex flex-row items-center gap-1">
              <div className="flex justify-center items-center h-5">
                <img width="16.3px" height="16.3px" src="/images/calendar1.png" alt="Days filter icon" />
              </div>
              <div className="text-xs text-neutral-900 font-semibold">
                {daysMap[daysFilter] || "All Days"}
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

          {isDaysDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10 max-h-60 overflow-y-auto">
              {daysOptions.map(({ key, value }) => (
                <div
                  key={key}
                  className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                    daysFilter === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                  }`}
                  onClick={() => handleDaysFilterChange(key)}
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <div 
            className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[150px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <div className="flex flex-row items-center gap-1">
              <div className="flex justify-center items-center h-5">
                <img width="16.3px" height="16.3px" src="/images/filter.png" alt="Filter icon" />
              </div>
              <div className="text-xs text-neutral-900 font-semibold">
                {statusMap[statusFilter] || "All Task"}
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

          {isStatusDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
              {statusOptions.map(({ key, value }) => (
                <div
                  key={key}
                  className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                    statusFilter === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                  }`}
                  onClick={() => handleStatusFilterChange(key)}
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'taskManagement' ? 'bg-white' : ''}`}
          onClick={() => setActiveTab('taskManagement')}
        >
          <div className={`text-xs text-neutral-900 ${activeTab === 'taskManagement' ? 'font-semibold' : 'font-medium'}`}>
            Task Management
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'taskAnalytics' ? 'bg-white' : ''}`}
          onClick={() => setActiveTab('taskAnalytics')}
        >
          <div className={`text-xs text-neutral-900 ${activeTab === 'taskAnalytics' ? 'font-semibold' : 'font-medium'}`}>
            Task Analytics
          </div>
        </div>
      </div>

      {activeTab === 'taskManagement' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div className="flex flex-col gap-4">
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="To Do"
              count={groupedTasks.todo.length}
              bgColor="bg-blue-500"
            />
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {groupedTasks.todo.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.todo.length === 0 && !isFetching && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks to do
                </div>
              )}
              {isFetching && groupedTasks.todo.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Loading tasks...
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="In Progress"
              count={groupedTasks.inProgress.length}
              bgColor="bg-yellow-500"
            />
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {groupedTasks.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.inProgress.length === 0 && !isFetching && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No tasks in progress
                </div>
              )}
              {isFetching && groupedTasks.inProgress.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Loading tasks...
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ColumnHeader
              icon="/images/taskstatus.png"
              title="Completed"
              count={groupedTasks.completed.length}
              bgColor="bg-green-500"
            />
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
              {groupedTasks.completed.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleCardClick} />
              ))}
              {groupedTasks.completed.length === 0 && !isFetching && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No completed tasks
                </div>
              )}
              {isFetching && groupedTasks.completed.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  Loading tasks...
                </div>
              )}
            </div>
          </div>

          <div 
            ref={observerTarget} 
            className="md:col-span-2 lg:col-span-3 h-10 flex items-center justify-center"
          >
            {isFetching && hasMore && (
              <div className="text-sm text-gray-500">Loading more tasks...</div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-between items-center gap-6 w-full">
          <div className="flex flex-row justify-between items-center gap-3 w-full h-[123px]">
            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">{totalTasksCount}</div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-neutral-900 font-semibold">{totalTasksCount} Tasks</div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">Completed</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">{completedCount}</div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-green-500 font-semibold">{completedCount} Tasks</div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ 
                    width: `${totalTasksCount > 0 ? (completedCount / totalTasksCount) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">In Progress</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">{inProgressCount}</div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-yellow-500 font-semibold">{inProgressCount} Tasks</div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ 
                    width: `${totalTasksCount > 0 ? (inProgressCount / totalTasksCount) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">Overdue</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      {overdueCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-red-500 font-semibold">
                {overdueCount} Tasks
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ 
                    width: `${totalTasksCount > 0 ? (overdueCount / totalTasksCount) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-6 h-[334px] w-full">
            <div className="flex flex-row justify-start items-center gap-4 py-4 h-14 w-full">
              <div className="text-lg text-neutral-900 font-medium">Task Performance</div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 h-64 w-full">
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-blue-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-blue-900 font-medium">Completion Rate</div>
                  <div className="text-xs text-blue-700 font-medium">
                    You have completed {completedCount} out of {totalTasksCount} tasks. 
                    Your current completion rate is {totalTasksCount > 0 ? ((completedCount / totalTasksCount) * 100).toFixed(1) : 0}%.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-green-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-green-900 font-medium">Average Progress</div>
                  <div className="text-xs text-green-700 font-medium">
                    Your average task progress is {allTasks.length > 0 ? Math.round(allTasks.reduce((sum, task) => sum + (task.progress_percentage || 0), 0) / allTasks.length) : 0}%.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-purple-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-purple-900 font-medium">Priority Distribution</div>
                  <div className="text-xs text-purple-700 font-medium">
                    High: {allTasks.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length} tasks, 
                    Medium: {allTasks.filter(t => t.priority === 'MEDIUM').length} tasks, 
                    Low: {allTasks.filter(t => t.priority === 'LOW').length} tasks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        refetch={() => {
          setCurrentPage(1);
          setAllTasks([]);
          setHasMore(true);
          refetch();
        }}
        taskPermissions={taskPermissions}
        onSubmit={handleCreateTask}  
      />
    </div>
  );
};

export default EmployeeTasksDashboardContent;
