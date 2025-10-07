import { apiSlice } from "../../api/apiSlice";

// Enhanced normalizeTask function with better field handling
const normalizeTask = (task) => ({
  ...task,
  // Normalize date fields
  dueDate: task.due_date || task.dueDate,
  startDate: task.start_date || task.startDate,
  
  // Normalize progress and numeric fields
  progressPercentage: task.progress_percentage || task.progressPercentage || 0,
  estimatedHours: task.estimated_hours || task.estimatedHours,
  
  // Normalize boolean fields
  isUrgent: task.is_urgent || task.isUrgent || false,
  requiresApproval: task.requires_approval || task.requiresApproval || false,
  isOverdue: task.is_overdue || task.isOverdue || false,
  
  // Normalize description with fallback
  description: task.description || "No description available",
  
  // Normalize user-related fields with better fallbacks
  assigneeName: task.assignee_name || task.assignee?.full_name || task.assigneeName || "Unassigned",
  createdByName: task.created_by_name || task.created_by?.full_name || task.createdByName || "System",
  
  // Normalize department field
  departmentName: task.department_name || task.department?.name || task.departmentName || "Not specified",
  
  // Ensure consistent status and priority
  status: task.status || "TO_DO",
  priority: task.priority || "MEDIUM",
  
  // Normalize counts with fallbacks
  attachmentsCount: task.attachments_count || task.attachmentsCount || 0,
  commentsCount: task.comments_count || task.commentsCount || 0,
  subtasksCount: task.subtasks_count || task.subtasksCount || 0,
  
  // Preserve original IDs
  assigneeId: task.assignee || task.assigneeId,
  departmentId: task.department || task.departmentId,
  createdById: task.created_by || task.createdById,
});

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * ========================
     * TASK QUERIES (READ)
     * ========================
     */

    getTasks: builder.query({
      query: ({ page, page_size, search, status, priority, ordering, assignee, department } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        if (search) params.search = search;
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (ordering) params.ordering = ordering;
        if (assignee) params.assignee = assignee;
        if (department) params.department = department;
        
        return { url: "tasks/api/tasks/", method: "GET", params };
      },
      transformResponse: (response) => ({
        ...response,
        results: response.results.map(normalizeTask),
      }),
      providesTags: ["Tasks"],
    }),

    getMyTasks: builder.query({
      query: ({ page, page_size, search, status, priority, ordering } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        if (search) params.search = search;
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (ordering) params.ordering = ordering;
        
        return { url: "tasks/api/tasks/my_tasks/", method: "GET", params };
      },
      transformResponse: (response) => ({
        ...response,
        results: response.results.map(normalizeTask),
      }),
      providesTags: ["MyTasks"],
    }),

    getTaskAnalytics: builder.query({
      query: ({ page, page_size, search, ordering, timeframe } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        if (search) params.search = search;
        if (ordering) params.ordering = ordering;
        if (timeframe) params.timeframe = timeframe; // e.g., "week", "month", "quarter"
        
        return { url: "tasks/api/tasks/analytics/", method: "GET", params };
      },
      providesTags: ["TaskAnalytics"],
    }),

    getTaskDetail: builder.query({
      query: (id) => ({ 
        url: `tasks/api/tasks/${id}/`, 
        method: "GET" 
      }),
      transformResponse: (task) => normalizeTask(task),
      providesTags: (result, error, id) => [{ type: "TaskDetail", id }],
    }),

    /**
     * ========================
     * TASK COMMENTS - FIXED
     * ========================
     */

    getTaskComments: builder.query({
      query: (task_pk, { page, page_size, ordering = "-created_at" } = {}) => {
        const params = {};
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        if (ordering) params.ordering = ordering;
        
        return { 
          url: `tasks/api/tasks/${task_pk}/comments/`, 
          method: "GET", 
          params 
        };
      },
      providesTags: (result, error, task_pk) => [
        { type: "TaskComments", id: task_pk }
      ],
    }),

    createTaskComment: builder.mutation({
      query: ({ task_pk, data }) => ({
        url: `tasks/api/tasks/${task_pk}/comments/`,
        method: "POST",
        body: {
          content: data.content,
          user: data.user,
          // Remove is_internal since it's not required and causing issues
        },
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskComments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
        "TaskAnalytics"
      ],
    }),

    updateTaskComment: builder.mutation({
      query: ({ task_pk, id, data }) => ({
        url: `tasks/api/tasks/${task_pk}/comments/${id}/`,
        method: "PUT",
        body: {
          content: data.content,
          user: data.user,
        },
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskComments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
      ],
    }),

    deleteTaskComment: builder.mutation({
      query: ({ task_pk, id }) => ({
        url: `tasks/api/tasks/${task_pk}/comments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskComments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
        "TaskAnalytics"
      ],
    }),

    /**
     * ========================
     * TASK MUTATIONS (WRITE) - ENHANCED
     * ========================
     */

    createTask: builder.mutation({
      query: (formData) => ({ 
        url: "tasks/api/tasks/", 
        method: "POST", 
        body: formData,
        // Note: No Content-Type header needed - browser will set it automatically with boundary
      }),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => {
        // Ensure required fields are always included with current values
        const updateData = {
          title: data.title || data.currentTitle, // Use current title if not provided
          description: data.description || data.currentDescription, // Use current description if not provided
          status: data.status,
          priority: data.priority,
          assignee: data.assignee,
          department: data.department,
          start_date: data.start_date || data.startDate,
          due_date: data.due_date || data.dueDate,
          progress_percentage: data.progress_percentage || data.progressPercentage,
          estimated_hours: data.estimated_hours || data.estimatedHours,
          parent_task: data.parent_task || data.parentTask,
          is_urgent: data.is_urgent || data.isUrgent,
          requires_approval: data.requires_approval || data.requiresApproval,
        };
        
        // Remove undefined values
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined) {
            delete updateData[key];
          }
        });
        
        return { 
          url: `tasks/api/tasks/${id}/`, 
          method: "PUT", 
          body: updateData
        };
      },
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        "MyTasks",
        "TaskAnalytics",
        { type: "TaskDetail", id },
      ],
    }),

    deleteTask: builder.mutation({
      query: (id) => ({ 
        url: `tasks/api/tasks/${id}/`, 
        method: "DELETE" 
      }),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    updateTaskStatus: builder.mutation({
      query: ({ id, status, progress_percentage, comment }) => ({ 
        url: `tasks/api/tasks/${id}/update_status/`, 
        method: "PATCH", 
        body: { 
          status,
          progress_percentage,
          comment 
        }
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        "MyTasks",
        "TaskAnalytics",
        { type: "TaskDetail", id },
      ],
    }),

    bulkUpdateTasks: builder.mutation({
      query: (data) => ({ 
        url: "tasks/api/tasks/bulk_update/", 
        method: "POST", 
        body: data 
      }),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    archiveTask: builder.mutation({
      query: (id) => ({ 
        url: `tasks/api/tasks/${id}/archive/`, 
        method: "POST" 
      }),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    /**
     * ========================
     * TASK ATTACHMENTS - ENHANCED
     * ========================
     */

    getTaskAttachments: builder.query({
      query: (task_pk) => ({
        url: `tasks/api/tasks/${task_pk}/attachments/`,
        method: "GET",
      }),
      providesTags: (result, error, task_pk) => [
        { type: "TaskAttachments", id: task_pk }
      ],
    }),

    uploadTaskAttachment: builder.mutation({
      query: ({ task_pk, formData }) => ({
        url: `tasks/api/tasks/${task_pk}/attachments/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskAttachments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
        "Tasks",
        "MyTasks",
      ],
    }),

    // 🔹 NEW: update attachment (PUT or PATCH)
    updateTaskAttachment: builder.mutation({
      query: ({ task_pk, id, formData, partial = true }) => ({
        url: `tasks/api/tasks/${task_pk}/attachments/${id}/`,
        method: partial ? "PATCH" : "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { task_pk, id }) => [
        { type: "TaskAttachments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
      ],
    }),

    deleteTaskAttachment: builder.mutation({
      query: ({ task_pk, id }) => ({
        url: `tasks/api/tasks/${task_pk}/attachments/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskAttachments", id: task_pk },
        { type: "TaskDetail", id: task_pk },
      ],
    }),

    /**
     * ========================
     * NEW ENHANCED ENDPOINTS
     * ========================
     */

    // Duplicate a task
    duplicateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `tasks/api/tasks/${id}/duplicate/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    // Assign task to another user
    assignTask: builder.mutation({
      query: ({ id, assignee_id, reason }) => ({
        url: `tasks/api/tasks/${id}/assign_task/`,
        method: "POST",
        body: { assignee: assignee_id, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        "MyTasks",
        "TaskAnalytics",
        { type: "TaskDetail", id },
      ],
    }),

    // Get task status history
    getTaskStatusHistory: builder.query({
      query: (task_pk) => ({
        url: `tasks/api/tasks/${task_pk}/`, // This will include status_history in the detail response
        method: "GET",
      }),
      transformResponse: (response) => response.status_history || [],
      providesTags: (result, error, task_pk) => [
        { type: "TaskStatusHistory", id: task_pk }
      ],
    }),

    // Get tasks by department
    getTasksByDepartment: builder.query({
      query: ({ department_id, page, page_size, status } = {}) => {
        const params = { department: department_id };
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        if (status) params.status = status;
        
        return { 
          url: "tasks/api/tasks/", 
          method: "GET", 
          params 
        };
      },
      transformResponse: (response) => ({
        ...response,
        results: response.results.map(normalizeTask),
      }),
      providesTags: ["Tasks"],
    }),

    // Search tasks with advanced filtering
    searchTasks: builder.query({
      query: ({ 
        search, 
        status, 
        priority, 
        assignee, 
        department, 
        overdue_only, 
        due_before, 
        due_after,
        page,
        page_size 
      } = {}) => {
        const params = {};
        if (search) params.search = search;
        if (status) params.status = status;
        if (priority) params.priority = priority;
        if (assignee) params.assignee = assignee;
        if (department) params.department = department;
        if (overdue_only) params.overdue_only = overdue_only;
        if (due_before) params.due_before = due_before;
        if (due_after) params.due_after = due_after;
        if (page) params.page = page;
        if (page_size) params.page_size = page_size;
        
        return { 
          url: "tasks/api/tasks/", 
          method: "GET", 
          params 
        };
      },
      transformResponse: (response) => ({
        ...response,
        results: response.results.map(normalizeTask),
      }),
      providesTags: ["Tasks"],
    }),

    /**
     * ========================
     * TASK TIME TRACKING
     * ========================
     */

    // Start time tracking for a task
    startTimeTracking: builder.mutation({
      query: ({ task_pk, data }) => ({
        url: `tasks/api/tasks/${task_pk}/time_logs/`,
        method: "POST",
        body: { ...data, start_time: new Date().toISOString() },
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskDetail", id: task_pk },
        "TaskAnalytics"
      ],
    }),

    // Stop time tracking for a task
    stopTimeTracking: builder.mutation({
      query: ({ task_pk, timeLogId, description }) => ({
        url: `tasks/api/tasks/${task_pk}/time_logs/${timeLogId}/`,
        method: "PATCH",
        body: { 
          end_time: new Date().toISOString(),
          description 
        },
      }),
      invalidatesTags: (result, error, { task_pk }) => [
        { type: "TaskDetail", id: task_pk },
        "TaskAnalytics"
      ],
    }),

    // Get time logs for a task
    getTaskTimeLogs: builder.query({
      query: (task_pk) => ({
        url: `tasks/api/tasks/${task_pk}/`, // This will include time_logs in the detail response
        method: "GET",
      }),
      transformResponse: (response) => response.time_logs || [],
      providesTags: (result, error, task_pk) => [
        { type: "TaskTimeLogs", id: task_pk }
      ],
    }),
  }),
});

// Export all hooks with CORRECTED parameter names
export const {
  // Core task queries
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskAnalyticsQuery,
  useGetTaskDetailQuery,
  
  // Comment hooks - FIXED parameter names
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  
  // Attachment hooks
  useGetTaskAttachmentsQuery,
  useUploadTaskAttachmentMutation,
  useDeleteTaskAttachmentMutation,
  
  // Core task mutations
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
  useBulkUpdateTasksMutation,
  useArchiveTaskMutation,
  
  // Enhanced functionality hooks
  useDuplicateTaskMutation,
  useAssignTaskMutation,
  useGetTaskStatusHistoryQuery,
  useGetTasksByDepartmentQuery,
  useSearchTasksQuery,
  
  // Time tracking hooks
  useStartTimeTrackingMutation,
  useStopTimeTrackingMutation,
  useGetTaskTimeLogsQuery,
} = tasksApi;