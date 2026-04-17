import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid, Users, Upload, ListChecks, Gauge, Settings, LogOut, UserRound, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutGrid;
}

const items: NavItem[] = [
  { label: "Worklist", to: "/radiologist/worklist", icon: LayoutGrid },
  { label: "Patients", to: "/radiologist/patient/PT-48201", icon: UserRound },
  { label: "Upload", to: "/technician/upload", icon: Upload },
  { label: "Queue", to: "/technician/queue", icon: ListChecks },
  { label: "Dashboard", to: "/admin/dashboard", icon: Gauge },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex md:flex-col w-20 shrink-0 bg-sidebar text-sidebar-foreground py-5 items-center gap-1 sticky top-0 h-screen">
      {/* Logo */}
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <Activity className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
      </div>
      <nav className="flex flex-1 flex-col gap-1 w-full items-center" aria-label="Main">
        {items.map(({ label, to, icon: Icon }) => {
          const active = pathname.startsWith(to.split("/").slice(0, 3).join("/"));
          return (
            <NavLink
              key={to}
              to={to}
              aria-label={label}
              title={label}
              className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                active
                  ? "bg-sidebar-accent text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-primary-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {active && <span className="absolute left-0 h-6 w-1 rounded-r-full bg-primary-glow" />}
            </NavLink>
          );
        })}
      </nav>
      <NavLink
        to="/login"
        aria-label="Logout"
        title="Logout"
        className="flex h-12 w-12 items-center justify-center rounded-xl text-sidebar-foreground/70 hover:bg-danger/20 hover:text-danger-foreground transition-colors"
      >
        <LogOut className="h-5 w-5" />
      </NavLink>
    </aside>
  );
};
