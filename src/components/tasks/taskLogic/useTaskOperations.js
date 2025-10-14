import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
  useCreateTaskCommentMutation,
  useUpdateTaskCommentMutation,
  useDeleteTaskCommentMutation,
  useUploadTaskAttachmentMutation,
  useDeleteTaskAttachmentMutation
} from "../../../store/services/tasks/tasksService";
import { useSelector } from "react-redux";
import { formatDateForInput } from "../taskFunctions/dateFormatters";

export const useTaskOperations = (task, refetch) => {
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const currentUser = useSelector((state) => state.auth.user);

  // RTK Query mutations
  const [updateTask] = useUpdateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [createComment] = useCreateTaskCommentMutation();
  const [updateComment] = useUpdateTaskCommentMutation();
  const [deleteComment] = useDeleteTaskCommentMutation();
  const [uploadTaskAttachment] = useUploadTaskAttachmentMutation();
  const [deleteTaskAttachment] = useDeleteTaskAttachmentMutation();

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

  const handleProgressUpdate = async (newProgress) => {
    if (!task) return;
    try {
      const updates = {
        progress_percentage: newProgress
      };

      if (task.title) updates.currentTitle = task.title;
      if (task.description) updates.currentDescription = task.description;

      if (newProgress === 100 && task.status !== 'COMPLETED') updates.status = 'COMPLETED';
      else if (newProgress > 0 && newProgress < 100 && task.status === 'TO_DO') updates.status = 'IN_PROGRESS';
      else if (newProgress === 0 && task.status !== 'TO_DO') updates.status = 'TO_DO';

      await updateTask({ id: task.id, ...updates }).unwrap();
      if (refetch) refetch();
      toast.success("Progress updated successfully!");
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error("Failed to update progress");
    }
  };

  // In useTaskOperations.js - Fix the handleStatusChange function
const handleStatusChange = async (taskId, newStatus, userId) => {
  try {
    const effectiveUserId = userId || (currentUser?.user?.id || currentUser?.id);
    
    if (!effectiveUserId) {
      throw new Error('User ID not available');
    }

    console.log('=== STATUS CHANGE API CALL ===');
    console.log('Task ID:', taskId);
    console.log('New Status:', newStatus);
    console.log('User ID:', effectiveUserId);

    // 🔥 FIX: Use the correct endpoint structure
    const response = await updateTaskStatus({
      id: taskId, // This should be the task ID
      status: newStatus,
      progress_percentage: task?.progress_percentage || task?.progressPercentage || 0, // Include current progress
      comment: `Status changed to ${newStatus}` // Optional comment
    }).unwrap();

    console.log('Status change successful:', response);
    return response;
  } catch (error) {
    console.error('Error updating task status:', error);
    console.error('Full error object:', error);
    console.error('Error data:', error?.data);
    console.error('Error status:', error?.status);
    throw error;
  }
};

  const handlePriorityChange = async (newPriority) => {
    if (!task) return;
    try {
      await updateTask({
        id: task.id,
        priority: newPriority,
        currentTitle: task.title,
        currentDescription: task.description
      }).unwrap();
      if (refetch) refetch();
      toast.success("Priority updated successfully!");
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error("Failed to update priority");
    }
  };

  const uploadAttachments = async (taskId) => {
    if (!files.length) return;

    setIsUploading(true);
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        await uploadTaskAttachment({
          task_pk: taskId,
          formData
        }).unwrap();

        return file.name;
      } catch (error) {
        console.error('Failed to upload file:', error);
        throw new Error(`Failed to upload ${file.name}`);
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success(`Successfully uploaded ${files.length} file(s)`);
    } catch (error) {
      console.error('Upload errors:', error);
      toast.error("Some files failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = async (attachmentId) => {
    if (!window.confirm('Are you sure you want to remove this attachment?')) return;
    try {
      await deleteTaskAttachment({
        task_pk: task.id,
        id: attachmentId
      }).unwrap();

      toast.success("Attachment removed successfully!");
      if (refetch) refetch();
    } catch (error) {
      console.error('Failed to remove attachment:', error);
      toast.error("Failed to remove attachment");
    }
  };

  const handleSaveAll = async (formData, fieldPermissions) => {
  try {
    setIsUploading(true);
    
    const userId = currentUser?.user?.id || currentUser?.id;
    
    if (!userId) {
      throw new Error('User ID not available for saving task');
    }

    // Debug what's in formData
    console.log('=== handleSaveAll DEBUG ===');
    console.log('formData.assigneeValue:', formData.assigneeValue);
    console.log('task.assignee (original):', task.assignee);
    console.log('Current User ID:', userId);
    console.log('=== END DEBUG ===');

    const updateData = {
      title: formData.titleValue || task.title,
      description: formData.descriptionValue || task.description,
      // 🔥 CRITICAL: Use the formData.assigneeValue which should be the user ID (40)
      // If it's empty or invalid, fall back to the original task.assignee
      assignee: formData.assigneeValue || task.assignee || userId,
      department: formData.departmentValue || task.department,
      due_date: formData.dueDateValue || task.due_date,
      priority: task.priority, // Keep original if not in formData
      status: task.status, // Keep original if not in formData
      progress: formData.progressValue || task.progress,
    };

    // If we're still getting the wrong ID, force the correct one
    if (updateData.assignee === 21) {
      console.warn('Wrong assignee ID detected, correcting to:', userId);
      updateData.assignee = userId;
    }

    console.log('Final update data:', updateData);

    const response = await updateTask(task.id, updateData);
    
    // 🔥 FIX: Call uploadAttachments instead of handleFileUpload
    if (files && files.length > 0) {
      await uploadAttachments(task.id);
    }

    return response;
  } catch (error) {
    console.error('Failed to update task:', error);
    throw error;
  } finally {
    setIsUploading(false);
  }
};

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      await deleteTask(task.id).unwrap();
      // Don't call refetch or toast here - let the component handle it
      return true; // Indicate success
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error; // Re-throw to let component handle the error
    }
  };

  const handleAddComment = async () => {
  if (!newComment.trim() || !task) return;
  try {
    // 🔥 FIX: Extract user ID correctly
    const userId = currentUser?.user?.id || currentUser?.id;
    
    if (!userId) {
      console.error("Cannot determine user ID from currentUser:", currentUser);
      toast.error("Failed to add comment: User ID not found");
      return;
    }
    
    await createComment({
      task_pk: task.id,
      data: {
        content: newComment.trim(),
        user: userId  // Use the extracted user ID
      }
    }).unwrap();
    setNewComment("");
    toast.success("Comment added successfully!");
  } catch (error) {
    console.error('Failed to add comment:', error);
    console.error('Error details:', error?.data);
    
    // Show specific error message
    if (error?.data?.user) {
      toast.error(`User error: ${error.data.user[0]}`);
    } else {
      toast.error("Failed to add comment");
    }
  }
};

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveComment = async (commentId) => {
  if (!editCommentContent.trim()) return;
  try {
    // 🔥 FIX: Extract user ID correctly
    const userId = currentUser?.user?.id || currentUser?.id;
    
    if (!userId) {
      console.error("Cannot determine user ID from currentUser:", currentUser);
      toast.error("Failed to update comment: User ID not found");
      return;
    }
    
    await updateComment({
      task_pk: task.id,
      id: commentId,
      data: {
        content: editCommentContent.trim(),
        user: userId  // Use the extracted user ID
      }
    }).unwrap();
    setEditingCommentId(null);
    setEditCommentContent("");
    toast.success("Comment updated successfully!");
  } catch (error) {
    console.error('Failed to update comment:', error);
    console.error('Error details:', error?.data);
    
    // Show specific error message
    if (error?.data?.user) {
      toast.error(`User error: ${error.data.user[0]}`);
    } else {
      toast.error("Failed to update comment");
    }
  }
};


  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment({
        task_pk: task.id,
        id: commentId
      }).unwrap();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentContent("");
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // In hooks/useTaskOperations.js, update the return statement:
  return {
    taskOperations: {
      handleProgressUpdate,
      handleStatusChange,
      handlePriorityChange,
      handleSaveAll,
      handleDeleteTask,
      handleAddComment,
      handleEditComment,
      handleSaveComment,
      handleDeleteComment,
      cancelEditComment,
      handleFileChange,
      removeFile,
      removeAttachment,
      setFiles
    },
    isUploading,
    files,
    newComment,
    setNewComment, // Make sure this is directly exported, not nested in taskOperations
    editingCommentId,
    editCommentContent,
    setEditCommentContent, // Make sure this is also directly exported
    statusMap,
    priorityMap
  };
};