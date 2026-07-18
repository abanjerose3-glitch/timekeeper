import supabase from "./supabase";

import { getCurrentSession } from "./authService";
import { getEmployeeByUserId } from "./employee/employeeService";

export async function getRecentAttendance() {
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      employees (
        full_name
      )
    `)
    .order("attendance_date", {
      ascending: false,
    })
    .order("time_in", {
      ascending: false,
    })
    .limit(10);

  if (error) throw error;

  return data || [];
}

export async function getMyRecentAttendance() {
  const session = await getCurrentSession();

  if (!session?.user) return [];

  const employee = await getEmployeeByUserId(
    session.user.id
  );

  if (!employee) return [];

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employee.id)
    .order("attendance_date", {
      ascending: false,
    })
    .order("time_in", {
      ascending: false,
    })
    .limit(10);

  if (error) throw error;

  return data || [];
}