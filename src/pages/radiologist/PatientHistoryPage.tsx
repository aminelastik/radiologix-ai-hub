import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileDown, Eye } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Badge, IconButton } from "@/ui";

const timeline = [
  { date: "Apr 17, 2025", study: "Chest AP", id: "STD-10002", result: "Pneumonia", variant: "warning" as const },
  { date: "Jan 04, 2025", study: "Chest PA", id: "STD-09877", result: "Normal", variant: "info" as const },
  { date: "Aug 22, 2024", study: "Chest PA", id: "STD-09102", result: "Effusion", variant: "warning" as const },
  { date: "Feb 11, 2024", study: "Chest PA", id: "STD-08410", result: "Normal", variant: "info" as const },
];

const PatientHistoryPage = () => {
  const { patientId = "PT-00000" } = useParams();
  return (
    <div className="min-h-screen">
      <Topbar title="Patient History" subtitle="Longitudinal view of imaging and reports." />
      <div className="p-6 md:p-10 space-y-5">
        <Link
          to="/radiologist/worklist"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Worklist
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="p-6 border border-border/60 lg:col-span-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold flex items-center justify-center text-lg">
                MC
              </div>
              <div>
                <h2 className="text-lg font-semibold">Marcus Chen</h2>
                <p className="text-xs font-mono text-primary-deep">{patientId}</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-xs text-muted-foreground">DOB</dt><dd>Mar 12, 1958</dd></div>
              <div><dt className="text-xs text-muted-foreground">Age / Gender</dt><dd>67 / M</dd></div>
              <div><dt className="text-xs text-muted-foreground">Phone</dt><dd>+1 (415) 555-0142</dd></div>
              <div><dt className="text-xs text-muted-foreground">Insurance</dt><dd>BlueShield · 88234</dd></div>
            </dl>
          </Card>

          <Card className="p-6 border border-border/60 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Studies", value: "14" },
              { label: "Last Visit", value: "Today" },
              { label: "Primary MD", value: "Dr. R. Khan" },
              { label: "Open Findings", value: "2" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{s.value}</p>
              </div>
            ))}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Card className="lg:col-span-2 p-6 border border-border/60">
            <h3 className="text-base font-semibold mb-4">Studies Timeline</h3>
            <ol className="relative border-l border-border ml-3 space-y-6">
              {timeline.map((t) => (
                <li key={t.id} className="ml-6">
                  <span className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full bg-primary-glow border-2 border-card" />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{t.study} · <span className="font-mono text-primary-deep">{t.id}</span></p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={t.variant} dot>{t.result}</Badge>
                      <Link to={`/radiologist/viewer/${t.id}`}>
                        <IconButton aria-label="Open" variant="solid" size="sm"><Eye className="h-4 w-4" /></IconButton>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card className="p-6 border border-border/60 space-y-4">
            <h3 className="text-base font-semibold">Reports Archive</h3>
            <ul className="space-y-2">
              {timeline.map((t) => (
                <li key={t.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{t.study}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                  <button className="inline-flex items-center gap-1.5 text-xs text-primary-deep hover:underline">
                    <FileDown className="h-3.5 w-3.5" /> PDF
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryPage;
