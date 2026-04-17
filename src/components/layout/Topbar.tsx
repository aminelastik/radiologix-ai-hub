import { Bell, Search } from "lucide-react";
import { IconButton } from "@/ui";

interface TopbarProps {
  title?: string;
  subtitle?: string;
}

export const Topbar = ({ title = "Welcome back, Dr. Smith!", subtitle = "Review your chest X-ray queue and AI analysis results" }: TopbarProps) => (
  <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 md:px-10 pt-6 md:pt-8">
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search patients..."
          aria-label="Search patients"
          className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <IconButton aria-label="Notifications" variant="solid" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-danger text-[10px] font-semibold text-danger-foreground flex items-center justify-center">3</span>
      </IconButton>
      <button className="hidden sm:inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-primary px-4 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-95 transition-opacity">
        <span className="h-2 w-2 rounded-full bg-warning" />
        AI Insights
      </button>
    </div>
  </header>
);
