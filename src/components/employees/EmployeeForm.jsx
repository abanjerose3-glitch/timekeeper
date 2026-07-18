import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  createEmployee,
  updateEmployee,
 } from "../../services/employee/employeeService"

function EmployeeForm({ employee = null, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    employee_code: "",
    full_name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    hire_date: "",
    role: "Employee",
    status: "Active",
  });

  useEffect(() => {
    if (employee) {
      setForm({
        employee_code: employee.employee_code ?? "",
        full_name: employee.full_name ?? "",
        email: employee.email ?? "",
        phone: employee.phone ?? "",
        department: employee.department ?? "",
        position: employee.position ?? "",
        hire_date: employee.hire_date ?? "",
        role: employee.role ?? "Employee",
        status: employee.status ?? "Active",
      });
    }
  }, [employee]);

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (employee) {
        await updateEmployee(employee.id, form);
      } else {
        await createEmployee(form);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label className="mb-2 block text-sm font-medium">
          Employee ID
        </label>

        <Input
          required
          name="employee_code"
          value={form.employee_code}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <Input
          required
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Email
        </label>

        <Input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <Input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Department
        </label>

        <Input
          name="department"
          value={form.department}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Position
        </label>

        <Input
          name="position"
          value={form.position}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Hire Date
        </label>

        <Input
          type="date"
          name="hire_date"
          value={form.hire_date}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Role
        </label>

        <Input
          name="role"
          value={form.role}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Status
        </label>

        <Input
          name="status"
          value={form.status}
          onChange={handleChange}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Saving..."
          : employee
          ? "Update Employee"
          : "Save Employee"}
      </Button>

    </form>
  );
}

export default EmployeeForm;