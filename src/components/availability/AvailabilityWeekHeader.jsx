import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function AvailabilityWeekHeader({
  weekLabel,
  onPrevious,
  onNext,
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-6">
      <div>
        <h2 className="text-xl font-semibold">
          Availability
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {weekLabel}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onPrevious}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Week
        </Button>

        <Button
          variant="outline"
          onClick={onNext}
        >
          Next Week
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default AvailabilityWeekHeader;