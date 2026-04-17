import { Card } from "@/ui";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  highlight?: boolean;
}

const stats: Stat[] = [
  { label: "Total Patients", value: "243", delta: "+12.4%", trend: "up", highlight: true },
  { label: "Pending Review", value: "18", delta: "-3.1%", trend: "down" },
  { label: "AI Detected", value: "56", delta: "+8.7%", trend: "up" },
  { label: "Completed Today", value: "34", delta: "+5.2%", trend: "up" },
];

export const StatsCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((s) => (
      <Card
        key={s.label}
        className={cn(
          "p-5 border border-border/60",
          s.highlight && "bg-gradient-primary text-primary-foreground border-transparent shadow-elegant",
        )}
      >
        <p className={cn("text-xs font-medium", s.highlight ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {s.label}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              s.highlight
                ? "bg-white/20 text-primary-foreground"
                : s.trend === "up"
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger",
            )}
          >
            {s.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {s.delta}
          </span>
        </div>
      </Card>
    ))}
  </div>
);
