import { Move, ZoomIn, Sun, RotateCcw, Ruler } from "lucide-react";
import { IconButton } from "@/ui";

const tools = [
  { icon: Move, label: "Pan" },
  { icon: ZoomIn, label: "Zoom" },
  { icon: Sun, label: "Window/Level" },
  { icon: RotateCcw, label: "Reset" },
  { icon: Ruler, label: "Measure" },
];

interface Props {
  studyId: string;
}

export const OHIFViewerPlaceholder = ({ studyId }: Props) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-1 rounded-2xl bg-card border border-border/60 p-1.5 w-fit">
      {tools.map(({ icon: Icon, label }) => (
        <IconButton key={label} aria-label={label} title={label} variant="ghost" size="sm">
          <Icon className="h-4 w-4" />
        </IconButton>
      ))}
    </div>
    <div className="relative aspect-[4/3] w-full rounded-2xl bg-foreground overflow-hidden border border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(213_30%_30%)_0%,hsl(215_47%_8%)_70%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
        <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/50">OHIF Integration Placeholder</p>
        <p className="mt-2 font-display text-3xl text-primary-foreground/90">{studyId}</p>
        <p className="mt-3 text-xs text-primary-foreground/40">Embed point for the OHIF viewer</p>
      </div>
      {/* Corner overlays */}
      <div className="absolute top-3 left-3 text-[10px] font-mono text-primary-foreground/60">PT-48202 · M · 67y</div>
      <div className="absolute top-3 right-3 text-[10px] font-mono text-primary-foreground/60">JANUS Health · MGH</div>
      <div className="absolute bottom-3 left-3 text-[10px] font-mono text-primary-foreground/60">AP · ERECT</div>
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-primary-foreground/60">WW 350 · WL 50 · 100%</div>
    </div>
  </div>
);
