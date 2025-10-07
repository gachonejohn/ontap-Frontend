import React from "react";
import CommentItem from "./CommentItem";

const TaskComments = ({
  task,
  comments,
  onAddComment,
  onEditComment,
  onSaveComment,
  onDeleteComment,
  onCancelEditComment,
  editingCommentId,
  editCommentContent,
  newComment,
  onNewCommentChange,
  onEditCommentContentChange,
  currentUser
}) => {
  const safeNewComment = newComment || '';
  
  return (
    <div className="flex flex-col justify-start items-start gap-3 w-full">
      <div className="text-sm font-semibold text-neutral-900">
        Comments ({comments.length})
      </div>
      
      {/* Add Comment Input */}
      <div className="flex flex-col justify-center items-center rounded-lg w-full p-3 bg-gray-50">
        <textarea 
          value={safeNewComment} 
          onChange={(e) => onNewCommentChange(e.target.value)}
          placeholder="Add a comment....." 
          className="w-full p-3 border-0 bg-transparent text-sm text-gray-600 font-normal outline-none resize-none" 
          rows="3"
        />
      </div>
      
      <div className="flex justify-end w-full">
        <button 
          onClick={onAddComment} 
          disabled={!safeNewComment.trim()} 
          className="px-4 py-2 bg-teal-500 text-white text-sm rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Comment
        </button>
      </div>

      {/* Existing Comments */}
      {comments.length === 0 ? (
        <div className="text-xs text-gray-600 font-normal w-full mt-2">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              editingCommentId={editingCommentId}
              editCommentContent={editCommentContent}
              currentUser={currentUser}
              onEditComment={onEditComment}
              onSaveComment={onSaveComment}
              onDeleteComment={onDeleteComment}
              onCancelEditComment={onCancelEditComment}
              onEditCommentContentChange={onEditCommentContentChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskComments;
