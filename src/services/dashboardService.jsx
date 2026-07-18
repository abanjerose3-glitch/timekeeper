import supabase from "./supabase";

export async function getDashboardStats() {
  const today = new Date().toISOString().split("T")[0];

  // Total Employees
  const { count: totalEmployees, error: employeeError } = await supabase
    .from("employees")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (employeeError) throw employeeError;

  // Today's Attendance
  const { data: attendance, error: attendanceError } = await supabase
    .from("attendance")
    .select("*")
    .eq("attendance_date", today);

  if (attendanceError) throw attendanceError;

  const present = attendance.filter(
    (a) =>
      a.time_in &&
      !a.time_out &&
      (!a.break_out || a.break_in)
  ).length;

  const onBreak = attendance.filter(
    (a) =>
      a.break_out &&
      !a.break_in &&
      !a.time_out
  ).length;

  const timedOut = attendance.filter(
    (a) => a.time_out
  ).length;

  return {
    totalEmployees,
    present,
    onBreak,
    timedOut,
  };
}

export async function getRecentActivity() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      employees (
        full_name
      )
    `)
    .eq("attendance_date", today)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}