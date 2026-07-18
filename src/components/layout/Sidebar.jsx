import {
    LayoutDashboard,
    Clock3,
    Users,
    CalendarDays,
    CalendarClock,
    FileBarChart2,
    Settings,
    LogOut,
  } from "lucide-react";
  
  import { NavLink, useNavigate } from "react-router-dom";
  
  import { useAuth } from "../../context/AuthContext";
  import { signOut } from "../../services/authService";
  
  import fscLogo from "../../assets/FSC-logo.jpg";
  
  function Sidebar() {
    const navigate = useNavigate();
    const { role } = useAuth();
  
    const menus = [
      {
        name: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
      {
        name: "Time Clock",
        path: "/time-clock",
        icon: Clock3,
      },
      {
        name: "Attendance",
        path: "/attendance",
        icon: CalendarDays,
      },
      {
        name: "Availability",
        path: "/availability",
        icon: CalendarClock,
      },
  
      ...(role === "Admin"
        ? [
            {
              name: "Employees",
              path: "/employees",
              icon: Users,
            },
            {
              name: "Reports",
              path: "/reports",
              icon: FileBarChart2,
            },
          ]
        : []),
  
      {
        name: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ];
  
    async function handleLogout() {
      await signOut();
      navigate("/login", { replace: true });
    }
  
    return (
      <aside className="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
        {/* Company Branding */}
<div className="border-b border-slate-200 px-6 py-6">
  <div className="flex flex-col items-center">

    <img
      src={fscLogo}
      alt="Food Systems Collective"
      className="h-20 w-auto object-contain"
    />

    <h1 className="mt-4 text-lg font-semibold text-slate-900 text-center leading-tight">
      Food Systems Collective
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      {role === "Admin"
        ? "Admin Portal"
        : "Employee Portal"}
    </p>

  </div>
</div>
  
        {/* Menu */}
        <nav className="flex-1 space-y-2 p-5">
          {menus.map((menu) => {
            const Icon = menu.icon;
  
            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={20} />
                <span>{menu.name}</span>
              </NavLink>
            );
          })}
        </nav>
  
        {/* Logout */}
        <div className="border-t border-slate-200 p-5">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-600 transition hover:bg-slate-100"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    );
  }
  
  export default Sidebar;