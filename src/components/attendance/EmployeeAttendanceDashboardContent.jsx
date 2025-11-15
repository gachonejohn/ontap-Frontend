import { CreateBreak } from '@components/attendance/breaks/CreateBreak';
import { useFilters } from '@hooks/useFIlters';
import { useGetEmployeeBreaksQuery } from '@store/services/policies/policyService';
import { useState } from 'react';
import Countdown from 'react-countdown';
import { AiOutlineFieldTime } from 'react-icons/ai';
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
import MetricsCard from './metricsCard';
import WeeklyAttendanceChart from './charts/WeeklyAttendace';
import { periodOptions } from '@constants/constants';
import FilterSelect from '@components/common/FilterSelect';
import { RequestOvertime } from './management/overtimeRequests/NewOvertimeRequests';
import { NewOffOfficeRequest } from './management/offSiteRequests/NewOfficeRequest';

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

  const openClockInModal = () => {
    setModalType('clockIn');
    setIsModalOpen(true);
  };

  const openClockOutModal = (id) => {
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
    try {
      const res = await checkOut(selectedItem).unwrap();
      const msg = res?.message || 'Clocked out successfully!';
      toast.success(msg);
      setSelectedItem(null);
    } catch (error) {
      console.log('error', error);
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        const errorData = error.data;
        toast.error(errorData.error || 'Error clocking out!.');
      } else {
        toast.error('Unexpected Error occured. Please try again.');
      }
    } finally {
      closeModal();
      refetch();
    }
  };

  const getBreakEndTime = (breakData) => {
    const start = new Date(breakData.created_at);
    const durationMs = breakData.duration_minutes * 60 * 1000;
    return new Date(start.getTime() + durationMs);
  };

  return (
    <div className="flex flex-col gap-6 font-inter">
      {/* Header */}
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
            onClick={() => openClockOutModal(attendanceData?.id)}
            className="px-4 py-2 bg-danger-600 text-white rounded-md flex items-center gap-x-2 hover:bg-danger-600 transition-colors"
          >
            <IoIosLogOut className="text-lg" />
            Clock Out
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full">
        <MetricsCard
          title="Today's Status"
          value={
            attendanceData?.clock_in
              ? attendanceData?.clock_out
                ? `Clocked Out: ${attendanceData.clock_out}`
                : `Clocked In: ${attendanceData.clock_in}`
              : 'Not Clocked In'
          }
          subtext={
            attendanceData
              ? attendanceData?.clock_out
                ? `${attendanceData.departure_status} — ${attendanceData.departure_difference}`
                : ` Arrived - ${attendanceData.arrival_difference}`
              : 'No attendance record for today'
          }
          icon={FiClock}
          iconColor="text-primary-600"
          iconBgColor="bg-primary-100"
        />

        <MetricsCard
          title="Today Total Hours"
          value={`${attendanceData?.today_total_hours || '0h 0m'} / ${
            attendanceData?.expected_daily_hours || '8h 0m'
          }`}
          subtext={
            attendanceData?.today_offsite_hours_raw || attendanceData?.today_overtime_hours_raw
              ? `Includes Offsite: ${attendanceData?.today_offsite_hours || '0h 0m'}, Overtime: ${attendanceData?.today_overtime_hours || '0h 0m'}`
              : `Break: ${attendanceData?.break_time_formatted?.minutes || 0}m`
          }
          icon={AiOutlineFieldTime}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />

        <MetricsCard
          title="Total Monthly Hours"
          value={`${attendanceData?.monthly_total_hours || '0h 0m'} / ${
            attendanceData?.expected_monthly_hours || '0h 0m'
          }`}
          subtext="This Month"
          icon={FiClock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />

        <MetricsCard
          title="Today's Overtime"
          value={attendanceData?.today_overtime_hours || '0h 0m'}
          subtext={
            attendanceData?.overtime_details
              ? `Approved: ${attendanceData.overtime_details.reason}`
              : 'No overtime today'
          }
          icon={FiTrendingUp}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Today's Time Breakdown */}
      <div className="bg-white rounded-xl py-6 shadow-sm">
        <div className="flex justify-between px-6 py-2 items-center border-b mb-6">
          <h2 className="text-base font-semibold text-gray-800">Today's Time Breakdown</h2>

          {attendanceData?.clock_in && !attendanceData?.clock_out && (
            <>
              {breakData?.is_ongoing ? (
                <div className="flex items-center gap-2 text-blue-600 font-semibold">
                  <span>On Break — Ends in:</span>
                  <Countdown
                    key={breakData.id}
                    date={getBreakEndTime(breakData)}
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

        {/* Stats */}
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

          {/* Show Offsite Hours if exists */}
          {attendanceData?.today_offsite_hours_raw > 0 && (
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                Offsite
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {attendanceData?.today_offsite_hours || '0h 0m'}
              </p>
            </div>
          )}

          {/* Show Overtime Hours if exists */}
          {attendanceData?.today_overtime_hours_raw > 0 && (
            <div className="text-center">
              <p className="text-gray-500 text-xs mb-1 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#135C57] inline-block"></span>
                Overtime
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {attendanceData?.today_overtime_hours || '0h 0m'}
              </p>
            </div>
          )}
        </div>

        {/* Timeline Bar */}
        <div className="px-6">
          <div className="flex w-full h-5 rounded-lg overflow-hidden bg-gray-300">
            {attendanceData?.clocked_in ? (
              (() => {
                const workingMinutes =
                  (attendanceData.working_hours_formatted?.hours || 0) * 60 +
                  (attendanceData.working_hours_formatted?.minutes || 0);
                const breakMinutes = attendanceData.total_break_minutes || 0;
                const offsiteMinutes = (attendanceData.today_offsite_hours_raw || 0) * 60;
                const overtimeMinutes = (attendanceData.today_overtime_hours_raw || 0) * 60;
                const totalMinutes =
                  workingMinutes + breakMinutes + offsiteMinutes + overtimeMinutes;

                const workingPercentage =
                  totalMinutes > 0 ? (workingMinutes / totalMinutes) * 100 : 0;
                const breakPercentage = totalMinutes > 0 ? (breakMinutes / totalMinutes) * 100 : 0;
                const offsitePercentage =
                  totalMinutes > 0 ? (offsiteMinutes / totalMinutes) * 100 : 0;
                const overtimePercentage =
                  totalMinutes > 0 ? (overtimeMinutes / totalMinutes) * 100 : 0;

                return (
                  <>
                    {/* Working Hours */}
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${workingPercentage}%`,
                      }}
                      title={`Working: ${workingMinutes}m`}
                    ></div>

                    {/* Break Time */}
                    {breakMinutes > 0 && (
                      <div
                        className="h-full bg-orange-400"
                        style={{
                          width: `${breakPercentage}%`,
                        }}
                        title={`Break: ${breakMinutes}m`}
                      ></div>
                    )}

                    {/* Offsite Hours */}
                    {offsiteMinutes > 0 && (
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${offsitePercentage}%`,
                        }}
                        title={`Offsite: ${offsiteMinutes}m`}
                      ></div>
                    )}

                    {/* Overtime */}
                    {overtimeMinutes > 0 && (
                      <div
                        className="h-full bg-[#135C57]"
                        style={{
                          width: `${overtimePercentage}%`,
                        }}
                        title={`Overtime: ${overtimeMinutes}m`}
                      ></div>
                    )}
                  </>
                );
              })()
            ) : (
              <div className="w-full h-full bg-gray-300"></div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span className="font-medium">
              {attendanceData?.expected_checkin_time || '06:00 AM'}
            </span>
            <span className="font-medium">
              {attendanceData?.expected_checkout_time || '02:00 PM'}
            </span>
          </div>
        </div>

        {/* Offsite Details Card */}
        {attendanceData?.offsite_details && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Today's Offsite Work</h3>
                <p className="text-xs text-blue-700 mb-2">
                  {attendanceData.offsite_details.request_type} -{' '}
                  {attendanceData.offsite_details.location}
                </p>
                <p className="text-xs text-gray-600">
                  {attendanceData.offsite_details.start_time} -{' '}
                  {attendanceData.offsite_details.end_time} (
                  {attendanceData.offsite_details.total_hours}h)
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {attendanceData.offsite_details.reason}
                </p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                Approved
              </span>
            </div>
          </div>
        )}

        {/* Overtime Details Card */}
        {attendanceData?.overtime_details && (
          <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-green-900 mb-1">Today's Overtime</h3>
                <p className="text-xs text-gray-600 mb-1">
                  Approved Hours: {attendanceData.overtime_details.total_hours}h
                </p>
                <p className="text-xs text-gray-600">{attendanceData.overtime_details.reason}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                Approved
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Request Overtime</h3>
          <p className="text-sm text-gray-600">
            Need to work extra hours? Submit your overtime request for approval.
          </p>
        </div>
        <RequestOvertime refetchData={refetch} />
      </div>

      <div className="bg-orange-50/50 border border-[#FAA541] p-5 rounded-xl shadow-sm flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Request Offsite</h3>
          <p className="text-sm text-gray-600">
            Working from a different location? Submit your offsite request for approval.
          </p>
        </div>
        <div>
          <NewOffOfficeRequest refetchData={refetch} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-base font-semibold text-gray-800">Your Attendance Consistency</h2>
          <div className="flex flex-col gap-3 lg:p-0 lg:flex-row md:flex-row md:items-center md:space-x-2 lg:items-center lg:space-x-5">
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
