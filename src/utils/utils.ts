/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate = (dateString: any): string => {
  const date = new Date(dateString); // Create a Date object from the string
  const year = date.getFullYear(); // Get the full year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month and pad to two digits
  const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad to two digits
  return `${month}/${day}/${year}`; // Return the formatted string
};

export function formatToDashDate(dateString: string | null | undefined) {
  // Handle undefined or null
  if (!dateString) {
    return "N/A";
  }

  // Handle invalid date format "0000-00-00"
  if (dateString === "0000-00-00") {
    return "N/A";
  }

  // Try to create a date object
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "N/A";
  }

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date
  );
  const year = date.getFullYear();

  const suffix = getDaySuffix(day);
  return `${day}${suffix} ${month} ${year}`;
}

// Helper function for day suffixes
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }

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

export const calculateAge = (dobString: string): number => {
  const dob = new Date(dobString);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // Adjust age if the birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export const capitalize = (str: string): string => {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

// utils/formatDate.tsx

export function formatToDDMMYYYY(datetime: string): string {
  // Handle placeholder or invalid datetime
  if (
    !datetime ||
    datetime === "0000-00-00 00:00:00" ||
    isNaN(new Date(datetime.replace(" ", "T")).getTime())
  ) {
    return "Invalid Date";
  }

  const date = new Date(datetime.replace(" ", "T")); // Convert to ISO format

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getBaseUrl(): string {
  try {
    // Get the current URL from the browser
    const currentUrl = window.location.href;

    // Create a URL object
    const urlObj = new URL(currentUrl);

    // Get the origin (protocol + hostname)
    const origin = urlObj.origin;

    // Get the pathname
    const pathname = urlObj.pathname;

    // Find the first directory from pathname
    let firstDir = "";
    if (pathname && pathname !== "/") {
      // Split by '/' and filter out empty strings
      const pathParts = pathname.split("/").filter((part) => part.length > 0);

      // If there's at least one directory, use it
      if (pathParts.length > 0) {
        firstDir = "/" + pathParts[0];
      }
    }

    // Combine origin and first directory
    return origin + firstDir;
  } catch (error) {
    console.error("Error extracting base URL:", error);
    return "";
  }
}

export const formatDueDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Parse the ISO date string
    const dueDate = new Date(dateString);
    const today = new Date();

    // Reset time to start of day for accurate comparison
    const dueDateOnly = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // Calculate the difference in milliseconds
    const diffTime = dueDateOnly.getTime() - todayOnly.getTime();

    // Convert to days
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    // Return appropriate string based on difference
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Tomorrow";
    } else if (diffDays === -1) {
      return "Yesterday";
    } else if (diffDays > 1) {
      return `${diffDays} days`;
    } else {
      return `${Math.abs(diffDays)} days ago`;
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString; // Return original string if parsing fails
  }
};