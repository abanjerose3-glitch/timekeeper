import { useMemo, useState } from "react";

import { Input } from "../ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function AvailabilityTable({
  data,
  isAdmin,
  selectedEmployee,
  onEmployeeChange,
}) {
  const [search, setSearch] = useState("");

  const employees = useMemo(() => {
    const map = new Map();

    data.forEach((row) => {
      if (row.employees) {
        map.set(row.employees.id, row.employees);
      }
    });

    return [...map.values()].sort((a, b) =>
      a.full_name.localeCompare(b.full_name)
    );
  }, [data]);

  const filteredData = useMemo(() => {
    let rows = data;

    if (isAdmin && selectedEmployee !== "all") {
      rows = rows.filter(
        (row) => row.employee_id === selectedEmployee
      );
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      rows = rows.filter((row) => {
        return (
          row.employees?.full_name
            ?.toLowerCase()
            .includes(keyword) ||
          row.status
            ?.toLowerCase()
            .includes(keyword) ||
          row.notes
            ?.toLowerCase()
            .includes(keyword)
        );
      });
    }

    return rows;
  }, [data, search, isAdmin, selectedEmployee]);

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(time) {
    if (!time) return "-";

    const [hour, minute] = time.split(":");

    const d = new Date();

    d.setHours(hour);
    d.setMinutes(minute);

    return d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function badge(status) {
    const styles = {
      Available:
        "bg-green-100 text-green-700",

      Off:
        "bg-gray-100 text-gray-700",

      Leave:
        "bg-red-100 text-red-700",

      Holiday:
        "bg-blue-100 text-blue-700",

      Training:
        "bg-yellow-100 text-yellow-700",

      "Work From Home":
        "bg-purple-100 text-purple-700",
    };

    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
          styles[status] ||
          "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-4">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <Input
          placeholder="Search..."
          className="max-w-sm"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {isAdmin && (
          <select
            value={selectedEmployee}
            onChange={(e) =>
              onEmployeeChange(e.target.value)
            }
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">
              All Employees
            </option>

            {employees.map((emp) => (
              <option
                key={emp.id}
                value={emp.id}
              >
                {emp.full_name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">

        <div className="max-h-[600px] overflow-auto">

          <Table>

            <TableHeader className="sticky top-0 bg-white z-10">

              <TableRow>

                {isAdmin && (
                  <TableHead>
                    Employee
                  </TableHead>
                )}

                <TableHead>Date</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Start</TableHead>

                <TableHead>End</TableHead>

                <TableHead>Notes</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {filteredData.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={isAdmin ? 6 : 5}
                    className="h-32 text-center text-slate-500"
                  >
                    No availability records found.
                  </TableCell>

                </TableRow>

              ) : (

                filteredData.map((row) => (

                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50"
                  >

                    {isAdmin && (
                      <TableCell className="font-medium">
                        {row.employees?.full_name}
                      </TableCell>
                    )}

                    <TableCell>
                      {formatDate(
                        row.availability_date
                      )}
                    </TableCell>

                    <TableCell>
                      {badge(row.status)}
                    </TableCell>

                    <TableCell>
                      {formatTime(
                        row.start_time
                      )}
                    </TableCell>

                    <TableCell>
                      {formatTime(
                        row.end_time
                      )}
                    </TableCell>

                    <TableCell className="max-w-xs truncate">
                      {row.notes || "-"}
                    </TableCell>

                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>

        </div>

      </div>

    </div>
  );
}

export default AvailabilityTable;