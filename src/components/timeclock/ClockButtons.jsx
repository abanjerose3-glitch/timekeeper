import { Button } from "@/components/ui/button";

function ClockButtons({
  attendance,
  loading = false,
  onClockIn,
  onBreakOut,
  onBreakIn,
  onClockOut,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex h-16 items-center justify-center text-slate-500">
          Loading...
        </div>
      </div>
    );
  }

  // No attendance yet
  if (!attendance) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <Button
          className="h-16 w-full text-lg"
          onClick={onClockIn}
        >
          🟢 Clock In
        </Button>
      </div>
    );
  }

  // Shift completed
  if (attendance.time_out) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex h-16 items-center justify-center rounded-lg bg-green-100 text-lg font-semibold text-green-700">
          ✅ Shift Complete
        </div>
      </div>
    );
  }

  // Currently on break
  if (attendance.break_out && !attendance.break_in) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <Button
          className="h-16 w-full text-lg"
          onClick={onBreakIn}
        >
          🟢 Break In
        </Button>
      </div>
    );
  }

  // Working
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="secondary"
          className="h-16 text-lg"
          onClick={onBreakOut}
          disabled={
            !!attendance.break_out ||
            !!attendance.break_in ||
            !!attendance.time_out
          }
        >
          🟡 Break Out
        </Button>

        <Button
          variant="destructive"
          className="h-16 text-lg"
          onClick={onClockOut}
          disabled={!!attendance.time_out}
        >
          🔴 Clock Out
        </Button>
      </div>
    </div>
  );
}

export default ClockButtons;