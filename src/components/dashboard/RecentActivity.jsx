import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { Badge } from "../ui/badge";

import { useAuth } from "../../context/AuthContext";
import {
  formatDate,
  formatTime,
} from "../../utils/dateTime";

import {
  getRecentAttendance,
  getMyRecentAttendance,
} from "../../services/recentAttendanceService";

function RecentActivity() {
  const { role } = useAuth();

  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, [role]);

  async function loadAttendance() {
    try {
      const data =
        role === "Admin"
          ? await getRecentAttendance()
          : await getMyRecentAttendance();

      setRecords(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  function getStatus(record) {
    if (record.time_out) return "Completed";

    if (
      record.break_out &&
      !record.break_in
    ) {
      return "On Break";
    }

    if (record.time_in) {
      return "Working";
    }

    return "Not Clocked In";
  }

  function getBadgeVariant(status) {
    switch (status) {
      case "Working":
        return "default";

      case "On Break":
        return "secondary";

      case "Completed":
        return "outline";

      default:
        return "outline";
    }
  }

  function formatDate(date) {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {role === "Admin"
            ? "Recent Attendance"
            : "My Recent Attendance"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-slate-500">
            No attendance records found.
          </p>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const status = getStatus(record);

              return (
                <div
                  key={record.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {role === "Admin"
                        ? record.employees?.full_name ||
                          "Unknown Employee"
                        : "You"}
                    </p>

                    <p className="text-sm text-slate-500">
                      {formatDate(record.attendance_date)} •{" "}
                      {formatTime(record.time_in)}
                    </p>
                  </div>

                  <Badge variant={getBadgeVariant(status)}>
                    {status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;