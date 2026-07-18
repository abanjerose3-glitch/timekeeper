import supabase from "../supabase";

import { getCurrentSession } from "../authService";
import { getEmployeeByUserId } from "../employee/employeeService";

export async function getWeeklyAttendance() {
  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const startDate = sevenDaysAgo
    .toISOString()
    .split("T")[0];

  const endDate = today
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("attendance_date")
    .gte("attendance_date", startDate)
    .lte("attendance_date", endDate);

  if (error) throw error;

  const grouped = {};

  data.forEach((record) => {
    grouped[record.attendance_date] =
      (grouped[record.attendance_date] || 0) + 1;
  });

  const result = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);

    const key = date.toISOString().split("T")[0];

    result.push({
      date: date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
      attendance: grouped[key] || 0,
    });
  }

  return result;
}

export async function getMyWeeklyAttendance() {
  const session = await getCurrentSession();

  if (!session) return [];

  const employee = await getEmployeeByUserId(
    session.user.id
  );

  if (!employee) return [];

  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const startDate = sevenDaysAgo
    .toISOString()
    .split("T")[0];

  const endDate = today
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("attendance")
    .select("attendance_date")
    .eq("employee_id", employee.id)
    .gte("attendance_date", startDate)
    .lte("attendance_date", endDate);

  if (error) throw error;

  const grouped = {};

  data.forEach((record) => {
    grouped[record.attendance_date] =
      (grouped[record.attendance_date] || 0) + 1;
  });

  const result = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);
    date.setDate(sevenDaysAgo.getDate() + i);

    const key = date.toISOString().split("T")[0];

    result.push({
      date: date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
      attendance: grouped[key] || 0,
    });
  }

  return result;
}