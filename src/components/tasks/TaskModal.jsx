import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ActionModal from '../common/Modals/ActionModal';

import { useTaskPermissions } from "./taskLogic/useTaskPermissions";
import { useTaskOperations } from "./taskLogic/useTaskOperations";
import { useTaskData } from "./taskLogic/useTaskData";
import TaskHeader from "./TaskHeader";
import TaskProgress from "./TaskProgress";
import TaskDescription from "./TaskDescription";
import TaskAttachments from "./TaskAttachments";
import TaskInfo from "./TaskInfo";
import TaskComments from "./TaskComments";
import LogTaskModal from "./LogTaskModal"; 

const TaskModal = ({ isOpen, onClose, task, refetch, onSubmit }) => { 
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddSubtaskModalOpen, setIsAddSubtaskModalOpen] = useState(false); 

  const currentUser = useSelector((state) => state.auth.user);

  const { hasAnyEditPermission, canDeleteTask, fieldPermissions } = useTaskPermissions(task);

    React.useEffect(() => {
        if (isOpen && task) {
            console.log('=== TASK MODAL PERMISSIONS DEBUG ===');
            console.log('Current User ID:', currentUser?.user?.id || currentUser?.id);
            console.log('Task:', task);
            console.log('Task Assignees:', task.assignees);
            console.log('Task Assignee (legacy):', task.assignee);
            console.log('hasAnyEditPermission:', hasAnyEditPermission);
            console.log('canDeleteTask:', canDeleteTask);
            console.log('fieldPermissions:', fieldPermissions);
            console.log('=== END DEBUG ===');
        }
    }, [isOpen, task, currentUser, hasAnyEditPermission, fieldPermissions]);

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

    const userId = currentUser?.user?.id || currentUser?.id;

    const handleDeleteConfirm = async () => {
        try {
            await taskOperations.handleDeleteTask();
            setIsDeleteModalOpen(false);
            onClose();
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const handleSaveAll = async () => {
        try {
            await taskOperations.handleSaveAll(formData, fieldPermissions);
            setIsEditingMode(false);
            if (refetch) refetch();
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error("Failed to update task:", error);
            
            if (error.response?.data) {
                console.error("Error details:", error.response.data);
                if (error.response.data.assignee) {
                    toast.error(`Assignee error: ${error.response.data.assignee}`);
                }
            }
            
            toast.error("Failed to update task");
        }
    };

    const handleStatusChange = async (newStatus, providedUserId) => {
        try {
            const effectiveUserId = providedUserId || userId;
            
            if (!effectiveUserId) {
                toast.error("User authentication required");
                return;
            }
            
            console.log('=== TASK MODAL STATUS CHANGE ===');
            console.log('Task ID:', task?.id);
            console.log('New Status:', newStatus);
            console.log('User ID:', effectiveUserId);
            
            await taskOperations.handleStatusChange(task.id, newStatus, effectiveUserId);
            
            if (refetch) {
                try {
                    await refetch();
                    console.log('Refetch successful after status change');
                } catch (refetchError) {
                    console.error('Refetch failed:', refetchError);
                }
            }
            
            toast.success("Status updated successfully!");
            
        } catch (error) {
            console.error("Failed to update status:", error);
            
            if (error?.data) {
                console.error("Backend error details:", error.data);
                if (typeof error.data === 'object') {
                    Object.entries(error.data).forEach(([field, messages]) => {
                        console.error(`Field ${field}:`, messages);
                    });
                }
            }
            
            toast.error("Failed to update status. Please try again.");
        }
    };

    const handlePriorityChange = async (newPriority, providedUserId) => {
        try {
            const effectiveUserId = providedUserId || userId;
            
            if (!effectiveUserId) {
                toast.error("User authentication required");
                return;
            }
            await taskOperations.handlePriorityChange(newPriority, effectiveUserId);
            if (refetch) refetch();
            toast.success("Priority updated successfully!");
        } catch (error) {
            console.error("Failed to update priority:", error);
            toast.error("Failed to update priority");
        }
      }

    // 🔥 NEW: Handle subtask creation
    const handleCreateSubtask = async (subtaskFormData) => {
        try {
            // Call the parent's onSubmit to create the subtask
            if (onSubmit) {
                await onSubmit(subtaskFormData);
            }
            
            // Close the subtask modal
            setIsAddSubtaskModalOpen(false);
            
            // Refetch to show the new subtask
            if (refetch) {
                await refetch();
            }
            
            toast.success("Subtask created successfully!");
        } catch (error) {
            console.error("Failed to create subtask:", error);
            toast.error("Failed to create subtask");
        }
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    
    // 🔥 NEW: Subtask modal handlers
    const openAddSubtaskModal = () => setIsAddSubtaskModalOpen(true);
    const closeAddSubtaskModal = () => setIsAddSubtaskModalOpen(false);

    return (
        <>
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
                        onTitleChange={(value) => updateFormData("titleValue", value)}
                        titleValue={formData.titleValue}
                        isAssignee={fieldPermissions.isAssignee}
                        canViewAll={fieldPermissions.canViewAll}
                        currentUser={currentUser}
                        onAddSubtask={openAddSubtaskModal} // 🔥 NEW: Pass subtask handler
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
                                    onDescriptionChange={(value) =>
                                        updateFormData("descriptionValue", value)
                                    }
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

            {/* 🔥 NEW: LogTaskModal for creating subtasks */}
            {isAddSubtaskModalOpen && (
                <LogTaskModal
                    isOpen={isAddSubtaskModalOpen}
                    onClose={closeAddSubtaskModal}
                    onSubmit={handleCreateSubtask}
                    preselectedParentTask={task?.id} // Pass current task as parent
                />
            )}
        </>
    );
};

export default TaskModal;
