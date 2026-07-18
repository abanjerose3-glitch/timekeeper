import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

function StatsCard({
  title,
  value,
  icon,
  to,
}) {
  const CardContent = (
    <div className="group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 break-words text-3xl font-bold text-slate-900 lg:text-4xl">
            {value}
          </h2>
        </div>

        <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
          {icon}
        </div>
      </div>

      {to && (
        <div className="mt-8 flex items-center text-sm font-medium text-blue-600">
          View Details

          <ChevronRight
            size={18}
            className="ml-1 transition-transform group-hover:translate-x-1"
          />
        </div>
      )}
    </div>
  );

  if (!to) {
    return CardContent;
  }

  return (
    <Link to={to}>
      {CardContent}
    </Link>
  );
}

export default StatsCard;