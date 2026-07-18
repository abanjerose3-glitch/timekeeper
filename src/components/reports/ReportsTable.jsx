import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "../ui/table";
  
  function formatDate(date) {
    if (!date) return "-";
  
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
  function formatTime(value) {
    if (!value) return "-";
  
    try {
      // Kung full timestamp na galing Supabase
      if (value.includes("T") || value.includes("-")) {
        return new Date(value).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
  
      // Kung TIME column lang (08:30:00)
      const [hour = 0, minute = 0] = value.split(":");
  
      const date = new Date();
      date.setHours(Number(hour));
      date.setMinutes(Number(minute));
      date.setSeconds(0);
  
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  }
  
  function getStatus(record) {
    if (record.time_out) return "Timed Out";
    if (record.break_out && !record.break_in) return "On Break";
    if (record.time_in) return "Present";
    return "-";
  }
  
  function ReportsTable({ records = [] }) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Break Out</TableHead>
              <TableHead>Break In</TableHead>
              <TableHead>Time Out</TableHead>
              <TableHead>Total Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
  
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-slate-500"
                >
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.employees?.full_name || "-"}
                  </TableCell>
  
                  <TableCell>
                    {formatDate(record.attendance_date)}
                  </TableCell>
  
                  <TableCell>{formatTime(record.time_in)}</TableCell>
  
                  <TableCell>{formatTime(record.break_out)}</TableCell>
  
                  <TableCell>{formatTime(record.break_in)}</TableCell>
  
                  <TableCell>{formatTime(record.time_out)}</TableCell>
  
                  <TableCell>
                    {record.total_hours ?? 0}
                  </TableCell>
  
                  <TableCell>{getStatus(record)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  export default ReportsTable;