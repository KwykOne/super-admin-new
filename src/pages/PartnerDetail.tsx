import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from "@/components/DashboardLayout";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Partner, CommissionStructure } from "@/types/partners";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart, LineChart, PieChart, ChartData } from "@/components/partners/PartnerCharts";
import { Briefcase, Calendar, Mail, Phone, MapPin, User, FileText, Link as LinkIcon, Trash, Copy, Users, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/formatters";
import { ReferrerReferralsList } from "@/components/referrals/ReferrerReferralsList";
import { Referrer } from "@/types/referrals";

// Mock partner data
const mockPartnerData: Partner = {
  id: "PART10001",
  name: "Global Marketer Solution Inc.",
  type: "digital-marketing",
  status: "active",
  contactPerson: "Raj Sharma",
  email: "contact@globalmarketersolution.com",
  phone: "+91 9876543210",
  address: "123, Mumbai, MH 400001",
  joinDate: new Date(2023, 6, 15),
  commissionStructure: {
    type: "percentage",
    value: 15,
    recurring: true,
    durationMonths: 6,
    effectiveFrom: new Date(2023, 6, 15),
    notes: "Revised structure after 3 months of partnership"
  },
  commissionHistory: [
    {
      type: "percentage",
      value: 10,
      recurring: true,
      durationMonths: 3,
      effectiveFrom: new Date(2023, 3, 15),
      effectiveTo: new Date(2023, 6, 14),
      notes: "Initial partner agreement"
    }
  ],
  referralCount: 47,
  totalCommissionEarned: 245000,
  lastUpdated: new Date(2024, 2, 10),
  referralLink: "https://bharatgo.in/partner/part10001"
};

// Mock referred sellers data
const referredSellers = Array.from({ length: 15 }, (_, i) => ({
  id: `SELL${10000 + i}`,
  name: `Demo Store ${i + 1}`,
  planType: Math.random() > 0.5 ? "Basic" : Math.random() > 0.5 ? "Premium" : "Enterprise",
  planStatus: Math.random() > 0.7 ? "active" : "inactive",
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
  commissionEarned: Math.floor(Math.random() * 15000) + 5000
}));

// Filter options for referred sellers
const planTypeOptions = [
  { value: "Basic", label: "Basic Plan" },
  { value: "Premium", label: "Premium Plan" },
  { value: "Enterprise", label: "Enterprise Plan" },
];

const planStatusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export default function PartnerDetail() {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Filter the referred sellers based on search and filters
  const filteredSellers = useMemo(() => {
    return referredSellers.filter(seller => {
      const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(seller.planType);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(seller.planStatus);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [searchQuery, selectedTypes, selectedStatuses]);
  
  // Helper function to convert partner type to readable form
  const getReadableType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Create a proper Referrer object from the Partner data
  const partnerAsReferrer: Referrer = {
    id: mockPartnerData.id,
    name: mockPartnerData.name,
    category: "partner",
    specialty: getReadableType(mockPartnerData.type),
    status: mockPartnerData.status,
    joinDate: mockPartnerData.joinDate,
    referralCount: mockPartnerData.referralCount,
    pointsEarned: mockPartnerData.totalCommissionEarned, // Using commission as points for display
    pointsRedeemed: 0,
    referralLink: mockPartnerData.referralLink,
    storeCount: 0,
    email: mockPartnerData.email,
    phone: mockPartnerData.phone,
    address: mockPartnerData.address,
    contactPerson: mockPartnerData.contactPerson,
    commissionPlan: {
      commissionRate: mockPartnerData.commissionStructure.value,
      durationMonths: mockPartnerData.commissionStructure.durationMonths,
      startDate: mockPartnerData.commissionStructure.effectiveFrom
    }
  };

  // Dummy monthly data for charts
  const monthlyReferrals: ChartData[] = [
    { name: 'Apr', value: 5 },
    { name: 'May', value: 8 },
    { name: 'Jun', value: 12 },
    { name: 'Jul', value: 9 },
    { name: 'Aug', value: 15 },
    { name: 'Sep', value: 18 }
  ];

  const monthlyCommission: ChartData[] = [
    { name: 'Apr', value: 12500 },
    { name: 'May', value: 22000 },
    { name: 'Jun', value: 36000 },
    { name: 'Jul', value: 28000 },
    { name: 'Aug', value: 48000 },
    { name: 'Sep', value: 52000 }
  ];

  const planDistribution: ChartData[] = [
    { name: 'Basic', value: 15 },
    { name: 'Premium', value: 25 },
    { name: 'Enterprise', value: 7 }
  ];

  return (
    <DashboardLayout 
      title={`Partner Details: ${mockPartnerData.name}`} 
      subtitle={`Manage partner information and track referred sellers`}
      backLink="/partners"
    >
      {/* Partner Summary Card */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0 bg-blue-100 rounded-full p-6">
                <Briefcase className="h-12 w-12 text-blue-700" />
              </div>
              
              <div className="flex-grow space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{mockPartnerData.name}</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge className="bg-blue-100 text-blue-800">{getReadableType(mockPartnerData.type)}</Badge>
                    {mockPartnerData.status === "active" && (
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    )}
                    {mockPartnerData.status === "inactive" && (
                      <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                    )}
                    {mockPartnerData.status === "suspended" && (
                      <Badge className="bg-red-100 text-red-800">Suspended</Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Contact: {mockPartnerData.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{mockPartnerData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{mockPartnerData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{mockPartnerData.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Joined: {formatDate(mockPartnerData.joinDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Commission Structure</CardTitle>
            <CardDescription>Current arrangement with partner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="font-semibold capitalize">
                    {mockPartnerData.commissionStructure.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Value</p>
                  <p className="font-semibold">
                    {mockPartnerData.commissionStructure.type === 'percentage' 
                      ? `${mockPartnerData.commissionStructure.value}%` 
                      : `₹${mockPartnerData.commissionStructure.value}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="font-semibold">
                    {mockPartnerData.commissionStructure.durationMonths === 0
                      ? 'One-time'
                      : `${mockPartnerData.commissionStructure.durationMonths} months`}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Recurring</p>
                  <p className="font-semibold">
                    {mockPartnerData.commissionStructure.recurring ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500">Effective From</p>
                <p className="font-medium">{formatDate(mockPartnerData.commissionStructure.effectiveFrom)}</p>
              </div>
              
              {mockPartnerData.commissionStructure.notes && (
                <div className="pt-2">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-sm">{mockPartnerData.commissionStructure.notes}</p>
                </div>
              )}
              
              <div className="pt-4">
                <Button variant="outline" className="w-full" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Commission
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{mockPartnerData.referralCount}</div>
            <p className="text-sm text-muted-foreground">Sellers brought onboard</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{mockPartnerData.totalCommissionEarned.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Earned to date</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{(mockPartnerData.totalCommissionEarned / Math.max(1, mockPartnerData.referralCount)).toFixed(0)}
            </div>
            <p className="text-sm text-muted-foreground">Per referred seller</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Partner Performance and History Tabs */}
      <Card className="mb-6">
        <Tabs defaultValue="performance">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Partner Analytics</CardTitle>
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="history">Commission History</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="performance" className="space-y-6">
              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Referrals</h3>
                  <div className="h-64">
                    <BarChart 
                      data={monthlyReferrals}
                      yAxisWidth={40}
                      showLegend={false}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Commission</h3>
                  <div className="h-64">
                    <LineChart 
                      data={monthlyCommission}
                      yAxisWidth={60}
                      showLegend={false}
                    />
                  </div>
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Plan Distribution</h3>
                  <div className="h-48">
                    <PieChart data={planDistribution} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Conversion Rate</h3>
                  <div className="flex items-center h-full">
                    <div className="text-5xl font-bold text-green-600">78%</div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">From lead to seller</p>
                      <p className="text-xs text-green-600">+5% vs last month</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Retention Rate</h3>
                  <div className="flex items-center h-full">
                    <div className="text-5xl font-bold text-blue-600">92%</div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Sellers still active</p>
                      <p className="text-xs text-blue-600">+2% vs last quarter</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Commission Structure History</h3>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export History
                  </Button>
                </div>
                
                {/* Current Structure */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Current Structure</h4>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium capitalize">{mockPartnerData.commissionStructure.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Value</p>
                      <p className="font-medium">
                        {mockPartnerData.commissionStructure.type === 'percentage' 
                          ? `${mockPartnerData.commissionStructure.value}%` 
                          : `₹${mockPartnerData.commissionStructure.value}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recurring</p>
                      <p className="font-medium">{mockPartnerData.commissionStructure.recurring ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">
                        {mockPartnerData.commissionStructure.durationMonths === 0
                          ? 'One-time'
                          : `${mockPartnerData.commissionStructure.durationMonths} months`}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Effective From</p>
                      <p className="font-medium">{formatDate(mockPartnerData.commissionStructure.effectiveFrom)}</p>
                    </div>
                    {mockPartnerData.commissionStructure.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-sm">{mockPartnerData.commissionStructure.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Historical Structures */}
                <h4 className="font-medium text-gray-500 mt-6 mb-4">Previous Structures</h4>
                {mockPartnerData.commissionHistory.map((history, index) => (
                  <div key={index} className="border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                      <div>
                        <p className="text-sm text-gray-500">Type</p>
                        <p className="font-medium capitalize">{history.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Value</p>
                        <p className="font-medium">
                          {history.type === 'percentage' 
                            ? `${history.value}%` 
                            : `₹${history.value}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Recurring</p>
                        <p className="font-medium">{history.recurring ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-medium">
                          {history.durationMonths === 0
                            ? 'One-time'
                            : `${history.durationMonths} months`}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Period</p>
                        <p className="font-medium">
                          {formatDate(history.effectiveFrom)} - {history.effectiveTo ? formatDate(history.effectiveTo) : 'N/A'}
                        </p>
                      </div>
                      {history.notes && (
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p className="text-sm">{history.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Referral Link Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Partner Referral Link</CardTitle>
          <CardDescription>Share this unique link with the partner for referrals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
              <Input 
                value={mockPartnerData.referralLink}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(mockPartnerData.referralLink)}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" size="sm">
                <LinkIcon className="h-4 w-4 mr-2" /> View Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Referred Sellers List */}
      <ReferrerReferralsList
        referrals={filteredSellers.map(seller => ({
          id: seller.id,
          storeName: seller.name,
          registrationDate: seller.joinDate,
          planType: seller.planType.toLowerCase(),
          pointsEligible: true,
          pointsEarned: seller.commissionEarned / 10,
          status: seller.planStatus
        }))}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        statusOptions={planStatusOptions}
        isPartnerView={true}
        referrerDetails={partnerAsReferrer}
      />
    </DashboardLayout>
  );
}
