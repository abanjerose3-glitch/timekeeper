import { useAuth } from "../../context/AuthContext";

function Header() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {today}
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-slate-900">
          {user?.email ?? "Guest"}
        </p>

        <p className="text-xs text-slate-500">
          Logged In
        </p>
      </div>
    </header>
  );
}

export default Header;