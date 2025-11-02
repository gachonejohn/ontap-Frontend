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
      toast.error(error?.data?.detail || "Failed to update progress");
    }
  };

  const handleStatusChange = async (taskId, newStatus, userId) => {
    try {
      const effectiveUserId = userId || (currentUser?.user?.id || currentUser?.id);
      
      if (!effectiveUserId) {
        throw new Error('User ID not available');
      }

      const response = await updateTaskStatus({
        id: taskId,
        status: newStatus,
        progress_percentage: task?.progress_percentage || task?.progressPercentage || 0,
        comment: `Status changed to ${newStatus}`
      }).unwrap();

      return response;
    } catch (error) {
      console.error('Error updating task status:', error);
      // Re-throw to let the calling component handle the error
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
      // Re-throw to let the calling component handle the error
      throw error;
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
      toast.error(error?.data?.detail || "Failed to remove attachment");
    }
  };

  // ✅ SIMPLIFIED: Removed fieldPermissions parameter
  const handleSaveAll = async (formData) => {
    try {
      setIsUploading(true);
      
      const userId = currentUser?.user?.id || currentUser?.id;
      
      if (!userId) {
        throw new Error('User ID not available for saving task');
      }

      const updateData = {
        title: formData.titleValue || task.title,
        description: formData.descriptionValue || task.description,
        assignee: formData.assigneeValue || task.assignee || userId,
        department: formData.departmentValue || task.department,
        due_date: formData.dueDateValue || task.due_date,
        priority: task.priority,
        status: task.status,
        progress: formData.progressValue || task.progress,
      };

      const response = await updateTask(task.id, updateData);
      
      if (files && files.length > 0) {
        await uploadAttachments(task.id);
      }

      return response;
    } catch (error) {
      console.error('Failed to update task:', error);
      // Re-throw to let component handle the error
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      await deleteTask(task.id).unwrap();
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      // Re-throw to let component handle the error
      throw error;
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    try {
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
          user: userId
        }
      }).unwrap();
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error('Failed to add comment:', error);
      
      if (error?.data?.user) {
        toast.error(`User error: ${error.data.user[0]}`);
      } else {
        toast.error(error?.data?.detail || "Failed to add comment");
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
          user: userId
        }
      }).unwrap();
      setEditingCommentId(null);
      setEditCommentContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error('Failed to update comment:', error);
      
      if (error?.data?.user) {
        toast.error(`User error: ${error.data.user[0]}`);
      } else {
        toast.error(error?.data?.detail || "Failed to update comment");
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
      toast.error(error?.data?.detail || "Failed to delete comment");
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
    setNewComment,
    editingCommentId,
    editCommentContent,
    setEditCommentContent,
    statusMap,
    priorityMap
  };
};