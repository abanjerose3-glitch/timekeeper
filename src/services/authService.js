import supabase from "./supabase";

// Sign In
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data.user;
}

// Sign Out
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

// Get current session
export async function getCurrentSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

// Get authenticated user
export async function getProfile() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return {
    user,
    profile: null,
  };
}

// Listen for auth changes
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback);
}

export async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  
    if (error) {
      throw error;
    }
  }