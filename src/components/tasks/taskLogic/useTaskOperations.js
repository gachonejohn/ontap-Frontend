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

  const handleStatusChange = async (newStatus) => {
    if (!task) return;
    try {
      await updateTaskStatus({ id: task.id, status: newStatus }).unwrap();
      if (refetch) refetch();
      toast.success("Status updated successfully!");
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error("Failed to update status");
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
    if (!task) return;

    setIsUploading(true);
    try {
      const updates = {
        currentTitle: task.title,
        currentDescription: task.description
      };

      // Only include fields that user has permission to edit AND that have changed
      if (fieldPermissions.canEditTitle && formData.titleValue.trim() !== task.title) {
        updates.title = formData.titleValue.trim();
      }
      if (fieldPermissions.canEditDescription && formData.descriptionValue !== task.description) {
        updates.description = formData.descriptionValue;
      }
      if (fieldPermissions.canEditDueDate) {
        const currentDueDate = task.due_date || task.dueDate;
        const formattedCurrentDueDate = formatDateForInput(currentDueDate);
        if (formData.dueDateValue !== formattedCurrentDueDate) {
          updates.due_date = formData.dueDateValue;
        }
      }

      // Employees without can_view_all can only assign to themselves
      if (fieldPermissions.canEditAssignee) {
        if (fieldPermissions.canViewAll && formData.assigneeValue !== task.assignee) {
          updates.assignee = formData.assigneeValue;
        } else if (!fieldPermissions.canViewAll && currentUser?.id !== task.assignee) {
          updates.assignee = currentUser?.id;
        }
      }

      if (fieldPermissions.canEditDepartment && formData.departmentValue !== task.department) {
        updates.department = formData.departmentValue;
      }

      // Check if there are any actual changes to save
      const hasChanges = Object.keys(updates).some(key =>
        !['currentTitle', 'currentDescription'].includes(key)
      );

      // Upload attachments if any files are selected
      if (files.length > 0) {
        await uploadAttachments(task.id);
      }

      if (!hasChanges && files.length === 0) {
        setIsUploading(false);
        toast.info("No changes to save");
        return;
      }

      if (hasChanges) {
        await updateTask({ id: task.id, ...updates }).unwrap();
      }

      setFiles([]); // Clear selected files after upload
      if (refetch) refetch();
    } catch (error) {
      console.error('Failed to update task:', error);
      if (error?.data?.detail?.includes('permission')) {
        toast.error("You don't have permission to update some fields");
      } else {
        toast.error("Failed to update task");
      }
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
      await createComment({
        task_pk: task.id,
        data: {
          content: newComment.trim(),
          user: currentUser?.id
        }
      }).unwrap();
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleSaveComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    try {
      await updateComment({
        task_pk: task.id,
        id: commentId,
        data: {
          content: editCommentContent.trim(),
          user: currentUser?.id
        }
      }).unwrap();
      setEditingCommentId(null);
      setEditCommentContent("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error('Failed to update comment:', error);
      toast.error("Failed to update comment");
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