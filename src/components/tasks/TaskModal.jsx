import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ActionModal from "../common/Modals/ActionModal";
import { useGetTaskDetailQuery } from "../../store/services/tasks/tasksService";
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

    const { data: fullTaskDetail } = useGetTaskDetailQuery(task?.id, {
        skip: !task?.id || !isOpen,
    });

    const taskData = fullTaskDetail || task;

    const taskPermissions = currentUser?.role?.permissions?.find(
        (p) => p.feature_code === "task" || p.feature_code === "task_management"
    );
    
    const canEdit = taskPermissions?.can_edit;
    const canDelete = taskPermissions?.can_delete;
    const canViewAll = taskPermissions?.can_view_all;

    const {
        taskOperations,
        isUploading,
        files,
        newComment,
        setNewComment,
        editingCommentId,
        editCommentContent,
        setEditCommentContent,
    } = useTaskOperations(taskData, refetch);

    const { formData, updateFormData, comments } = useTaskData(
        taskData,
        isEditingMode
    );

    if (!isOpen || !taskData) return null;

    const userId = currentUser?.user?.id || currentUser?.id;
    
    // ✅ Simple UI flags for display purposes only
    const isAssignee = taskData.assignees?.includes(userId);
    const isCreator = taskData.created_by === userId;

    const handleDeleteConfirm = async () => {
        try {
            await taskOperations.handleDeleteTask();
            setIsDeleteModalOpen(false);
            onClose();
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error(error?.data?.detail || "Failed to delete task");
        }
    };

    const handleSaveAll = async () => {
        try {
            await taskOperations.handleSaveAll(formData);
            setIsEditingMode(false);
            if (refetch) refetch();
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error("Failed to update task:", error);
            
            if (error.response?.data) {
                console.error("Error details:", error.response.data);
                const errorMsg = error.response.data.assignee 
                    ? `Assignee error: ${error.response.data.assignee}`
                    : "Failed to update task";
                toast.error(errorMsg);
            } else if (error?.data) {
                const errorMessage = typeof error.data === 'string' 
                    ? error.data 
                    : error.data.detail || "Failed to update task";
                toast.error(errorMessage);
            } else {
                toast.error("Failed to update task");
            }
        }
    };

    const handleStatusChange = async (newStatus, providedUserId) => {
        try {
            const effectiveUserId = providedUserId || userId;
            
            if (!effectiveUserId) {
                toast.error("User authentication required");
                return;
            }
            
            await taskOperations.handleStatusChange(taskData.id, newStatus, effectiveUserId);
            
            if (refetch) {
                try {
                    await refetch();
                } catch (refetchError) {
                    console.error('Refetch failed:', refetchError);
                }
            }
            
            toast.success("Status updated successfully!");
            
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(error?.data?.detail || "Failed to update status. Please try again.");
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
            toast.error(error?.data?.detail || "Failed to update priority");
        }
    };

    const handleCreateSubtask = async (subtaskFormData) => {
        try {
            if (onSubmit) {
                await onSubmit(subtaskFormData);
            }
            
            setIsAddSubtaskModalOpen(false);
            
            if (refetch) {
                await refetch();
            }
            
            toast.success("Subtask created successfully!");
        } catch (error) {
            console.error("Failed to create subtask:", error);
            toast.error(error?.data?.detail || "Failed to create subtask");
        }
    };

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openAddSubtaskModal = () => setIsAddSubtaskModalOpen(true);
    const closeAddSubtaskModal = () => setIsAddSubtaskModalOpen(false);

    return (
        <>
            <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
                <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
                    <TaskHeader
                        isEditingMode={isEditingMode}
                        hasAnyEditPermission={canEdit}
                        canDeleteTask={canDelete}
                        onEditToggle={() => setIsEditingMode(!isEditingMode)}
                        onSave={handleSaveAll}
                        onCancel={() => {
                            setIsEditingMode(false);
                            taskOperations.setFiles([]);
                        }}
                        onDelete={openDeleteModal}
                        onClose={onClose}
                        isUploading={isUploading}
                        task={taskData}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                        onTitleChange={(value) => updateFormData("titleValue", value)}
                        titleValue={formData.titleValue}
                        isAssignee={isAssignee}
                        canViewAll={canViewAll}
                        currentUser={currentUser}
                        onAddSubtask={openAddSubtaskModal}
                    />

                    <TaskProgress
                        task={taskData}
                        isEditingMode={isEditingMode}
                        canEditProgress={isAssignee || isCreator || canViewAll}
                        onProgressUpdate={taskOperations.handleProgressUpdate}
                    />

                    <div className="w-full border-t border-gray-200 mb-4"></div>

                    <div className="flex flex-col justify-start items-start gap-5">
                        <div className="flex flex-row justify-between items-start gap-4 w-full">
                            <div className="flex flex-col justify-start items-start gap-4 w-[307px]">
                                <TaskDescription
                                    task={taskData}
                                    isEditingMode={isEditingMode}
                                    canEditDescription={isEditingMode && canEdit}
                                    descriptionValue={formData.descriptionValue}
                                    onDescriptionChange={(value) =>
                                        updateFormData("descriptionValue", value)
                                    }
                                />

                                <TaskAttachments
                                    task={taskData}
                                    isEditingMode={isEditingMode}
                                    canEditAttachments={isEditingMode && canEdit}
                                    files={files || []}
                                    onFileChange={taskOperations.handleFileChange}
                                    onRemoveFile={taskOperations.removeFile}
                                    onRemoveAttachment={taskOperations.removeAttachment}
                                />
                            </div>

                            <div className="flex flex-col justify-start items-start gap-3 w-[205px]">
                                <TaskInfo
                                    task={taskData}
                                    isEditingMode={isEditingMode}
                                    canEdit={canEdit}
                                    canViewAll={canViewAll}
                                    isAssignee={isAssignee}
                                    isCreator={isCreator}
                                    formData={formData}
                                    onFormDataUpdate={updateFormData}
                                    currentUser={currentUser}
                                />
                            </div>
                        </div>

                        <TaskComments
                            task={taskData}
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

            {isAddSubtaskModalOpen && (
                <LogTaskModal
                    isOpen={isAddSubtaskModalOpen}
                    onClose={closeAddSubtaskModal}
                    onSubmit={handleCreateSubtask}
                    preselectedParentTask={taskData?.id}
                />
            )}
        </>
    );
};

export default TaskModal;