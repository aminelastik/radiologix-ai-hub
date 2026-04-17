import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { StudyInfo } from "@/components/viewer/StudyInfo";
import { OHIFViewerPlaceholder } from "@/components/viewer/OHIFViewerPlaceholder";
import { ThumbnailStrip } from "@/components/viewer/ThumbnailStrip";
import { AIAnalysisPanel } from "@/components/viewer/AIAnalysisPanel";

const ViewerPage = () => {
  const { studyId = "STD-00000" } = useParams();
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
        <StudyInfo studyId={studyId} />
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
