import supabase from "./supabase";

export async function getSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveSettings(settings) {
  const existing = await getSettings();

  if (existing) {
    const { error } = await supabase
      .from("settings")
      .update({
        company_name: settings.companyName,
        company_email: settings.companyEmail,
        company_phone: settings.companyPhone,
        working_hours: Number(settings.workingHours),
        break_duration: Number(settings.breakDuration),
        grace_period: Number(settings.gracePeriod),
        timezone: settings.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);

    if (error) throw error;

    return;
  }

  const { error } = await supabase.from("settings").insert({
    company_name: settings.companyName,
    company_email: settings.companyEmail,
    company_phone: settings.companyPhone,
    working_hours: Number(settings.workingHours),
    break_duration: Number(settings.breakDuration),
    grace_period: Number(settings.gracePeriod),
    timezone: settings.timezone,
  });

  if (error) throw error;
}