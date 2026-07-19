// Get today's date based on employee timezone
export function getToday(timezone = "Asia/Manila") {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
  }).format(new Date());
}

// Format date/time based on employee timezone
export function formatTime(date, timezone = "Asia/Manila") {
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(new Date(date));
}

// Format full date
export function formatDate(date, timezone = "Asia/Manila") {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(new Date(date));
}