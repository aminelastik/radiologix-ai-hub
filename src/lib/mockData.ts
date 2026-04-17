// Mock data for the JANUS CXR teleradiology UI.
// Replace with real API calls when backend is wired.

export type AIResult = "Normal" | "Pneumonia" | "Effusion" | "Nodule" | "Cardiomegaly" | "Pneumothorax" | "Urgent";
export type Priority = "STAT" | "Urgent" | "Routine";
export type StudyType = "Chest PA" | "Chest AP" | "Chest Lateral";
export type ReviewStatus = "Pending" | "Reviewing" | "Reviewed" | "Signed";

export interface PatientStudy {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: "M" | "F";
  study: StudyType;
  date: string;
  dateLabel: string;
  aiResult: AIResult;
  priority: Priority;
  status: ReviewStatus;
}

export const studies: PatientStudy[] = [
  { id: "STD-10001", patientId: "PT-48201", patientName: "Sarah Johnson", age: 54, gender: "F", study: "Chest PA", date: "2025-04-17", dateLabel: "Today", aiResult: "Normal", priority: "Routine", status: "Pending" },
  { id: "STD-10002", patientId: "PT-48202", patientName: "Marcus Chen", age: 67, gender: "M", study: "Chest AP", date: "2025-04-17", dateLabel: "Today", aiResult: "Pneumonia", priority: "Urgent", status: "Reviewing" },
  { id: "STD-10003", patientId: "PT-48203", patientName: "Elena Rodriguez", age: 42, gender: "F", study: "Chest PA", date: "2025-04-17", dateLabel: "Today", aiResult: "Effusion", priority: "Urgent", status: "Pending" },
  { id: "STD-10004", patientId: "PT-48204", patientName: "James Patel", age: 71, gender: "M", study: "Chest PA", date: "2025-04-16", dateLabel: "Yesterday", aiResult: "Urgent", priority: "STAT", status: "Pending" },
  { id: "STD-10005", patientId: "PT-48205", patientName: "Aisha Williams", age: 38, gender: "F", study: "Chest AP", date: "2025-04-16", dateLabel: "Yesterday", aiResult: "Normal", priority: "Routine", status: "Reviewed" },
];

export interface QueueItem {
  id: string;
  patientId: string;
  study: StudyType;
  uploadedAt: string;
  status: "Pending" | "Processing" | "Completed" | "Failed";
}

export const queueItems: QueueItem[] = [
  { id: "Q-001", patientId: "PT-48201", study: "Chest PA", uploadedAt: "10:24", status: "Completed" },
  { id: "Q-002", patientId: "PT-48202", study: "Chest AP", uploadedAt: "10:31", status: "Processing" },
  { id: "Q-003", patientId: "PT-48203", study: "Chest PA", uploadedAt: "10:42", status: "Pending" },
  { id: "Q-004", patientId: "PT-48204", study: "Chest PA", uploadedAt: "10:58", status: "Failed" },
  { id: "Q-005", patientId: "PT-48205", study: "Chest AP", uploadedAt: "11:03", status: "Completed" },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Radiologist" | "Technician" | "Admin";
  status: "Active" | "Inactive";
  lastLogin: string;
  initials: string;
}

export const users: AdminUser[] = [
  { id: "U-001", name: "Dr. Olivia Smith", email: "olivia.smith@janus.med", role: "Radiologist", status: "Active", lastLogin: "2 min ago", initials: "OS" },
  { id: "U-002", name: "Dr. Marcus Chen", email: "marcus.chen@janus.med", role: "Radiologist", status: "Active", lastLogin: "1 h ago", initials: "MC" },
  { id: "U-003", name: "Lucas Bennett", email: "lucas.b@janus.med", role: "Technician", status: "Active", lastLogin: "3 h ago", initials: "LB" },
  { id: "U-004", name: "Priya Raman", email: "priya.r@janus.med", role: "Technician", status: "Inactive", lastLogin: "2 d ago", initials: "PR" },
  { id: "U-005", name: "Admin Root", email: "admin@janus.med", role: "Admin", status: "Active", lastLogin: "just now", initials: "AR" },
];

export const pathologies = [
  { name: "Pneumonia", value: 0.82, detected: true },
  { name: "Pleural Effusion", value: 0.61, detected: true },
  { name: "Lung Nodule", value: 0.18, detected: false },
  { name: "Cardiomegaly", value: 0.34, detected: false },
  { name: "Pneumothorax", value: 0.07, detected: false },
  { name: "No Finding", value: 0.09, detected: false },
];
