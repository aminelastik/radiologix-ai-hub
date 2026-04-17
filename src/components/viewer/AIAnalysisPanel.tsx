import { Link } from "react-router-dom";
import { FileText, RotateCw, ShieldCheck } from "lucide-react";
import { Card, Button, Badge } from "@/ui";
import { PathologyBars } from "./PathologyBars";

interface Props {
  studyId: string;
}

export const AIAnalysisPanel = ({ studyId }: Props) => (
  <Card className="p-5 border border-border/60 space-y-5">
    <div className="flex items-center justify-between">
      <h3 className="text-base font-semibold text-foreground">AI Analysis</h3>
      <Badge variant="success" dot>Ready</Badge>
    </div>

    <PathologyBars />

    <div className="rounded-xl bg-secondary/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">Confidence</p>
        <p className="text-sm font-semibold text-foreground">High · 92%</p>
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-card overflow-hidden">
        <div className="h-full bg-gradient-primary rounded-full" style={{ width: "92%" }} />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">σ = 0.07 — model uncertainty within accepted range.</p>
    </div>

    <div className="flex flex-col gap-2">
      <Link to={`/radiologist/report/${studyId}`}>
        <Button variant="gradient" className="w-full">
          <FileText className="h-4 w-4" /> Generate Report
        </Button>
      </Link>
      <Button variant="outline" className="w-full">
        <RotateCw className="h-4 w-4" /> Re-analyze
      </Button>
      <Button variant="primary" className="w-full">
        <ShieldCheck className="h-4 w-4" /> Approve & Sign
      </Button>
    </div>
  </Card>
);
