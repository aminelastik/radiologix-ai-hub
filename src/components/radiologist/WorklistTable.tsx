import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ChevronDown } from "lucide-react";
import { Badge, Card, IconButton, Input } from "@/ui";

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

const aiVariant = (r: AIResult): "info" | "warning" | "danger" => {
  if (r === "Normal") return "info";
  if (r === "Urgent") return "danger";
  return "warning";
};

export const WorklistTable = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/studies")
      .then((res) => res.json())
      .then((data) => setStudies(data))
      .catch((err) => console.error("Error fetching studies:", err));
  }, []);

  const filteredStudies = studies.filter((s) =>
    s.patientName.toLowerCase().includes(search.toLowerCase()) ||
    (s.patientId && s.patientId.toLowerCase().includes(search.toLowerCase())) ||
    (s.date && s.date.includes(search))
  );

  return (
    <Card className="overflow-hidden border border-border/60">
      <div className="flex items-center justify-between p-5 border-b border-border/60">
        <h2 className="text-base font-semibold text-foreground">Recent Studies</h2>
        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search patient name, ID, or date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <button className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 h-9 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
            All Chest X-Rays
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
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
            {filteredStudies.map((s) => {
              const result = s.aiResult || "Normal";
              const studyName = s.study || `${s.modality || ""} ${s.bodyPart || ""}`.trim();

              return (
                <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-primary-deep text-xs">
                    {s.patientId || s.id}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {s.patientName}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="info">{studyName}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="neutral">{s.dateLabel || s.date}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={aiVariant(result)} dot>
                      {result}
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
              );
            })} 
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-5 border-t border-border/60">
        <p className="text-xs text-muted-foreground">
          Showing {filteredStudies.length} of {studies.length} studies
        </p>
      </div>
    </Card>
  );
};