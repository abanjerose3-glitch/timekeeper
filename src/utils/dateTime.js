// ==============================
// DATE & TIME HELPERS
// ==============================

const DEFAULT_TIMEZONE = "Asia/Manila";

// Returns a valid timezone or falls back to Asia/Manila
function getSafeTimezone(timezone) {
  if (!timezone) return DEFAULT_TIMEZONE;

  try {
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
    });

    return timezone;
  } catch {
    console.warn(`Invalid timezone: ${timezone}. Using ${DEFAULT_TIMEZONE}.`);
    return DEFAULT_TIMEZONE;
  }
}

// Returns today's date based on timezone
export function getToday(timezone) {
  const safeTimezone = getSafeTimezone(timezone);
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: safeTimezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year").value;
  const month = parts.find((p) => p.type === "month").value;
  const day = parts.find((p) => p.type === "day").value;

  return `${year}-${month}-${day}`;
}

// Formats dates like: Fri, 18 Jul 2026
export function formatDate(value, timezone) {
  if (!value) return "-";

  const safeTimezone = getSafeTimezone(timezone);

  try {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: safeTimezone,
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

// Formats BOTH:
// 2026-07-18T08:30:00Z
// and
// 08:30:00
export function formatTime(value, timezone) {
  if (!value) return "-";

  const safeTimezone = getSafeTimezone(timezone);

  try {
    // Full datetime
    if (
      typeof value === "string" &&
      (value.includes("T") || value.includes("-"))
    ) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: safeTimezone,
      }).format(new Date(value));
    }

    // Plain time (08:30:00)
    if (typeof value === "string") {
      const [hour = 0, minute = 0] = value.split(":");

      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      date.setSeconds(0);

      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(date);
    }

    return "-";
  } catch {
    return "-";
  }
}