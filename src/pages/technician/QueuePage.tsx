import { useState } from "react";
import { RefreshCw, Trash2, RotateCw, Wifi } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Badge, Button } from "@/ui";
import { queueItems } from "@/lib/mockData";

const stats = [
  { label: "Pending", value: 4, variant: "neutral" as const },
  { label: "Processing", value: 2, variant: "info" as const },
  { label: "Completed", value: 18, variant: "success" as const },
  { label: "Failed", value: 1, variant: "danger" as const },
];

const filters = ["All", "Pending", "Processing", "Completed", "Failed"] as const;

const QueuePage = () => {
  const [filter, setFilter] = useState<typeof filters[number]>("All");
  const visible = filter === "All" ? queueItems : queueItems.filter((q) => q.status === filter);

  return (
    <div className="min-h-screen">
      <Topbar title="Queue" subtitle="Track DICOM uploads through the AI pipeline." />
      <div className="p-6 md:p-10 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 border border-border/60">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-3xl font-semibold">{s.value}</p>
                <Badge variant={s.variant} dot>{s.label}</Badge>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-5 border border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1 bg-secondary/60 rounded-xl p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 h-8 rounded-lg text-xs font-medium transition-colors ${
                  filter === f ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-success">
              <Wifi className="h-3.5 w-3.5" /> Live
            </span>
            <Button variant="outline" size="sm"><RotateCw className="h-3.5 w-3.5" /> Retry failed</Button>
            <Button variant="outline" size="sm"><Trash2 className="h-3.5 w-3.5" /> Clear completed</Button>
            <Button variant="primary" size="sm"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
          </div>
        </Card>

        <Card className="overflow-hidden border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Job</th>
                <th className="px-5 py-3 font-medium">Patient ID</th>
                <th className="px-5 py-3 font-medium">Study</th>
                <th className="px-5 py-3 font-medium">Uploaded</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {visible.map((q) => (
                <tr key={q.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-primary-deep">{q.id}</td>
                  <td className="px-5 py-4 font-mono text-xs">{q.patientId}</td>
                  <td className="px-5 py-4">{q.study}</td>
                  <td className="px-5 py-4 text-muted-foreground">{q.uploadedAt}</td>
                  <td className="px-5 py-4">
                    <Badge
                      variant={
                        q.status === "Completed" ? "success" :
                        q.status === "Processing" ? "info" :
                        q.status === "Failed" ? "danger" : "neutral"
                      }
                      dot
                    >
                      {q.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default QueuePage;
