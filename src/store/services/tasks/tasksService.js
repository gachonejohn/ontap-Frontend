import { apiSlice } from "../../api/apiSlice";

// Enhanced normalizeTask function with MULTI-ASSIGNEE support
const normalizeTask = (task) => {
  // DEBUG: Log the raw task to see what we're receiving
  console.log('🔍 normalizeTask received:', {
    id: task.id,
    title: task.title,
    assignees: task.assignees,
    assignees_detail: task.assignees_detail,
    assignee_name: task.assignee_name,
    assignee: task.assignee,
    assignee_detail: task.assignee_detail
  });
  
  // Handle multiple assignees
  let assigneeNames = "Unassigned";
  
  // PRIORITY 1: Check assignees_detail (backend sends detailed user info here)
  if (task.assignees_detail && Array.isArray(task.assignees_detail) && task.assignees_detail.length > 0) {
    console.log('📋 Found assignees_detail:', task.assignees_detail);
    
    assigneeNames = task.assignees_detail
      .map(assignee => {
        if (typeof assignee === 'object' && assignee !== null) {
          // Try different possible field structures
          if (assignee.first_name && assignee.last_name) {
            return `${assignee.first_name} ${assignee.last_name}`;
          } else if (assignee.user?.first_name && assignee.user?.last_name) {
            return `${assignee.user.first_name} ${assignee.user.last_name}`;
          } else if (assignee.full_name) {
            return assignee.full_name;
          } else if (assignee.user?.full_name) {
            return assignee.user.full_name;
          }
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");
    
    console.log('✅ Extracted names from assignees_detail:', assigneeNames);
    
    // Fallback if no names were extracted
    if (!assigneeNames) {
      assigneeNames = "Unassigned";
    }
  } 
  // PRIORITY 2: Check assignees array (in case it has objects instead of just IDs)
  else if (task.assignees && Array.isArray(task.assignees) && task.assignees.length > 0) {
    console.log('📋 Found assignees array:', task.assignees);
    
    // Check if assignees array contains objects (not just IDs)
    const firstItem = task.assignees[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      assigneeNames = task.assignees
        .map(assignee => {
          if (assignee.first_name && assignee.last_name) {
            return `${assignee.first_name} ${assignee.last_name}`;
          } else if (assignee.user?.first_name && assignee.user?.last_name) {
            return `${assignee.user.first_name} ${assignee.user.last_name}`;
          } else if (assignee.full_name) {
            return assignee.full_name;
          }
          return null;
        })
        .filter(Boolean)
        .join(", ");
      
      console.log('✅ Extracted names from assignees:', assigneeNames);
      
      if (!assigneeNames) {
        assigneeNames = "Unassigned";
      }
    } else {
      console.log('⚠️ Assignees array contains IDs, not objects');
    }
    // If assignees is just an array of IDs, we can't extract names
  } 
  // PRIORITY 3: Single assignee fallbacks
  else if (task.assignee_name) {
    assigneeNames = task.assignee_name;
    console.log('✅ Using assignee_name:', assigneeNames);
  } else if (task.assignee?.full_name) {
    assigneeNames = task.assignee.full_name;
    console.log('✅ Using assignee.full_name:', assigneeNames);
  } else if (task.assignee_detail?.full_name) {
    assigneeNames = task.assignee_detail.full_name;
    console.log('✅ Using assignee_detail.full_name:', assigneeNames);
  } else if (task.assignee_detail?.first_name && task.assignee_detail?.last_name) {
    assigneeNames = `${task.assignee_detail.first_name} ${task.assignee_detail.last_name}`;
    console.log('✅ Using assignee_detail names:', assigneeNames);
  }
  
  console.log('🏁 Final assigneeNames:', assigneeNames);

  return {
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
    
    // FIXED: Handle both single and multiple assignees
    assignee_name: assigneeNames,
    assigneeName: assigneeNames,
    
    // Normalize created_by
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
    
    // Preserve original IDs and arrays
    assignees: task.assignees || [],
    assigneeId: task.assignee || task.assigneeId,
    departmentId: task.department || task.departmentId,
    createdById: task.created_by || task.createdById,
  };
};

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
        if (timeframe) params.timeframe = timeframe;
        
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
     * TASK COMMENTS
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
     * TASK MUTATIONS (WRITE) - FIXED FOR REQUIRED FIELDS
     * ========================
     */

    createTask: builder.mutation({
  query: (formData) => {
    console.log('=== CREATE TASK SERVICE ===');
    console.log('Received formData:', formData);
    
    // Remove validation - trust the component validation
    const formDataObj = formData instanceof FormData ? formData : new FormData();
    
    if (!(formData instanceof FormData)) {
      // Convert regular object to FormData without validation
      formDataObj.append("title", formData.title?.trim() || "");
      formDataObj.append("description", formData.description?.trim() || "");
      formDataObj.append("status", formData.status || "TO_DO");
      formDataObj.append("priority", formData.priority || "MEDIUM");
      
      if (formData.assignees && formData.assignees.length > 0) {
        formData.assignees.forEach(assigneeId => {
          formDataObj.append("assignees", assigneeId.toString());
        });
      }
      
      if (formData.department) formDataObj.append("department", formData.department.toString());
      if (formData.start_date) formDataObj.append("start_date", formData.start_date);
      if (formData.due_date) formDataObj.append("due_date", formData.due_date);
      
      formDataObj.append("progress_percentage", (formData.progress_percentage || 0).toString());
      
      if (formData.estimated_hours) {
        formDataObj.append("estimated_hours", formData.estimated_hours.toString());
      }
      
      formDataObj.append("is_urgent", formData.is_urgent ? "true" : "false");
      formDataObj.append("requires_approval", formData.requires_approval ? "true" : "false");
      
      if (formData.files && formData.files.length > 0) {
        formData.files.forEach(file => {
          formDataObj.append("files", file);
        });
      }
    }

    console.log('FormData contents:');
    for (let pair of formDataObj.entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }
    
    return { 
      url: "tasks/api/tasks/", 
      method: "POST", 
      body: formDataObj,
    };
  },
  // IMPORTANT: Transform the response to normalize the created task
  transformResponse: (response) => normalizeTask(response),
  invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
}),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => {
        const updateData = {
          title: data.title || data.currentTitle,
          description: data.description || data.currentDescription,
          status: data.status,
          priority: data.priority,
          assignees: data.assignees || (data.assignee ? [data.assignee] : []),
          department: data.department,
          start_date: data.start_date || data.startDate,
          due_date: data.due_date || data.dueDate,
          progress_percentage: data.progress_percentage || data.progressPercentage,
          estimated_hours: data.estimated_hours || data.estimatedHours,
          parent_task: data.parent_task || data.parentTask,
        };
        
        return { 
          url: `tasks/api/tasks/${id}/`, 
          method: "PATCH", 
          body: updateData 
        };
      },
      transformResponse: (response) => normalizeTask(response),
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
      query: ({ id, status, reason }) => ({
        url: `tasks/api/tasks/${id}/update_status/`,
        method: "POST",
        body: { status, reason },
      }),
      transformResponse: (response) => normalizeTask(response),
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
     * TASK ATTACHMENTS
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
     * ENHANCED ENDPOINTS
     * ========================
     */

    duplicateTask: builder.mutation({
      query: ({ id, data }) => ({
        url: `tasks/api/tasks/${id}/duplicate/`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => normalizeTask(response),
      invalidatesTags: ["Tasks", "MyTasks", "TaskAnalytics"],
    }),

    assignTask: builder.mutation({
      query: ({ id, assignee_id, reason }) => ({
        url: `tasks/api/tasks/${id}/assign_task/`,
        method: "POST",
        body: { assignee: assignee_id, reason },
      }),
      transformResponse: (response) => normalizeTask(response),
      invalidatesTags: (result, error, { id }) => [
        "Tasks",
        "MyTasks",
        "TaskAnalytics",
        { type: "TaskDetail", id },
      ],
    }),

    getTaskStatusHistory: builder.query({
      query: (task_pk) => ({
        url: `tasks/api/tasks/${task_pk}/`,
        method: "GET",
      }),
      transformResponse: (response) => response.status_history || [],
      providesTags: (result, error, task_pk) => [
        { type: "TaskStatusHistory", id: task_pk }
      ],
    }),

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

    getTaskTimeLogs: builder.query({
      query: (task_pk) => ({
        url: `tasks/api/tasks/${task_pk}/`,
        method: "GET",
      }),
      transformResponse: (response) => response.time_logs || [],
      providesTags: (result, error, task_pk) => [
        { type: "TaskTimeLogs", id: task_pk }
      ],
    }),
  }),
});

// Export all hooks
export const {
  // Core task queries
  useGetTasksQuery,
  useGetMyTasksQuery,
  useGetTaskAnalyticsQuery,
  useGetTaskDetailQuery,
  
  // Comment hooks
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