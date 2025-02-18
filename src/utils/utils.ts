/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate = (dateString: any): string => {
  const date = new Date(dateString); // Create a Date object from the string
  const year = date.getFullYear(); // Get the full year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month and pad to two digits
  const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad to two digits
  return `${month}/${day}/${year}`; // Return the formatted string
};

export function formatToDashDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);
  return `${day}${suffix} ${month} ${year}`;
}

export function getDaySuffix(day: any) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export const capitalizeWord = (word: any) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const timeAgoFromToday = (dateString: string | number | Date) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  const diffInMs = today.getTime() - givenDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffInDays / 30);
  const days = diffInDays % 30;

  let result = "";
  if (months > 0) result += `${months} month${months > 1 ? "s" : ""} `;
  if (days > 0) result += `${days} day${days > 1 ? "s" : ""} `;
  return result.trim() + " ago";
};

