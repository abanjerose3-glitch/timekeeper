import * as XLSX from "xlsx";

function getStatus(record) {
  if (record.time_out) return "Timed Out";
  if (record.break_out && !record.break_in) return "On Break";
  if (record.time_in) return "Present";
  return "-";
}

function formatTime(time) {
  if (!time) return "-";

  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function exportReportToExcel(records = []) {
  const data = records.map((record) => ({
    Employee: record.employees?.full_name || "-",
    Date: record.attendance_date,
    "Time In": formatTime(record.time_in),
    "Break Out": formatTime(record.break_out),
    "Break In": formatTime(record.break_in),
    "Time Out": formatTime(record.time_out),
    "Total Hours": record.total_hours || 0,
    Status: getStatus(record),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

  XLSX.writeFile(
    workbook,
    `Attendance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}