import { Link } from "react-router-dom";
import { Eye, ChevronDown } from "lucide-react";
import { Badge, Card, IconButton } from "@/ui";
import { studies, AIResult } from "@/lib/mockData";

const aiVariant = (r: AIResult): "info" | "warning" | "danger" => {
  if (r === "Normal") return "info";
  if (r === "Urgent") return "danger";
  return "warning";
};

export const WorklistTable = () => (
  <Card className="overflow-hidden border border-border/60">
    <div className="flex items-center justify-between p-5 border-b border-border/60">
      <h2 className="text-base font-semibold text-foreground">Recent Studies</h2>
      <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 h-9 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
        All Chest X-Rays
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50">
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            <th className="px-5 py-3 font-medium">Patient ID</th>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Study</th>
            <th className="px-5 py-3 font-medium">Date</th>
            <th className="px-5 py-3 font-medium">AI Result</th>
            <th className="px-5 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {studies.map((s) => (
            <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
              <td className="px-5 py-4 font-mono text-primary-deep text-xs">{s.patientId}</td>
              <td className="px-5 py-4 font-medium text-foreground">{s.patientName}</td>
              <td className="px-5 py-4">
                <Badge variant="info">{s.study}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge variant={s.dateLabel === "Today" ? "primary" : "neutral"}>{s.dateLabel}</Badge>
              </td>
              <td className="px-5 py-4">
                <Badge variant={aiVariant(s.aiResult)} dot>
                  {s.aiResult}
                </Badge>
              </td>
              <td className="px-5 py-4 text-right">
                <Link to={`/radiologist/viewer/${s.id}`}>
                  <IconButton aria-label={`View study ${s.id}`} variant="solid" size="sm" title="View Study">
                    <Eye className="h-4 w-4" />
                  </IconButton>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex items-center justify-between p-5 border-t border-border/60">
      <p className="text-xs text-muted-foreground">Showing 1–5 of 243</p>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((p) => (
          <button
            key={p}
            className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
              p === 1
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {p}
          </button>
        ))}
        <span className="px-1 text-muted-foreground">…</span>
        <button className="h-8 w-8 rounded-lg text-xs font-medium text-muted-foreground hover:bg-secondary">49</button>
      </div>
    </div>
  </Card>
);
