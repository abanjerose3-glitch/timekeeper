import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../ui/card";

import { useAuth } from "../../context/AuthContext";

import {
  getWeeklyAttendance,
  getMyWeeklyAttendance,
} from "../../services/attendance/attendanceChartService";

function AttendanceChart() {
  const { role } = useAuth();

  const [data, setData] = useState([]);

  useEffect(() => {
    loadChart();
  }, [role]);

  async function loadChart() {
    try {
      const result =
        role === "Admin"
          ? await getWeeklyAttendance()
          : await getMyWeeklyAttendance();

      setData(result || []);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {role === "Admin"
            ? "Attendance Overview (Last 7 Days)"
            : "My Attendance (Last 7 Days)"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="attendance"
                strokeWidth={3}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default AttendanceChart;