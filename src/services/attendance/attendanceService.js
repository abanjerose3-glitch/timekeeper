import supabase from "../supabase";
import { getCurrentSession } from "../authService";
import { getToday } from "../../utils/dateTime";

// Get logged in employee
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

console.log("Current Employee:", data);

return data;
}
// ==============================
// ADMIN / REPORTS
// ==============================

// Get all attendance records
export async function getAttendance() {
  const { data, error } = await supabase
    .from("attendance")
    .select(
      `
      *,
      employees(
        id,
        full_name,
        position,
        department
      )
    `
    )
    .order("attendance_date", { ascending: false });

  if (error) throw error;

  return data;
}

// Get attendance of one employee
export async function getAttendanceByEmployee(employeeId) {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employeeId)
    .order("attendance_date", { ascending: false });

  if (error) throw error;

  return data;
}

// ==============================
// TIME CLOCK
// ==============================

// Get today's attendance
export async function getTodayAttendance() {
  const employee = await getCurrentEmployee();

  if (!employee) {
    console.error("Employee not found.");
    return null;
  }

  const today = getToday(employee.timezone);

  console.log("=================================");
  console.log("Employee ID:", employee.id);
  console.log("Employee Name:", employee.full_name);
  console.log("Employee Timezone:", employee.timezone);
  console.log("Today:", today);

  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("employee_id", employee.id)
    .eq("attendance_date", today)
    .maybeSingle();

  console.log("Attendance Result:", data);
  console.log("Attendance Error:", error);
  console.log("=================================");

  if (error) throw error;

  return data;
}

// Clock In
export async function clockIn() {
  const employee = await getCurrentEmployee();

  const today = getToday(employee.timezone);

  const existing = await getTodayAttendance();

  if (existing) {
    throw new Error("You have already clocked in today.");
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert({
      employee_id: employee.id,
      attendance_date: today,
      time_in: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Break Out
export async function breakOut() {
  const attendance = await getTodayAttendance();

  if (!attendance) {
    throw new Error("Clock in first.");
  }

  if (attendance.break_out) {
    throw new Error("Break out already recorded.");
  }

  const { data, error } = await supabase
    .from("attendance")
    .update({
      break_out: new Date().toISOString(),
    })
    .eq("id", attendance.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Break In
export async function breakIn() {
  const attendance = await getTodayAttendance();

  if (!attendance) {
    throw new Error("Clock in first.");
  }

  if (!attendance.break_out) {
    throw new Error("Break out first.");
  }

  if (attendance.break_in) {
    throw new Error("Break in already recorded.");
  }

  const { data, error } = await supabase
    .from("attendance")
    .update({
      break_in: new Date().toISOString(),
    })
    .eq("id", attendance.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// Clock Out
export async function clockOut() {
  const attendance = await getTodayAttendance();

  if (!attendance) {
    throw new Error("Clock in first.");
  }

  if (attendance.time_out) {
    throw new Error("You already clocked out.");
  }

  const timeOut = new Date();

  const totalHours =
    (timeOut - new Date(attendance.time_in)) /
    1000 /
    60 /
    60;

  const { data, error } = await supabase
    .from("attendance")
    .update({
      time_out: timeOut.toISOString(),
      total_hours: Number(totalHours.toFixed(2)),
    })
    .eq("id", attendance.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}
// ==============================
// TEAM AVAILABILITY
// ==============================

export async function getTeamAvailability() {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      id,
      full_name,
      attendance(*)
    `);

  if (error) throw error;

  const today = getToday("Asia/Manila");

  const working = [];
  const onBreak = [];
  const offline = [];

  data.forEach((employee) => {
    const attendance = employee.attendance.find(
      (a) => a.attendance_date === today
    );

    if (!attendance) {
      offline.push(employee);
      return;
    }

    if (attendance.time_out) {
      offline.push(employee);
      return;
    }

    if (attendance.break_out && !attendance.break_in) {
      onBreak.push(employee);
      return;
    }

    if (attendance.time_in) {
      working.push(employee);
      return;
    }

    offline.push(employee);
  });

  return {
    working,
    onBreak,
    offline,
  };
}