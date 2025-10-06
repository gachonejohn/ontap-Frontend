// src/components/tasks/modals/FileUploadModal.jsx
import React, { useState } from "react";
import { useUploadTaskAttachmentMutation } from "../../../store/services/tasks/tasksService";

export default function FileUploadModal({ isOpen, onClose, taskId, refetch }) {
  const [file, setFile] = useState(null);
  const [uploadAttachment, { isLoading: isUploading }] =
    useUploadTaskAttachmentMutation();

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !taskId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadAttachment({
        taskPk: taskId,
        formData,
      }).unwrap();

      if (refetch) refetch();
      onClose();
    } catch (err) {
      console.error("File upload error:", err);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl p-6 w-[420px] shadow-lg">
        {/* header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Upload Attachment
          </h2>
          <button
            onClick={onClose}
            className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* file input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Select File *</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border rounded-lg text-sm"
          />
        </div>

        {/* actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 text-sm rounded-lg bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
