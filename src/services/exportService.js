import * as XLSX from "xlsx";

function getStatus(record) {
  if (
    record.time_in &&
    !record.time_out &&
    (!record.break_out || record.break_in)
  ) {
    return "Present";
  }

  if (
    record.break_out &&
    !record.break_in &&
    !record.time_out
  ) {
    return "On Break";
  }

  if (record.time_out) {
    return "Timed Out";
  }

  return "Absent";
}

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
}

function formatTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function exportAttendance(records) {
  const data = records.map((record) => ({
    "Employee ID": record.employees?.employee_id ?? "-",
    Employee: record.employees?.full_name ?? "-",
    Email: record.employees?.email ?? "-",

    Date: formatDate(record.attendance_date),

    "Time In": formatTime(record.time_in),

    "Break Out": formatTime(record.break_out),

    "Break In": formatTime(record.break_in),

    "Time Out": formatTime(record.time_out),

    Hours: record.total_hours ?? "-",

    Status: getStatus(record),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Attendance"
  );

  XLSX.writeFile(
    workbook,
    `Attendance_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`
  );
}