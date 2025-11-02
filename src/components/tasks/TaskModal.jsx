import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ActionModal from '../common/Modals/ActionModal';

import { useTaskPermissions } from './taskLogic/useTaskPermissions';
import { useTaskOperations } from './taskLogic/useTaskOperations';
import { useTaskData } from './taskLogic/useTaskData';
import TaskHeader from './TaskHeader';
import TaskProgress from './TaskProgress';
import TaskDescription from './TaskDescription';
import TaskAttachments from './TaskAttachments';
import TaskInfo from './TaskInfo';
import TaskComments from './TaskComments';

const TaskModal = ({ isOpen, onClose, task, refetch }) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);

  const { hasAnyEditPermission, canDeleteTask, fieldPermissions } = useTaskPermissions(task);

  // Destructure all the needed values from useTaskOperations
  const {
    taskOperations,
    isUploading,
    files,
    newComment,
    setNewComment,
    editingCommentId,
    editCommentContent,
    setEditCommentContent,
  } = useTaskOperations(task, refetch);

  const { formData, updateFormData, comments, refetchComments } = useTaskData(task, isEditingMode);

  if (!isOpen || !task) return null;

  // Safe user ID extraction
  const userId = currentUser?.user?.id || currentUser?.id;

  const handleDeleteConfirm = async () => {
    try {
      await taskOperations.handleDeleteTask();
      // Close both modals
      setIsDeleteModalOpen(false);
      onClose(); // This will close the main modal and take user back to task list
      toast.success('Task deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  // In TaskModal.jsx - Update handleSaveAll
  const handleSaveAll = async () => {
    try {
      // 🔥 Pass the correct user ID to handleSaveAll if needed
      await taskOperations.handleSaveAll(formData, fieldPermissions);
      setIsEditingMode(false);
      if (refetch) refetch();
      toast.success('Task updated successfully!');
    } catch (error) {
      console.error('Failed to update task:', error);

      // More detailed error logging
      if (error.response?.data) {
        console.error('Error details:', error.response.data);
        if (error.response.data.assignee) {
          toast.error(`Assignee error: ${error.response.data.assignee}`);
        }
      }

      toast.error('Failed to update task');
    }
  };

  // Enhanced status change handler
  // In TaskModal.jsx - Update handleStatusChange with better error handling
  const handleStatusChange = async (newStatus) => {
    try {
      if (!userId) {
        toast.error('User authentication required');
        return;
      }

      console.log('=== TASK MODAL STATUS CHANGE ===');
      console.log('Task ID:', task?.id);
      console.log('New Status:', newStatus);
      console.log('User ID:', userId);

      await taskOperations.handleStatusChange(task.id, newStatus, userId);

      // 🔥 Force refetch with error handling
      if (refetch) {
        try {
          await refetch();
          console.log('Refetch successful after status change');
        } catch (refetchError) {
          console.error('Refetch failed:', refetchError);
          // Continue anyway - the status change was successful
        }
      }

      toast.success('Status updated successfully!');
    } catch (error) {
      console.error('Failed to update status:', error);

      // More detailed error information
      if (error?.data) {
        console.error('Backend error details:', error.data);
        if (typeof error.data === 'object') {
          // Show specific field errors
          Object.entries(error.data).forEach(([field, messages]) => {
            console.error(`Field ${field}:`, messages);
          });
        }
      }

      toast.error('Failed to update status. Please try again.');
    }
  };

  // Enhanced priority change handler
  const handlePriorityChange = async (newPriority) => {
    try {
      if (!userId) {
        toast.error('User authentication required');
        return;
      }
      await taskOperations.handlePriorityChange(newPriority, userId);
      if (refetch) refetch();
      toast.success('Priority updated successfully!');
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority');
    }
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
      <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
        <TaskHeader
          isEditingMode={isEditingMode}
          hasAnyEditPermission={hasAnyEditPermission}
          canDeleteTask={canDeleteTask}
          onEditToggle={() => setIsEditingMode(!isEditingMode)}
          onSave={handleSaveAll}
          onCancel={() => {
            setIsEditingMode(false);
            taskOperations.setFiles([]);
          }}
          onDelete={openDeleteModal}
          onClose={onClose}
          isUploading={isUploading}
          task={task}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onTitleChange={(value) => updateFormData('titleValue', value)}
          titleValue={formData.titleValue}
          isAssignee={fieldPermissions.isAssignee}
          canViewAll={fieldPermissions.canViewAll}
          currentUser={currentUser} // Pass currentUser to TaskHeader
        />

        <TaskProgress
          task={task}
          isEditingMode={isEditingMode}
          canEditProgress={fieldPermissions.canEditProgress}
          onProgressUpdate={taskOperations.handleProgressUpdate}
        />

        <div className="w-full border-t border-gray-200 mb-4"></div>

        <div className="flex flex-col justify-start items-start gap-5">
          <div className="flex flex-row justify-between items-start gap-4 w-full">
            <div className="flex flex-col justify-start items-start gap-4 w-[307px]">
              <TaskDescription
                task={task}
                isEditingMode={isEditingMode}
                canEditDescription={fieldPermissions.canEditDescription}
                descriptionValue={formData.descriptionValue}
                onDescriptionChange={(value) => updateFormData('descriptionValue', value)}
              />

              <TaskAttachments
                task={task}
                isEditingMode={isEditingMode}
                canEditAttachments={fieldPermissions.canEditAttachments}
                files={files || []}
                onFileChange={taskOperations.handleFileChange}
                onRemoveFile={taskOperations.removeFile}
                onRemoveAttachment={taskOperations.removeAttachment}
              />
            </div>

            <div className="flex flex-col justify-start items-start gap-3 w-[205px]">
              <TaskInfo
                task={task}
                isEditingMode={isEditingMode}
                fieldPermissions={fieldPermissions}
                formData={formData}
                onFormDataUpdate={updateFormData}
                currentUser={currentUser}
              />
            </div>
          </div>

          <TaskComments
            task={task}
            comments={comments}
            onAddComment={taskOperations.handleAddComment}
            onEditComment={taskOperations.handleEditComment}
            onSaveComment={taskOperations.handleSaveComment}
            onDeleteComment={taskOperations.handleDeleteComment}
            onCancelEditComment={taskOperations.cancelEditComment}
            editingCommentId={editingCommentId}
            editCommentContent={editCommentContent}
            newComment={newComment}
            onNewCommentChange={setNewComment}
            onEditCommentContentChange={setEditCommentContent}
            currentUser={currentUser}
          />
        </div>
      </div>

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteConfirm}
        isDeleting={false}
        confirmationMessage="Are you sure you want to delete this task?"
        deleteMessage="Deleting this task will remove it permanently. This action cannot be undone."
        title="Delete Task"
        actionText="Delete Task"
      />
    </div>
  );
};

export default TaskModal;
