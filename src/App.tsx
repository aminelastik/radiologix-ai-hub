import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthShell } from "@/components/layout/AuthShell";
import { AppShell } from "@/components/layout/AppShell";

import LoginPage from "@/pages/auth/LoginPage";
import WorklistPage from "@/pages/radiologist/WorklistPage";
import ViewerPage from "@/pages/radiologist/ViewerPage";
import ReportPage from "@/pages/radiologist/ReportPage";
import PatientHistoryPage from "@/pages/radiologist/PatientHistoryPage";
import UploadPage from "@/pages/technician/UploadPage";
import QueuePage from "@/pages/technician/QueuePage";
import DashboardPage from "@/pages/admin/DashboardPage";
import UsersPage from "@/pages/admin/UsersPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route element={<AuthShell />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Authenticated app */}
          <Route element={<AppShell />}>
            {/* Radiologist */}
            <Route path="/radiologist/worklist" element={<WorklistPage />} />
            <Route path="/radiologist/viewer/:studyId" element={<ViewerPage />} />
            <Route path="/radiologist/report/:studyId" element={<ReportPage />} />
            <Route path="/radiologist/patient/:patientId" element={<PatientHistoryPage />} />

            {/* Technician */}
            <Route path="/technician/upload" element={<UploadPage />} />
            <Route path="/technician/queue" element={<QueuePage />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
