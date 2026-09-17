import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { IntegrationsTab } from "./IntegrationsTab";
import { CreditCard } from "lucide-react";

interface SettingsTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SettingsTabs({ value, onValueChange }: SettingsTabsProps) {
  const { toast } = useToast();
  
  // Form states
  const [companyName, setCompanyName] = useState("BharatGo Technologies Pvt Ltd");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [logoutTime, setLogoutTime] = useState("30");
  const [apiEnabled, setApiEnabled] = useState(true);
  
  const handleSaveChanges = () => {
    toast({
      title: "Settings updated",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleResetPassword = () => {
    toast({
      title: "Password reset email sent",
      description: "Check your email for instructions to reset your password.",
    });
  };
  
  const handleResetToDefaults = () => {
    setCompanyName("BharatGo Technologies Pvt Ltd");
    setEmailNotifications(true);
    setPushNotifications(true);
    setDarkMode(false);
    setCompactView(false);
    setAutoLogout(true);
    setLogoutTime("30");
    setApiEnabled(true);
    
    toast({
      title: "Settings reset",
      description: "All settings have been reset to default values.",
    });
  };

  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsContent value="account" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Manage your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value="admin@bharatgo.com" 
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  id="timezone"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleResetToDefaults}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Manage how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive important updates via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-500">
                  Receive alerts in your browser
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>
              Save Notification Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
            <CardDescription>
              Customize how the dashboard looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <p className="text-sm text-gray-500">
                  Switch between light and dark themes
                </p>
              </div>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                onClick={()=>{
                  const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
                  const newTheme = currentTheme === "dark" ? "light" : "dark";
                  document.documentElement.classList.toggle("dark");
                  localStorage.setItem("theme", newTheme);
                }}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compactView">Compact View</Label>
                <p className="text-sm text-gray-500">
                  Reduce spacing between elements
                </p>
              </div>
              <Switch
                id="compactView"
                checked={compactView}
                onCheckedChange={setCompactView}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>
              Save Appearance Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="security" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Manage security and authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleResetPassword}>
              Reset Password
            </Button>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="autoLogout">Auto Logout</Label>
                <p className="text-sm text-gray-500">
                  Automatically logout after period of inactivity
                </p>
              </div>
              <Switch
                id="autoLogout"
                checked={autoLogout}
                onCheckedChange={setAutoLogout}
              />
            </div>
            
            {autoLogout && (
              <div className="pl-6">
                <Label htmlFor="logoutTime">Logout After (minutes)</Label>
                <div className="flex w-1/3 mt-1">
                  <Input 
                    id="logoutTime" 
                    type="number" 
                    min="1" 
                    max="120" 
                    value={logoutTime} 
                    onChange={(e) => setLogoutTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>
              Save Security Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="integrations" className="mt-0">
        <IntegrationsTab />
      </TabsContent>
      
      <TabsContent value="api" className="space-y-6 mt-0">
        <Card>
          <CardHeader>
            <CardTitle>API Access</CardTitle>
            <CardDescription>
              Manage API keys and access controls
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="apiEnabled">Enable API Access</Label>
                <p className="text-sm text-gray-500">
                  Allow programmatic access to your data
                </p>
              </div>
              <Switch
                id="apiEnabled"
                checked={apiEnabled}
                onCheckedChange={setApiEnabled}

              />
            </div>
            
            {apiEnabled && (
              <>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="apiKey" 
                      value="bgt_5f8a4c2e7d6b3a9f1e0d8c7b6a5f4e3d" 
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline">Copy</Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Keep this key secure. Anyone with this key can access your data.
                  </p>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" className="text-red-500">
                    Regenerate API Key
                  </Button>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges}>
              Save API Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="database" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Database Settings</CardTitle>
            <CardDescription>
              Configure database connection and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Database Status</Label>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span>Connected (PostgreSQL)</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Database Metrics</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Storage Used</span>
                    <p>8.2 GB / 10 GB</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Connections</span>
                    <p>12 / 100</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Avg. Query Time</span>
                    <p>23ms</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm text-gray-500">Last Backup</span>
                    <p>Today, 04:30 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Run Manual Backup</Button>
            <Button>View Database Logs</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="billing" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>
              Manage your subscription and billing details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">Enterprise</Badge>
                  <span className="text-green-600">Active</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Billing Cycle</Label>
                <p>Yearly (Renews on 15 Oct 2024)</p>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="flex items-center space-x-2">
                  <CreditCard size={16} />
                  <span>HDFC Bank Credit Card (ending in 4567)</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Update Payment Method</Button>
            <Button>View Invoices</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
