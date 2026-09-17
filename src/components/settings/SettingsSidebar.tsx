
import { 
  UserCog, 
  Bell, 
  PaletteIcon, 
  Lock, 
  Webhook, 
  Database, 
  CreditCard, 
  KeyRound 
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function SettingsSidebar({ activeTab, setActiveTab }: SettingsSidebarProps) {
  return (
    <Card className="sticky top-6">
      <CardContent className="p-0">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          orientation="vertical" 
          className="w-full"
        >
          <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0">
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <UserCog size={18} />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <Bell size={18} />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <PaletteIcon size={18} />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <Lock size={18} />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="integrations" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <KeyRound size={18} />
              <span>Integrations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="api" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <Webhook size={18} />
              <span>API Access</span>
            </TabsTrigger>
            <TabsTrigger 
              value="database" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <Database size={18} />
              <span>Database</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex items-center gap-2 px-4 py-3 text-left justify-start"
            >
              <CreditCard size={18} />
              <span>Billing</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}
