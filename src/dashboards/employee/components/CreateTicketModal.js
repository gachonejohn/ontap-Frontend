// CreateTicketModal.js
import React, { useState } from "react";

const CreateTicketModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [description, setDescription] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit({ title, category, priority, description });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start bg-black/30 overflow-auto">
            <div className="relative mt-12 bg-white rounded-2xl w-[560px] max-h-[90vh] overflow-y-auto shadow-lg p-6">
                {/* Header with Close Button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg text-neutral-900 font-semibold">
                        Create Support Ticket
                    </h2>
                    <button
                        onClick={onClose}
                        className="flex justify-center items-center w-7 h-7 hover:bg-gray-100 rounded-full"
                        aria-label="Close Modal"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 4L4 12"
                                stroke="#4B5563"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M4 4L12 12"
                                stroke="#4B5563"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex flex-col gap-5">
                    {/* Issue Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-900 font-medium">
                            Issue Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Brief discussion of your issue..."
                            className="rounded-lg border border-neutral-200 w-full h-11 px-3"
                        />
                    </div>

                    {/* Category & Priority */}
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm text-neutral-900 font-medium">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded-lg border border-neutral-200 w-full h-11 px-2 cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select category
                                </option>
                                <option value="HR">HR</option>
                                <option value="Technical">Technical</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 w-1/2">
                            <label className="text-sm text-neutral-900 font-medium">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="rounded-lg border border-neutral-200 w-full h-11 px-2 cursor-pointer"
                            >
                                <option value="" disabled>
                                    Select priority
                                </option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-neutral-900 font-medium">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Please describe your issue in detail..."
                            className="rounded-lg border border-neutral-200 w-full h-24 px-3 py-2 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="flex justify-center items-center h-12 bg-teal-500 rounded-lg text-white font-medium hover:bg-teal-600 transition-colors"
                    >
                        Submit Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTicketModal;
