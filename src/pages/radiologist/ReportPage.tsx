import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Save, ShieldCheck, Check } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Button, Card } from "@/ui";

const ReportPage = () => {
  const { studyId = "STD-00000" } = useParams();
  const [history, setHistory] = useState("67 y/o male, productive cough and fever for 4 days.");
  const [findings, setFindings] = useState(
    "Patchy airspace opacities in the right lower lobe consistent with consolidation. Small right pleural effusion. No pneumothorax. Cardiomediastinal silhouette within normal limits.",
  );
  const [impression, setImpression] = useState(
    "1. Right lower lobe pneumonia.\n2. Small right pleural effusion.",
  );
  const [saved, setSaved] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const onSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen">
      <Topbar
        title="Report Editor"
        subtitle="Refine the AI-assisted draft, then finalize and sign."
      />
      <div className="p-6 md:p-10 space-y-5">
        <Link
          to={`/radiologist/viewer/${studyId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Viewer
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-6 border border-border/60 space-y-5">
            <header className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Study</p>
                <h2 className="text-lg font-semibold">{studyId} · Marcus Chen</h2>
              </div>
              {saved && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 text-xs font-medium animate-fade-in">
                  <Check className="h-3.5 w-3.5" /> Draft saved
                </span>
              )}
            </header>

            {[
              { label: "Clinical history", value: history, set: setHistory, rows: 3 },
              { label: "Findings", value: findings, set: setFindings, rows: 6 },
              { label: "Impression", value: impression, set: setImpression, rows: 4 },
            ].map((f) => (
              <div key={f.label} className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <textarea
                  rows={f.rows}
                  disabled={finalized}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full rounded-xl border border-input bg-card p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-70"
                />
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-border/60">
              <Button variant="outline" onClick={onSave} disabled={finalized}>
                <Save className="h-4 w-4" /> Save Draft
              </Button>
              <Button variant="gradient" onClick={() => setFinalized(true)} disabled={finalized}>
                <ShieldCheck className="h-4 w-4" /> {finalized ? "Finalized" : "Finalize"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border border-border/60 space-y-3 h-fit">
            <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
            <p className="text-xs text-muted-foreground">Confidence 92% · σ 0.07</p>
            <ul className="text-sm text-foreground space-y-2 mt-2">
              <li className="rounded-lg bg-warning/10 text-warning px-3 py-2">Pneumonia · 82%</li>
              <li className="rounded-lg bg-warning/10 text-warning px-3 py-2">Pleural Effusion · 61%</li>
              <li className="rounded-lg bg-secondary/60 text-foreground px-3 py-2">Cardiomegaly · 34%</li>
            </ul>
            <p className="text-[11px] text-muted-foreground pt-2">
              AI suggestions are advisory and require radiologist confirmation.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
