import { Badge } from "@/ui";
import { pathologies } from "@/lib/mockData";

export const PathologyBars = () => (
  <ul className="space-y-3">
    {pathologies.map((p) => (
      <li key={p.name}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">{p.name}</span>
          <span className="flex items-center gap-2">
            {p.detected && <Badge variant="warning">Detected</Badge>}
            <span className="font-mono text-muted-foreground">{(p.value * 100).toFixed(0)}%</span>
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              p.value > 0.5 ? "bg-warning" : p.value > 0.25 ? "bg-primary-glow" : "bg-muted-foreground/40"
            }`}
            style={{ width: `${p.value * 100}%` }}
          />
        </div>
      </li>
    ))}
  </ul>
);
