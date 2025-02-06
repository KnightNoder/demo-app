// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formatDate = (dateString: any): string => {
  const date = new Date(dateString); // Create a Date object from the string
  const year = date.getFullYear(); // Get the full year
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get the month and pad to two digits
  const day = String(date.getDate()).padStart(2, "0"); // Get the day and pad to two digits
  return `${year}-${month}-${day}`; // Return the formatted string
};
