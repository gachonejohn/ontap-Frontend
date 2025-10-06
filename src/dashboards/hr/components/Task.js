import React, { useState } from 'react';
import LogTaskModal from './LogTaskModal';
import TaskModal from './TaskModal';

const Task = () => {
  const [isLogTaskModalOpen, setIsLogTaskModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const handleLogTaskSubmit = (formData) => {
    console.log("New Task Submitted:", formData);
    // You can push new task to state here
  };

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
      },
      {
        id: 4,
        title: "Design Review for OnTap",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "To do",
        priority: "High",
        assignee: "Mildred",
        startDate: "Sep 02,2025",
        dueDate: "Aug 28, 2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
      },
      {
        id: 5,
        title: "Design Review for OnTap",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "To do",
        priority: "High",
        assignee: "Mildred",
        startDate: "Sep 02,2025",
        dueDate: "Aug 28, 2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
      }
    ],
    inProgress: [
      {
        id: 2,
        title: "Complete Q3 Performance Review",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "In Progress",
        priority: "Medium",
        assignee: "Thaddeus",
        startDate: "Sep 02,2025",
        dueDate: "Sep 18, 2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
      },
      {
        id: 6,
        title: "Design Review for Ontap",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "In Progress",
        priority: "Medium",
        assignee: "Sarah",
        startDate: "Sep 02,2025",
        dueDate: "Sep 18, 2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
      }
    ],
    completed: [
      {
        id: 3,
        title: "Complete Q3 Performance Review",
        description: "Fill out the quarterly performance form and submit to HR",
        status: "Completed",
        priority: "Low",
        assignee: "Mildred",
        startDate: "Sep 02,2025",
        dueDate: "Sep 01, 2025",
        attachments: [{ name: "Training_outl_docx", size: "2.5 MB" }],
      }
    ]
  };

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className="flex flex-col gap-3 p-4 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm border border-gray-100"
      onClick={() => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
      }}
    >
      <div className="flex justify-between items-start">
        <div className="text-sm text-neutral-900 font-medium">{task.title}</div>
        <img
          width="16"
          height="16"
          src={`/images/${task.priority.toLowerCase()}flag.png`}
          alt="Priority flag"
        />
      </div>
      <div className="text-xs text-neutral-700">{task.description}</div>
      <div className="flex justify-between pt-2 text-xs">
        <div className="flex items-center gap-1 text-gray-600">
          <img src="/images/calendar.png" className="w-3 h-3" alt="calendar" />
          {task.dueDate}
        </div>
        <div
          className="px-2 py-1 rounded-md font-semibold text-xs"
          style={{
            backgroundColor:
              task.priority === "High"
                ? "#FEE2E2"
                : task.priority === "Medium"
                ? "#FEF9C3"
                : "#DCFCE7",
            color:
              task.priority === "High"
                ? "#B91C1C"
                : task.priority === "Medium"
                ? "#92400E"
                : "#166534"
          }}
        >
          {task.priority}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-200">
        <div className="flex items-center gap-1">
          <img width="12" height="13" src="/images/assignee_2.png" alt="Assignee" />
          <div className="text-xs text-gray-600 font-medium">
            Assigned by {task.assignee}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">My Tasks</div>
        <div className="text-sm text-gray-600 font-normal">
          Manage and track your assigned tasks
        </div>
      </div>

      {/* New Task Button */}
      <div className="flex justify-end">
        <button
          className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
          onClick={() => setIsLogTaskModalOpen(true)}
        >
          <img src="/images/addtask.png" className="w-5 h-5" alt="Add Task" />
          New Task
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 h-10 shadow-md bg-white flex-1">
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
          />
        </div>

        <div className="relative">
          <div
            className="flex flex-row justify-center items-center gap-2 p-2 rounded-lg border border-neutral-200 w-[150px] h-10 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsFilterDropdownOpen(prev => !prev)}
          >
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
                {selectedFilter} Tasks
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

          {/* Filter Options Dropdown */}
          {isFilterDropdownOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {['All', 'To Do', 'In Progress', 'Completed'].map((filter) => (
                <div
                  key={filter}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                  onClick={() => {
                    setSelectedFilter(filter);
                    setIsFilterDropdownOpen(false);
                  }}
                >
                  {filter}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(selectedFilter === 'All' || selectedFilter === 'To Do') && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "#3A86FF" }}
              ></span>
              <h3 className="text-sm font-semibold text-neutral-700 flex items-center">
                To Do
                <span
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-sm bg-gray-100 text-gray-700"
                >
                  {tasks.todo.length}
                </span>
              </h3>
            </div>
            {tasks.todo.map(renderTaskCard)}
          </div>
        )}

        {(selectedFilter === 'All' || selectedFilter === 'In Progress') && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "#e7b213" }}
              ></span>
              <h3 className="text-sm font-semibold text-neutral-700 flex items-center">
                In Progress
                <span
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-sm bg-gray-100 text-gray-700"
                >
                  {tasks.inProgress.length}
                </span>
              </h3>
            </div>
            {tasks.inProgress.map(renderTaskCard)}
          </div>
        )}

        {(selectedFilter === 'All' || selectedFilter === 'Completed') && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: '#4fc560' }}
              ></span>
              <h3 className="text-sm font-semibold text-neutral-700 flex items-center">
                Completed
                <span
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold rounded-sm bg-gray-100 text-gray-700"
                >
                  {tasks.completed.length}
                </span>
              </h3>
            </div>
            {tasks.completed.map(renderTaskCard)}
          </div>
        )}
      </div>

      {/* Modals */}
      <LogTaskModal
        isOpen={isLogTaskModalOpen}
        onClose={() => setIsLogTaskModalOpen(false)}
        onSubmit={handleLogTaskSubmit}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
      />
    </div>
  );
};

export default Task;