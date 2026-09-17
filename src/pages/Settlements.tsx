import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SettlementPeriodFilter } from "@/components/SettlementPeriodFilter";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  ArrowUpDown, 
  ChevronDown, 
  Eye 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Link } from "react-router-dom";

// Mock settlement data
const settlementData = [
  {
    id: "STL-2023-1001",
    sellerId: "SLR-2023-001",
    sellerName: "Sharma Electronics",
    city: "Delhi",
    amount: "₹45,250",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    initiatedDate: "15 May 2023",
    completedDate: "17 May 2023",
    orderCount: 12,
    isTest: false,
  },
  {
    id: "STL-2023-1002",
    sellerId: "SLR-2023-002",
    sellerName: "Patel Fashion",
    city: "Mumbai",
    amount: "₹32,800",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    initiatedDate: "16 May 2023",
    completedDate: "-",
    orderCount: 8,
    isTest: false,
  },
  {
    id: "STL-2023-1003",
    sellerId: "SLR-2023-003",
    sellerName: "Kumar Furniture",
    city: "Bengaluru",
    amount: "₹78,500",
    status: "Processing",
    paymentMethod: "Bank Transfer",
    initiatedDate: "16 May 2023",
    completedDate: "-",
    orderCount: 5,
    isTest: false,
  },
  {
    id: "STL-2023-1004",
    sellerId: "SLR-2023-004",
    sellerName: "Joshi Jewellers",
    city: "Jaipur",
    amount: "₹1,25,000",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    initiatedDate: "14 May 2023",
    completedDate: "16 May 2023",
    orderCount: 3,
    isTest: false,
  },
  {
    id: "STL-2023-1005",
    sellerId: "SLR-2023-005",
    sellerName: "Reddy Handicrafts",
    city: "Hyderabad",
    amount: "₹28,750",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    initiatedDate: "17 May 2023",
    completedDate: "-",
    orderCount: 7,
    isTest: false,
  },
  {
    id: "STL-2023-1006",
    sellerId: "SLR-2023-006",
    sellerName: "Singh Appliances",
    city: "Chandigarh",
    amount: "₹52,400",
    status: "Failed",
    paymentMethod: "Bank Transfer",
    initiatedDate: "15 May 2023",
    completedDate: "-",
    orderCount: 14,
    isTest: false,
  },
  {
    id: "STL-2023-1007",
    sellerId: "SLR-2023-007",
    sellerName: "Mehta Textiles",
    city: "Ahmedabad",
    amount: "₹41,200",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    initiatedDate: "13 May 2023",
    completedDate: "15 May 2023",
    orderCount: 10,
    isTest: false,
  },
  {
    id: "STL-TEST-1001",
    sellerId: "SLR-TEST-001",
    sellerName: "Test Store Alpha",
    city: "Delhi",
    amount: "₹15,000",
    status: "Completed",
    paymentMethod: "Bank Transfer",
    initiatedDate: "16 May 2023",
    completedDate: "16 May 2023",
    orderCount: 3,
    isTest: true,
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};

const cities = Array.from(new Set(settlementData.map(item => item.city)));
const statuses = ["Completed", "Pending", "Processing", "Failed"];
const paymentMethods = ["Bank Transfer", "Wallet Credit"];

export default function Settlements() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    status: [] as string[],
    city: [] as string[],
    paymentMethod: [] as string[],
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [settlementStats, setSettlementStats] = useState({
    totalAmount: "₹2.5 Lakh",
    pendingAmount: "₹1.2 Lakh",
    completedAmount: "₹1.3 Lakh",
    pendingCount: 42,
    completedCount: 38,
    settlementTrend: 4,
    pendingTrend: 2,
    completedTrend: 5
  });

  const handleDataUpdate = (data: any) => {
    setLoading(true);
    setTimeout(() => {
      setSettlementStats(data);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredSettlements = settlementData.filter(settlement => {
    const matchesSearch = 
      settlement.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(settlement.status);
    const matchesCity = filters.city.length === 0 || filters.city.includes(settlement.city);
    const matchesPaymentMethod = filters.paymentMethod.length === 0 || filters.paymentMethod.includes(settlement.paymentMethod);
    
    let matchesTab = true;
    if (activeTab === "pending") {
      matchesTab = settlement.status === "Pending" || settlement.status === "Processing";
    } else if (activeTab === "completed") {
      matchesTab = settlement.status === "Completed";
    } else if (activeTab === "failed") {
      matchesTab = settlement.status === "Failed";
    }
    
    return matchesSearch && matchesStatus && matchesCity && matchesPaymentMethod && matchesTab;
  });

  const resetFilters = () => {
    setFilters({
      status: [],
      city: [],
      paymentMethod: [],
    });
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <DashboardLayout
      title="Settlements"
      subtitle="Track and manage seller settlement payments"
      wip
    >
      <SettlementPeriodFilter onDataUpdate={handleDataUpdate} defaultPeriod="today" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
        <StatCard
          title="Total Settlement Amount"
          value={settlementStats.totalAmount}
          icon={<CreditCard size={22} />}
          description="All seller settlements"
          trend={settlementStats.settlementTrend}
          loading={loading}
          variant="primary"
        />
        <StatCard
          title="Pending Settlements"
          value={settlementStats.pendingAmount}
          icon={<Clock size={22} />}
          description={`${settlementStats.pendingCount} settlements pending`}
          trend={settlementStats.pendingTrend}
          loading={loading}
          variant="warning"
        />
        <StatCard
          title="Completed Settlements"
          value={settlementStats.completedAmount}
          icon={<CheckCircle size={22} />}
          description={`${settlementStats.completedCount} settlements completed`}
          trend={settlementStats.completedTrend}
          loading={loading}
          variant="success"
        />
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Settlement Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search settlements by ID or seller name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <DateRangePicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                className="w-full md:w-auto"
              />
              <Button onClick={resetFilters} variant="outline" className="shrink-0">
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Status ({filters.status.length || 'All'})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {statuses.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filters.status.includes(status)}
                      onCheckedChange={() => {
                        setFilters(prev => ({
                          ...prev,
                          status: prev.status.includes(status)
                            ? prev.status.filter(s => s !== status)
                            : [...prev.status, status]
                        }));
                      }}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    City ({filters.city.length || 'All'})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {cities.map((city) => (
                    <DropdownMenuCheckboxItem
                      key={city}
                      checked={filters.city.includes(city)}
                      onCheckedChange={() => {
                        setFilters(prev => ({
                          ...prev,
                          city: prev.city.includes(city)
                            ? prev.city.filter(c => c !== city)
                            : [...prev.city, city]
                        }));
                      }}
                    >
                      {city}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Payment Method ({filters.paymentMethod.length || 'All'})
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Payment Method</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {paymentMethods.map((method) => (
                    <DropdownMenuCheckboxItem
                      key={method}
                      checked={filters.paymentMethod.includes(method)}
                      onCheckedChange={() => {
                        setFilters(prev => ({
                          ...prev,
                          paymentMethod: prev.paymentMethod.includes(method)
                            ? prev.paymentMethod.filter(m => m !== method)
                            : [...prev.paymentMethod, method]
                        }));
                      }}
                    >
                      {method}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Settlements</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="animate-fade-in">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Settlement ID</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Initiated Date</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSettlements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No settlements found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSettlements.map((settlement) => (
                      <TableRow key={settlement.id} className={settlement.isTest ? "bg-gray-50" : ""}>
                        <TableCell className="font-medium">
                          <Link to={`/settlements/${settlement.id}`} className="hover:underline text-blue-600">
                            {settlement.id}
                          </Link>
                          {settlement.isTest && (
                            <Badge variant="outline" className="ml-2 text-xs">Test</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Link to={`/sellers/${settlement.sellerId}`} className="hover:underline text-blue-600">
                              {settlement.sellerName}
                            </Link>
                            <span className="text-xs text-gray-500">{settlement.city}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{settlement.amount}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[settlement.status]}>
                            {settlement.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{settlement.paymentMethod}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                            {settlement.initiatedDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {settlement.completedDate !== "-" ? (
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-4 w-4 text-gray-500" />
                              {settlement.completedDate}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{settlement.orderCount}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/settlements/${settlement.id}`}>
                              <Eye size={16} />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
