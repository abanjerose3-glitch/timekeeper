import {
    getAttendanceRecords,
    getMyAttendanceRecords,
  } from "./attendance/attendanceReportService";
  
  import { getCurrentSession } from "./authService";
  import { getEmployeeByUserId } from "./employee/employeeService";
  
  export async function getReportData() {
    const session = await getCurrentSession();
  
    if (!session?.user) {
      return [];
    }
  
    const employee = await getEmployeeByUserId(
      session.user.id
    );
  
    if (!employee) {
      return [];
    }
  
    if (employee.role === "Admin") {
      return await getAttendanceRecords();
    }
  
    return await getMyAttendanceRecords();
  }