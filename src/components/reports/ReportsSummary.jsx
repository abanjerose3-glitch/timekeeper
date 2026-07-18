function ReportsSummary({ records = [] }) {
    const totalEmployees = new Set(
      records.map((r) => r.employee_id)
    ).size;
  
    const totalAttendance = records.length;
  
    const present = records.filter(
      (r) => !!r.time_in
    ).length;
  
    const completed = records.filter(
      (r) => !!r.time_out
    ).length;
  
    const totalHours = records.reduce(
      (sum, r) => sum + Number(r.total_hours || 0),
      0
    );
  
    const averageHours =
      totalAttendance > 0
        ? totalHours / totalAttendance
        : 0;
  
    const overtimeHours = records.reduce(
      (sum, r) => {
        const hours = Number(r.total_hours || 0);
  
        return sum + Math.max(0, hours - 8);
      },
      0
    );
  
    const attendanceRate =
      totalAttendance > 0
        ? ((present / totalAttendance) * 100).toFixed(1)
        : "0.0";
  
    const cards = [
      {
        title: "Employees",
        value: totalEmployees,
      },
      {
        title: "Attendance",
        value: totalAttendance,
      },
      {
        title: "Present",
        value: present,
      },
      {
        title: "Completed",
        value: completed,
      },
      {
        title: "Hours Worked",
        value: `${totalHours.toFixed(1)} hrs`,
      },
      {
        title: "Average Hours",
        value: `${averageHours.toFixed(1)} hrs`,
      },
      {
        title: "Overtime",
        value: `${overtimeHours.toFixed(1)} hrs`,
      },
      {
        title: "Attendance Rate",
        value: `${attendanceRate}%`,
      },
    ];
  
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>
  
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    );
  }
  
  export default ReportsSummary;