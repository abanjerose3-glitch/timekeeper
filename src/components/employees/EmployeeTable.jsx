import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function EmployeeTable({
  employees,
  onEdit,
  onDelete,
  onView,
  onChangeRole,
}) {
  return (
    <div className="rounded-xl border bg-white">
      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {(employees ?? []).length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-slate-500"
              >
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow
                key={employee.id}
                className="cursor-pointer hover:bg-slate-50"
                onClick={() => onView(employee)}
              >

                <TableCell>
                  {employee.employee_code}
                </TableCell>

                <TableCell className="font-medium">
                  {employee.full_name}
                </TableCell>

                <TableCell>
                  {employee.email}
                </TableCell>

                <TableCell>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeRole(employee);
                    }}
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold transition hover:opacity-80 ${
                      employee.role === "Admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {employee.role}
                  </button>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : employee.status === "Inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {employee.status}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(employee);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <div onClick={(e) => e.stopPropagation()}>
                      <DeleteEmployeeDialog
                        employee={employee}
                        onConfirm={onDelete}
                      />
                    </div>

                  </div>
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>
    </div>
  );
}

export default EmployeeTable;