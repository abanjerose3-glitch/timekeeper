import supabase from "../supabase";
import { getCurrentSession } from "../authService";
import { getEmployeeByUserId } from "../employee/employeeService";

export async function createAttendanceAdjustment({
  attendanceId,
  employeeId,
  adjustmentType,
  originalTime,
  requestedTime,
  reason,
}) {
  const { error } = await supabase
    .from("attendance_adjustments")
    .insert({
      attendance_id: attendanceId,
      employee_id: employeeId,
      adjustment_type: adjustmentType,
      original_time: originalTime,
      requested_time: requestedTime,
      reason,
      status: "Pending",
    });

  if (error) throw error;
}

export async function getAttendanceAdjustments() {
  const { data, error } = await supabase
    .from("attendance_adjustments")
    .select(`
      *,
      employees!attendance_adjustments_employee_id_fkey (
        employee_code,
        full_name
      ),
      attendance!attendance_adjustments_attendance_id_fkey (
        id,
        attendance_date,
        time_in,
        break_out,
        break_in,
        time_out
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function getMyAttendanceAdjustments() {
  const session = await getCurrentSession();

  if (!session?.user) return [];

  const employee = await getEmployeeByUserId(
    session.user.id
  );

  if (!employee) return [];

  const { data, error } = await supabase
    .from("attendance_adjustments")
    .select(`
      *,
      attendance!attendance_adjustments_attendance_id_fkey (
        id,
        attendance_date,
        time_in,
        break_out,
        break_in,
        time_out
      )
    `)
    .eq("employee_id", employee.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

export async function updateAdjustmentStatus(
  id,
  status,
  approvedBy
) {
  const { error } = await supabase
    .from("attendance_adjustments")
    .update({
      status,
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function approveAttendanceAdjustment(
  adjustment,
  approvedBy
) {
  let updateField;

  switch (adjustment.adjustment_type) {
    case "Time In":
      updateField = "time_in";
      break;

    case "Break Out":
      updateField = "break_out";
      break;

    case "Break In":
      updateField = "break_in";
      break;

    case "Time Out":
      updateField = "time_out";
      break;

    default:
      throw new Error("Invalid adjustment type.");
  }

  const { error: attendanceError } = await supabase
    .from("attendance")
    .update({
      [updateField]:
        adjustment.requested_time,
    })
    .eq("id", adjustment.attendance_id);

  if (attendanceError) throw attendanceError;

  const { error } = await supabase
    .from("attendance_adjustments")
    .update({
      status: "Approved",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", adjustment.id);

  if (error) throw error;
}

export async function rejectAttendanceAdjustment(
  adjustmentId,
  approvedBy
) {
  const { error } = await supabase
    .from("attendance_adjustments")
    .update({
      status: "Rejected",
      approved_by: approvedBy,
      approved_at: new Date().toISOString(),
    })
    .eq("id", adjustmentId);

  if (error) throw error;
}