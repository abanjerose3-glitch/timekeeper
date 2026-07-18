import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

function formatTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AttendanceSheet({
  open,
  onOpenChange,
  record,
}) {
  if (!record) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="w-[450px] sm:w-[500px]">

        <SheetHeader>

          <SheetTitle>
            {record.employees?.full_name}
          </SheetTitle>

        </SheetHeader>

        <div className="mt-8 space-y-6">

          <AttendanceStatusBadge
            record={record}
          />

          <Info
            label="Clock In"
            value={formatTime(record.time_in)}
          />

          <Info
            label="Break Out"
            value={formatTime(record.break_out)}
          />

          <Info
            label="Break In"
            value={formatTime(record.break_in)}
          />

          <Info
            label="Clock Out"
            value={formatTime(record.time_out)}
          />

          <Info
            label="Total Hours"
            value={record.total_hours ?? "-"}
          />

        </div>

      </SheetContent>
    </Sheet>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b pb-3">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>

    </div>
  );
}

export default AttendanceSheet;