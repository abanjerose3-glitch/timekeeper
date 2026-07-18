import supabase from "./supabase";

import { getCurrentSession } from "./authService";
import { getEmployeeByUserId } from "./employee/employeeService";

export async function getTodayAvailability() {
  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("availability")
    .select(`
      *,
      employees!availability_employee_id_fkey (
        id,
        full_name,
        employee_code
      )
    `)
    .eq("availability_date", today)
    .order("start_time");

  if (error) throw error;

  return data;
}

export async function getMyTodayAvailability() {
  const session = await getCurrentSession();

  if (!session) return [];

  const employee = await getEmployeeByUserId(
    session.user.id
  );

  if (!employee) return [];

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("availability")
    .select(`
      *,
      employees!availability_employee_id_fkey (
        id,
        full_name,
        employee_code
      )
    `)
    .eq("employee_id", employee.id)
    .eq("availability_date", today)
    .order("start_time");

  if (error) throw error;

  return data;
}