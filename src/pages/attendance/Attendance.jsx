import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Layout from "../../components/layout/Layout";
import AttendanceToolbar from "../../components/attendance/AttendanceToolbar";
import AttendanceStatusBadge from "../../components/attendance/AttendanceStatusBadge";
import AdjustmentDialog from "../../components/attendance/AdjustmentDialog";
import {
    formatTime,
    formatDate,
  } from "../../utils/dateTime";

import { Button } from "../../components/ui/button";

import { useAuth } from "../../context/AuthContext";

import {
  getAttendanceRecords,
  getMyAttendanceRecords,
} from "../../services/attendance/attendanceReportService";

import { exportAttendance } from "../../services/exportService";


function Attendance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { role } = useAuth();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(
    searchParams.get("status") || "all"
  );

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadAttendance();
  }, []);

  useEffect(() => {
    setStatus(searchParams.get("status") || "all");
  }, [searchParams]);

  async function loadAttendance() {
    try {
      const data =
        role === "Admin"
          ? await getAttendanceRecords()
          : await getMyAttendanceRecords();

      setRecords(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredRecords =
  role !== "Admin"
    ? records
    : records.filter((record) => {
        const matchesSearch =
          record.employees?.full_name
            ?.toLowerCase()
            .includes(search.toLowerCase());

        let matchesStatus = true;

        if (status === "present") {
          matchesStatus =
            record.time_in &&
            !record.time_out &&
            (!record.break_out || record.break_in);
        }

        if (status === "break") {
          matchesStatus =
            record.break_out &&
            !record.break_in &&
            !record.time_out;
        }

        if (status === "timedout") {
          matchesStatus = !!record.time_out;
        }

        return matchesSearch && matchesStatus;
      });

  function handleExport() {
    exportAttendance(filteredRecords);
  }

  function handleAdjustment(record) {
    setSelectedRecord(record);
    setDialogOpen(true);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {role === "Admin"
                ? "Attendance"
                : "My Attendance"}
            </h1>

            <p className="mt-1 text-slate-500">
              {role === "Admin"
                ? "Employee attendance records."
                : "Your attendance records."}
            </p>
          </div>

          {role === "Admin" && (
            <Button
              variant="outline"
              onClick={() =>
                navigate("/attendance/adjustments")
              }
            >
              Review Requests
            </Button>
          )}
        </div>


        {role === "Admin" && (
  <AttendanceToolbar
    search={search}
    setSearch={setSearch}
    status={status}
    setStatus={setStatus}
    onExport={handleExport}
    isAdmin={true}
  />
)}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
              <th className="p-4 text-left">
  Date
</th>

{role === "Admin" && (
  <th className="p-4 text-left">
    Employee
  </th>
)}

                <th className="p-4 text-left">
                  Time In
                </th>
                <th className="p-4 text-left">
                  Break Out
                </th>
                <th className="p-4 text-left">
                  Break In
                </th>
                <th className="p-4 text-left">
                  Time Out
                </th>
                <th className="p-4 text-left">
                  Status
                </th>
                <th className="p-4 text-left">
                  Hours
                </th>
                <th className="p-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t hover:bg-slate-50"
                  >
                    <td className="p-4 whitespace-nowrap">
  {formatDate(record.attendance_date)}
</td>

{role === "Admin" && (
  <td className="p-4 font-medium">
    {record.employees?.full_name}
  </td>
)}

                    <td className="p-4">
                      {formatTime(record.time_in)}
                    </td>

                    <td className="p-4">
                      {formatTime(record.break_out)}
                    </td>

                    <td className="p-4">
                      {formatTime(record.break_in)}
                    </td>

                    <td className="p-4">
                      {formatTime(record.time_out)}
                    </td>

                    <td className="p-4">
                      <AttendanceStatusBadge
                        record={record}
                      />
                    </td>

                    <td className="p-4">
                      {record.total_hours ?? "-"}
                    </td>

                    <td className="p-4 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleAdjustment(record)
                        }
                      >
                        Request Adjustment
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "Admin" ? 9 : 8}
                    className="p-10 text-center text-slate-500"
                  >
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AdjustmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={selectedRecord}
        onSuccess={loadAttendance}
      />
    </Layout>
  );
}

export default Attendance;