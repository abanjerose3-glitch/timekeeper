import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import Layout from "../../components/layout/Layout";

import EmployeeToolbar from "../../components/employees/EmployeeToolbar";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeDialog from "../../components/employees/EmployeeDialog";
import EmployeeProfileSheet from "../../components/employees/EmployeeProfileSheet";
import ChangeRoleDialog from "../../components/employees/ChangeRoleDialog";

import {
  getEmployees,
  updateEmployee,
} from "../../services/employee/employeeService";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleEmployee, setRoleEmployee] = useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleView(employee) {
    setSelectedEmployee(employee);
    setProfileOpen(true);
  }

  function handleEdit(employee) {
    setProfileOpen(false);
    setSelectedEmployee(employee);
    setDialogOpen(true);
  }

  function handleChangeRole(employee) {
    setRoleEmployee(employee);
    setRoleDialogOpen(true);
  }

  async function handleDelete(employee) {
    try {
      await updateEmployee(employee.id, {
        status: "Inactive",
      });

      await loadEmployees();

      toast.success(
        `${employee.full_name} has been marked as inactive.`
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  function handleDialogClose(open) {
    setDialogOpen(open);

    if (!open) {
      setSelectedEmployee(null);
    }
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const keyword = search.toLowerCase();

      return (
        employee.full_name?.toLowerCase().includes(keyword) ||
        employee.email?.toLowerCase().includes(keyword) ||
        employee.employee_code?.toLowerCase().includes(keyword) ||
        employee.role?.toLowerCase().includes(keyword)
      );
    });
  }, [employees, search]);

  return (
    <Layout>
      <div className="space-y-6">

        <EmployeeToolbar
          search={search}
          onSearchChange={setSearch}
          onAdd={() => {
            setSelectedEmployee(null);
            setDialogOpen(true);
          }}
        />

        <EmployeeTable
          employees={filteredEmployees}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeRole={handleChangeRole}
        />

        <EmployeeDialog
          employee={selectedEmployee}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSuccess={() => {
            loadEmployees();
            setDialogOpen(false);

            toast.success(
              selectedEmployee
                ? "Employee updated successfully."
                : "Employee created successfully."
            );
          }}
        />

        <EmployeeProfileSheet
          employee={selectedEmployee}
          open={profileOpen}
          onOpenChange={setProfileOpen}
        />

        <ChangeRoleDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          employee={roleEmployee}
          onSuccess={() => {
            loadEmployees();
            setRoleDialogOpen(false);
            setRoleEmployee(null);
          }}
        />

      </div>
    </Layout>
  );
}

export default Employees;