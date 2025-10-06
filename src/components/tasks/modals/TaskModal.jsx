import React, { useState, useEffect } from "react";
import { 
  useUpdateTaskMutation, 
  useUpdateTaskStatusMutation,
  useGetTaskCommentsQuery,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation
} from "../../../store/services/tasks/tasksService";
import { useSelector } from "react-redux";

const TaskModal = ({ isOpen, onClose, task, isHR, refetch }) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  
  const currentUser = useSelector((state) => state.auth.user);
  
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [createComment] = useCreateTaskCommentMutation();
  const [updateComment] = useUpdateTaskCommentMutation();
  const [deleteComment] = useDeleteTaskCommentMutation();

  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = 
    useGetTaskCommentsQuery(task?.id || null, {
      skip: !task?.id,
      refetchOnMountOrArgChange: true
    });

  const comments = commentsData?.results || [];

  useEffect(() => {
    if (task) setProgressValue(task.progressPercentage || 0);
  }, [task]);

  const statusMap = {
    'TO_DO': 'To Do',
    'IN_PROGRESS': 'In Progress', 
    'UNDER_REVIEW': 'Under Review',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'ON_HOLD': 'On Hold'
  };

  const priorityMap = {
    'LOW': 'Low',
    'MEDIUM': 'Medium',
    'HIGH': 'High',
    'URGENT': 'Urgent'
  };

  const statusOptions = Object.entries(statusMap).map(([key, value]) => ({ key, value }));
  
  // Get upgradable priority options based on current priority
  const getUpgradablePriorityOptions = () => {
    const priorities = Object.entries(priorityMap);
    const currentPriorityIndex = priorities.findIndex(([key]) => key === task?.priority);
    
    if (currentPriorityIndex === -1) return [];
    
    // Return only higher priorities (upgradable)
    return priorities.slice(currentPriorityIndex).map(([key, value]) => ({ key, value }));
  };

  const priorityOptions = getUpgradablePriorityOptions();

  const handleProgressUpdate = async (newProgress) => {
    if (!task) return;
    try {
      const updates = { progress_percentage: newProgress };
      if (newProgress === 100 && task.status !== 'COMPLETED') updates.status = 'COMPLETED';
      else if (newProgress > 0 && newProgress < 100 && task.status === 'TO_DO') updates.status = 'IN_PROGRESS';
      else if (newProgress === 0 && task.status !== 'TO_DO') updates.status = 'TO_DO';

      await updateTask({ id: task.id, ...updates }).unwrap();
      setIsEditingProgress(false);
      if (refetch) refetch();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!task) return;
    try {
      await updateTaskStatus({ id: task.id, status: newStatus }).unwrap();
      setIsStatusDropdownOpen(false);
      if (refetch) refetch();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!task) return;
    try {
      await updateTask({ id: task.id, priority: newPriority }).unwrap();
      setIsPriorityDropdownOpen(false);
      if (refetch) refetch();
    } catch (error) {
      console.error('Failed to update priority:', error);
    }
  };

  const handleProgressChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setProgressValue(Math.min(100, Math.max(0, value)));
  };

  const saveProgress = () => handleProgressUpdate(progressValue);
  const cancelProgressEdit = () => { setProgressValue(task?.progressPercentage || 0); setIsEditingProgress(false); };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    try {
      await createComment({
        taskPk: task.id,
        data: { content: newComment.trim(), is_internal: false, user: currentUser?.id }
      }).unwrap();
      setNewComment("");
      refetchComments();
    } catch (error) { console.error('Failed to add comment:', error); }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    try {
      await updateComment({ taskPk: task.id, id: commentId, data: { content: editCommentContent.trim() } }).unwrap();
      setEditingCommentId(null);
      setEditCommentContent("");
      refetchComments();
    } catch (error) { console.error('Failed to update comment:', error); }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment({ taskPk: task.id, id: commentId }).unwrap();
      refetchComments();
    } catch (error) { console.error('Failed to delete comment:', error); }
  };

  const cancelEditComment = () => { setEditingCommentId(null); setEditCommentContent(""); };

  const getProgressSuggestions = () => {
    const progress = task?.progressPercentage || 0;
    if (progress === 0) return "Task not started";
    if (progress < 25) return "Just getting started";
    if (progress < 50) return "Making good progress";
    if (progress < 75) return "More than halfway there";
    if (progress < 100) return "Almost complete";
    return "Task completed!";
  };

  // Check if current user is the assignee of the task
  const isAssignee = currentUser?.id === task?.assignee;

  if (!isOpen || !task) return null;

  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No date set';
  const formatDateTime = (dateString) => dateString ? new Date(dateString).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg text-neutral-900 font-semibold">Task Details</h2>
          <button onClick={onClose} className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Task Title and Status/Priority Row */}
        <div className="flex flex-col justify-start items-start gap-4 mb-3">
          <div className="text-lg font-semibold text-neutral-900">
            {task.title}
          </div>

          <div className="flex flex-row justify-start items-center gap-3">
            {/* Status Display - Always visible but only editable by assignee */}
            <div className="relative">
              <div
                className={`flex flex-row justify-center items-center rounded-md border border-neutral-200 h-9 bg-white overflow-hidden ${
                  isAssignee ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => isAssignee && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <div className="flex flex-row justify-center items-center gap-1.5 py-2 px-3 h-8">
                  <div className="text-xs text-neutral-900 font-semibold">
                    {statusMap[task.status] || task.status}
                  </div>
                  {isAssignee && (
                    <div className="flex flex-col justify-center items-center w-4 h-5">
                      <img
                        width="9.5px"
                        height="5.1px"
                        src="/images/dropdown.png"
                        alt="Dropdown"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Dropdown Menu - Only show for assignee */}
              {isStatusDropdownOpen && isAssignee && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                  {statusOptions.map(({ key, value }) => (
                    <div
                      key={key}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${task.status === key ? "bg-teal-100 text-teal-800" : "text-neutral-900"
                        }`}
                      onClick={() => handleStatusChange(key)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Priority Dropdown */}
            <div className="relative">
              <div
                className={`flex flex-row justify-center items-center rounded-md border border-neutral-200 h-9 bg-white overflow-hidden cursor-pointer ${
                  task.priority === "HIGH" || task.priority === "URGENT"
                    ? "bg-red-100 text-pink-800"
                    : task.priority === "MEDIUM"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
                onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
              >
                <div className="flex flex-row justify-center items-center gap-1.5 py-2 px-3 h-8">
                  <div className="text-xs font-semibold">
                    {priorityMap[task.priority] || task.priority} Priority
                  </div>
                  <div className="flex flex-col justify-center items-center w-4 h-5">
                    <img
                      width="9.5px"
                      height="5.1px"
                      src="/images/dropdown.png"
                      alt="Dropdown"
                    />
                  </div>
                </div>
              </div>

              {/* Priority Dropdown Menu */}
              {isPriorityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg z-10">
                  {priorityOptions.map(({ key, value }) => (
                    <div
                      key={key}
                      className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                        task.priority === key 
                          ? "bg-teal-100 text-teal-800" 
                          : "text-neutral-900"
                      }`}
                      onClick={() => handlePriorityChange(key)}
                    >
                      {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Section - Only show edit options if user is assignee */}
        <div className="mb-4">
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>Progress</span>
            {isEditingProgress ? (
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={progressValue} 
                  onChange={handleProgressChange} 
                  className="w-16 p-1 border rounded text-xs"
                />
                <span>%</span>
                <button 
                  onClick={saveProgress} 
                  className="px-2 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600"
                >
                  Save
                </button>
                <button 
                  onClick={cancelProgressEdit} 
                  className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{task.progressPercentage || 0}%</span>
                {isAssignee && (
                  <button 
                    onClick={() => setIsEditingProgress(true)} 
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
              style={{width:`${task.progressPercentage||0}%`}}
            ></div>
          </div>
          <div className="text-xs text-gray-500 italic mt-1">{getProgressSuggestions()}</div>
          
          {/* Single progress display box - Only show for assignee when not editing */}
          {!isEditingProgress && isAssignee && (
            <div className="flex gap-1 mt-2">
              <div className="px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded border border-teal-200">
                {task.progressPercentage || 0}%
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-200 mb-4"></div>

        {/* Main Content Area */}
        <div className="flex flex-col justify-start items-start gap-5">
          {/* Description and Task Info Row */}
          <div className="flex flex-row justify-between items-start gap-4 w-full">
            {/* Left Column - Description and Attachments */}
            <div className="flex flex-col justify-start items-start gap-4 w-[307px]">
              {/* Description */}
              <div className="flex flex-col justify-start items-start gap-3">
                <div className="text-sm font-semibold text-neutral-900">
                  Description
                </div>
                <div className="rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
                  <div className="text-xs text-gray-600 font-medium">
                    {task.description || 'No description provided'}
                  </div>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex flex-col justify-start items-start gap-3 w-full">
                <div className="flex flex-row justify-start items-center gap-1">
                  <div className="flex justify-center items-center w-6 h-4">
                    <img
                      width="24px"
                      height="25px"
                      src="/images/attachment.png"
                      alt="Attachment"
                    />
                  </div>
                  <div className="text-sm font-medium text-neutral-900">
                    Attachments ({task.attachments?.length || 0})
                  </div>
                </div>

                {task.attachments && task.attachments.length > 0 ? (
                  task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex flex-col justify-center items-center rounded-lg w-full p-3 shadow-sm bg-white">
                      <div className="flex flex-row justify-between items-center w-full">
                        <div className="flex flex-col justify-start items-start">
                          <div className="text-xs font-medium text-neutral-900">
                            {attachment.original_filename}
                          </div>
                          <div className="text-[10px] text-gray-600 font-medium">
                            {attachment.file_size_formatted} • {new Date(attachment.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <a 
                          href={attachment.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex flex-row justify-center items-center gap-1 py-1 px-5 rounded-lg border border-neutral-200 hover:bg-gray-50"
                        >
                          <div className="flex justify-center items-center h-4">
                            <img
                              width="13px"
                              height="13px"
                              src="/images/download.png"
                              alt="Download"
                            />
                          </div>
                          <div className="text-[10px] text-gray-800 font-medium">
                            Download
                          </div>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4 border border-dashed border-gray-300 rounded-lg w-full">
                    No attachments yet
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Task Info */}
            <div className="flex flex-col justify-start items-start gap-3 w-[205px]">
              <div className="text-sm font-semibold text-neutral-900">
                Task Info
              </div>
              <div className="flex flex-col justify-center items-center rounded-xl border border-stone-300 w-full p-3 bg-slate-50/80">
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Assignee
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.assignee_name || 'Unassigned'}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Department
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {task.department_name || 'Not specified'}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Priority
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {priorityMap[task.priority] || task.priority}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Created
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {formatDate(task.created_at)}
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-center w-full">
                    <div className="text-xs text-gray-600 font-medium">
                      Due Date
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                      {formatDate(task.dueDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="flex flex-col justify-start items-start gap-3 w-full">
            <div className="text-sm font-semibold text-neutral-900">
              Comments ({comments.length})
            </div>
            
            {/* Add Comment Input */}
            <div className="flex flex-col justify-center items-center rounded-lg w-full p-3 bg-gray-50">
              <textarea 
                value={newComment} 
                onChange={(e)=>setNewComment(e.target.value)}
                placeholder="Add a comment....." 
                className="w-full p-3 border-0 bg-transparent text-sm text-gray-600 font-normal outline-none resize-none" 
                rows="3"
              />
            </div>
            
            <div className="flex justify-end w-full">
              <button 
                onClick={handleAddComment} 
                disabled={!newComment.trim()} 
                className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Comment
              </button>
            </div>

            {/* Existing Comments */}
            {commentsLoading ? (
              <div className="text-center text-gray-500 text-sm py-4 w-full">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-xs text-gray-600 font-normal w-full mt-2">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                {comments.map(comment=>(
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-3">
                    {editingCommentId===comment.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea 
                          value={editCommentContent} 
                          onChange={(e)=>setEditCommentContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded text-sm resize-none" 
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={()=>handleSaveComment(comment.id)} 
                            disabled={!editCommentContent.trim()} 
                            className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEditComment} 
                            className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                              {comment.user_name?.charAt(0) || 'U'}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{comment.user_name || 'Unknown User'}</span>
                          </div>
                          {currentUser?.id === comment.user && (
                            <div className="flex gap-1">
                              <button 
                                onClick={()=>handleEditComment(comment)} 
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={()=>handleDeleteComment(comment.id)} 
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 font-normal whitespace-pre-wrap">{comment.content}</p>
                        <div className="text-xs text-gray-500 mt-2">
                          {formatDateTime(comment.created_at)}
                          {comment.updated_at !== comment.created_at && ' (edited)'}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;