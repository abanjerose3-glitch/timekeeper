import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useAuth } from "../../context/AuthContext";
import { getEmployees } from "../../services/employee/employeeService";

function AvailabilityForm({
  employeeId,
  onSave,
  loading = false,
}) {
  const { role } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const initialForm = {
    employee_id: "",
    availability_date: "",
    status: "Available",
    start_time: "",
    end_time: "",
    notes: "",
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (role === "Admin") {
      loadEmployees();
    } else {
      setForm((prev) => ({
        ...prev,
        employee_id: employeeId || "",
      }));
    }
  }, [role, employeeId]);

  async function loadEmployees() {
    try {
      setLoadingEmployees(true);

      const data = await getEmployees();

      setEmployees(data || []);

      if (data?.length) {
        setForm((prev) => ({
          ...prev,
          employee_id: data[0].id,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmployees(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      form.status === "Available" &&
      form.start_time &&
      form.end_time &&
      form.end_time <= form.start_time
    ) {
      alert("End time must be later than start time.");
      return;
    }
    console.log(form);
    await onSave([
      {
        employee_id: form.employee_id,
        availability_date: form.availability_date,
        status: form.status,
        start_time:
          form.status === "Available"
            ? form.start_time || null
            : null,
        end_time:
          form.status === "Available"
            ? form.end_time || null
            : null,
        notes: form.notes.trim() || null,
      },
    ]);

    setForm((prev) => ({
      ...initialForm,
      employee_id: prev.employee_id,
    }));
  }

  const disableTime = form.status !== "Available";

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
            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={form.employee_id}
            disabled={loadingEmployees}
            onChange={(e) =>
              handleChange("employee_id", e.target.value)
            }
            required
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

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Date
          </label>

          <Input
            type="date"
            value={form.availability_date}
            onChange={(e) =>
              handleChange(
                "availability_date",
                e.target.value
              )
            }
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            className="w-full rounded-md border bg-white px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) =>
              handleChange("status", e.target.value)
            }
          >
            <option value="Available">Available</option>
            <option value="Off">Off</option>
            <option value="Leave">Leave</option>
            <option value="Holiday">Holiday</option>
            <option value="Training">Training</option>
            <option value="Work From Home">
              Work From Home
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Start Time
          </label>

          <Input
            type="time"
            disabled={disableTime}
            value={form.start_time}
            onChange={(e) =>
              handleChange("start_time", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            End Time
          </label>

          <Input
            type="time"
            disabled={disableTime}
            value={form.end_time}
            onChange={(e) =>
              handleChange("end_time", e.target.value)
            }
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Notes
        </label>

        <textarea
          rows={3}
          className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Optional notes..."
          value={form.notes}
          onChange={(e) =>
            handleChange("notes", e.target.value)
          }
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Availability"}
        </Button>
      </div>
    </form>
  );
}

export default AvailabilityForm;