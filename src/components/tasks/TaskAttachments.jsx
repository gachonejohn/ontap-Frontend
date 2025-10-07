import React from "react";
import { formatDate } from "./taskFunctions/dateFormatters";

const TaskAttachments = ({ 
  task, 
  isEditingMode, 
  canEditAttachments, 
  files, 
  onFileChange, 
  onRemoveFile, 
  onRemoveAttachment 
}) => {
  // Add safety check for files
  const safeFiles = files || [];
  
  return (
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
          Attachments ({task?.attachments?.length || 0})
        </div>
      </div>

      {isEditingMode && canEditAttachments && (
        <div className="w-full">
          <label className="flex flex-col justify-center items-center gap-2.5 py-4 rounded-md border-2 border-dashed border-zinc-300 w-full bg-zinc-300/0 cursor-pointer hover:bg-gray-50">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={onFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
            />
            <div className="flex flex-col items-center gap-2">
              <img width="29" height="34" src="/images/upload.png" alt="Upload icon" />
              <div className="text-xs text-gray-500/70">
                {safeFiles.length > 0 ? (
                  `${safeFiles.length} new file(s) selected`
                ) : (
                  <>Upload or <span className="text-blue-600">browse</span></>
                )}
              </div>
            </div>
          </label>
          
          {/* Selected Files List */}
          {safeFiles.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-600 mb-2">New files to upload:</div>
              <div className="space-y-2">
                {safeFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-700 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {task?.attachments && task.attachments.length > 0 ? (
        task.attachments.map((attachment) => (
          <div key={attachment.id} className="flex flex-col justify-center items-center rounded-lg w-full p-3 shadow-sm bg-white">
            <div className="flex flex-row justify-between items-center w-full">
              <div className="flex flex-col justify-start items-start">
                <div className="text-xs font-medium text-neutral-900">
                  {attachment.original_filename}
                </div>
                <div className="text-[10px] text-gray-600 font-medium">
                  {attachment.file_size_formatted} • {formatDate(attachment.created_at)}
                </div>
              </div>
              <div className="flex gap-2">
                <a 
                  href={attachment.file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-row justify-center items-center gap-1 py-1 px-3 rounded-lg border border-neutral-200 hover:bg-gray-50"
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
                {isEditingMode && canEditAttachments && (
                  <button
                    onClick={() => onRemoveAttachment(attachment.id)}
                    className="flex flex-row justify-center items-center gap-1 py-1 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <div className="text-[10px] font-medium">
                      Remove
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : !isEditingMode && (
        <div className="text-center text-gray-500 text-sm py-4 border border-dashed border-gray-300 rounded-lg w-full">
          No attachments yet
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;