import supabase from "../supabase";
import { getCurrentSession } from "../authService";
import { getEmployeeByUserId } from "../employee/employeeService";

export async function getAttendanceRecords() {
  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      employees!attendance_employee_id_fkey (
        id,
        employee_code,
        full_name,
        email
      )
    `)
    .order("attendance_date", { ascending: false })
    .order("time_in", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getMyAttendanceRecords() {
  const session = await getCurrentSession();

  if (!session) return [];

  const employee = await getEmployeeByUserId(session.user.id);

  if (!employee) return [];

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      employees!attendance_employee_id_fkey (
        id,
        employee_code,
        full_name,
        email
      )
    `)
    .eq("employee_id", employee.id)
    .order("attendance_date", { ascending: false })
    .order("time_in", { ascending: false });

  if (error) throw error;

  return data;
}