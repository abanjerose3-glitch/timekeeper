import { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { getEmployees } from "../../services/employee/employeeService";

function AvailabilityForm({
    employeeId,
    role,
    editingWeek,
    setEditingWeek,
    onSave,
    loading = false,
  }) {
  
  console.log("ROLE:", role);
console.log("employeeId prop:", employeeId);


  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || "");
  const [weekStarting, setWeekStarting] = useState("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState([]);

  const statuses = [
    "Available",
    "Off",
    "Leave",
    "Holiday",
    "Training",
    "Work From Home",
  ];

  useEffect(() => {
    if (role === "Admin") {
      loadEmployees();
    } else {
      setSelectedEmployee(employeeId || "");
    }
  }, [role, employeeId]);

  async function loadEmployees() {
    try {
      setLoadingEmployees(true);

      const data = await getEmployees();

      setEmployees(data || []);

      if (data?.length > 0) {
        setSelectedEmployee(data[0].id);
      }
    } finally {
      setLoadingEmployees(false);
    }
  }

  function getMonday(date) {
    const d = new Date(date);

    const day = d.getDay();

    const diff = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + diff);

    return d;
  }

  const week = useMemo(() => {
    if (!weekStarting) return [];

    const monday = getMonday(weekStarting);

    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    return days.map((day, index) => {
      const current = new Date(monday);

      current.setDate(monday.getDate() + index);

      return {
        day,
        availability_date: current.toISOString().split("T")[0],
        status: "Available",
        start_time: "08:00",
        end_time: "17:00",
      };
    });
  }, [weekStarting]);

  useEffect(() => {
    setRecords(week);
  }, [week]);

  useEffect(() => {
    if (!editingWeek) return;
  
    setSelectedEmployee(editingWeek.employee_id || employeeId);
    setWeekStarting(editingWeek.week);
    setNotes(editingWeek.notes || "");
  
    const newRecords = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day) => {
      const record = editingWeek.days[day];
  
      return {
        day,
        availability_date:
          record?.availability_date || "",
        status:
          record?.status || "Available",
        start_time:
          record?.start_time || "08:00",
        end_time:
          record?.end_time || "17:00",
      };
    });
  
    setRecords(newRecords);
  
  }, [editingWeek, employeeId]);

  function updateRecord(index, field, value) {
    setRecords((prev) =>
      prev.map((record, i) =>
        i === index
          ? {
              ...record,
              [field]: value,
            }
          : record
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedEmployee) {
      alert("Please select an employee.");
      return;
    }

    if (records.length !== 7) {
      alert("Please select a week first.");
      return;
    }

    for (const record of records) {
      if (
        record.status === "Available" &&
        record.end_time <= record.start_time
      ) {
        alert(
          `${record.day}: End time must be later than Start time.`
        );
        return;
      }
    }

    const payload = records.map((record) => ({
      employee_id: selectedEmployee,
      availability_date: record.availability_date,
      status: record.status,
      start_time:
        record.status === "Available"
          ? record.start_time
          : null,
      end_time:
        record.status === "Available"
          ? record.end_time
          : null,
      notes,
    }));

    await onSave(payload);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
    >
         {role === "Admin" && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Employee
          </label>

          <select
            className="w-full rounded-md border bg-white px-3 py-2"
            value={selectedEmployee}
            disabled={loadingEmployees}
            onChange={(e) =>
              setSelectedEmployee(e.target.value)
            }
          >
            {employees.map((emp) => (
              <option
                key={emp.id}
                value={emp.id}
              >
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Week Starting
        </label>

        <Input
          type="date"
          value={weekStarting}
          onChange={(e) =>
            setWeekStarting(e.target.value)
          }
          required
        />
      </div>

      <div className="space-y-4">
        {records.map((record, index) => (
          <div
            key={record.availability_date}
            className="grid grid-cols-5 gap-4 rounded-lg border p-4"
          >
            <div>
              <div className="font-medium">
                {record.day}
              </div>

              <div className="text-xs text-slate-500">
                {record.availability_date}
              </div>
            </div>

            <select
              className="rounded-md border px-3 py-2"
              value={record.status}
              onChange={(e) =>
                updateRecord(
                  index,
                  "status",
                  e.target.value
                )
              }
            >
              {statuses.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

            <Input
              type="time"
              disabled={record.status !== "Available"}
              value={record.start_time}
              onChange={(e) =>
                updateRecord(
                  index,
                  "start_time",
                  e.target.value
                )
              }
            />

            <Input
              type="time"
              disabled={record.status !== "Available"}
              value={record.end_time}
              onChange={(e) =>
                updateRecord(
                  index,
                  "end_time",
                  e.target.value
                )
              }
            />

            <div className="flex items-center justify-center">
              <span className="rounded-full bg-slate-100 px-3 py-2 text-xs">
                {record.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Notes
        </label>

        <textarea
          rows={4}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
          placeholder="Optional notes for this week..."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Week"}
        </Button>
      </div>
    </form>
  );
}

export default AvailabilityForm;