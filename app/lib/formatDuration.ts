import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
} from "date-fns";

const formatDuration = (startDate: any, endDate: any) => {
  const daysDifference = differenceInDays(endDate, startDate);
  const monthsDifference = differenceInMonths(endDate, startDate);
  const yearsDifference = differenceInYears(endDate, startDate);

  if (daysDifference < 31) {
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""}`;
  } else if (monthsDifference < 12) {
    return `${monthsDifference} month${monthsDifference !== 1 ? "s" : ""}`;
  } else {
    return `${yearsDifference} year${yearsDifference !== 1 ? "s" : ""}`;
  }
};

export default formatDuration;
