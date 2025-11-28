export const JWT_COOKIE_NAME = 'accessToken';

export const PAGE_SIZE = 10;

export const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export const employeeStatusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'TERMINATED', label: 'Terminated' },
  { value: 'ON_LEAVE', label: 'On Leave' },
];

export const attendanceStatusOptions = [
  { value: 'PRESENT', label: 'PRESENT' },
  { value: 'ABSENT', label: 'ABSENT' },
  { value: 'ON LEAVE', label: 'On Leave' },
];

export const docOptions = [
  { value: 'National Id', label: 'National Id' },
  { value: 'Passport', label: 'Passport' },
  { value: 'Medical Certificate', label: 'Medical Certificate' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Academic Certificate', label: 'Academic Certificate' },
  { value: 'Other', label: 'Other' },
];

export const payFrequencyOptions = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'DAILY', label: 'Daily' },
];

export const contractTypeOptions = [
  { value: 'Permanent', label: 'Permanent' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Probation', label: 'Probation' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Volunteer', label: 'Volunteer' },
  { value: 'Other', label: 'Other' },
];
export const contractStatusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'TERMINATED', label: 'Terminated' },
  { value: 'SUSPENDED', label: 'Suspended' },
];

export const workLocationOptions = [
  { value: 'Remote', label: 'Remote' },
  { value: 'On Site', label: 'On Site' },
  { value: 'Hybrid', label: 'Hybrid' },
];

export const paymentMethodOptions = [
  { value: 'BANK', label: 'Bank Account' },
  { value: 'MOBILE_MONEY', label: 'Mobile Money' },
  { value: 'CASH', label: 'Cash' },
  { value: 'OTHER', label: 'Other' },
];

export const relationshipOptions = [
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'PARENT', label: 'Parent' },
  { value: 'CHILD', label: 'Child' },
  { value: 'SIBLING', label: 'Sibling' },
  { value: 'RELATIVE', label: 'Relative' },
  { value: 'FRIEND', label: 'Friend' },
  { value: 'GUARDIAN', label: 'Guardian' },
  { value: 'OTHER', label: 'Other' },
];

export const educationLevelOptions = [
  { value: 'No Schooling', label: 'No formal schooling' },
  { value: 'Primary', label: 'Primary / Elementary School' },
  { value: 'secondary', label: 'Secondary / High School' },
  { value: 'Higher Secondary', label: 'Higher Secondary / Sixth Form / A-Levels' },
  { value: 'vocational', label: 'Vocational / Trade / Technical School' },
  { value: 'Associate', label: 'Associate Degree / Foundation Degree' },
  { value: 'Bachelor', label: "Bachelor's Degree" },
  { value: 'Postgraduate Diploma', label: 'Postgraduate Diploma / Certificate' },
  { value: 'Master', label: "Master's Degree" },
  { value: 'Doctorate', label: 'Doctorate / PhD' },
  { value: 'PostDoctoral', label: 'Postdoctoral Studies' },
  { value: 'Other', label: 'Other' },
];

export const attendancePolicyOptions = [
  { value: 'Check In', label: 'Check In' },
  { value: 'Check Out', label: 'Check Out' },
];

export const templateTypeOptions = [
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Offboarding', label: 'Offboarding' },
];
export const onboardingstepPriorityOptions = [
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
];

export const periodOptions = [
  { label: "This Week", value: "current_week" },
  { label: "Last Week", value: "last_week" },
  { label: "Last 7 Days", value: "last_7_days" },
];


export const leavesStatusOptions = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REJECTED', label: 'REJECTED' },
  { value: 'CANCELLED', label: 'CANCELLED' },
];

//Calendar Constants
export const EVENT_TYPE_OPTIONS = [
  { value: '', label: 'Select Event Type' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'LEAVE', label: 'Leave' },
  { value: 'TRAINING', label: 'Training' },
  { value: 'PERFORMANCE_REVIEW', label: 'Performance Review' },
  { value: 'PAYROLL_DEADLINE', label: 'Payroll Deadline' },
  { value: 'ONBOARDING', label: 'Onboarding' },
  { value: 'HOLIDAY', label: 'Holiday' },
  { value: 'PROJECT_MILESTONE', label: 'Project Milestone' },
  { value: 'OTHER', label: 'Other' },
];


export const EVENT_TYPE_META = {
  MEETING: { color: '#3B82F6', icon: '📹' },
  LEAVE: { color: '#EC4899', icon: '🏖️' },
  TRAINING: { color: '#10B981', icon: '📚' },
  PERFORMANCE_REVIEW: { color: '#F59E0B', icon: '⭐' },
  PAYROLL_DEADLINE: { color: '#8B5CF6', icon: '💰' },
  ONBOARDING: { color: '#6366F1', icon: '👋' },
  HOLIDAY: { color: '#EF4444', icon: '🎉' },
  PROJECT_MILESTONE: { color: '#F97316', icon: '🎯' },
  OTHER: { color: '#6B7280', icon: '📌' },
};

export const VIEW_TYPES = {
  MONTH: 'month',
  WEEK: 'week'
};

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HOURS = Array.from({ length: 24 }, (_, i) => i);


export const offsiteRequestTypes = [
    { label: 'Meeting', value: 'Meeting' },
    { label: 'Field Visit', value: 'Field Visit' },
    { label: 'External Meeting', value: 'External Meeting' },
    { label: 'Other', value: 'Other' },
];
