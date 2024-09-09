export function convertNanosecondsToDateTime(nanoseconds) {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(nanoseconds) / 1_000_000;

  // Create a new Date object with the milliseconds
  const date = new Date(milliseconds);

  const IST_OFFSET_MS = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // 5 hours 30 minutes in milliseconds
  const istDate = new Date(date.getTime() + IST_OFFSET_MS);

  // Extract date and time components
  const month = String(istDate.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(istDate.getUTCDate()).padStart(2, "0");
  const year = String(istDate.getUTCFullYear()).slice(-2); // Get last two digits of the year
  let hour = istDate.getUTCHours();
  const minute = String(istDate.getUTCMinutes()).padStart(2, "0");
  const isPM = hour >= 12;

  // Convert hour to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Format AM/PM
  const period = isPM ? "PM" : "AM";

  // Format the date and time string
  return `${day}/${month}/${year} ${hour}:${minute}${period}`;
}
