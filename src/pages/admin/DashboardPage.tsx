import { Topbar } from "@/components/layout/Topbar";
import { Card, Badge } from "@/ui";
import { ArrowUpRight, Activity, Database, Cpu, ShieldCheck } from "lucide-react";

const stats = [
  { label: "Studies Today", value: "342", delta: "+12%" },
  { label: "Reviewed", value: "287", delta: "+9%" },
  { label: "Pending", value: "55", delta: "-4%" },
  { label: "AI Accuracy", value: "94.6%", delta: "+0.4%" },
];

const distribution = [
  { name: "Pneumonia", value: 32, color: "bg-warning" },
  { name: "Effusion", value: 18, color: "bg-primary-glow" },
  { name: "Cardiomegaly", value: 14, color: "bg-info" },
  { name: "Nodule", value: 9, color: "bg-danger" },
  { name: "No Finding", value: 27, color: "bg-success" },
];

const services = [
  { name: "API Server", status: "Healthy", icon: Activity, ok: true },
  { name: "PostgreSQL", status: "Healthy", icon: Database, ok: true },
  { name: "Orthanc PACS", status: "Healthy", icon: Database, ok: true },
  { name: "Keycloak", status: "Degraded", icon: ShieldCheck, ok: false },
  { name: "AI Model", status: "Healthy", icon: Cpu, ok: true },
];

const DashboardPage = () => (
  <div className="min-h-screen">
    <Topbar title="Admin Dashboard" subtitle="System-wide overview of activity and health." />
    <div className="p-6 md:p-10 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 border border-border/60">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <p className="text-3xl font-semibold">{s.value}</p>
              <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-success">
                <ArrowUpRight className="h-3 w-3" /> {s.delta}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 border border-border/60">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">Studies over time</h3>
            <Badge variant="info">Last 7 days</Badge>
          </div>
          <div className="mt-6 h-56 flex items-end gap-2">
            {[40, 65, 52, 78, 60, 90, 72].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-primary transition-all hover:opacity-90"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">D{i + 1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-border/60">
          <h3 className="text-base font-semibold">Pathology Distribution</h3>
          <ul className="mt-4 space-y-3">
            {distribution.map((d) => (
              <li key={d.name}>
                <div className="flex items-center justify-between text-xs">
                  <span>{d.name}</span>
                  <span className="font-mono text-muted-foreground">{d.value}%</span>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${d.color}`} style={{ width: `${d.value * 2}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-6 border border-border/60">
          <h3 className="text-base font-semibold">Recent Activity</h3>
          <ul className="mt-4 divide-y divide-border/60">
            {[
              { user: "Dr. Smith", action: "signed report STD-10002", time: "2 min ago" },
              { user: "Lucas B.", action: "uploaded 12 files for PT-48205", time: "8 min ago" },
              { user: "Dr. Chen", action: "re-analyzed STD-09877", time: "21 min ago" },
              { user: "Admin", action: "added user Priya R.", time: "1 h ago" },
            ].map((a, i) => (
              <li key={i} className="py-3 flex items-center justify-between text-sm">
                <span><strong className="text-foreground">{a.user}</strong> <span className="text-muted-foreground">{a.action}</span></span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border border-border/60">
          <h3 className="text-base font-semibold">System Health</h3>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.name} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                <span className="flex items-center gap-2 text-sm"><s.icon className="h-4 w-4 text-muted-foreground" /> {s.name}</span>
                <Badge variant={s.ok ? "success" : "warning"} dot>{s.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  </div>
);

export default DashboardPage;
