import React, { useState } from 'react';
import ViewProfileModal from './ViewProfileModal.js';

const Training = () => {
  const [activeTab, setActiveTab] = useState('myCourses');
  const [currentView, setCurrentView] = useState('trainingDashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseDetailTab, setCourseDetailTab] = useState('overview');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleContinueCourse = (course) => {
    setSelectedCourse(course);
    setCurrentView('courseDetail');
  };

  const handleReturnToCourses = () => {
    setCurrentView('trainingDashboard');
    setSelectedCourse(null);
  };

  if (currentView === 'courseDetail') {
    return (
      <div className="flex flex-col gap-6">
        {/* Course Navigation Header */}
        <div className="flex flex-row justify-between items-center w-full flex-nowrap">
          <div className="flex flex-row justify-center items-center gap-6 w-[433px] min-w-0">
            <div
              className="flex flex-row justify-center items-center gap-1.5 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors whitespace-nowrap"
              onClick={handleReturnToCourses}
            >
              <div className="flex flex-col justify-center items-center h-5">
                <img width="17.9px" height="15.1px" src="/images/back.png" alt="Back icon" />
              </div>
              <div className="text-sm text-neutral-900 font-medium">Return to courses</div>
            </div>
            <div className="flex flex-col justify-start items-start gap-1.5 w-[264px] min-w-0">
              <div className="text-[18px] text-neutral-900 font-semibold truncate">
                Developing Leadership Skills
              </div>
              <div className="text-sm text-gray-600 font-normal truncate">
                Module 1 of 4: Leadership Skills Overview
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-start items-center gap-2 w-[283px] min-w-0">
            <div className="text-[10px] text-gray-600 font-medium whitespace-nowrap">
              Course Progress: 38% Complete
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full flex-shrink-0">
              <div className="h-2 bg-teal-500 rounded-full" style={{ width: '38%' }}></div>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-start items-start gap-6 w-full">
          {/* Course Modules Sidebar */}
          <div className="flex flex-col justify-start items-start gap-5 w-[251px]">
            <div className="text-base text-neutral-900 font-semibold">Course Modules</div>

            <div className="flex flex-col justify-start items-start gap-3 w-full">
              {/* Module 1 - Active */}
              <div className="flex flex-col justify-center items-center rounded-lg border border-green-200 w-full h-[71px] bg-green-50 p-3">
                <div className="flex flex-row justify-start items-center gap-3 w-full">
                  <div className="flex flex-row justify-center items-center rounded-2xl w-9 h-9 bg-green-500">
                    <img width="24px" height="24px" src="/images/check.png" alt="Check icon" />
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-[185px]">
                    <div className="text-sm text-neutral-900 font-medium">
                      Leadership Introduction...
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="11.5px"
                          src="/images/clock.png"
                          alt="Clock icon"
                        />
                      </div>
                      <div className="text-[10px] text-green-600 font-medium">
                        Duration: 2 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 2 */}
              <div className="flex flex-col justify-center items-center rounded-lg border border-gray-200 w-full h-[71px] bg-gray-50 p-3">
                <div className="flex flex-row justify-start items-center gap-3 w-full">
                  <div className="flex flex-row justify-center items-center rounded-2xl w-9 h-9 bg-gray-300">
                    <div className="text-base text-gray-600 font-medium">2</div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-[185px]">
                    <div className="text-sm text-neutral-900 font-medium">
                      Effective Communication
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="11.5px"
                          src="/images/clock.png"
                          alt="Clock icon"
                        />
                      </div>
                      <div className="text-[10px] text-gray-600 font-medium">
                        Duration: 45 minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 3 */}
              <div className="flex flex-col justify-center items-center rounded-lg border border-gray-200 w-full h-[71px] bg-gray-50 p-3">
                <div className="flex flex-row justify-start items-center gap-3 w-full">
                  <div className="flex flex-row justify-center items-center rounded-2xl w-9 h-9 bg-gray-300">
                    <div className="text-base text-gray-600 font-medium">3</div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-[185px]">
                    <div className="text-sm text-neutral-900 font-medium">Team Management</div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="11.5px"
                          src="/images/clock.png"
                          alt="Clock icon"
                        />
                      </div>
                      <div className="text-[10px] text-gray-600 font-medium">
                        Duration: 45 minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Module 4 */}
              <div className="flex flex-col justify-center items-center rounded-lg border border-gray-200 w-full h-[71px] bg-gray-50 p-3">
                <div className="flex flex-row justify-start items-center gap-3 w-full">
                  <div className="flex flex-row justify-center items-center rounded-2xl w-9 h-9 bg-gray-300">
                    <div className="text base text-gray-600 font-medium">4</div>
                  </div>
                  <div className="flex flex-col justify-start items-start gap-1 w-[185px]">
                    <div className="text-sm text-neutral-900 font-medium">Strategic Thinking</div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="11.5px"
                          src="/images/clock.png"
                          alt="Clock icon"
                        />
                      </div>
                      <div className="text-[10px] text-gray-600 font-medium">
                        Duration: 45 minutes
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="flex flex-col justify-start items-start gap-6 flex-1 min-w-0">
            {/* Video Player */}
            <div className="flex flex-col justify-between items-center pt-12 pb-8 gap-6 rounded-lg w-full h-[500px] bg-black">
              <div className="flex flex-col justify-start items-center gap-6 h-44">
                <img width="100px" height="100px" src="/images/video.png" alt="Video icon" />
                <div className="flex flex-col justify-center items-center gap-1.5 w-full max-w-[398px] px-4">
                  <div className="text-[18px] text-white font-semibold text-center">
                    Leadership Skills Overview
                  </div>
                  <div className="text-sm text-white/80 font-medium text-center">
                    Training Video Materials
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-center gap-3 w-full px-6">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-base text-white font-medium">Start Time: 0:00</div>
                  <div className="text-base text-white font-medium">Total Duration: 1:59:00</div>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="flex flex-row justify-start items-center gap-6">
                    <div className="flex justify-center items-center w-5 h-5">
                      <img
                        width="16.3px"
                        height="18.2px"
                        src="/images/play.png"
                        alt="Rewind icon"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-center h-5">
                      <img
                        width="19.3px"
                        height="17.3px"
                        src="/images/volume.png"
                        alt="Volume button"
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-5 h-5">
                    <img
                      width="16.5px"
                      height="16.5px"
                      src="/images/fullscreen.png"
                      alt="Fullscreen icon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-row justify-between items-center w-full">
              <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex flex-row justify-start items-center gap-0.5">
                  <div className="flex justify-center items-center w-4 h-4">
                    <img
                      width="10px"
                      height="15px"
                      src="/images/previous.png"
                      alt="Previous icon"
                    />
                  </div>
                  <div className="text-xs text-neutral-900 font-medium">Previous Module</div>
                </div>
              </button>

              <div className="text-xs text-neutral-900 font-medium">1/4 Modules</div>

              <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex flex-row justify-start items-center gap-0.5">
                  <div className="text-xs text-neutral-900 font-medium">Next Module</div>
                  <div className="flex justify-center items-center w-4 h-4">
                    <img width="10px" height="15px" src="/images/next.png" alt="Next icon" />
                  </div>
                </div>
              </button>
            </div>

            {/* Course Details Tabs */}
            <div className="flex flex-col justify-start items-start w-full">
              <div className="flex flex-row justify-center items-center border border-slate-100 bg-slate-50 w-full overflow-x-auto">
                <div
                  className={`flex flex-row justify-center items-center gap-2 p-2 px-4 rounded-lg border-r border-slate-100 h-10 min-w-[201px] shrink-0 cursor-pointer ${
                    courseDetailTab === 'overview' ? 'bg-white' : ''
                  }`}
                  onClick={() => setCourseDetailTab('overview')}
                >
                  <div
                    className={`text-xs text-neutral-900 ${
                      courseDetailTab === 'overview' ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    Overview
                  </div>
                </div>
                <div
                  className={`flex flex-row justify-center items-center gap-2 p-2 px-4 h-10 min-w-[201px] shrink-0 cursor-pointer ${
                    courseDetailTab === 'resources' ? 'bg-white' : ''
                  }`}
                  onClick={() => setCourseDetailTab('resources')}
                >
                  <div
                    className={`text-xs text-neutral-900 ${
                      courseDetailTab === 'resources' ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    Resources
                  </div>
                </div>
                <div
                  className={`flex flex-row justify-center items-center gap-2 p-2 px-4 h-10 min-w-[201px] shrink-0 cursor-pointer ${
                    courseDetailTab === 'notes' ? 'bg-white' : ''
                  }`}
                  onClick={() => setCourseDetailTab('notes')}
                >
                  <div
                    className={`text-xs text-neutral-900 ${
                      courseDetailTab === 'notes' ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    Notes
                  </div>
                </div>
                <div
                  className={`flex flex-row justify-center items-center gap-2 p-2 px-4 h-10 min-w-[201px] shrink-0 cursor-pointer ${
                    courseDetailTab === 'discussion' ? 'bg-white' : ''
                  }`}
                  onClick={() => setCourseDetailTab('discussion')}
                >
                  <div
                    className={`text-xs text-neutral-900 ${
                      courseDetailTab === 'discussion' ? 'font-semibold' : 'font-medium'
                    }`}
                  >
                    Discussion
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex flex-col justify-start items-start gap-6 p-4 w-full shadow-sm bg-white">
                {courseDetailTab === 'overview' && (
                  <>
                    {/* Learning Objectives */}
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                      <div className="text-base text-neutral-900 font-semibold">
                        Learning Objectives
                      </div>
                      <div className="flex flex-col justify-start items-start gap-2 w-full">
                        <div className="flex flex-row justify-center items-center gap-1.5">
                          <img
                            width="18px"
                            height="18px"
                            src="/images/checkcircle.png"
                            alt="Check circle"
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            Understand advanced React concepts and patterns
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-1.5">
                          <img
                            width="18px"
                            height="18px"
                            src="/images/checkcircle.png"
                            alt="Check circle"
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            Implement custom hooks for code reusability
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-1.5">
                          <img
                            width="18px"
                            height="18px"
                            src="/images/checkcircle.png"
                            alt="Check circle"
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            Optimize React applications for better performance
                          </div>
                        </div>
                        <div className="flex flex-row justify-center items-center gap-1.5">
                          <img
                            width="18px"
                            height="18px"
                            src="/images/checkcircle.png"
                            alt="Check circle"
                          />
                          <div className="text-xs text-gray-600 font-medium">
                            Write effective tests for React components
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Course Description */}
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                      <div className="text-base text-neutral-900 font-semibold">
                        Course Description
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        This comprehensive course covers advanced React development techniques that
                        will take your skills to the next level.
                        <br />
                        You'll learn about performance optimization, custom hooks, testing
                        strategies, and best practices for building scalable React applications.
                      </div>
                    </div>

                    {/* Prerequisites */}
                    <div className="flex flex-col justify-start items-start gap-2 w-full">
                      <div className="text-base text-neutral-900 font-semibold">Prerequisites</div>
                      <div className="flex flex-col justify-start items-start gap-1 w-full">
                        <div className="text-xs text-gray-600 font-medium">
                          • Basic understanding of React fundamentals
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          • JavaScript ES6+ knowledge
                        </div>
                        <div className="text-xs text-gray-600 font-medium">
                          • Experience with React hooks
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {courseDetailTab === 'resources' && (
                  <div className="flex flex-col justify-start items-center h-[412px] shadow-sm bg-white w-full">
                    <div className="flex flex-col justify-start items-start gap-2 pt-4 pr-4 pb-4 pl-4 w-full">
                      {/* Section Header */}
                      <div className="flex flex-row justify-start items-center gap-4 pt-2 pb-2 h-9">
                        <div className="gap-4 flex flex-row justify-start items-center w-full">
                          <div className="flex flex-row justify-start items-center gap-1.5 h-5">
                            <div className="text-base min-w-[142px] whitespace-nowrap text-neutral-900 font-semibold">
                              Course Resources
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cards Grid */}
                      <div className="grid grid-cols-2 gap-4 w-full">
                        {/* Card 1 */}
                        <div className="flex flex-col justify-center items-center rounded-lg h-20 shadow-sm bg-white p-4">
                          <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-col justify-start items-start gap-2 w-[180px]">
                              <div className="text-sm text-neutral-900 font-medium">
                                Leadership Documentation
                              </div>
                              <div className="text-xs text-gray-600 font-medium">PDF 2.5 MB</div>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 p-2 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50">
                              <div className="flex justify-center items-center h-4">
                                <img
                                  width="13px"
                                  height="13px"
                                  src="/images/download.png"
                                  alt="Download icon"
                                />
                              </div>
                              <div className="text-xs text-gray-800 font-medium">Download</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 2 */}
                        <div className="flex flex-col justify-center items-center rounded-lg h-20 shadow-sm bg-white p-4">
                          <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-col justify-start items-start gap-2 w-[180px]">
                              <div className="text-sm text-neutral-900 font-medium">
                                Leadership Workbook
                              </div>
                              <div className="text-xs text-gray-600 font-medium">PDF 3.2 MB</div>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 p-2 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50">
                              <div className="flex justify-center items-center h-4">
                                <img
                                  width="13px"
                                  height="13px"
                                  src="/images/download.png"
                                  alt="Download icon"
                                />
                              </div>
                              <div className="text-xs text-gray-800 font-medium">Download</div>
                            </div>
                          </div>
                        </div>

                        {/* Card 3 - Case Studies */}
                        <div className="flex flex-col justify-center items-center rounded-lg h-20 shadow-sm bg-white p-4">
                          <div className="flex flex-row justify-between items-center w-full">
                            <div className="flex flex-col justify-start items-start gap-2 w-[180px]">
                              <div className="text-sm text-neutral-900 font-medium">
                                Case Studies
                              </div>
                              <div className="text-xs text-gray-600 font-medium">ZIP 5.1 MB</div>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-1 p-2 rounded-lg border border-neutral-200 h-9 min-w-[90px] cursor-pointer hover:bg-gray-50">
                              <div className="flex justify-center items-center h-4">
                                <img
                                  width="13px"
                                  height="13px"
                                  src="/images/download.png"
                                  alt="Download icon"
                                />
                              </div>
                              <div className="text-xs text-gray-800 font-medium">Download</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {courseDetailTab === 'notes' && (
                  <div className="flex flex-col justify-start items-start w-full">
                    <div className="flex flex-row justify-between items-center w-full pb-4">
                      <div className="text-base text-neutral-900 font-semibold">My Notes</div>
                      <button className="flex flex-row justify-center items-center gap-1 p-2 rounded-lg border border-neutral-200 h-9 bg-white hover:bg-gray-50 transition-colors min-w-[90px]">
                        <div className="text-xs text-gray-800 font-medium">Save Notes</div>
                      </button>
                    </div>
                    <div className="flex justify-start items-start p-3 rounded-lg w-full h-[300px] bg-gray-100 border border-gray-200">
                      <textarea
                        className="w-full h-full bg-transparent text-sm text-gray-600 focus:outline-none resize-none"
                        placeholder="Take note about this module..."
                      />
                    </div>
                  </div>
                )}

                {courseDetailTab === 'discussion' && (
                  <div className="flex flex-col justify-start items-start gap-4 w-full">
                    {/* Comment Input Area */}
                    <div className="flex flex-col justify-center items-center rounded-lg w-full p-4 bg-gray-50">
                      <div className="flex flex-col justify-start items-start gap-4 w-full">
                        <div className="flex justify-start items-center p-3 rounded-md w-full bg-gray-100">
                          <input
                            className="w-full bg-transparent text-sm text-gray-600 focus:outline-none"
                            placeholder="Ask a question or share your thoughts"
                          />
                        </div>
                        <button className="flex flex-row justify-center items-center gap-2 p-2 rounded-md h-9 bg-teal-500 min-w-[145px] hover:bg-teal-600 transition-colors">
                          <div className="flex justify-center items-center h-4">
                            <img
                              width="15.8px"
                              height="14.6px"
                              src="/images/comment.png"
                              alt="Comment icon"
                            />
                          </div>
                          <div className="text-xs text-white font-medium">Post Comment</div>
                        </button>
                      </div>
                    </div>

                    {/* Comment 1 */}
                    <div className="flex justify-center items-center rounded-lg w-full p-4 shadow-sm bg-white">
                      <div className="flex flex-row justify-start items-start gap-4 w-full">
                        <img
                          className="rounded-full border-2 border-white"
                          src="/images/profile1.png"
                          alt="Jack Johnson"
                          width="32px"
                          height="32px"
                        />
                        <div className="flex flex-col justify-start items-start gap-3 flex-1">
                          <div className="text-sm text-neutral-900 font-semibold">
                            Jack Johnson
                            <span className="text-xs text-gray-600 font-medium"> • </span>
                            <span className="text-sm text-gray-600 font-normal">2 hours ago</span>
                          </div>
                          <div className="text-xs text-gray-600 font-normal">
                            Great explanation of leadership overview! The examples really helped me
                            understand the concept better. The practical examples were especially
                            helpful.
                          </div>
                          <div className="flex flex-row justify-start items-center gap-1">
                            <div className="flex justify-center items-center h-3">
                              <img
                                width="10.6px"
                                height="10.6px"
                                src="/images/reply.png"
                                alt="Reply icon"
                              />
                            </div>
                            <div className="text-xs text-gray-600 font-medium">Reply (0)</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Comment 2 with replies */}
                    <div className="flex flex-col justify-center items-center rounded-lg w-full p-4 shadow-sm bg-white">
                      <div className="flex flex-col justify-start items-center gap-4 w-full">
                        {/* Main comment */}
                        <div className="flex flex-row justify-start items-start gap-4 w-full">
                          <img
                            className="rounded-full border-2 border-white"
                            src="/images/profile2.png"
                            alt="John Joshua"
                            width="32px"
                            height="32px"
                          />
                          <div className="flex flex-col justify-start items-start gap-3 flex-1">
                            <div className="text-sm text-neutral-900 font-semibold">
                              John Joshua
                              <span className="text-xs text-gray-600 font-medium"> • </span>
                              <span className="text-sm text-gray-600 font-normal">2 hours ago</span>
                            </div>
                            <div className="text-xs text-gray-600 font-normal">
                              Great explanation of leadership overview! The examples really helped
                              me understand the concept better. The practical examples were
                              especially helpful.
                            </div>
                            <div className="flex flex-row justify-start items-center gap-1">
                              <div className="flex justify-center items-center h-3">
                                <img
                                  width="10.6px"
                                  height="10.6px"
                                  src="/images/reply.png"
                                  alt="Reply icon"
                                />
                              </div>
                              <div className="text-xs text-gray-600 font-medium">Reply (2)</div>
                            </div>
                          </div>
                        </div>

                        {/* Reply 1 */}
                        <div className="flex flex-row justify-start items-start gap-4 w-full ml-12">
                          <img
                            className="rounded-full border-2 border-white"
                            src="/images/profile3.png"
                            alt="Aisha Patel"
                            width="32px"
                            height="32px"
                          />
                          <div className="flex flex-col justify-start items-start gap-3 flex-1">
                            <div className="text-sm text-neutral-900 font-semibold">
                              Aisha Patel
                              <span className="text-xs text-gray-600 font-medium"> • </span>
                              <span className="text-sm text-gray-600 font-normal">1 hour ago</span>
                            </div>
                            <div className="text-xs text-gray-600 font-normal">
                              I agree! The useState and useEffect combinations were eye-opening.
                            </div>
                          </div>
                        </div>

                        {/* Reply 2 */}
                        <div className="flex flex-row justify-start items-start gap-4 w-full ml-12">
                          <img
                            className="rounded-full border-2 border-white"
                            src="/images/profile4.png"
                            alt="Markus Reyes"
                            width="32px"
                            height="32px"
                          />
                          <div className="flex flex-col justify-start items-start gap-3 flex-1">
                            <div className="text-sm text-neutral-900 font-semibold">
                              Markus Reyes
                              <span className="text-xs text-gray-600 font-medium"> • </span>
                              <span className="text-sm text-gray-600 font-normal">30 min ago</span>
                            </div>
                            <div className="text-xs text-gray-600 font-normal">
                              Thanks Alice! Have you tried implementing the custom hooks in your
                              projects yet?
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Original Training Dashboard View
  return (
    <div className="flex flex-col gap-6">
      {/* Training Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col justify-start items-start gap-1.5 w-96">
          <div className="text-lg text-neutral-900 font-semibold">Training & Development</div>
          <div className="text-sm text-gray-600 font-normal">
            Access training materials and track your progress
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 w-full">
        {/* Overall Progress Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Overall Progress</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">72%</div>
              <div className="mt-1 text-xs text-gray-600 font-normal">3 active courses</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-teal-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/progress.png"
                alt="Overall Progress icon"
              />
            </div>
          </div>
        </div>

        {/* Completed Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Completed</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">1</div>
              <div className="mt-1 text-xs text-gray-600 font-normal">This month</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-green-400 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/check.png"
                alt="Completed icon"
              />
            </div>
          </div>
        </div>

        {/* Learning Hours Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Learning Hours</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">33h</div>
              <div className="mt-1 text-xs text-gray-600 font-normal">This year</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-blue-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/learninghours.png"
                alt="Learning Hours icon"
              />
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-sm text-gray-600 font-medium">Achievements</div>
              <div className="mt-2 text-lg text-neutral-900 font-semibold">3</div>
              <div className="mt-1 text-xs text-gray-600 font-normal">Badges earned</div>
            </div>
            <div className="flex items-center justify-center p-1 rounded-2xl h-8 w-8 bg-violet-100 shadow-sm">
              <img
                className="h-5 w-5 object-contain"
                src="/images/achievements.png"
                alt="Achievements icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {activeTab === 'myCourses' ? (
        /* My Courses Content */
        <div className="flex flex-col justify-start items-start gap-4 p-4 rounded-xl shadow-sm bg-white p-6 border border-gray-200 w-full">
          <div className="flex flex-row justify-start items-center h-14">
            <div className="text-lg text-neutral-900 font-semibold">Current Training</div>
          </div>

          {/* Course List */}
          <div className="flex flex-col justify-start items-start gap-4 w-full">
            {/* Course 1 */}
            <div className="flex flex-col justify-center items-center rounded-lg w-full shadow-sm bg-white p-6 border border-gray-200">
              <div className="flex flex-row justify-between items-start w-full mb-4">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Leadership Skills Development
                  </div>
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">Sarah Chen</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">4 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[12px] text-gray-600 font-medium">4.5</div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex justify-center items-center rounded w-28 h-9 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
                  onClick={() => handleContinueCourse('Leadership Skills Development')}
                >
                  <div className="flex flex-row justify-center items-center gap-1">
                    <div className="flex justify-center items-center w-4 h-4">
                      <img
                        width="14px"
                        height="15px"
                        src="/images/continue.png"
                        alt="Continue icon"
                      />
                    </div>
                    <div className="text-xs text-white font-medium">Continue</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">Progress</div>
                  <div className="text-xs text-neutral-900 font-medium">1/4 Modules</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-teal-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">
                    Next: Effective Communication
                  </div>
                  <div className="text-xs text-teal-500 font-normal">Due 30 Aug 2025</div>
                </div>
              </div>
            </div>

            {/* Course 2 */}
            <div className="flex flex-col justify-center items-center rounded-lg w-full shadow-sm bg-white p-6 border border-gray-200">
              <div className="flex flex-row justify-between items-start w-full mb-4">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Effective Communication
                  </div>
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">Sarah Chen</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">4 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[12px] text-gray-600 font-medium">4.5</div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex justify-center items-center rounded w-28 h-9 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
                  onClick={() => handleContinueCourse('Effective Communication')}
                >
                  <div className="flex flex-row justify-center items-center gap-1">
                    <div className="flex justify-center items-center w-4 h-4">
                      <img
                        width="14px"
                        height="15px"
                        src="/images/continue.png"
                        alt="Continue icon"
                      />
                    </div>
                    <div className="text-xs text-white font-medium">Continue</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">Progress</div>
                  <div className="text-xs text-neutral-900 font-medium">6/6 Modules</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-teal-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">
                    Next: Effective Communication
                  </div>
                  <div className="text-xs text-teal-500 font-normal">Completed</div>
                </div>
              </div>
            </div>

            {/* Course 3 */}
            <div className="flex flex-col justify-center items-center rounded-lg w-full shadow-sm bg-white p-6 border border-gray-200">
              <div className="flex flex-row justify-between items-start w-full mb-4">
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Leadership Skills Development
                  </div>
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">Sarah Chen</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[12px] text-gray-600 font-medium">4 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[12px] text-gray-600 font-medium">4.5</div>
                    </div>
                  </div>
                </div>
                <div
                  className="flex justify-center items-center rounded w-28 h-9 bg-teal-500 cursor-pointer hover:bg-teal-600 transition-colors"
                  onClick={() => handleContinueCourse('Leadership Skills Development')}
                >
                  <div className="flex flex-row justify-center items-center gap-1">
                    <div className="flex justify-center items-center w-4 h-4">
                      <img
                        width="14px"
                        height="15px"
                        src="/images/continue.png"
                        alt="Continue icon"
                      />
                    </div>
                    <div className="text-xs text-white font-medium">Continue</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2 w-full">
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">Progress</div>
                  <div className="text-xs text-neutral-900 font-medium">3/6 Modules</div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-teal-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <div className="flex flex-row justify-between items-center w-full">
                  <div className="text-xs text-gray-600 font-medium">
                    Next: Effective Communication
                  </div>
                  <div className="text-xs text-teal-500 font-normal">Due 30 Aug 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Course Catalog Content */
        <div className="flex flex-col justify-start items-start gap-4 w-full">
          {/* Course Catalog Grid */}
          <div className="grid grid-cols-2 gap-6 w-full">
            {/* Course 1 */}
            <div className="flex flex-col justify-start items-start gap-6 p-6 rounded-xl bg-slate-50/80">
              <div className="flex flex-col justify-start items-start gap-6 h-28">
                <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Project Management Essentials
                  </div>
                  <div className="text-xs text-neutral-900 font-normal">
                    Master project planning, execution, and delivery
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-purple-50">
                      <div className="text-[10.5px] text-purple-900 font-semibold">Business</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-green-100">
                      <div className="text-[10.5px] text-green-800 font-semibold">Beginner</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">Sarah Chen</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">2 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[11px] text-gray-600 font-medium">4.5</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="text-xs text-gray-600 font-medium">456 enrolled</div>
                <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-neutral-900 font-semibold">Enroll now</div>
                </button>
              </div>
            </div>

            {/* Course 2 */}
            <div className="flex flex-col justify-start items-start gap-6 p-6 rounded-xl bg-slate-50/80">
              <div className="flex flex-col justify-start items-start gap-6 h-28">
                <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                  <div className="text-sm text-neutral-900 font-semibold">
                    Data Analysis Fundamentals
                  </div>
                  <div className="text-xs text-neutral-900 font-normal">
                    Learn to analyze and visualize data effectively
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-blue-50">
                      <div className="text-[10.5px] text-blue-900 font-semibold">Data</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-yellow-100">
                      <div className="text-[10.5px] text-yellow-800 font-semibold">
                        Intermediate
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">Michael Wong</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">3 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[11px] text-gray-600 font-medium">4.8</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="text-xs text-gray-600 font-medium">289 enrolled</div>
                <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-neutral-900 font-semibold">Enroll now</div>
                </button>
              </div>
            </div>

            {/* Course 3 */}
            <div className="flex flex-col justify-start items-start gap-6 p-6 rounded-xl bg-slate-50/80">
              <div className="flex flex-col justify-start items-start gap-6 h-28">
                <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                  <div className="text-sm text-neutral-900 font-semibold">
                    UI/UX Design Principles
                  </div>
                  <div className="text-xs text-neutral-900 font-normal">
                    Create intuitive and engaging user experiences
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-pink-50">
                      <div className="text-[10.5px] text-pink-900 font-semibold">Design</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-green-100">
                      <div className="text-[10.5px] text-green-800 font-semibold">Beginner</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">Lisa Johnson</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">4 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[11px] text-gray-600 font-medium">4.7</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="text-xs text-gray-600 font-medium">512 enrolled</div>
                <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-neutral-900 font-semibold">Enroll now</div>
                </button>
              </div>
            </div>

            {/* Course 4 */}
            <div className="flex flex-col justify-start items-start gap-6 p-6 rounded-xl bg-slate-50/80">
              <div className="flex flex-col justify-start items-start gap-6 h-28">
                <div className="flex flex-col justify-start items-start gap-2.5 w-full">
                  <div className="text-sm text-neutral-900 font-semibold">Advanced JavaScript</div>
                  <div className="text-xs text-neutral-900 font-normal">
                    Master modern JavaScript concepts and patterns
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-3 w-full">
                  <div className="flex flex-row justify-start items-center gap-4">
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-orange-50">
                      <div className="text-[10.5px] text-orange-900 font-semibold">Development</div>
                    </div>
                    <div className="flex flex-row justify-center items-center gap-2.5 py-0.5 px-5 rounded-md h-5 bg-red-100">
                      <div className="text-[10.5px] text-red-800 font-semibold">Advanced</div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between items-start w-full">
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="11.5px"
                          height="12.8px"
                          src="/images/instructor.png"
                          alt="Instructor icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">David Kim</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <div className="flex justify-center items-center h-3.5">
                        <img
                          width="12.2px"
                          height="12.2px"
                          src="/images/duration.png"
                          alt="Duration icon"
                        />
                      </div>
                      <div className="text-[11px] text-gray-600 font-medium">5 hours</div>
                    </div>
                    <div className="flex flex-row justify-center items-start gap-1">
                      <img width="15px" height="15px" src="/images/rating.png" alt="Rating icon" />
                      <div className="text-[11px] text-gray-600 font-medium">4.9</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between items-center w-full">
                <div className="text-xs text-gray-600 font-medium">321 enrolled</div>
                <button className="flex flex-row justify-center items-center gap-2 p-2 pl-3 rounded-lg border border-neutral-200 h-8 bg-white hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-neutral-900 font-semibold">Enroll now</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Training;
