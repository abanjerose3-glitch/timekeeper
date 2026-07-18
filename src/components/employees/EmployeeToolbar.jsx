import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

function EmployeeToolbar({
  search,
  onSearchChange,
  onAdd,
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Employees
        </h1>

        <p className="mt-1 text-slate-500">
          Manage employee information.
        </p>
      </div>

      <div className="flex gap-3">

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-80 pl-10"
          />
        </div>

        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>

      </div>

    </div>
  );
}

export default EmployeeToolbar;