import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit2, Trash2, ExternalLink, Search, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// Define types for our integration data
interface IntegrationField {
  id: string;
  label: string;
  type: "text" | "password" | "email";
  value: string;
  placeholder?: string;
}

interface Integration {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  enabled: boolean;
  fields: IntegrationField[];
  category: string;
}

// Initial data structure for integration categories
const initialCategories = [
  {
    id: "payment",
    name: "Payment Services",
    description: "Manage payment gateway integrations",
    icon: "💳",
  },
  {
    id: "delivery",
    name: "Delivery Services",
    description: "Manage shipping and logistics integrations",
    icon: "🚚",
  },
  {
    id: "analytics",
    name: "Analytics & Tracking",
    description: "Manage analytics and tracking tools",
    icon: "📊",
  },
  {
    id: "communication",
    name: "Communication",
    description: "Manage SMS, email, and notification services",
    icon: "📧",
  },
  {
    id: "other",
    name: "Other Services",
    description: "Manage other third-party integrations",
    icon: "🔌",
  },
];

// Initial integrations data
const initialIntegrations: Integration[] = [
  {
    id: "razorpay",
    name: "Razorpay",
    description: "Online payment gateway for India",
    logo: "https://razorpay.com/favicon.png",
    enabled: true,
    category: "payment",
    fields: [
      { id: "key_id", label: "Key ID", type: "text", value: "rzp_test_1234567890" },
      { id: "key_secret", label: "Key Secret", type: "password", value: "abcdefghijklmnopqrstuvwxyz" },
    ],
  },
  {
    id: "paytm",
    name: "Paytm",
    description: "Indian digital payment service",
    logo: "https://pbs.twimg.com/profile_images/1455591031561564163/QUbgD4Cc_400x400.jpg",
    enabled: false,
    category: "payment",
    fields: [
      { id: "merchant_id", label: "Merchant ID", type: "text", value: "" },
      { id: "merchant_key", label: "Merchant Key", type: "password", value: "" },
    ],
  },
  {
    id: "shiprocket",
    name: "Shiprocket",
    description: "Shipping logistics platform",
    logo: "https://shiprocket.in/wp-content/uploads/2019/01/shiprocket-favicon.png",
    enabled: true,
    category: "delivery",
    fields: [
      { id: "email", label: "Email", type: "email", value: "test@example.com" },
      { id: "password", label: "Password", type: "password", value: "secretpassword" },
    ],
  },
  {
    id: "dunzo",
    name: "Dunzo",
    description: "Hyperlocal delivery service",
    logo: "https://yt3.googleusercontent.com/NGsb9GUYOJ0YzNSQIbOSZgzXwXLpNRQcvCBz8pHxGHnFmEYpUMcZJcOro6jTWApzPGvg8VuQQYQ=s900-c-k-c0x00ffffff-no-rj",
    enabled: false,
    category: "delivery",
    fields: [
      { id: "client_id", label: "Client ID", type: "text", value: "" },
      { id: "client_secret", label: "Client Secret", type: "password", value: "" },
    ],
  },
  {
    id: "google_analytics",
    name: "Google Analytics",
    description: "Web analytics service",
    logo: "https://www.google.com/analytics/images/ga_icon_black.png",
    enabled: true,
    category: "analytics",
    fields: [
      { id: "tracking_id", label: "Tracking ID", type: "text", value: "UA-12345678-1" },
    ],
  },
  {
    id: "facebook_pixel",
    name: "Facebook Pixel",
    description: "Analytics tool for Facebook ads",
    logo: "https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico",
    enabled: false,
    category: "analytics",
    fields: [
      { id: "pixel_id", label: "Pixel ID", type: "text", value: "" },
    ],
  },
  {
    id: "msg91",
    name: "MSG91",
    description: "SMS and voice messaging service",
    logo: "https://msg91.com/favicon/favicon-32x32.png",
    enabled: true,
    category: "communication",
    fields: [
      { id: "auth_key", label: "Auth Key", type: "text", value: "123456789abcdefghijk" },
      { id: "sender_id", label: "Sender ID", type: "text", value: "BRTGEO" },
    ],
  },
];

export function IntegrationsTab() {
  const [activeTab, setActiveTab] = useState("all");
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newIntegration, setNewIntegration] = useState<Integration>({
    id: "",
    name: "",
    description: "",
    logo: "",
    enabled: false,
    fields: [],
    category: "other",
  });
  const [newField, setNewField] = useState<IntegrationField>({
    id: "",
    label: "",
    type: "text",
    value: "",
  });
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // Filter integrations by search term and active tab
  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === "all" || integration.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  // Toggle integration enabled status
  const toggleIntegrationStatus = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, enabled: !integration.enabled } 
        : integration
    ));
  };

  // Add new integration
  const handleAddIntegration = () => {
    if (newIntegration.name.trim() === "") return;
    if (newIntegration.id.trim() === "") {
      newIntegration.id = newIntegration.name.toLowerCase().replace(/\s+/g, '_');
    }
    setIntegrations([...integrations, newIntegration]);
    setIsAddDialogOpen(false);
    setActiveTab(newIntegration.category);
    setNewIntegration({
      id: "",
      name: "",
      description: "",
      logo: "",
      enabled: false,
      fields: [],
      category: "other",
    });
  };

  // Add new field to integration
  const handleAddField = () => {
    if (newField.label.trim() === "") return;
    if (newField.id.trim() === "") {
      newField.id = newField.label.toLowerCase().replace(/\s+/g, '_');
    }
    setNewIntegration({
      ...newIntegration,
      fields: [...newIntegration.fields, { ...newField }],
    });
    setNewField({ id: "", label: "", type: "text", value: "" });
  };

  // Remove field from new integration
  const handleRemoveField = (fieldId: string) => {
    setNewIntegration({
      ...newIntegration,
      fields: newIntegration.fields.filter(field => field.id !== fieldId),
    });
  };

  // Save edited integration
  const handleSaveIntegration = () => {
    if (!selectedIntegration) return;
    setIntegrations(
      integrations.map(integration => 
        integration.id === selectedIntegration.id ? selectedIntegration : integration
      )
    );
    setIsEditDialogOpen(false);
    setSelectedIntegration(null);
  };

  // Delete integration
  const handleDeleteIntegration = (id: string) => {
    setIntegrations(integrations.filter(integration => integration.id !== id));
    if (selectedIntegration?.id === id) {
      setIsEditDialogOpen(false);
      setSelectedIntegration(null);
    }
  };

  // Update field in edited integration
  const handleUpdateField = (fieldId: string, value: string) => {
    if (!selectedIntegration) return;
    setSelectedIntegration({
      ...selectedIntegration,
      fields: selectedIntegration.fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      ),
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search integrations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Integration</DialogTitle>
              <DialogDescription>
                Configure a new third-party service integration.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="grid gap-4 py-4 px-1">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="integration-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="integration-name"
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="integration-desc" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="integration-desc"
                    value={newIntegration.description}
                    onChange={(e) => setNewIntegration({...newIntegration, description: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="integration-logo" className="text-right">
                    Logo URL
                  </Label>
                  <Input
                    id="integration-logo"
                    value={newIntegration.logo}
                    onChange={(e) => setNewIntegration({...newIntegration, logo: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="integration-category" className="text-right">
                    Category
                  </Label>
                  <select
                    id="integration-category"
                    value={newIntegration.category}
                    onChange={(e) => setNewIntegration({...newIntegration, category: e.target.value})}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {initialCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <Separator className="my-2" />
                
                <div className="grid gap-4">
                  <h4 className="font-medium">Configuration Fields</h4>
                  
                  {newIntegration.fields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="grid grid-cols-[1fr_1fr_auto] gap-2 flex-1">
                        <div>{field.label}</div>
                        <div>{field.type}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveField(field.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                    <Input
                      placeholder="Field Label"
                      value={newField.label}
                      onChange={(e) => setNewField({...newField, label: e.target.value})}
                    />
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField({...newField, type: e.target.value as any})}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="text">Text</option>
                      <option value="password">Password</option>
                      <option value="email">Email</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddField}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddIntegration} disabled={!newIntegration.name || newIntegration.fields.length === 0}>
                Add Integration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto overflow-auto">
          <TabsTrigger key="all" value="all" className="flex items-center">
            <span className="mr-1">🔍</span>
            All Integrations
          </TabsTrigger>
          {initialCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center">
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent key="all" value="all" className="space-y-4">
          <Card className="w-full overflow-hidden">
            <CardHeader>
              <CardTitle>All Integrations</CardTitle>
              <CardDescription>All available third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredIntegrations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredIntegrations.map((integration) => (
                    <Card key={integration.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center space-x-2">
                          {integration.logo ? (
                            <img
                              src={integration.logo}
                              alt={integration.name}
                              className="h-8 w-8 rounded"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                              <span className="text-xs">{integration.name.substring(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            {integration.enabled ? (
                              <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                            ) : (
                              <Badge variant="outline">Disabled</Badge>
                            )}
                          </div>
                        </div>
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                        />
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-sm text-muted-foreground mb-2">
                          {integration.description}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <Dialog
                            open={isEditDialogOpen && selectedIntegration?.id === integration.id}
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (open) setSelectedIntegration(integration);
                              else setSelectedIntegration(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                                <Edit2 className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Edit Integration</DialogTitle>
                                <DialogDescription>
                                  Update the configuration for {selectedIntegration?.name}.
                                </DialogDescription>
                              </DialogHeader>
                              {selectedIntegration && (
                                <div className="grid gap-4 py-4">
                                  {selectedIntegration.fields.map((field) => (
                                    <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                                      <Label htmlFor={`field-${field.id}`} className="text-right">
                                        {field.label}
                                      </Label>
                                      <div className="col-span-3 relative">
                                        <Input
                                          id={`field-${field.id}`}
                                          type={field.type === "password" && !showPasswords[field.id] ? "password" : "text"}
                                          value={field.value}
                                          onChange={(e) => handleUpdateField(field.id, e.target.value)}
                                          className="pr-10"
                                        />
                                        {field.type === "password" && (
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            className="absolute right-0 top-0 h-full px-3"
                                            onClick={() => togglePasswordVisibility(field.id)}
                                          >
                                            {showPasswords[field.id] ? (
                                              <EyeOff className="h-4 w-4" />
                                            ) : (
                                              <Eye className="h-4 w-4" />
                                            )}
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <DialogFooter className="flex justify-between">
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (selectedIntegration) handleDeleteIntegration(selectedIntegration.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                                <div>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="mr-2">
                                    Cancel
                                  </Button>
                                  <Button onClick={handleSaveIntegration}>
                                    Save Changes
                                  </Button>
                                </div>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No integrations found.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add a New Integration
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {initialCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <Card className="w-full overflow-hidden">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredIntegrations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntegrations.map((integration) => (
                      <Card key={integration.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                          <div className="flex items-center space-x-2">
                            {integration.logo ? (
                              <img
                                src={integration.logo}
                                alt={integration.name}
                                className="h-8 w-8 rounded"
                              />
                            ) : (
                              <div className="h-8 w-8 rounded bg-gray-200 flex items-center justify-center">
                                <span className="text-xs">{integration.name.substring(0, 2).toUpperCase()}</span>
                              </div>
                            )}
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              {integration.enabled ? (
                                <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                              ) : (
                                <Badge variant="outline">Disabled</Badge>
                              )}
                            </div>
                          </div>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegrationStatus(integration.id)}
                          />
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          <p className="text-sm text-muted-foreground mb-2">
                            {integration.description}
                          </p>
                          <div className="flex justify-end space-x-2">
                            <Dialog
                              open={isEditDialogOpen && selectedIntegration?.id === integration.id}
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open);
                                if (open) setSelectedIntegration(integration);
                                else setSelectedIntegration(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedIntegration(integration)}>
                                  <Edit2 className="h-3.5 w-3.5 mr-1" />
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Integration</DialogTitle>
                                  <DialogDescription>
                                    Update the configuration for {selectedIntegration?.name}.
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedIntegration && (
                                  <div className="grid gap-4 py-4">
                                    {selectedIntegration.fields.map((field) => (
                                      <div key={field.id} className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor={`field-${field.id}`} className="text-right">
                                          {field.label}
                                        </Label>
                                        <div className="col-span-3 relative">
                                          <Input
                                            id={`field-${field.id}`}
                                            type={field.type === "password" && !showPasswords[field.id] ? "password" : "text"}
                                            value={field.value}
                                            onChange={(e) => handleUpdateField(field.id, e.target.value)}
                                            className="pr-10"
                                          />
                                          {field.type === "password" && (
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              type="button"
                                              className="absolute right-0 top-0 h-full px-3"
                                              onClick={() => togglePasswordVisibility(field.id)}
                                            >
                                              {showPasswords[field.id] ? (
                                                <EyeOff className="h-4 w-4" />
                                              ) : (
                                                <Eye className="h-4 w-4" />
                                              )}
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <DialogFooter className="flex justify-between">
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => {
                                      if (selectedIntegration) handleDeleteIntegration(selectedIntegration.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                  <div>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="mr-2">
                                      Cancel
                                    </Button>
                                    <Button onClick={handleSaveIntegration}>
                                      Save Changes
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No integrations found in this category.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setNewIntegration({...newIntegration, category: category.id});
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add a {category.name} Integration
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
