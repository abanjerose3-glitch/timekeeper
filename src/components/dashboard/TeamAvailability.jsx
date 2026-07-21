import { useEffect, useState } from "react";
import { getTeamAvailability } from "../../services/attendance/attendanceService";

function TeamAvailability() {
  const [team, setTeam] = useState({
    working: [],
    onBreak: [],
    offline: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await getTeamAvailability();
        setTeam(data);
      } catch (error) {
        console.error("Error loading team availability:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <p className="text-slate-500">Loading team availability...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-6">
        👥 Team Availability
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Working */}
        <div>
          <h3 className="font-semibold text-green-600 mb-3">
            🟢 Working ({team.working.length})
          </h3>

          {team.working.length === 0 ? (
            <p className="text-sm text-slate-500">
              No employees working.
            </p>
          ) : (
            <ul className="space-y-2">
              {team.working.map((employee) => (
                <li
                  key={employee.id}
                  className="text-sm bg-green-50 px-3 py-2 rounded-lg"
                >
                  {employee.full_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* On Break */}
        <div>
          <h3 className="font-semibold text-yellow-600 mb-3">
            🟡 On Break ({team.onBreak.length})
          </h3>

          {team.onBreak.length === 0 ? (
            <p className="text-sm text-slate-500">
              No employees on break.
            </p>
          ) : (
            <ul className="space-y-2">
              {team.onBreak.map((employee) => (
                <li
                  key={employee.id}
                  className="text-sm bg-yellow-50 px-3 py-2 rounded-lg"
                >
                  {employee.full_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Offline */}
        <div>
          <h3 className="font-semibold text-slate-600 mb-3">
            ⚫ Offline ({team.offline.length})
          </h3>

          {team.offline.length === 0 ? (
            <p className="text-sm text-slate-500">
              No employees offline.
            </p>
          ) : (
            <ul className="space-y-2">
              {team.offline.map((employee) => (
                <li
                  key={employee.id}
                  className="text-sm bg-slate-100 px-3 py-2 rounded-lg"
                >
                  {employee.full_name}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default TeamAvailability;