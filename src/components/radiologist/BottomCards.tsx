import { Card, Badge } from "@/ui";

const queue = [
  { initials: "SJ", name: "Sarah Johnson", detail: "Chest PA · STD-10001", status: "Reviewing" as const },
  { initials: "MC", name: "Marcus Chen", detail: "Chest AP · STD-10002", status: "Pending" as const },
  { initials: "ER", name: "Elena Rodriguez", detail: "Chest PA · STD-10003", status: "Pending" as const },
];

const breakdown = [
  { label: "Critical / Urgent", value: 5, variant: "danger" as const },
  { label: "Requires Attention", value: 13, variant: "warning" as const },
  { label: "Normal / Routine", value: 225, variant: "info" as const },
];

export const BottomCards = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Review queue */}
    <Card className="p-5 border border-border/60">
      <h3 className="text-base font-semibold text-foreground">Review Queue</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">Studies currently being reviewed.</p>
      <ul className="mt-4 space-y-3">
        {queue.map((q) => (
          <li key={q.name} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-sm font-semibold text-primary-foreground">
              {q.initials}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{q.name}</p>
              <p className="text-xs text-muted-foreground truncate">{q.detail}</p>
            </div>
            <Badge variant={q.status === "Reviewing" ? "warning" : "neutral"} dot>
              {q.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>

    {/* Priority breakdown */}
    <Card className="p-5 bg-gradient-navy text-primary-foreground border-transparent overflow-hidden relative">
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary-glow/30 blur-3xl" />
      <h3 className="text-base font-semibold">Priority Breakdown</h3>
      <p className="mt-0.5 text-xs text-primary-foreground/70">Distribution across active studies.</p>
      <ul className="mt-5 space-y-3 relative">
        {breakdown.map((b) => (
          <li
            key={b.label}
            className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm"
          >
            <span className="flex items-center gap-3 text-sm">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  b.variant === "danger" ? "bg-danger" : b.variant === "warning" ? "bg-warning" : "bg-primary-glow"
                }`}
              />
              {b.label}
            </span>
            <span className="text-lg font-semibold">{b.value}</span>
          </li>
        ))}
      </ul>
    </Card>
  </div>
);
