
export const JWT_COOKIE_NAME = "accessToken";


export const PAGE_SIZE = 10;

export const genderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];


export const employeeStatusOptions = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "TERMINATED", label: "Terminated" },
  { value: "ON_LEAVE", label: "On Leave" },
];

export const attendanceStatusOptions = [
  { value: "PRESENT", label: "PRESENT" },
  { value: "ABSENT", label: "ABSENT" },
  { value: "ON LEAVE", label: "On Leave" },
];


export const docOptions = [
  { value: "National Id", label: "National Id" },
  { value: "Passport", label: "Passport" },
  { value: "Medical Certificate", label: "Medical Certificate" },
  { value: "Contract", label: "Contract" },
  { value: "Academic Certificate", label: "Academic Certificate" },
  { value: "Other", label: "Other" },
];


// Pay frequency options
export const payFrequencyOptions = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "DAILY", label: "Daily" },
];

// Contract type options
export const contractTypeOptions = [
  { value: "Permanent", label: "Permanent" },
  { value: "Contract", label: "Contract" },
  { value: "Probation", label: "Probation" },
  { value: "Internship", label: "Internship" },
  { value: "Volunteer", label: "Volunteer" },
  { value: "Other", label: "Other" },
];

export const workLocationOptions =[
  { value: "Remote", label: "Remote" },
  { value: "On Site", label: "On Site" },
  { value: "Hybrid", label: "Hybrid" },
]

export const paymentMethodOptions = [
  { value: "BANK", label: "Bank Account" },
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];



export const relationshipOptions = [
  { value: "SPOUSE", label: "Spouse" },
  { value: "PARENT", label: "Parent" },
  { value: "CHILD", label: "Child" },
  { value: "SIBLING", label: "Sibling" },
  { value: "RELATIVE", label: "Relative" },
  { value: "FRIEND", label: "Friend" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "OTHER", label: "Other" },
];



export const educationLevelOptions = [
  { value: "No Schooling", label: "No formal schooling" }, 
  { value: "Primary", label: "Primary / Elementary School" }, 
  { value: "secondary", label: "Secondary / High School" }, 
  { value: "Higher Secondary", label: "Higher Secondary / Sixth Form / A-Levels" }, 
  { value: "vocational", label: "Vocational / Trade / Technical School" }, 
  { value: "Associate", label: "Associate Degree / Foundation Degree" }, 
  { value: "Bachelor", label: "Bachelor's Degree" }, 
  { value: "Postgraduate Diploma", label: "Postgraduate Diploma / Certificate" }, 
  { value: "Master", label: "Master's Degree" }, 
  { value: "Doctorate", label: "Doctorate / PhD" }, 
  { value: "PostDoctoral", label: "Postdoctoral Studies" },
  { value: "Other", label: "Other" }, 
];
