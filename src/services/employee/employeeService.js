import supabase from "../supabase";

// Get all employees
export async function getEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("full_name", { ascending: true });

  if (error) throw error;

  return data;
}

// Get employee by authenticated user ID
export async function getEmployeeByUserId(authId) {

  console.log("Searching auth_id:", authId);

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("auth_id", authId)
    .maybeSingle();

  console.log("Employee:", data);
  console.log("Error:", error);

  if (error) throw error;

  return data;
}

// Create employee
export async function createEmployee(employee) {
  const { data, error } = await supabase
    .from("employees")
    .insert([employee])
    .select();

  if (error) throw error;

  return data;
}

// Update employee
export async function updateEmployee(id, employee) {
  const { data, error } = await supabase
    .from("employees")
    .update(employee)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

// Delete employee
export async function deleteEmployee(id) {
  const { error } = await supabase
    .from("employees")
    .delete()
    .eq("id", id);


  if (error) throw error;
}

export async function updateEmployeeRole(id, role) {
  const { data, error } = await supabase
    .from("employees")
    .update({ role })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}