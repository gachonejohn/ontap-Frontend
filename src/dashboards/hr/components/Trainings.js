import React, { useState, useRef } from 'react';

export default function Trainings() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [activeTab, setActiveTab] = useState('myCourses');
  const [activeStep, setActiveStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [courseFiles, setCourseFiles] = useState([]);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);

  const courseInfo = {
    title: 'Leadership Skills',
    category: 'Professional Development',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    instructor: 'John Doe',
  };

  const modules = [
    {
      title: 'Introduction',
      description: 'Module overview',
      files: [{ name: 'intro.pdf' }, { name: 'overview.mp4' }],
    },
    {
      title: 'Effective Communication',
      description: 'Communication strategies',
      files: [{ name: 'slides.pptx' }],
    },
  ];

  const targetAudience = 'Team Leads, Managers';

  const currentTrainings = [
    {
      title: 'Leadership Skills Development',
      user: 'Sarah Chen',
      duration: '4 hours',
      rating: 4.5,
      progressPercent: 70,
      nextModule: 'Effective Communication',
      modulesCompleted: 1,
      totalModules: 4,
      dueDate: '30 Aug 2025',
    },
    {
      title: 'Effective Communication',
      user: 'Sarah Chen',
      duration: '4 hours',
      rating: 4.5,
      progressPercent: 60,
      nextModule: 'Effective Communication',
      modulesCompleted: 1,
      totalModules: 4,
      dueDate: '30 Aug 2025',
    },
    {
      title: 'Leadership Skills Development',
      user: 'Sarah Chen',
      duration: '4 hours',
      rating: 4.5,
      progressPercent: 55,
      nextModule: 'Effective Communication',
      modulesCompleted: 1,
      totalModules: 4,
      dueDate: '30 Aug 2025',
    },
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setUploadedFiles(selectedFiles);
    console.log('Selected files:', selectedFiles);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col gap-1.5">
        <div className="text-lg text-neutral-900 font-semibold">Training and Development</div>
        <div className="text-sm text-gray-600 font-normal">
          Access training materials and track your progress
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Overall Progress Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Overall Progress</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">72%</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/overall_progress2.png"
                alt="Overall Progress icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">3 active courses</div>
        </div>

        {/* Completed Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Completed</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">1</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/complete.png"
                alt="Completed icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">This month</div>
        </div>

        {/* Learning Hours Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Learning Hours</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">33h</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/clock_3.png"
                alt="Learning Hours icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">This year</div>
        </div>

        {/* Achievements Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Achievements</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">3</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-purple-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/achievements.png"
                alt="Achievements icon"
              />
            </div>
          </div>
          <div className="text-xs text-gray-600">Badges earned</div>
        </div>
      </div>

      {/* Tabs section */}
      <div className="flex flex-col gap-4">
        {/* Tab Buttons */}
        <div className="flex rounded-lg border border-slate-100 h-10 bg-slate-50 overflow-hidden">
          <div
            className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'myCourses' ? 'bg-white' : ''}`}
            onClick={() => setActiveTab('myCourses')}
          >
            <div
              className={`text-xs text-neutral-900 ${activeTab === 'myCourses' ? 'font-semibold' : 'font-medium'}`}
            >
              My Courses
            </div>
          </div>
          <div
            className={`flex items-center justify-center h-10 w-1/2 cursor-pointer ${activeTab === 'courseCatalog' ? 'bg-white' : ''}`}
            onClick={() => setActiveTab('courseCatalog')}
          >
            <div
              className={`text-xs text-neutral-900 ${activeTab === 'courseCatalog' ? 'font-semibold' : 'font-medium'}`}
            >
              Course Catalog
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex flex-col gap-4">
          {activeTab === 'myCourses' ? (
            currentTrainings.map((course, index) => (
              <div key={index} className="flex flex-col gap-4 p-6 rounded-xl shadow-sm bg-white">
                {/* Header Row */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="text-sm text-neutral-900 font-semibold">{course.title}</div>
                    <div className="flex items-center gap-4">
                      {/* Instructor */}
                      <div className="flex items-center gap-1">
                        <img width="12" height="12" src="/images/user.png" alt="Instructor icon" />
                        <span className="text-xs text-gray-600 font-medium">{course.user}</span>
                      </div>
                      {/* Duration */}
                      <div className="flex items-center gap-1">
                        <img width="12" height="12" src="/images/clock.png" alt="Duration icon" />
                        <span className="text-xs text-gray-600 font-medium">{course.duration}</span>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <img width="15" height="15" src="/images/star.png" alt="Rating icon" />
                        <span className="text-xs text-gray-600 font-medium">{course.rating}</span>
                      </div>
                    </div>
                  </div>
                  {/* Continue Button */}
                  <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors">
                    <img src="/images/play.png" alt="Continue" className="w-4 h-4" />
                    Continue
                  </button>
                </div>

                {/* Progress Info */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600 font-medium">Progress</p>
                    <p className="text-xs text-gray-600 font-medium">
                      {course.modulesCompleted}/{course.totalModules} Modules
                    </p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-500 h-2 rounded-full"
                      style={{ width: `${course.progressPercent}%` }}
                    ></div>
                  </div>
                  {/* Bottom Info */}
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">Next: {course.nextModule}</p>
                    <p className="text-xs text-gray-500">Due: {course.dueDate}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center bg-white rounded-xl shadow-sm p-6 min-h-[200px]">
              <p className="text-gray-400 text-lg">Course Catalog Coming Soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Training Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowNewEmployeeModal(true)}
          className="flex justify-center items-center gap-2 p-2 rounded-md h-12 bg-teal-500 text-white text-sm hover:bg-teal-600 transition-colors"
        >
          <img src="/images/upload_training.png" alt="Upload Training" className="h-5 w-5" />
          Upload Training
        </button>
      </div>

      {/* Upload Training Modal */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowNewEmployeeModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
            >
              ×
            </button>

            {/* Modal Header */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload New Training Course</h2>

            {/* Step Navigation */}
            <div className="flex mb-6 text-sm border rounded-lg overflow-hidden">
              <button
                className={`flex-1 py-2 font-semibold text-center ${activeStep === 1 ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => setActiveStep(1)}
              >
                Course Details
              </button>
              <button
                className={`flex-1 py-2 font-semibold text-center ${activeStep === 2 ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => setActiveStep(2)}
              >
                Content & Modules
              </button>
              <button
                className={`flex-1 py-2 font-semibold text-center ${activeStep === 3 ? 'bg-white text-gray-700' : 'bg-gray-100 text-gray-500'}`}
                onClick={() => setActiveStep(3)}
              >
                Review & Publish
              </button>
            </div>

            {/* Step 1: Course Details */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter course title..."
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter instructor name..."
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                      <option>Select category</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Target Audience
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                      <option>Select audience</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Difficulty Level
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                      <option>Select difficulty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Estimated Duration
                    </label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 text-sm">
                      <option>Select duration</option>
                    </select>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setShowNewEmployeeModal(false)}
                    className="w-1/2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-1/2 bg-teal-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Content & Modules */}
            {activeStep === 2 && (
              <div className="space-y-6">
                {/* Course Materials Upload */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Course Materials</h3>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    <img
                      src="/images/upload_file.png"
                      alt="upload"
                      className="mx-auto mb-4 w-14 h-14 object-contain"
                    />
                    <p className="text-sm text-gray-600 mb-1">Upload course materials</p>
                    <p className="text-xs text-gray-400 mb-4">
                      Supported formats: PDF, DOCX, PPTX, MP4, AVI, JPG, PNG (Max: 100MB each)
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      accept=".pdf,.docx,.pptx,.mp4,.avi,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-teal-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-teal-600 inline-block"
                    >
                      + Choose Files
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setActiveStep(1)}
                    className="w-1/2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setActiveStep(3)}
                    className="w-1/2 bg-teal-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Publish */}
            {activeStep === 3 && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Course Preview</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-base font-semibold text-gray-700 mb-3">
                        Course Information
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>
                          <strong>Title:</strong> {courseInfo.title || 'Not specified'}
                        </li>
                        <li>
                          <strong>Category:</strong> {courseInfo.category || 'Not specified'}
                        </li>
                        <li>
                          <strong>Difficulty:</strong> {courseInfo.difficulty || 'Not specified'}
                        </li>
                        <li>
                          <strong>Duration:</strong> {courseInfo.duration || 'Not specified'}
                        </li>
                        <li>
                          <strong>Instructor:</strong> {courseInfo.instructor || 'Not specified'}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-700 mb-3">
                        Content Summary
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>
                          <strong>Modules:</strong> {modules.length}
                        </li>
                        <li>
                          <strong>Course Files:</strong> {courseFiles.length}
                        </li>
                        <li>
                          <strong>Total Module Files:</strong>{' '}
                          {modules.reduce((acc, mod) => acc + mod.files.length, 0)}
                        </li>
                        <li>
                          <strong>Target Audience:</strong> {targetAudience || 'Not specified'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-1/2 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => {
                      // Handle publish logic here
                      setShowNewEmployeeModal(false);
                    }}
                    className="w-1/2 bg-teal-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-600"
                  >
                    Publish Course
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
