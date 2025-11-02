import React from 'react';
import { formatDateTime } from './taskFunctions/dateFormatters';

const CommentItem = ({
  comment,
  editingCommentId,
  editCommentContent,
  currentUser,
  onEditComment,
  onSaveComment,
  onDeleteComment,
  onCancelEditComment,
  onEditCommentContentChange,
}) => {
  const isEditing = editingCommentId === comment.id;

  // 🔥 FIX: Extract user ID correctly and compare with comment.user
  const userId = currentUser?.user?.id || currentUser?.id;
  const canEditComment = userId === comment.user;

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editCommentContent}
            onChange={(e) => onEditCommentContentChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
            rows="3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onSaveComment(comment.id)}
              disabled={!editCommentContent.trim()}
              className="px-3 py-1 bg-teal-500 text-white text-xs rounded hover:bg-teal-600 disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={onCancelEditComment}
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
              <span className="text-sm font-medium text-gray-900">
                {comment.user_name || 'Unknown User'}
              </span>
            </div>
            {/* 🔥 FIX: Use extracted userId for comparison */}
            {canEditComment && (
              <div className="flex gap-1">
                <button
                  onClick={() => onEditComment(comment)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
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
  );
};

export default CommentItem;
