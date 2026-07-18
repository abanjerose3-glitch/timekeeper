import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function Info({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="font-medium text-right">
        {value || "-"}
      </span>
    </div>
  );
}

function EmployeeProfileSheet({
  open,
  onOpenChange,
  employee,
}) {
  if (!employee) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="!w-[700px] !max-w-[700px] p-0"
      >
        <div className="flex h-full flex-col">

          {/* Header */}

          <div className="border-b p-6">

            <SheetHeader>

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">

                  {employee.full_name?.charAt(0)}

                </div>

                <div>

                  <SheetTitle className="text-3xl">

                    {employee.full_name}

                  </SheetTitle>

                  <p className="mt-1 text-sm text-slate-500">

                    {employee.position || "No Position"}

                  </p>

                  <p className="text-sm text-slate-400">

                    {employee.department || "No Department"}

                  </p>

                </div>

              </div>

            </SheetHeader>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto p-6">

            <div className="space-y-2">

            <Info
  label="Employee ID"
  value={employee.employee_code}
/>

              <Info
                label="Email"
                value={employee.email}
              />

              <Info
                label="Phone"
                value={employee.phone}
              />

              <Info
                label="Department"
                value={employee.department}
              />

              <Info
                label="Position"
                value={employee.position}
              />

              <Info
                label="Role"
                value={employee.role}
              />

              <Info
                label="Status"
                value={employee.status}
              />

              <Info
                label="Hire Date"
                value={employee.hire_date}
              />

            </div>

          </div>

        </div>

      </SheetContent>
    </Sheet>
  );
}

export default EmployeeProfileSheet;