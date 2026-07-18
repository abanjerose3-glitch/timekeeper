import { useEffect, useState } from "react";

import {
  Users,
  CircleCheckBig,
  Coffee,
  Clock4,
} from "lucide-react";

import StatsCard from "./StatsCard";

import { useAuth } from "../../context/AuthContext";

import {
  getDashboardStats,
  getEmployeeDashboardStats,
} from "../../services/dashboardService";

function DashboardStats() {
  const { role } = useAuth();

  const [stats, setStats] = useState({
    totalEmployees: 0,
    clockedIn: 0,
    onBreak: 0,
    timedOut: 0,
    hoursToday: 0,
    hoursWeek: 0,
    hoursMonth: 0,
    currentStatus: "Not Clocked In",
  });

  useEffect(() => {
    loadStats();
  }, [role]);

  async function loadStats() {
    try {
      const data =
        role === "Admin"
          ? await getDashboardStats()
          : await getEmployeeDashboardStats();

      setStats(data);
    } catch (error) {
      console.error(error);
    }
  }

  if (role === "Admin") {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Employees"
          value={stats.totalEmployees}
          icon={<Users />}
          to="/employees"
        />

        <StatsCard
          title="Working"
          value={stats.clockedIn}
          icon={<CircleCheckBig />}
          to="/attendance"
        />

        <StatsCard
          title="On Break"
          value={stats.onBreak}
          icon={<Coffee />}
          to="/attendance"
        />

        <StatsCard
          title="Completed"
          value={stats.timedOut}
          icon={<Clock4 />}
          to="/attendance"
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Hours Today"
        value={`${stats.hoursToday} hrs`}
        icon={<Clock4 />}
      />

      <StatsCard
        title="Current Status"
        value={stats.currentStatus}
        icon={<CircleCheckBig />}
      />

      <StatsCard
        title="This Week"
        value={`${stats.hoursWeek} hrs`}
        icon={<Coffee />}
      />

      <StatsCard
        title="This Month"
        value={`${stats.hoursMonth} hrs`}
        icon={<Users />}
      />
    </div>
  );
}
export default DashboardStats;