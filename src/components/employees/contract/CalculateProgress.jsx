import dayjs from "dayjs";

export const calculateExpiryProgress = (startDate, endDate) => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const today = dayjs();

  const totalDuration = end.diff(start, "day");  
  const elapsed = today.diff(start, "day");      
  const remaining = end.diff(today, "day") + 1;  

  let percentage = (elapsed / totalDuration) * 100;
  if (percentage < 0) percentage = 0;   
  if (percentage > 100) percentage = 100; 

  return {
    percentage: Math.round(percentage),
    daysLeft: remaining < 0 ? 0 : remaining,
  };
};
