import Layout from "../../components/layout/Layout";

import DashboardStats from "../../components/dashboard/DashboardStats";
import AttendanceChart from "../../components/dashboard/AttendanceChart";
import RecentActivity from "../../components/dashboard/RecentActivity";
import TodayAvailability from "../../components/dashboard/TodayAvailability";

import { useAuth } from "../../context/AuthContext";

function Dashboard() {
  const { role, employee } = useAuth();

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            {role === "Admin"
              ? "Dashboard"
              : "My Dashboard"}
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back
            {employee?.full_name
              ? `, ${employee.full_name}`
              : ""}
            . Here's today's overview.
          </p>
        </div>

        <DashboardStats />

        <div className="space-y-6">
          <AttendanceChart />

          <RecentActivity />

          <TodayAvailability />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;