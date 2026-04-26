import { useEffect, useState } from "react";
import { Upload, FileCheck2, X, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Input, Select, Button, Badge } from "@/ui";

type UploadStatus = "queued" | "uploading" | "done" | "failed";

interface SelectedFile {
  file: File;
  status: UploadStatus;
  error?: string;
}

interface UploadResult {
  filename: string;
  status: UploadStatus;
  error: string | null;
}

interface UploadResponse {
  success: boolean;
  study_instance_uid?: string;
  uploaded_count: number;
  failed_count: number;
  results: UploadResult[];
  error?: string;
  message?: string;
}

const STUDY_DESCRIPTION_OPTIONS = [
  "CHEST PA AND LATERAL",
  "CHEST AP PORTABLE",
  "CHEST PA",
  "CHEST AP AND LATERAL",
  "CHEST DECUBITUS",
  "CHEST PA FOR TUBERCULOSIS",
] as const;

const VIEW_POSITION_OPTIONS = ["PA", "AP", "LATERAL"] as const;
const MODALITY_OPTIONS = ["CR", "DX"] as const;

const UploadPage = () => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "success" | "error">("info");
  const [uploading, setUploading] = useState(false);
  const [studiesCount, setStudiesCount] = useState<number | null>(null);

  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [studyDescription, setStudyDescription] = useState("");
  const [viewPosition, setViewPosition] = useState("");
  const [modality, setModality] = useState("");
  const [referringPhysician, setReferringPhysician] = useState("");

  const isValid =
    selectedFiles.length > 0 &&
    !!patientId.trim() &&
    !!dob.trim() &&
    !!studyDescription.trim() &&
    !!viewPosition.trim() &&
    !!modality.trim();

  useEffect(() => {
    if (!selectedFiles.length) {
      setStatusMessage(null);
      setStatusTone("info");
    }
  }, [selectedFiles.length]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    setSelectedFiles((current) => {
      const existing = new Set(current.map((e) => `${e.file.name}_${e.file.size}_${e.file.lastModified}`));
      const toAdd = Array.from(files)
        .map((file) => ({ file, status: "queued" as UploadStatus }))
        .filter((entry) => {
          const key = `${entry.file.name}_${entry.file.size}_${entry.file.lastModified}`;
          if (existing.has(key)) return false;
          existing.add(key);
          return true;
        });

      if (toAdd.length === 0) return current;
      return [...current, ...toAdd];
    });

    setStatusMessage(null);
    setStatusTone("info");
  };

  const removeFile = (indexToRemove: number) => {
    if (uploading) {
      return;
    }

    setSelectedFiles((current) => current.filter((_, index) => index !== indexToRemove));
    setStatusMessage(null);
    setStatusTone("info");
  };

  const markAllFiles = (status: UploadStatus) => {
    setSelectedFiles((current) =>
      current.map((entry) => ({
        ...entry,
        status,
        error: undefined,
      })),
    );
  };

  const applyResults = (results: UploadResult[], fallbackError?: string) => {
    setSelectedFiles((current) =>
      current.map((entry, index) => {
        const result = results[index];

        if (!result) {
          return {
            ...entry,
            status: "failed",
            error: fallbackError || "Upload failed",
          };
        }

        if (result.status === "done") {
          return {
            ...entry,
            status: "done",
            error: undefined,
          };
        }

        return {
          ...entry,
          status: "failed",
          error: result.error || fallbackError || "Upload failed",
        };
      }),
    );
  };

  const handleUpload = async () => {
    if (!isValid) {
      setStatusMessage("Please complete all required fields and select at least one file.");
      setStatusTone("error");
      return;
    }

    setUploading(true);
    setStatusMessage("Uploading to Orthanc...");
    setStatusTone("info");
    markAllFiles("uploading");

    const fd = new FormData();
    for (const selectedFile of selectedFiles) {
      fd.append("files", selectedFile.file);
    }
    fd.append("patient_id", patientId);
    fd.append("patient_name", patientName);
    fd.append("dob", dob);
    fd.append("gender", gender);
    fd.append("study_description", studyDescription);
    fd.append("view_position", viewPosition);
    fd.append("modality", modality);
    fd.append("referring_physician", referringPhysician);

    try {
      const res = await fetch("http://localhost:8000/upload-dicom", {
        method: "POST",
        body: fd,
      });

      const responseText = await res.text();
      let json: UploadResponse | null = null;

      try {
        json = responseText ? (JSON.parse(responseText) as UploadResponse) : null;
      } catch {
        json = null;
      }

      console.log("Upload response", {
        ok: res.ok,
        status: res.status,
        body: json ?? responseText,
      });

      if (!res.ok) {
        const backendError = json?.error || responseText || `HTTP ${res.status}`;
        applyResults(json?.results ?? [], backendError);
        setStatusMessage(`Upload failed: ${backendError}`);
        setStatusTone("error");
        return;
      }

      if (json?.success) {
        applyResults(json.results ?? []);
        try {
          const studiesRes = await fetch("http://localhost:8000/studies");
          const studies = await studiesRes.json();
          const count = Array.isArray(studies) ? studies.length : 0;
          setStudiesCount(count);
          setStatusMessage(`Uploaded ${json.uploaded_count} file(s) successfully. Worklist now shows ${count} studies.`);
        } catch {
          setStatusMessage(`Uploaded ${json.uploaded_count} file(s) successfully. Refresh Worklist to see the new study.`);
        }
        setStatusTone("success");
      } else {
        const backendError = json?.error || "One or more files failed to upload";
        applyResults(json?.results ?? [], backendError);
        setStatusMessage(`Upload failed: ${backendError}`);
        setStatusTone("error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Network error";
      applyResults([], message);
      setStatusMessage(`Upload failed: ${message}`);
      setStatusTone("error");
    } finally {
      setUploading(false);
    }
  };

  const statusMessageClasses =
    statusTone === "success"
      ? "text-success"
      : statusTone === "error"
        ? "text-danger"
        : "text-muted-foreground";

  const getStatusBadgeClasses = (status: UploadStatus) => {
    switch (status) {
      case "queued":
        return "border-border bg-muted text-muted-foreground";
      case "uploading":
        return "border-info/30 bg-info/10 text-info";
      case "done":
        return "border-success/30 bg-success/10 text-success";
      case "failed":
        return "border-danger/30 bg-danger/10 text-danger";
      default:
        return "border-border bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Upload Studies" subtitle="Send DICOM files to PACS for AI analysis." />
      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-6 border border-border/60">
            <label className="block rounded-2xl border-2 border-dashed border-primary-glow/50 bg-primary-glow/5 p-10 text-center cursor-pointer hover:bg-primary-glow/10 transition-colors">
              <Upload className="mx-auto h-10 w-10 text-primary-glow" />
              <p className="mt-3 font-medium text-foreground">Drop DICOM or image files here</p>
              <p className="text-xs text-muted-foreground">or click to browse · .dcm, .png, .jpg, .jpeg files supported</p>
              <input
                type="file"
                multiple
                accept=".dcm,.jpg,.jpeg,.png,application/dicom,image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </label>
          </Card>

          <Card className="p-6 border border-border/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Selected Files</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])} disabled={uploading || selectedFiles.length === 0}>
                Clear
              </Button>
            </div>
            {selectedFiles.length > 0 ? (
              <ul className="space-y-2">
                {selectedFiles.map((selectedFile, index) => (
                  <li
                    key={`${selectedFile.file.name}-${selectedFile.file.size}-${selectedFile.file.lastModified}-${index}`}
                    className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
                  >
                    <FileCheck2 className="h-5 w-5 text-primary-deep" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <p className="font-medium truncate">{selectedFile.file.name}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge className={getStatusBadgeClasses(selectedFile.status)}>{selectedFile.status}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {(selectedFile.file.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </div>
                      </div>
                      {selectedFile.error ? <p className="mt-1 text-xs text-danger">{selectedFile.error}</p> : null}
                    </div>
                    <button
                      aria-label={`Remove ${selectedFile.file.name}`}
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-danger transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      disabled={uploading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No files selected</p>
            )}
          </Card>

          <Card className="p-6 border border-danger/30 bg-danger/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-danger mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-danger">Validation</p>
                <p className="text-muted-foreground mt-0.5">
                  {selectedFiles.length > 0 ? "Files selected. Ready to upload." : "Please select one or more DICOM files to upload."}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="p-6 border border-border/60 space-y-4">
            <h3 className="text-sm font-semibold">Patient Information</h3>
            <Input label="Patient ID" placeholder="PT-00000" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
            <Input label="Patient Name" placeholder="Full name" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="DOB" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              <Select label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </Select>
            </div>
            <Select label="Study Description" value={studyDescription} onChange={(e) => setStudyDescription(e.target.value)}>
              <option value="">Select study description</option>
              {STUDY_DESCRIPTION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select label="View Position" value={viewPosition} onChange={(e) => setViewPosition(e.target.value)}>
              <option value="">Select view position</option>
              {VIEW_POSITION_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Select label="Modality" value={modality} onChange={(e) => setModality(e.target.value)}>
              <option value="">Select modality</option>
              {MODALITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            <Input label="Referring Physician" placeholder="Dr. Khan" value={referringPhysician} onChange={(e) => setReferringPhysician(e.target.value)} />
            <Button variant="gradient" className="w-full" disabled={!isValid || uploading} onClick={handleUpload}>
              {uploading ? "Uploading..." : "Upload to PACS"}
            </Button>
            {statusMessage ? <p className={`text-sm mt-2 ${statusMessageClasses}`}>{statusMessage}</p> : null}
          </Card>

          <Card className="p-6 border border-border/60">
            <h3 className="text-sm font-semibold mb-3">Upload Status</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>{selectedFiles.length} file(s) selected</p>
              {studiesCount !== null ? <p>Worklist currently shows {studiesCount} studies</p> : <p>Upload files to see current study count</p>}
              {uploading ? <Badge variant="info">Uploading</Badge> : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
