import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";

import EmployeeForm from "./EmployeeForm";

function EmployeeDialog({
  employee = null,
  open,
  onOpenChange,
  onSuccess,
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;

  const dialogOpen = isControlled ? open : internalOpen;

  const setDialogOpen = isControlled
    ? onOpenChange
    : setInternalOpen;

  useEffect(() => {
    if (!dialogOpen) return;
  }, [dialogOpen]);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      {!employee && open === undefined && (
  <DialogTrigger asChild>
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Add Employee
    </Button>
  </DialogTrigger>
)}

<DialogContent
  className="
  sm:max-w-xl
  max-h-[90vh]
  overflow-y-auto
"
>

        <DialogHeader>
          <DialogTitle>
            {employee ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>

        <EmployeeForm
          employee={employee}
          onSuccess={() => {
            setDialogOpen(false);
            onSuccess?.();
          }}
        />

      </DialogContent>
    </Dialog>
  );
}

export default EmployeeDialog;