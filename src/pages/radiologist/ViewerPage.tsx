import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { OHIFViewerPlaceholder } from "@/components/viewer/OHIFViewerPlaceholder";
import { ThumbnailStrip } from "@/components/viewer/ThumbnailStrip";
import { AIAnalysisPanel } from "@/components/viewer/AIAnalysisPanel";
import { Card } from "@/ui";

type AIResult = "Normal" | "Urgent" | "Abnormal";

type Study = {
  id: string;
  patientId?: string;
  patientName: string;
  study?: string;
  modality?: string;
  bodyPart?: string;
  date?: string;
  dateLabel?: string;
  aiResult?: AIResult;
};

const ViewerPage = () => {
  const { studyId = "" } = useParams();

  const [study, setStudy] = useState<Study | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`http://localhost:8000/studies/${studyId}`)
      .then((res) => res.json())
      .then((data: Study) => {
        if (!mounted) return;
        if (data.error) {
          setStudy(null);
        } else {
          setStudy(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching study:", err);
        if (mounted) setStudy(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [studyId]);

  const selected = study;

  const studyLabel = (s: Study) => s.study || `${s.modality || ""} ${s.bodyPart || ""}`.trim();
  const studyDate = (s: Study) => s.dateLabel || s.date || "";

  return (
    <div className="min-h-screen">
      <Topbar
        title="Study Viewer"
        subtitle="Inspect imagery and AI findings before generating a report."
      />

      <div className="p-6 md:p-10 space-y-5">
        <Link
          to="/radiologist/worklist"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Worklist
        </Link>

        {loading ? (
          <Card className="p-4 border border-border/60">
            <p className="text-sm text-muted-foreground">Loading study…</p>
          </Card>
        ) : !selected ? (
          <Card className="p-4 border border-border/60">
            <p className="text-sm text-muted-foreground">Study not found</p>
          </Card>
        ) : (
          <Card className="p-4 border border-border/60 flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="text-sm font-semibold text-foreground">{selected.patientName} · {selected.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Study</p>
              <p className="text-sm font-semibold text-foreground">{studyLabel(selected)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-semibold text-foreground">{studyDate(selected)}</p>
            </div>
            <Link
              to={`/radiologist/patient/${selected.patientId || selected.id}`}
              className="text-sm text-primary-glow hover:underline"
            >
              View Patient History
            </Link>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
          <div className="lg:col-span-7 space-y-4">
            <OHIFViewerPlaceholder studyId={studyId} />
            <ThumbnailStrip />
          </div>
          <div className="lg:col-span-3">
            <AIAnalysisPanel studyId={studyId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
