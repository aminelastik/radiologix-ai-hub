import { useState } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, Button, Input, Select } from "@/ui";

const tabs = ["General", "AI Model", "PACS", "Keycloak", "Notifications"] as const;
type Tab = typeof tabs[number];

const SettingsPage = () => {
  const [tab, setTab] = useState<Tab>("General");

  return (
    <div className="min-h-screen">
      <Topbar title="Settings" subtitle="Configure platform behavior and integrations." />
      <div className="p-6 md:p-10 space-y-5">
        <Card className="p-2 border border-border/60">
          <div className="flex flex-wrap gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 h-9 rounded-xl text-sm font-medium transition-colors ${
                  tab === t ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-border/60 max-w-2xl space-y-4">
          {tab === "General" && (
            <>
              <h3 className="text-base font-semibold">General</h3>
              <Input label="Platform name" defaultValue="JANUS CXR" />
              <Select label="Default language" defaultValue="English">
                <option>English</option><option>Français</option><option>العربية</option>
              </Select>
              <Select label="Timezone" defaultValue="UTC">
                <option>UTC</option><option>America/New_York</option><option>Europe/Paris</option>
              </Select>
            </>
          )}
          {tab === "AI Model" && (
            <>
              <h3 className="text-base font-semibold">AI Model</h3>
              <Select label="Model"><option>JANUS-CXR v3.1</option><option>JANUS-CXR v2.7</option></Select>
              <Input label="Confidence threshold" defaultValue="0.65" />
              <Input label="Uncertainty threshold (σ)" defaultValue="0.20" />
            </>
          )}
          {tab === "PACS" && (
            <>
              <h3 className="text-base font-semibold">PACS / Orthanc</h3>
              <Input label="Orthanc URL" defaultValue="https://orthanc.janus.local" />
              <Input label="DICOMweb root" defaultValue="/dicom-web" />
              <Button variant="outline">Test connection</Button>
            </>
          )}
          {tab === "Keycloak" && (
            <>
              <h3 className="text-base font-semibold">Keycloak</h3>
              <Input label="Server URL" defaultValue="https://auth.janus.local" />
              <Input label="Realm" defaultValue="janus" />
              <Input label="Client ID" defaultValue="janus-web" />
            </>
          )}
          {tab === "Notifications" && (
            <>
              <h3 className="text-base font-semibold">Notifications</h3>
              <label className="flex items-center justify-between rounded-xl bg-secondary/50 p-3">
                <span className="text-sm">Email notifications</span>
                <input type="checkbox" defaultChecked className="h-5 w-9 appearance-none rounded-full bg-muted-foreground/40 checked:bg-primary transition-colors relative cursor-pointer
                  before:content-[''] before:absolute before:top-0.5 before:left-0.5 before:h-4 before:w-4 before:rounded-full before:bg-card before:transition-transform checked:before:translate-x-4" />
              </label>
              <Input label="SMTP host" defaultValue="smtp.janus.local" />
              <Input label="Alert threshold (urgent / day)" defaultValue="3" />
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border/60">
            <Button variant="ghost">Reset</Button>
            <Button variant="gradient">Save changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
