import supabase from "./supabase";

export async function getEmployeeProfile(employeeId) {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      attendance (
        *
      ),
      availability (
        *
      )
    `)
    .eq("id", employeeId)
    .single();

  if (error) throw error;

  return data;
}