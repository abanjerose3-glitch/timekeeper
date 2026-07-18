import supabase from "../supabase";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // No active session is not an application error.
  if (error) {
    return null;
  }

  return user;
}

export async function getProfile() {
  const user = await getCurrentUser();

if (!user) {
  return {
    user: null,
    profile: null,
  };
}

const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .maybeSingle();

  if (error) throw error;

  return {
    user,
    profile: data,
  };
}

export async function saveProfile(fullName) {
  const user = await getCurrentUser();

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

  if (error) throw error;
}