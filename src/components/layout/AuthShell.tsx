import { Outlet } from "react-router-dom";

export const AuthShell = () => (
  <div className="min-h-screen w-full bg-[hsl(var(--login-bg))]">
    <Outlet />
  </div>
);
