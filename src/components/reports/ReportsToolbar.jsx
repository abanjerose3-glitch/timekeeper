import { Input } from "../ui/input";
import { Button } from "../ui/button";

function ReportsToolbar({
  search,
  setSearch,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onExportExcel,
}) {
  function clearFilters() {
    setSearch("");
    setStartDate("");
    setEndDate("");
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px_auto]">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Search Employee
          </label>

          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Start Date
          </label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End Date
          </label>

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full lg:w-auto"
            onClick={clearFilters}
          >
            Clear
          </Button>

          <Button
            type="button"
            className="w-full lg:w-auto"
            onClick={onExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportsToolbar;