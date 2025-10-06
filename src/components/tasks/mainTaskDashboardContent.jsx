// src/components/tasks/MainTaskDashboardContent.jsx
import React, { useState } from "react";
import {
  useGetTasksQuery,
  useGetTaskAnalyticsQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetTaskDetailQuery,
} from "../../store/services/tasks/tasksService";
import LogTaskModal from "./modals/LogTaskModal";
import TaskModal from "./modals/TaskModal";
import FileUploadModal from "./modals/FileUploadModal";

// TaskCard stays same as before…
const TaskCard = ({ task, onClick }) => {
  const { data: taskDetail } = useGetTaskDetailQuery(task.id);
  const detail = taskDetail || task;

  const description = detail.description || "No description provided";
  const title = detail.title || task.title;
  const dueDate = detail.due_date || task.due_date;
  const priority = detail.priority || task.priority;
  const assigneeName =
    detail.assignee_name || task.assignee_name || "Unassigned";
  const progress = detail.progress_percentage || task.progress_percentage || 0;
  const status = detail.status || task.status;

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
      className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors border border-transparent hover:border-slate-200"
      onClick={() => onClick(detail)}
    >
      {/* Title and Status */}
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm text-neutral-900 font-semibold flex-1">
          {title}
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status?.replace("_", " ") || "Unknown"}
        </span>
      </div>

      {/* Description */}
      <div className="text-xs text-gray-700 line-clamp-3 leading-relaxed">
        {description}
      </div>

      {/* Dates + Priority */}
      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center gap-1">
          <img
            width="12.2"
            height="12.2"
            src="/images/calendar1.png"
            alt="Calendar"
          />
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

      {/* Assignee */}
      <div className="pt-2 border-t border-neutral-200">
        <div className="flex items-center gap-1">
          <img
            width="11.5"
            height="12.8"
            src="/images/assignee.png"
            alt="Assignee"
          />
          <div className="text-[10px] text-gray-600 font-medium">
            Assigned to {assigneeName}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Progress</span>
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

export default function MainTaskDashboardContent() {
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState("taskManagement");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  // Define statusMap to fix the error
  const statusMap = {
    "All": "All Status",
    "TO_DO": "To Do",
    "IN_PROGRESS": "In Progress",
    "COMPLETED": "Completed",
    "UNDER_REVIEW": "Under Review",
    "ON_HOLD": "On Hold",
    "CANCELLED": "Cancelled"
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));

  // Fetch all tasks
  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useGetTasksQuery({
    search: searchTerm || undefined,
    status: statusFilter !== "All" ? statusFilter : undefined,
  });

  // Fetch analytics
  const { data: analyticsData } = useGetTaskAnalyticsQuery({});

  const [createTask] = useCreateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const tasks = tasksData?.results || [];
  const analytics = analyticsData?.results || [];

  const groupedTasks = {
    todo: tasks.filter((t) => t.status === "TO_DO"),
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS"),
    completed: tasks.filter((t) => t.status === "COMPLETED"),
    underReview: tasks.filter((t) => t.status === "UNDER_REVIEW"),
    onHold: tasks.filter((t) => t.status === "ON_HOLD"),
    cancelled: tasks.filter((t) => t.status === "CANCELLED"),
  };

  const handleCreateTask = async (formData) => {
    try {
      console.log("Form data received:", formData);

      const formatDate = (date) => {
        if (!date) return null;
        const dateObj = date instanceof Date ? date : new Date(date);
        return dateObj.toISOString().split("T")[0];
      };

      const apiData = {
        title: formData.title || "",
        description: formData.description || "",
        status: formData.status || "TO_DO",
        priority: formData.priority || "MEDIUM",
        assignee: formData.assignee ? parseInt(formData.assignee) : null,
        department: formData.department ? parseInt(formData.department) : null,
        start_date: formatDate(formData.start_date || formData.startDate),
        due_date: formatDate(formData.due_date || formData.dueDate),
        progress_percentage:
          parseInt(formData.progress_percentage || formData.progressPercentage) ||
          0,
        estimated_hours:
          formData.estimated_hours || formData.estimatedHours
            ? parseFloat(formData.estimated_hours || formData.estimatedHours)
            : null,
        is_urgent: Boolean(formData.is_urgent || formData.isUrgent),
        requires_approval: Boolean(
          formData.requires_approval || formData.requiresApproval
        ),
        parent_task: formData.parent_task || formData.parentTask || null,
      };

      const result = await createTask(apiData).unwrap();
      console.log("Task created successfully:", result);

      // Instead of finishing here, open FileUploadModal
      setSelectedTask(result);
      setIsLogTaskModalOpen(false);
      setIsFileUploadModalOpen(true);

      refetch();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await updateTaskStatus({ id: taskId, status: newStatus }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to update task status:", error);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">Task Management</div>
          <div className="text-sm text-gray-600 font-normal">
            Manage and track all team tasks
          </div>
        </div>
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
            <div className="text-sm text-white font-medium">New Task</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-row justify-between items-center gap-4 w-full">
        <div className="flex flex-row items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md min-w-[800px] transition-transform duration-200 hover:-translate-y-1 bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img width="16.5" height="16.5" src="/images/search.png" alt="Search icon" />
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
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <div className="flex flex-row items-center gap-1">
              <div className="flex justify-center items-center h-5">
                <img width="16.3" height="16.3" src="/images/filter.png" alt="Filter icon" />
              </div>
              <div className="text-xs text-neutral-900 font-semibold">
                {statusMap[statusFilter] || "All Status"}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center w-4 h-4">
              <img width="9.5px" height="5.1px" src="/images/dropdown.png" alt="Dropdown" />
            </div>
          </div>

          {/* Status Dropdown Menu */}
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

      {/* Tabs */}
      <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "taskManagement" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("taskManagement")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "taskManagement" ? "font-semibold" : "font-medium"
            }`}
          >
            Task Management
          </div>
        </div>
        <div
          className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${
            activeTab === "taskAnalytics" ? "bg-white" : ""
          }`}
          onClick={() => setActiveTab("taskAnalytics")}
        >
          <div
            className={`text-xs text-neutral-900 ${
              activeTab === "taskAnalytics" ? "font-semibold" : "font-medium"
            }`}
          >
            Task Analytics
          </div>
        </div>
      </div>

      {activeTab === "taskManagement" ? (
        /* Task Columns */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {/* To Do Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img width="14" height="14" src="/images/todo.png" alt="To Do icon" />
                <div className="text-base text-neutral-900 font-medium">To Do</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">
                  {groupedTasks.todo.length}
                </div>
              </div>
            </div>
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
                <img
                  width="14"
                  height="14"
                  src="/images/inprogress.png"
                  alt="In Progress"
                />
                <div className="text-base text-neutral-900 font-medium">In Progress</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">
                  {groupedTasks.inProgress.length}
                </div>
              </div>
            </div>
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
                <img
                  width="14"
                  height="14"
                  src="/images/completed.png"
                  alt="Completed"
                />
                <div className="text-base text-neutral-900 font-medium">Completed</div>
              </div>
              <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                <div className="text-xs text-neutral-900 font-semibold">
                  {groupedTasks.completed.length}
                </div>
              </div>
            </div>
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

          {/* Additional columns for other statuses */}
          {(groupedTasks.underReview.length > 0 || groupedTasks.onHold.length > 0 || groupedTasks.cancelled.length > 0) && (
            <div className="md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Under Review Column */}
              {groupedTasks.underReview.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img width="14" height="14" src="/images/review.png" alt="Under Review" />
                      <div className="text-base text-neutral-900 font-medium">Under Review</div>
                    </div>
                    <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                      <div className="text-xs text-neutral-900 font-semibold">
                        {groupedTasks.underReview.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {groupedTasks.underReview.map((task) => (
                      <TaskCard key={task.id} task={task} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* On Hold Column */}
              {groupedTasks.onHold.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img width="14" height="14" src="/images/hold.png" alt="On Hold" />
                      <div className="text-base text-neutral-900 font-medium">On Hold</div>
                    </div>
                    <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                      <div className="text-xs text-neutral-900 font-semibold">
                        {groupedTasks.onHold.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {groupedTasks.onHold.map((task) => (
                      <TaskCard key={task.id} task={task} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              )}

              {/* Cancelled Column */}
              {groupedTasks.cancelled.length > 0 && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img width="14" height="14" src="/images/cancelled.png" alt="Cancelled" />
                      <div className="text-base text-neutral-900 font-medium">Cancelled</div>
                    </div>
                    <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
                      <div className="text-xs text-neutral-900 font-semibold">
                        {groupedTasks.cancelled.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {groupedTasks.cancelled.map((task) => (
                      <TaskCard key={task.id} task={task} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Task Analytics Content */
        <div className="flex flex-col justify-between items-center gap-6 w-full">
          {/* Task Stats Cards */}
          <div className="flex flex-row justify-between items-center gap-3 w-full h-[123px]">
            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">Total Tasks</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      {tasks.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-neutral-900 font-semibold">
                {tasks.length} Tasks
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">Completed</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      {groupedTasks.completed.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-green-500 font-semibold">
                {groupedTasks.completed.length} Tasks
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${
                      tasks.length > 0
                        ? (groupedTasks.completed.length / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-4 rounded-xl w-64 h-[121px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 font-medium">In Progress</div>
                <div className="flex flex-col justify-start items-start gap-2.5 p-1 rounded border border-neutral-200 h-5 overflow-hidden">
                  <div className="flex flex-row justify-center items-center gap-1 h-4">
                    <div className="text-xs text-neutral-900 font-semibold">
                      {groupedTasks.inProgress.length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-yellow-500 font-semibold">
                {groupedTasks.inProgress.length} Tasks
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{
                    width: `${
                      tasks.length > 0
                        ? (groupedTasks.inProgress.length / tasks.length) * 100
                        : 0
                    }%`,
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
                      {tasks.filter((t) => t.is_overdue).length}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-lg text-red-500 font-semibold">
                {tasks.filter((t) => t.is_overdue).length} Tasks
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${
                      tasks.length > 0
                        ? (tasks.filter((t) => t.is_overdue).length / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Task Performance Section */}
          <div className="flex flex-col justify-start items-start gap-6 h-[334px] w-full">
            <div className="flex flex-row justify-start items-center gap-4 py-4 h-14 w-full">
              <div className="text-lg text-neutral-900 font-medium">Task Analytics</div>
            </div>
            <div className="flex flex-col justify-start items-start gap-4 h-64 w-full">
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-blue-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-blue-900 font-medium">Completion Rate</div>
                  <div className="text-xs text-blue-700 font-medium">
                    Team has completed {groupedTasks.completed.length} out of {tasks.length}{" "}
                    tasks. Current completion rate is{" "}
                    {tasks.length > 0
                      ? (
                          (groupedTasks.completed.length / tasks.length) *
                          100
                        ).toFixed(1)
                      : 0}
                    %.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-green-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-green-900 font-medium">Average Progress</div>
                  <div className="text-xs text-green-700 font-medium">
                    Team average task progress is{" "}
                    {tasks.length > 0
                      ? Math.round(
                          tasks.reduce(
                            (sum, task) => sum + (task.progress_percentage || 0),
                            0
                          ) / tasks.length
                        )
                      : 0}
                    %.
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center p-3 rounded-lg w-full h-[74px] bg-purple-50">
                <div className="flex flex-col justify-start items-start gap-2 w-full">
                  <div className="text-base text-purple-900 font-medium">
                    Priority Distribution
                  </div>
                  <div className="text-xs text-purple-700 font-medium">
                    High:{" "}
                    {
                      tasks.filter(
                        (t) => t.priority === "HIGH" || t.priority === "URGENT"
                      ).length
                    }{" "}
                    tasks, Medium:{" "}
                    {tasks.filter((t) => t.priority === "MEDIUM").length} tasks,
                    Low: {tasks.filter((t) => t.priority === "LOW").length} tasks.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        isHR={true}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        isHR={true}
        refetch={refetch}
      />

      <FileUploadModal
        isOpen={isFileUploadModalOpen}
        onClose={() => setIsFileUploadModalOpen(false)}
        taskId={selectedTask?.id}
        refetch={refetch}
      />
    </div>
  );
}