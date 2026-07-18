import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";

import {
  getAttendanceAdjustments,
  approveAttendanceAdjustment,
  rejectAttendanceAdjustment,
} from "../../services/attendance/attendanceAdjustmentService";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

function formatDateTime(value) {
  if (!value) return "-";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Approved: "bg-green-100 text-green-700 border-green-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function AdminAdjustmentRequests() {
  const { employee } = useAuth();

  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      const data = await getAttendanceAdjustments();
      setRequests(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load adjustment requests.");
    }
  }

  async function handleApprove(request) {
    try {
      await approveAttendanceAdjustment(
        request,
        employee.id
      );

      toast.success(
        "Adjustment request approved successfully."
      );

      loadRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve request.");
    }
  }

  async function handleReject(request) {
    try {
      await rejectAttendanceAdjustment(
        request.id,
        employee.id
      );

      toast.success("Adjustment request rejected.");

      loadRequests();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request.");
    }
  }

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.employees?.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        request.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, status]);

  return (
    <Layout>
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Review Adjustment Requests
          </h1>

          <p className="mt-1 text-slate-500">
            Review, approve, or reject employee attendance adjustment requests.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border bg-white p-4">

          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-md border px-3"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>

        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

          <table className="w-full">

            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Original</th>
                <th className="p-4 text-left">Requested</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="p-4">
                      <div className="font-medium">
                        {request.employees?.full_name}
                      </div>

                      <div className="text-xs text-slate-500">
                        {request.employees?.employee_code}
                      </div>
                    </td>

                    <td className="p-4">
                      {request.adjustment_type}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatDateTime(request.original_time)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatDateTime(request.requested_time)}
                    </td>

                    <td className="max-w-xs p-4">
                      {request.reason}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={request.status} />
                    </td>

                    <td className="p-4">
                      {request.status === "Pending" ? (
                        <div className="flex justify-center gap-2">

                          <Button
                            size="sm"
                            onClick={() => handleApprove(request)}
                          >
                            Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(request)}
                          >
                            Reject
                          </Button>

                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Completed
                        </span>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-10 text-center text-slate-500"
                  >
                    No adjustment requests found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>
    </Layout>
  );
}

export default AdminAdjustmentRequests;