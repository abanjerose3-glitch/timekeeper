import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
  } from "@/components/ui/drawer";
  
  import AttendanceStatusBadge from "./AttendanceStatusBadge";
  import { formatTime } from "../../utils/dateTime";
  
  function AttendanceDrawer({
    open,
    onOpenChange,
    record,
  }) {
    if (!record) return null;
  
    return (
      <Drawer
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
  
          <div className="mx-auto w-full max-w-lg">
  
            <DrawerHeader>
  
              <DrawerTitle>
  
                {record.employees?.full_name}
  
              </DrawerTitle>
  
            </DrawerHeader>
  
            <div className="space-y-6 p-6">
  
              <AttendanceStatusBadge
                record={record}
              />
  
              <div className="space-y-3">
  
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
  
            </div>
  
          </div>
  
        </DrawerContent>
  
      </Drawer>
    );
  }
  
  function Info({
    label,
    value,
  }) {
    return (
      <div className="flex justify-between border-b pb-2">
  
        <span className="text-slate-500">
          {label}
        </span>
  
        <span className="font-medium">
          {value}
        </span>
  
      </div>
    );
  }
  
  export default AttendanceDrawer;