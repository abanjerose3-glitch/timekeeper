// ==============================
// DATE & TIME HELPERS
// ==============================

// Returns today's date based on timezone
export function getToday(timezone = "Asia/Manila") {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
    }).format(new Date());
  }
  
  // Formats dates like: Fri, 18 Jul 2026
  export function formatDate(
    value,
    timezone = "Asia/Manila"
  ) {
    if (!value) return "-";
  
    try {
      return new Intl.DateTimeFormat("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: timezone,
      }).format(new Date(value));
    } catch {
      return "-";
    }
  }
  
  // Formats BOTH:
  // 2026-07-18T08:30:00Z
  // and
  // 08:30:00
  export function formatTime(
    value,
    timezone = "Asia/Manila"
  ) {
    if (!value) return "-";
  
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
          timeZone: timezone,
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