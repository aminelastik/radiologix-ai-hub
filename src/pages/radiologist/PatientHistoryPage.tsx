import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, FileDown, Eye } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Badge, IconButton } from "@/ui";

const PatientHistoryPage = () => {
  const { patientId = "" } = useParams();
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:8000/patients/${patientId}/studies`)
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => console.error("Error fetching patient studies:", err))
      .finally(() => setLoading(false));
  }, [patientId]);

  const timeline = studies.map((s) => ({
    date: s.date || "Unknown",
    study: s.study || `${s.modality || ""} ${s.bodyPart || ""}`.trim() || "Study",
    id: s.id,
    result: s.aiResult || "Normal",
    variant: (s.aiResult === "Normal" ? "info" : s.aiResult === "Urgent" ? "danger" : "warning") as const,
  }));

  // Get patient info from first study
  const patientInfo = studies.length > 0 ? studies[0] : null;
  const patientName = patientInfo?.patientName || "Unknown Patient";
  const patientInitials = patientName.split(' ').map(n => n[0]).join('').toUpperCase() || "UP";

  if (!patientId) {
    return (
      <div className="min-h-screen">
        <Topbar title="Patient History" subtitle="Longitudinal view of imaging and reports." />
        <div className="p-6 md:p-10">
          <Card className="p-4 border border-border/60">
            <p className="text-sm text-muted-foreground">No patient selected.</p>
          </Card>
        </div>
      </div>
    );
  }

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

        {loading ? (
          <Card className="p-4 border border-border/60">
            <p className="text-sm text-muted-foreground">Loading patient studies…</p>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <Card className="p-6 border border-border/60 lg:col-span-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold flex items-center justify-center text-lg">
                    {patientInitials}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{patientName}</h2>
                    <p className="text-xs font-mono text-primary-deep">{patientId}</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div><dt className="text-xs text-muted-foreground">DOB</dt><dd>Not available</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Age / Gender</dt><dd>Not available</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Phone</dt><dd>Not available</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Insurance</dt><dd>Not available</dd></div>
                </dl>
              </Card>

              <Card className="p-6 border border-border/60 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Studies", value: studies.length.toString() },
                  { label: "Last Visit", value: studies.length > 0 ? (studies[0].date || "Unknown") : "No studies" },
                  { label: "Primary MD", value: "Not available" },
                  { label: "Open Findings", value: "0" },
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
                {timeline.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No studies found for this patient.</p>
                ) : (
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
                )}
              </Card>

              <Card className="p-6 border border-border/60 space-y-4">
                <h3 className="text-base font-semibold">Reports Archive</h3>
                <p className="text-sm text-muted-foreground">No reports yet.</p>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientHistoryPage;
