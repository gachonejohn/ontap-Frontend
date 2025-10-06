import React, { useState } from "react";
import LogTaskModal from "./LogTaskModal.js";
import TaskModal from "./TaskModal.js";
import ViewProfileModal from "./ViewProfileModal.js";

const Task = () => {
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogTaskSubmit = (formData) => {
    console.log("New Task Submitted:", formData);
    // You can add your API call or state update here
  };

  // Sample task data (you might want to move this to state or props)
  const tasks = {
    todo: [
      {
        id: 1,
        title: "Complete Q3 Performance Review",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "To do",
        priority: "High",
        assignee: "Mildred",
        team: "HR",
        startDate: "Sep 02,2025",
        dueDate: "Sep 09,2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
        comments: "Great explanation of leadership overview! The examples really helped me understand the concept better."
      },
      // ... other tasks
    ],
    inProgress: [
      // ... tasks
    ],
    completed: [
      // ... tasks
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Task Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">
            My Tasks
          </div>
          <div className="text-sm text-gray-600 font-normal">
            Manage and track your assigned tasks
          </div>
        </div>
        <div
          className="flex justify-center items-center rounded-md w-[180px] h-12 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
          onClick={() => setIsLogTaskModalOpen(true)} // Open LogTaskModal
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex justify-center items-center w-5 h-5">
              <img
                width="15.3px"
                height="15.3px"
                src="/images/addtask.png"
                alt="Add Task icon"
              />
            </div>
            <div className="text-sm text-white font-medium">
              New Task
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-row justify-between items-center gap-4 w-full">
        {/* Search Input */}
        <div className="flex flex-row items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md min-w-[800px] transition-transform duration-200 hover:-translate-y-1 bg-white flex-1">
          <div className="flex justify-center items-center h-5">
            <img
              width="16.5px"
              height="16.5px"
              src="/images/search.png"
              alt="Search icon"
            />
          </div>
          <input
            type="text"
            placeholder="Search for tasks"
            className="flex-1 text-xs text-gray-400 font-normal outline-none"
            onChange={(e) => {
              // Add your search handler here, e.g. setSearchTerm(e.target.value)
              console.log(e.target.value);
            }}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[115px] h-11 bg-white cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex flex-row items-center gap-1">
            <div className="flex justify-center items-center h-5">
              <img
                width="16.3px"
                height="16.3px"
                src="/images/filter.png"
                alt="Filter icon"
              />
            </div>
            <div className="text-xs text-neutral-900 font-semibold">
              All Task
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-4 h-4">
            <img
              width="9.5px"
              height="5.1px"
              src="/images/dropdown.png"
              alt="Dropdown icon"
            />
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* To Do Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img width="14" height="14" src="/images/todo.png" alt="To Do icon" />
              <div className="text-base text-neutral-900 font-medium">To Do</div>
            </div>
            <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
              <div className="text-xs text-neutral-900 font-semibold">3</div>
            </div>
          </div>

          {/* Task Cards */}
          <div className="flex flex-col gap-4">
            {/* Task 1 */}
            <div
              className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
              onClick={() => {
                setSelectedTask(tasks.todo[0]);
                setIsTaskModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Complete Q3 Performance Review
                </div>
                <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR.....
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-red-100">
                  <div className="text-[10.5px] text-pink-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by Mildred</div>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div
              className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors"
              onClick={() => {
                // You would set the appropriate task data here
                setSelectedTask({
                  title: "Design Review for Ontap",
                  description: "Fill out the quarterly performance form and submit to HR",
                  status: "To do",
                  priority: "High",
                  assignee: "Thaddeus",
                  team: "Design",
                  startDate: "Sep 02,2025",
                  dueDate: "Sep 09,2025",
                  attachments: [],
                  comments: "No comments yet."
                });
                setIsTaskModalOpen(true);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Design Review for Ontap
                </div>
                <img width="16.5" height="16.3" src="/images/greenflag.png" alt="Green flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-green-100">
                  <div className="text-[10.5px] text-green-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by Thaddeus</div>
                </div>
              </div>
            </div>

            {/* Task 3 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Design Review for Ontap
                </div>
                <img width="16.5" height="16.3" src="/images/greenflag.png" alt="Green flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-green-100">
                  <div className="text-[10.5px] text-green-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by me</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In Progress Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img width="14" height="14" src="/images/inprogress.png" alt="In Progress" />
              <div className="text-base text-neutral-900 font-medium">In Progress</div>
            </div>
            <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
              <div className="text-xs text-neutral-900 font-semibold">2</div>
            </div>
          </div>

          {/* Task Cards */}
          <div className="flex flex-col gap-4">
            {/* Task 1 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Complete Q3 Performance Review
                </div>
                <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-red-100">
                  <div className="text-[10.5px] text-pink-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by Mildred</div>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Design Review for Ontap
                </div>
                <img width="16.5" height="16.3" src="/images/greenflag.png" alt="Green flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-green-100">
                  <div className="text-[10.5px] text-green-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by Thaddeus</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img width="14" height="14" src="/images/completed.png" alt="Completed" />
              <div className="text-base text-neutral-900 font-medium">Completed</div>
            </div>
            <div className="flex items-center justify-center rounded border border-neutral-200 w-5 h-5">
              <div className="text-xs text-neutral-900 font-semibold">1</div>
            </div>
          </div>

          {/* Task Cards */}
          <div className="flex flex-col gap-4">
            {/* Task 1 */}
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50/80 cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex justify-between items-start">
                <div className="text-sm text-neutral-900 font-medium">
                  Complete Q3 Performance Review
                </div>
                <img width="16.5" height="16.3" src="/images/redflag.png" alt="Red flag" />
              </div>
              <div className="text-xs text-neutral-900 font-normal">
                Fill out the quarterly performance form and submit to HR
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1">
                  <img width="12.2" height="12.2" src="/images/calendar1.png" alt="Calendar" />
                  <div className="text-[10px] text-gray-600 font-medium">Aug 26, 2025</div>
                </div>
                <div className="flex items-center justify-center py-0.5 px-2 rounded-md bg-red-100">
                  <div className="text-[10.5px] text-pink-800 font-semibold">High</div>
                </div>
              </div>
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex items-center gap-1">
                  <img width="11.5" height="12.8" src="/images/assignee.png" alt="Assignee" />
                  <div className="text-[10px] text-gray-600 font-medium">Assigned by Mildred</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Log Task Modal */}
      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleLogTaskSubmit}
      />

      {/* Task Detail Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default Task;