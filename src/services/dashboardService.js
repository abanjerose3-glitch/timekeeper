import supabase from "./supabase";

import { getCurrentSession } from "./authService";
import { getEmployeeByUserId } from "./employee/employeeService";

export async function getDashboardStats() {
  const { count: totalEmployees, error: employeeError } =
    await supabase
      .from("employees")
      .select("*", {
        count: "exact",
        head: true,
      });

  if (employeeError) throw employeeError;

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("attendance_date", today);

  if (error) throw error;

  const clockedIn = data.filter(
    (a) =>
      a.time_in &&
      !a.time_out &&
      (!a.break_out || a.break_in)
  ).length;

  const onBreak = data.filter(
    (a) =>
      a.break_out &&
      !a.break_in &&
      !a.time_out
  ).length;

  const timedOut = data.filter(
    (a) => a.time_out
  ).length;

  return {
    totalEmployees,
    clockedIn,
    onBreak,
    timedOut,
  };
}

export async function getEmployeeDashboardStats() {
  const session = await getCurrentSession();

  if (!session) {
    return {
      hoursToday: 0,
      hoursWeek: 0,
      hoursMonth: 0,
      currentStatus: "Not Clocked In",
    };
  }

  const employee = await getEmployeeByUserId(
    session.user.id
  );

  if (!employee) {
    return {
      hoursToday: 0,
      hoursWeek: 0,
      hoursMonth: 0,
      currentStatus: "Not Clocked In",
    };
  }

  const today = new Date();
  const todayString = today
    .toISOString()
    .split("T")[0];

  const weekStart = new Date(today);
  weekStart.setDate(
    today.getDate() - today.getDay()
  );

  const monthStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employee.id)
    .gte(
      "attendance_date",
      monthStart.toISOString().split("T")[0]
    )
    .order("attendance_date", {
      ascending: false,
    });

  if (error) throw error;

  const todayAttendance = data.find(
    (a) => a.attendance_date === todayString
  );

  let currentStatus = "Not Clocked In";

  if (todayAttendance) {
    if (todayAttendance.time_out) {
      currentStatus = "Completed";
    } else if (
      todayAttendance.break_out &&
      !todayAttendance.break_in
    ) {
      currentStatus = "On Break";
    } else if (todayAttendance.time_in) {
      currentStatus = "Working";
    }
  }

  const hoursToday =
    Number(todayAttendance?.total_hours ?? 0);

  const hoursWeek = data
    .filter(
      (a) =>
        new Date(a.attendance_date) >= weekStart
    )
    .reduce(
      (sum, a) =>
        sum + Number(a.total_hours || 0),
      0
    );

  const hoursMonth = data.reduce(
    (sum, a) =>
      sum + Number(a.total_hours || 0),
    0
  );

  return {
    hoursToday,
    hoursWeek,
    hoursMonth,
    currentStatus,
  };
}