import { useState } from "react";
import { Upload, FileCheck2, X, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Input, Select, Button, Badge } from "@/ui";

const initialFiles = [
  { name: "IM_0001.dcm", size: "4.2 MB", progress: 100, status: "done" as const },
  { name: "IM_0002.dcm", size: "3.8 MB", progress: 64, status: "uploading" as const },
  { name: "IM_0003.dcm", size: "4.1 MB", progress: 0, status: "queued" as const },
];

const UploadPage = () => {
  const [files, setFiles] = useState(initialFiles);
  const [valid, setValid] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  return (
    <div className="min-h-screen">
      <Topbar title="Upload Studies" subtitle="Send DICOM files to PACS for AI analysis." />
      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6 border border-border/60">
            <label className="block rounded-2xl border-2 border-dashed border-primary-glow/50 bg-primary-glow/5 p-10 text-center cursor-pointer hover:bg-primary-glow/10 transition-colors">
              <Upload className="mx-auto h-10 w-10 text-primary-glow" />
              <p className="mt-3 font-medium text-foreground">Drop DICOM files here</p>
              <p className="text-xs text-muted-foreground">or click to browse · .dcm files only</p>
              <input
                type="file"
                multiple
                accept=".dcm"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setSelectedFile(f);
                  if (f) {
                    setFiles((arr) => [{ name: f.name, size: `${(f.size / 1024 / 1024).toFixed(1)} MB`, progress: 0, status: "queued" }, ...arr]);
                    setValid(true);
                  }
                }}
              />
            </label>
          </Card>

          <Card className="p-6 border border-border/60">
            <h3 className="text-sm font-semibold mb-3">Files</h3>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={f.name} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                  <FileCheck2 className="h-5 w-5 text-primary-deep" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-sm">
                      <p className="font-medium truncate">{f.name}</p>
                      <span className="text-xs text-muted-foreground">{f.size}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-card overflow-hidden">
                      <div
                        className={`h-full rounded-full ${f.status === "done" ? "bg-success" : "bg-primary-glow"}`}
                        style={{ width: `${f.progress}%` }}
                      />
                    </div>
                  </div>
                  <Badge variant={f.status === "done" ? "success" : f.status === "uploading" ? "info" : "neutral"}>
                    {f.status}
                  </Badge>
                  <button
                    aria-label="Remove"
                    onClick={() => setFiles((arr) => arr.filter((_, idx) => idx !== i))}
                    className="text-muted-foreground hover:text-danger transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-danger">Validation</p>
                <p className="text-muted-foreground mt-0.5">No critical errors. Verify patient ID matches PACS records.</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-semibold">Patient Information</h3>
            <Input label="Patient ID" placeholder="PT-00000" onChange={() => setValid(true)} />
            <Input label="Patient Name" placeholder="Full name" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="DOB" type="date" />
              <Select label="Gender">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </div>
            <Input label="Study Description" placeholder="Chest PA" />
            <Input label="Referring Physician" placeholder="Dr. Khan" />
            <Button
              variant="gradient"
              className="w-full"
              disabled={!valid}
              onClick={async () => {
                if (!selectedFile) {
                  setStatus("No file selected");
                  return;
                }
                setStatus("uploading");
                // mark first file as uploading
                setFiles((arr) => arr.map((f, i) => (i === 0 ? { ...f, status: "uploading", progress: 50 } : f)));

                const fd = new FormData();
                fd.append("file", selectedFile);

                try {
                  const res = await fetch("http://localhost:8000/upload-dicom", {
                    method: "POST",
                    body: fd,
                  });
                  const json = await res.json();
                  if (res.ok && json.success) {
                    setStatus("uploaded successfully");
                    setFiles((arr) => arr.map((f, i) => (i === 0 ? { ...f, status: "done", progress: 100 } : f)));
                  } else {
                    setStatus("upload failed");
                    setFiles((arr) => arr.map((f, i) => (i === 0 ? { ...f, status: "failed", progress: 0 } : f)));
                  }
                } catch (err) {
                  setStatus("upload failed");
                  setFiles((arr) => arr.map((f, i) => (i === 0 ? { ...f, status: "failed", progress: 0 } : f)));
                }
              }}
            >
              Upload to PACS
            </Button>
            {status && <p className="text-sm text-muted-foreground mt-2">{status}</p>}
          </Card>

          <Card className="p-6 border border-border/60">
            <h3 className="text-sm font-semibold mb-3">Recent Uploads</h3>
            <ul className="space-y-2 text-sm">
              {[
                { id: "PT-48199", time: "10:02", ok: true },
                { id: "PT-48198", time: "09:48", ok: true },
                { id: "PT-48197", time: "09:31", ok: false },
              ].map((u) => (
                <li key={u.id} className="flex items-center justify-between">
                  <span className="font-mono text-primary-deep text-xs">{u.id}</span>
                  <span className="text-xs text-muted-foreground">{u.time}</span>
                  <Badge variant={u.ok ? "success" : "danger"} dot>{u.ok ? "Sent" : "Failed"}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
