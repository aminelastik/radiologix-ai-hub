import { Card } from "@/ui";

interface Props {
  studyId: string;
}

export const StudyInfo = ({ studyId }: Props) => (
  <Card className="p-4 border border-border/60 flex flex-wrap items-center gap-x-8 gap-y-2">
    <div>
      <p className="text-xs text-muted-foreground">Patient</p>
      <p className="text-sm font-semibold text-foreground">Marcus Chen · PT-48202</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Age / Gender</p>
      <p className="text-sm font-semibold text-foreground">67 / M</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Study</p>
      <p className="text-sm font-semibold text-foreground">Chest AP · {studyId}</p>
    </div>
    <div>
      <p className="text-xs text-muted-foreground">Date</p>
      <p className="text-sm font-semibold text-foreground">Apr 17, 2025 · 10:31</p>
    </div>
  </Card>
);
