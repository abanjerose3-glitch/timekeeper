function formatTime(value) {
    if (!value) return "--:--";
  
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  
  function getStatus(attendance) {
    if (!attendance) {
      return {
        label: "Not Clocked In",
        bg: "bg-slate-100",
        text: "text-slate-600",
      };
    }
  
    if (attendance.time_out) {
      return {
        label: "Shift Complete",
        bg: "bg-green-100",
        text: "text-green-700",
      };
    }
  
    if (attendance.break_out && !attendance.break_in) {
      return {
        label: "On Break",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
      };
    }
  
    return {
      label: "Working",
      bg: "bg-blue-100",
      text: "text-blue-700",
    };
  }
  
  function TodayAttendanceCard({
    attendance,
    loading = false,
  }) {
    if (loading) {
      return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex h-72 items-center justify-center text-slate-500">
            Loading...
          </div>
        </div>
      );
    }
  
    const status = getStatus(attendance);
  
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Today's Attendance
          </h2>
  
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>
  
        <div className="mt-6 space-y-4">
          <div className="flex justify-between">
            <span className="text-slate-500">
              Time In
            </span>
  
            <span className="font-medium">
              {formatTime(attendance?.time_in)}
            </span>
          </div>
  
          <div className="flex justify-between">
            <span className="text-slate-500">
              Break Out
            </span>
  
            <span className="font-medium">
              {formatTime(attendance?.break_out)}
            </span>
          </div>
  
          <div className="flex justify-between">
            <span className="text-slate-500">
              Break In
            </span>
  
            <span className="font-medium">
              {formatTime(attendance?.break_in)}
            </span>
          </div>
  
          <div className="flex justify-between">
            <span className="text-slate-500">
              Time Out
            </span>
  
            <span className="font-medium">
              {formatTime(attendance?.time_out)}
            </span>
          </div>
  
          <hr />
  
          <div className="flex justify-between text-lg font-semibold">
            <span>Working Hours</span>
  
            <span>
              {attendance?.total_hours
                ? `${attendance.total_hours} hrs`
                : "0.00 hrs"}
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  export default TodayAttendanceCard;