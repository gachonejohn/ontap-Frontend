import { CreateBreak } from '@components/attendance/breaks/CreateBreak';
import { useFilters } from '@hooks/useFIlters';
import { useGetEmployeeBreaksQuery } from '@store/services/policies/policyService';
import { isBreakActive } from '@utils/isBreakActive';
import { useState } from 'react';
import Countdown from 'react-countdown';
import { AiOutlineFieldTime } from 'react-icons/ai';
import { BsPersonCheck } from 'react-icons/bs';
import { FiClock, FiTrendingUp } from 'react-icons/fi';
import { IoIosLogIn, IoIosLogOut } from 'react-icons/io';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useCheckInMutation,
  useCheckOutMutation,
  useGetWeeklyAttendanceQuery,
  useGetTodayAttendaceQuery,
} from '../../store/services/attendance/attendanceService';
import ActionModal from '../common/Modals/ActionModal';
import AttendanceSummaryChart from './charts/ConsistencyChart';
import MetricsCard from './metricsCard';
import WeeklyAttendanceChart from './charts/WeeklyAttendace';
import { periodOptions } from '@constants/constants';
import FilterSelect from '@components/common/FilterSelect';

const EmployeeAttendanceDashboardContent = () => {
  const [searchParams] = useSearchParams();
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const {
    data: attendanceData,
    isLoading: loadingData,
    error,
    refetch,
  } = useGetTodayAttendaceQuery({}, { refetchOnMountOrArgChange: true });

  const {
    data: breakData,
    isLoading: loadingBreakData,
    error: breakError,
    refetch: refetchBreak,
  } = useGetEmployeeBreaksQuery({}, { refetchOnMountOrArgChange: true });

  const currentPageParam = parseInt(searchParams.get('page') || '1', 10);

const { filters, handleFilterChange } = useFilters({
  initialFilters: {
 
    period: searchParams.get('period') || '',
  },
  initialPage: currentPageParam,
  navigate,
  debounceTime: 100,
  debouncedFields: ['period'],
});



 const handlePeriodChange = (selectedOption) => {
    handleFilterChange({
      period: selectedOption ? selectedOption.value : '',
    });
  };
  const {
    data: attendanceConsistencyData,
    isLoading: loadingConsistency,
    error: errorLoadingConsistency,
  } = useGetWeeklyAttendanceQuery(filters, { refetchOnMountOrArgChange: true });
  const [checkIn, { isLoading: isClockingIn }] = useCheckInMutation();
  const [checkOut, { isLoading: isClockingOut }] = useCheckOutMutation();

  const [isNavigating, setIsNavigating] = useState(false);
  console.log('attendanceData', attendanceData);
  const clockIn = attendanceData?.clock_in;
  const clockOut = attendanceData?.clock_out;

  const openClockInModal = () => {
    setModalType('clockIn');
    setIsModalOpen(true);
  };
  console.log('breakData', breakData);
  const openClockOutModal = (id) => {
    console.log('Clicked ID:', id);
    setSelectedItem(id);
    setModalType('clockOut');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const refetchInfo = () => {
    refetch();
    refetchBreak();
  };
  const handleClockIn = async () => {
    try {
      const res = await checkIn().unwrap();
      const msg = res?.message || 'Clocked in successfully!';
      toast.success(msg);

      setIsNavigating(true);
      await refetch();

      setTimeout(() => {
        navigate('/dashboard/tasks');
      }, 300);
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error clocking in!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
      closeModal();
      setIsNavigating(false);
    }
  };
  const handleCheckOut = async () => {
    console.log('selectedItem', selectedItem);
    try {
      const res = await checkOut(selectedItem).unwrap();
      const msg = res?.message || 'Clocked out successfully!';
      toast.success(msg);
      setSelectedItem(null);
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        console.log('errorData', errorData);
        toast.error(errorData.error || 'Error clocking out!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
    } finally {
      closeModal();
      refetch();
    }
  };
  const calculateBreakEndTime = (breakEndTime) => {
    const [hours, minutes, seconds] = breakEndTime.split(':').map(Number);
    const now = new Date();
    const end = new Date(now);
    end.setHours(hours, minutes, seconds, 0);
    if (end < now) return now;

    return end;
  };

  const calculateTimeBreakdown = () => {
    if (!attendanceData) return { working: 0, break: 0, overtime: 0 };

    const workingMinutes =
      (attendanceData.working_hours_formatted?.hours || 0) * 60 +
      (attendanceData.working_hours_formatted?.minutes || 0);
    const breakMinutes = attendanceData.break_time_formatted?.minutes || 0;
    const overtimeMinutes = attendanceData.overtime_formatted?.minutes || 0;

    const totalMinutes = workingMinutes + breakMinutes + overtimeMinutes;

    if (totalMinutes === 0) return { working: 0, break: 0, overtime: 0 };

    return {
      working: (workingMinutes / totalMinutes) * 100,
      break: (breakMinutes / totalMinutes) * 100,
      overtime: (overtimeMinutes / totalMinutes) * 100,
    };
  };

  const timeBreakdown = calculateTimeBreakdown();

  const generateTimeMarkers = () => {
    const expectedStart = attendanceData?.expected_checkin_time || '06:00 AM';
    const expectedEnd = attendanceData?.expected_checkout_time || '05:00 PM';
    const actualStart = attendanceData?.clock_in_formatted || null;
    const actualEnd = attendanceData?.clock_out_formatted || null;

    const parseTime = (timeStr) => {
      if (!timeStr) return null;
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    };

    const expectedStartDate = parseTime(expectedStart);
    const expectedEndDate = parseTime(expectedEnd);
    const actualStartDate = parseTime(actualStart);
    const actualEndDate = parseTime(actualEnd);

    const totalHours = (expectedEndDate - expectedStartDate) / (1000 * 60 * 60);
    const markers = [];
    for (let i = 0; i <= totalHours; i++) {
      const mark = new Date(expectedStartDate);
      mark.setHours(expectedStartDate.getHours() + i);
      markers.push(mark.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    const totalRange = expectedEndDate - expectedStartDate;
    const actualStartOffset =
      actualStartDate && expectedStartDate
        ? ((actualStartDate - expectedStartDate) / totalRange) * 100
        : 0;
    const actualEndOffset =
      actualEndDate && expectedStartDate
        ? ((actualEndDate - expectedStartDate) / totalRange) * 100
        : actualStartOffset +
          (((attendanceData?.working_hours_formatted?.hours || 0) * 60 +
            (attendanceData?.working_hours_formatted?.minutes || 0)) /
            (totalRange / (1000 * 60))) *
            (100 / (totalRange / (1000 * 60 * 60)));

    return { markers, actualStartOffset, actualEndOffset };
  };

  const { markers, actualStartOffset, actualEndOffset } = generateTimeMarkers();

  return (
    <div className="flex flex-col  gap-6 font-inter">
      {/* Leave Header */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <div className="text-lg text-neutral-900 font-semibold">Attendance</div>
          <div className="text-sm text-gray-600 font-normal">
            Track your attendance and working hours
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={openClockInModal}
            className="px-4 py-2 bg-primary text-white rounded-md flex items-center gap-x-2 hover:bg-primary transition-colors"
          >
            <IoIosLogIn className="text-lg" />
            Clock In
          </button>
          <button
            onClick={openClockOutModal}
            className="px-4 py-2 bg-danger-600 text-white rounded-md flex items-center gap-x-2 hover:bg-danger-600 transition-colors"
          >
            <IoIosLogOut className="text-lg" />
            Clock Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
        {(() => {
          const cards = [
            {
              title: "Today's Status",
              value: attendanceData?.clocked_in
                ? `Clocked In: ${attendanceData?.clock_in_formatted || '--'}`
                : 'Not Clocked In',
              subtext: attendanceData
                ? `Arrival: ${attendanceData?.arrival_status || 'Unknown'}`
                : 'No attendance record for today',
              icon: FiClock,
              iconColor: 'text-primary-600',
              iconBgColor: 'bg-primary-100',
            },
            {
              title: 'Today Hours Worked',
              value: `${attendanceData?.working_hours_formatted?.hours || 0}h ${
                attendanceData?.working_hours_formatted?.minutes || 0
              }m / ${attendanceData?.expected_daily_hours || 0} hrs`,
              subtext: `Break: ${attendanceData?.break_time_formatted?.minutes || 0}m`,
              icon: AiOutlineFieldTime,
              iconColor: 'text-blue-600',
              iconBgColor: 'bg-blue-100',
            },
            {
              title: 'Total Monthly Hours',
              value: `${attendanceData?.monthly_total_hours || 0} / ${
                attendanceData?.expected_monthly_hours || 0
              } hrs`,
              subtext: 'This Month',
              icon: FiClock,
              iconColor: 'text-yellow-600',
              iconBgColor: 'bg-yellow-100',
            },
            {
              title: 'Overtime',
              value: `${attendanceData?.overtime_formatted?.minutes || 0}m`,
              subtext: 'Overtime this session',
              icon: FiTrendingUp,
              iconColor: 'text-orange-600',
              iconBgColor: 'bg-orange-100',
            },
          ];

          return cards.map((card, i) => <MetricsCard key={i} {...card} />);
        })()}
      </div>

      {/* Today's Time Breakdown */}
      <div className="bg-white  rounded-xl py-6 shadow-sm">
        <div className="flex justify-between px-6 py-2 items-center border-b mb-6">
          <h2 className="text-base font-semibold text-gray-800">Today's Time Breakdown</h2>

          {clockIn && !attendanceData?.clock_out && (
            <>
              {breakData && isBreakActive(breakData.break_end) ? (
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <span>On Break — Ends in:</span>
                  <Countdown
                    key={breakData.id}
                    date={calculateBreakEndTime(breakData.break_end)}
                    renderer={({ minutes, seconds, completed }) => {
                      if (completed) {
                        return <span className="text-red-600 font-semibold">Break ended</span>;
                      }
                      return (
                        <span className="text-lg font-semibold text-blue-700">
                          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </span>
                      );
                    }}
                  />
                </div>
              ) : (
                <div>
                  <CreateBreak refetchData={refetchInfo} />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-wrap px-6 mb-4 items-center gap-4">
          <div className="text-center">
            <p className="text-gray-500 text-xs mb-1 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 inline-block"></span>
              Working Hours
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {attendanceData?.working_hours_formatted?.hours || 0}h{' '}
              {attendanceData?.working_hours_formatted?.minutes || 0}m
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-xs mb-1 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block"></span>
              Break Time
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {attendanceData?.total_break_minutes || 0}m
            </p>
          </div>

          <div className="text-center">
            <p className="text-gray-500 text-xs mb-1 flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
              Overtime
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {attendanceData?.overtime_formatted?.minutes || 0}m
            </p>
          </div>
        </div>
        <div className="px-6">
          {/* Timeline Bar */}
          <div className="relative flex w-full h-5 rounded-lg overflow-hidden bg-gray-100">
            {/* Expected working hours range (from expected_checkin_time to expected_checkout_time) */}
            <div
              className="absolute h-full bg-gray-300 rounded-md"
              style={{
                left: '0%',
                width: '100%',
              }}
            ></div>

            {/* Actual working range — color depends on arrival status */}
            {attendanceData?.clocked_in && (
              <div
                className={`absolute h-full rounded-md ${
                  attendanceData?.arrival_status === 'Late' ? 'bg-red-400' : 'bg-teal-500'
                }`}
                style={{
                  left: `${actualStartOffset}%`,
                  width: `${Math.max(actualEndOffset - actualStartOffset, 2)}%`,
                }}
              ></div>
            )}
          </div>

          {/* Time Markers below the bar */}
          <div className="relative flex justify-between text-xs text-gray-600 mt-2">
            {markers.map((mark, i) => (
              <span key={i} className="w-1/12 text-center">
                {mark}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Request Overtime Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Request Overtime</h3>
          <p className="text-sm text-gray-600">
            Need to work extra hours? Submit your overtime request for approval.
          </p>
        </div>
        <button
          className="px-4.5 
        py-2.5 bg-primary-dark
         text-white rounded-lg flex items-center space-x-2 hover:bg-primary-dark transition-colors font-medium"
        >
          <FiClock className="text-lg" />
          <span className="text-sm">Request Overtime</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">Your Attendance Consistency</h2>

          {/* Filters */}
         
          <div className="flex flex-col gap-3 lg:p-0
         lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
        
          <FilterSelect
            options={periodOptions}
            value={
              periodOptions.find((option) => option.value === filters.period) || {
                value: '',
                label: 'Period',
              }
            }
            onChange={handlePeriodChange}
            placeholder=""
            defaultLabel="Reset Period"
          />
        </div>
     
        </div>

        <div className="p-5">
          <WeeklyAttendanceChart
            data={attendanceConsistencyData}
            isLoading={loadingConsistency}
            selectedPeriod={filters.period}
            
          />
        </div>
      </div>

     

      <ActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        actionType={modalType === 'clockIn' ? 'submit' : 'delete'}
        onDelete={modalType === 'clockIn' ? handleClockIn : handleCheckOut}
        isDeleting={isClockingIn || isClockingOut}
        title={modalType === 'clockIn' ? 'Confirm Clock In' : 'Confirm Clock Out'}
        confirmationMessage={
          modalType === 'clockIn'
            ? 'Are you sure you want to clock in now?'
            : 'Are you sure you want to clock out now?'
        }
        extraInfo={
          modalType === 'clockOut'
            ? {
                pending: attendanceData?.pending_tasks ?? 0,
                inProgress: attendanceData?.in_progress_tasks ?? 0,
                link: '/dashboard/tasks',
                linkText: 'Go to Tasks Dashboard',
              }
            : null
        }
        deleteMessage="This action will update your attendance records."
        actionText={modalType === 'clockIn' ? 'Clock In' : 'Clock Out'}
      />
    </div>
  );
};

export default EmployeeAttendanceDashboardContent;
