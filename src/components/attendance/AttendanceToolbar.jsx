import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Search,
  Download,
} from "lucide-react";

import AttendanceFilters from "./AttendanceFilters";

function AttendanceToolbar({
  search,
  setSearch,
  status,
  setStatus,
  onExport,
  isAdmin = false,
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-4 md:flex-row">
        {isAdmin && (
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={18}
            />

            <Input
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        <AttendanceFilters
          status={status}
          setStatus={setStatus}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onExport}
      >
        <Download
          size={18}
          className="mr-2"
        />
        Export Excel
      </Button>
    </div>
  );
}

export default AttendanceToolbar;