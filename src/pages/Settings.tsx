
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { SettingsTabs } from "@/components/settings/SettingsTabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout title="Settings" subtitle="Manage your BharatGo dashboard preferences">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SettingsTabs value={activeTab} onValueChange={setActiveTab} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
