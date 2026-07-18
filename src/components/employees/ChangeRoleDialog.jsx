import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { updateEmployeeRole } from "../../services/employee/employeeService";

function ChangeRoleDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}) {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (employee) {
      setRole(employee.role);
    }
  }, [employee]);

  async function handleSave() {
    try {
      await updateEmployeeRole(employee.id, role);

      toast.success("Role updated successfully.");

      onSuccess?.();

      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            <p className="text-sm text-slate-500">Employee</p>
            <p className="font-medium">{employee.full_name}</p>
          </div>

          <select
            className="w-full rounded-md border p-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
          </select>

        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

export default ChangeRoleDialog;