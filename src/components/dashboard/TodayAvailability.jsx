import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";

import {
  getTodayAvailability,
  getMyTodayAvailability,
} from "../../services/todayAvailabilityService";

function getBadge(status) {
  switch (status) {
    case "Available":
      return "bg-green-100 text-green-700";

    case "Off":
      return "bg-slate-100 text-slate-700";

    case "Leave":
      return "bg-red-100 text-red-700";

    case "Holiday":
      return "bg-blue-100 text-blue-700";

    case "Training":
      return "bg-yellow-100 text-yellow-700";

    case "Work From Home":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function TodayAvailability() {
  const { role } = useAuth();

  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    load();
  }, [role]);

  async function load() {
    try {
      const data =
        role === "Admin"
          ? await getTodayAvailability()
          : await getMyTodayAvailability();

      setAvailability(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold">
        {role === "Admin"
          ? "Today's Availability"
          : "My Availability Today"}
      </h2>

      {availability.length === 0 ? (
        <p className="text-slate-500">
          No availability today.
        </p>
      ) : (
        <div className="divide-y">
          {availability.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">
                  {role === "Admin"
                    ? item.employees?.full_name
                    : "You"}
                </p>

                <p className="text-sm text-slate-500">
                  {item.start_time || "--:--"} -{" "}
                  {item.end_time || "--:--"}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getBadge(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodayAvailability;