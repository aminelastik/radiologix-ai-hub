import { Topbar } from "@/components/layout/Topbar";
import { StatsCards } from "@/components/radiologist/StatsCards";
import { WorklistTable } from "@/components/radiologist/WorklistTable";
import { BottomCards } from "@/components/radiologist/BottomCards";

const WorklistPage = () => (
  <div className="min-h-screen">
    <Topbar />
    <div className="p-6 md:p-10 space-y-6">
      <StatsCards />
      <WorklistTable />
      <BottomCards />
    </div>
  </div>
);

export default WorklistPage;
