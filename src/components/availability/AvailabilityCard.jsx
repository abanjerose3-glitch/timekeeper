import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function formatTime(value) {
  if (!value) return "OFF";

  return value.slice(0, 5);
}

function AvailabilityCard({
  employee,
  availability,
  onEdit,
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">

            {employee.full_name}

          </h2>

          <p className="text-sm text-slate-500">
  {employee.employee_code}
</p>

        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(employee)}
        >
          <Pencil
            size={16}
            className="mr-2"
          />

          Edit

        </Button>

      </div>

      <div className="space-y-3">

        {DAYS.map((day, index) => {
          const schedule = availability.find(
            (item) => item.day_of_week === index + 1
          );

          return (
            <div
              key={day}
              className="flex items-center justify-between border-b pb-2"
            >

              <span className="font-medium">

                {day}

              </span>

              <span className="text-slate-600">

                {schedule?.is_available
                  ? `${formatTime(
                      schedule.start_time
                    )} - ${formatTime(
                      schedule.end_time
                    )}`
                  : "OFF"}

              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default AvailabilityCard;