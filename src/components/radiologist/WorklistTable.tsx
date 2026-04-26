import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ChevronDown } from "lucide-react";
import { Badge, Card, IconButton, Input, Button, Select } from "@/ui";

type AIResult = "Normal" | "Urgent" | "Abnormal";

type Study = {
  id: string;
  patientId?: string;
  patientName: string;
  study?: string;
  studyDescription?: string;
  modality?: string;
  viewPosition?: string;
  bodyPart?: string;
  date?: string;
  dateLabel?: string;
  instanceCount?: number;
  seriesCount?: number;
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
  const [modalityFilter, setModalityFilter] = useState<string>("");

  const fetchStudies = async () => {
    try {
      const res = await fetch("http://localhost:8000/studies");
      const data = await res.json();
      setStudies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching studies:", err);
    }
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const filteredStudies = studies.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.patientName.toLowerCase().includes(q) ||
      (!!s.patientId && s.patientId.toLowerCase().includes(q)) ||
      (!!s.study && s.study.toLowerCase().includes(q)) ||
      (!!s.studyDescription && s.studyDescription.toLowerCase().includes(q)) ||
      (!!s.modality && s.modality.toLowerCase().includes(q)) ||
      (!!s.viewPosition && s.viewPosition.toLowerCase().includes(q)) ||
      (!!s.date && s.date.includes(search))
    );
  });

  const filteredAndFilteredByModality = modalityFilter && modalityFilter !== "ALL"
    ? filteredStudies.filter((s) => (s.modality || "").toUpperCase() === modalityFilter)
    : filteredStudies;

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
          <Button variant="secondary" size="sm" onClick={fetchStudies}>
            Refresh
          </Button>
          <Select value={modalityFilter} onChange={(e) => setModalityFilter(e.target.value)}>
            <option value="">All Modalities</option>
            <option value="ALL">All Modalities</option>
            <option value="CR">CR</option>
            <option value="DX">DX</option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Patient ID</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Study Description</th>
              <th className="px-5 py-3 font-medium">Modality</th>
              <th className="px-5 py-3 font-medium">View</th>
              <th className="px-5 py-3 font-medium">Instances</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">AI Result</th>
              <th className="px-5 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/60">
            {filteredAndFilteredByModality.map((s) => {
              const result = s.aiResult || "Normal";
              const studyName = s.studyDescription || s.study || `${s.modality || ""} ${s.bodyPart || ""}`.trim();

              return (
                <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-primary-deep text-xs">{s.patientId || s.id}</td>
                  <td className="px-5 py-4 font-medium text-foreground">{s.patientName}</td>
                  <td className="px-5 py-4">
                    <Badge variant="info">{studyName}</Badge>
                  </td>
                  <td className="px-5 py-4">{s.modality || "—"}</td>
                  <td className="px-5 py-4">{s.viewPosition || "—"}</td>
                  <td className="px-5 py-4">{typeof s.instanceCount === "number" ? s.instanceCount : "—"}</td>
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
          Showing {filteredAndFilteredByModality.length} of {studies.length} studies
        </p>
      </div>
    </Card>
  );
};