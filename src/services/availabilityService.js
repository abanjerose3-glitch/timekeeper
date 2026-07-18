import supabase from "./supabase";
import { getCurrentSession } from "./authService";

// Get current logged-in employee
async function getCurrentEmployee() {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error("No active session.");
  }

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("auth_id", session.user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Get all availability (Admin)
export async function getAvailability() {
  const { data, error } = await supabase
    .from("availability")
    .select(`
      *,
      employees (
        id,
        employee_code,
        full_name,
        role
      )
    `)
    .order("availability_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw error;

  return data;
}

// Get logged-in employee availability
export async function getMyAvailability() {
  const employee = await getCurrentEmployee();

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("employee_id", employee.id)
    .order("availability_date", { ascending: true });

  if (error) throw error;

  return data;
}

// Get specific employee availability (Admin)
export async function getEmployeeAvailability(employeeId) {
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("employee_id", employeeId)
    .order("availability_date", { ascending: true });

  if (error) throw error;

  return data;
}

// Save weekly availability
export async function saveAvailability(records) {
    if (!records.length) return [];
  
    const employeeId = records[0].employee_id;
  
    const dates = records.map((r) => r.availability_date);
  
    // Remove existing records for the selected week
    const { error: deleteError } = await supabase
      .from("availability")
      .delete()
      .eq("employee_id", employeeId)
      .in("availability_date", dates);
  
    if (deleteError) throw deleteError;
  
    // Insert fresh week
    const { data, error } = await supabase
      .from("availability")
      .insert(records)
      .select(`
        *,
        employees (
          id,
          employee_code,
          full_name,
          role
        )
      `);
  
    if (error) throw error;
  
    return data;
  }

// Delete availability
export async function deleteAvailability(id) {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("id", id);

  if (error) throw error;
}