import { useMemo, useState } from "react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

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
    loading,
    onEdit,
  }) {
  const [search, setSearch] = useState("");


  function getMonday(dateString) {
    // Parse YYYY-MM-DD without timezone conversion
    const [year, month, day] = dateString.split("-").map(Number);
  
    const d = new Date(year, month - 1, day);
  
    const dayOfWeek = d.getDay();
  
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
    d.setDate(d.getDate() + diff);
  
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
  
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  }

  function formatTime(time) {
    if (!time) return "-";
  
    const [h, m] = time.split(":");
  
    const d = new Date();
  
    d.setHours(Number(h));
    d.setMinutes(Number(m));
    d.setSeconds(0);
  
    return d.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
  
    return new Date(year, month - 1, day).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
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
        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
          styles[status] ??
          "bg-slate-100 text-slate-700"
        }`}
      >
        {status}
      </span>
    );
  }

  const grouped = useMemo(() => {
    const map = new Map();

    data.forEach((row) => {
      const monday = getMonday(
        row.availability_date
      );

      const key = `${row.employee_id}_${monday}`;

      if (!map.has(key)) {
        map.set(key, {
            employee_id: row.employee_id,
          
            employee:
              row.employees?.full_name ??
              "-",
          
            week: monday,
          
            notes: row.notes ?? "",
          
            days: {
              Monday: null,
              Tuesday: null,
              Wednesday: null,
              Thursday: null,
              Friday: null,
              Saturday: null,
              Sunday: null,
            },
          });
      }

      const [year, month, day] = row.availability_date
      .split("-")
      .map(Number);
    
    const weekday = new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-US", {
      weekday: "long",
    });
    map.get(key).days[weekday] = row;

}); // <-- ISARA ANG data.forEach()

return [...map.values()].filter((week) => {
  if (!search.trim()) return true;

  return week.employee
    .toLowerCase()
    .includes(search.toLowerCase());
});
  }, [data, search]);

  return (
    <div className="space-y-4">

{isAdmin && (
  <Input
    placeholder="Search employee..."
    className="max-w-sm"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
)}

      <div className="overflow-hidden rounded-xl border bg-white">

        <div className="max-h-[650px] overflow-auto">

          <Table>

            <TableHeader className="sticky top-0 z-10 bg-white">

              <TableRow>

                {isAdmin && (
                  <TableHead>
                    Employee
                  </TableHead>
                )}

                <TableHead>
                  Week Starting
                </TableHead>

                <TableHead>Monday</TableHead>

                <TableHead>Tuesday</TableHead>

                <TableHead>Wednesday</TableHead>

                <TableHead>Thursday</TableHead>

                <TableHead>Friday</TableHead>

                <TableHead>Saturday</TableHead>

                <TableHead>Sunday</TableHead>

                <TableHead>
                  Notes
                </TableHead>

                <TableHead>
  Actions
</TableHead>

              </TableRow>

            </TableHeader>

            <TableBody>

              {loading ? (

                <TableRow>

                  <TableCell
                    colSpan={isAdmin ? 10 : 9}
                    className="h-32 text-center"
                  >
                    Loading...
                  </TableCell>

                </TableRow>

              ) : grouped.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={isAdmin ? 10 : 9}
                    className="h-32 text-center text-slate-500"
                  >
                    No weekly availability found.
                  </TableCell>

                </TableRow>

              ) : (

                grouped.map((week, index) => (

                  <TableRow
                    key={index}
                    className="hover:bg-slate-50"
                  >

                    {isAdmin && (
                      <TableCell className="font-medium whitespace-nowrap">
                        {week.employee}
                      </TableCell>
                    )}

                    <TableCell className="whitespace-nowrap">
                      {formatDate(
                        week.week
                      )}
                    </TableCell>

                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => {
                      const record =
                        week.days[day];

                      return (
                        <TableCell
                          key={day}
                          className="min-w-[170px]"
                        >
                          {record ? (
                            <div className="space-y-2">

                              {badge(
                                record.status
                              )}

                              {record.status ===
                                "Available" && (
                                <div className="text-xs text-slate-500">
                                  {formatTime(
                                    record.start_time
                                  )}{" "}
                                  -{" "}
                                  {formatTime(
                                    record.end_time
                                  )}
                                </div>
                              )}

                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    })}

<TableCell>
  <Button
    variant="outline"
    size="sm"
    onClick={() => {
        console.log("EDIT WEEK:", week);
        onEdit(week);
      }}
  >
    Edit
  </Button>
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