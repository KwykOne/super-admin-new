import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { 
  Search, 
  Filter, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { 
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { getDateRangeFromPeriod } from "@/utils/dateUtils";
import { OrderStatistics } from "@/components/orders/OrderStatistics";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { DashboardLayout } from "@/components/DashboardLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { convertNumber, downloadTableAsCSV, formatDateTime, formatTableDataForDownload } from "@/utils/dataUtils";
import { toast } from "sonner";
import { DownloadButton } from "@/components/ui/download-button";

const orderData = [
  {
    id: "ORD-2023-1001",
    customerId: "CUST-12345",
    customerName: "Rajesh Kumar",
    storeName: "Sharma Electronics",
    storeCity: "Delhi",
    amount: "₹12,500",
    items: 3,
    status: "Delivered",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    date: "15 May 2023",
    time: "14:30",
    deliveryType: "Home Delivery",
    deliveryPartner: "Own Delivery",
    isTest: false,
  },
  {
    id: "ORD-2023-1002",
    customerId: "CUST-12346",
    customerName: "Anil Patel",
    storeName: "Patel Fashion",
    storeCity: "Mumbai",
    amount: "₹5,200",
    items: 2,
    status: "In Transit",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    date: "16 May 2023",
    time: "10:15",
    deliveryType: "Home Delivery",
    deliveryPartner: "Dunzo",
    isTest: false,
  },
  {
    id: "ORD-2023-1003",
    customerId: "CUST-12347",
    customerName: "Priya Singh",
    storeName: "Kumar Furniture",
    storeCity: "Bengaluru",
    amount: "₹25,000",
    items: 1,
    status: "New Order",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    date: "16 May 2023",
    time: "16:45",
    deliveryType: "Home Delivery",
    deliveryPartner: "Shiprocket",
    isTest: false,
  },
  {
    id: "ORD-2023-1004",
    customerId: "CUST-12348",
    customerName: "Sanjay Gupta",
    storeName: "Joshi Jewellers",
    storeCity: "Jaipur",
    amount: "₹45,000",
    items: 1,
    status: "Confirmed",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    date: "17 May 2023",
    time: "11:20",
    deliveryType: "Store Pickup",
    deliveryPartner: "N/A",
    isTest: false,
  },
  {
    id: "ORD-2023-1005",
    customerId: "CUST-12349",
    customerName: "Meena Reddy",
    storeName: "Reddy Handicrafts",
    storeCity: "Hyderabad",
    amount: "₹8,500",
    items: 4,
    status: "Ready",
    paymentMethod: "COD",
    paymentStatus: "Pending",
    date: "17 May 2023",
    time: "15:30",
    deliveryType: "In-Store",
    deliveryPartner: "N/A",
    isTest: false,
  },
  {
    id: "ORD-2023-1006",
    customerId: "CUST-12350",
    customerName: "Amit Sharma",
    storeName: "Sharma Electronics",
    storeCity: "Delhi",
    amount: "₹18,200",
    items: 2,
    status: "Delivered",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    date: "18 May 2023",
    time: "12:10",
    deliveryType: "Home Delivery",
    deliveryPartner: "Delhivery",
    isTest: false,
  },
  {
    id: "ORD-2023-1007",
    customerId: "CUST-12351",
    customerName: "Kavita Joshi",
    storeName: "Patel Fashion",
    storeCity: "Mumbai",
    amount: "₹3,800",
    items: 3,
    status: "Cancelled",
    paymentMethod: "Online",
    paymentStatus: "Refunded",
    date: "18 May 2023",
    time: "09:45",
    deliveryType: "Home Delivery",
    deliveryPartner: "Dunzo",
    isTest: false,
  },
  {
    id: "ORD-TEST-1001",
    customerId: "CUST-TEST",
    customerName: "Test User",
    storeName: "Test Store Alpha",
    storeCity: "Delhi",
    amount: "₹5,000",
    items: 2,
    status: "Ready",
    paymentMethod: "Online",
    paymentStatus: "Paid",
    date: "19 May 2023",
    time: "14:25",
    deliveryType: "Store Pickup",
    deliveryPartner: "N/A",
    isTest: true,
  },
];

const orderStatusCounts = {
  "New Order": 42,
  Confirmed: 35,
  Ready: 28,
  "In Transit": 19,
  Delivered: 163,
  Cancelled: 15,
  Rejected: 5,
};

const statusColors: Record<string, string> = {
  "New Order": "bg-blue-100 text-blue-800",
  Confirmed: "bg-purple-100 text-purple-800",
  Ready: "bg-amber-100 text-amber-800",
  "In Transit": "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
  Rejected: "bg-gray-100 text-gray-800",
};

const paymentStatusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800",
  Pending: "bg-amber-100 text-amber-800",
  Refunded: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};

const deliveryTypeColors: Record<string, string> = {
  "Home Delivery": "bg-blue-100 text-blue-800",
  "Store Pickup": "bg-purple-100 text-purple-800",
  "In-Store": "bg-teal-100 text-teal-800",
};

const cities = Array.from(new Set(orderData.map(order => order.storeCity)));
const statuses = Array.from(new Set(orderData.map(order => order.status)));
const paymentMethods = ["Online", "COD"];
const paymentStatuses = ["Paid", "Pending", "Refunded", "Failed"];
const deliveryTypes = ["Home Delivery", "Store Pickup", "In-Store"];
const deliveryPartners = Array.from(new Set(orderData.map(order => order.deliveryPartner)));

const statsByPeriod = {
  today: {
    totalOrders: "560",
    delivered: 163,
    inProgress: 382,
    cancelled: 15,
    totalTrend: 3,
    deliveredTrend: 4,
    inProgressTrend: 2,
    cancelledTrend: -1
  },
  last7days: {
    totalOrders: "3,240",
    delivered: 1180,
    inProgress: 1945,
    cancelled: 115,
    totalTrend: 5,
    deliveredTrend: 6,
    inProgressTrend: 4,
    cancelledTrend: -2
  },
  last30days: {
    totalOrders: "12,420",
    delivered: 7650,
    inProgress: 4120,
    cancelled: 650,
    totalTrend: 8,
    deliveredTrend: 9,
    inProgressTrend: 7,
    cancelledTrend: -3
  },
  thisMonth: {
    totalOrders: "10,240",
    delivered: 6280,
    inProgress: 3520,
    cancelled: 440,
    totalTrend: 7,
    deliveredTrend: 8,
    inProgressTrend: 6,
    cancelledTrend: -2
  },
  allTime: {
    totalOrders: "35,240",
    delivered: 22350,
    inProgress: 11240,
    cancelled: 1650,
    totalTrend: 12,
    deliveredTrend: 14,
    inProgressTrend: 10,
    cancelledTrend: -5
  }
};


function OrderFilters({ searchQuery, onSearchChange, filters, onFilterChange, onResetFilters, statuses, paymentMethods, paymentStatuses, deliveryTypes, deliveryPartners }) {
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Order Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders by ID, customer or store..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={onResetFilters} variant="outline" className="shrink-0">
              <Filter className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                    onCheckedChange={() => onFilterChange('status', status)}
                  >
                    {status}
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
                    onCheckedChange={() => onFilterChange('paymentMethod', method)}
                  >
                    {method}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Payment Status ({filters.paymentStatus.length || 'All'})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Payment Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {paymentStatuses.map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.paymentStatus.includes(status)}
                    onCheckedChange={() => onFilterChange('paymentStatus', status)}
                  >
                    {status}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Delivery Type ({filters.deliveryType.length || 'All'})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Delivery Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deliveryTypes.map((type) => (
                  <DropdownMenuCheckboxItem
                    key={type}
                    checked={filters.deliveryType.includes(type)}
                    onCheckedChange={() => onFilterChange('deliveryType', type)}
                  >
                    {type}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Delivery Partner ({filters.deliveryPartner.length || 'All'})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter by Delivery Partner</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {deliveryPartners.map((partner) => (
                  <DropdownMenuCheckboxItem
                    key={partner}
                    checked={filters.deliveryPartner.includes(partner)}
                    onCheckedChange={() => onFilterChange('deliveryPartner', partner)}
                  >
                    {partner}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Orders() {
  const token = localStorage.getItem('userToken')
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    dateRange: "all",
    city: "",
    status: [] as string[],
    paymentMethod: [] as string[],
    paymentStatus: [] as string[],
    deliveryType: [] as string[],
    deliveryPartner: [] as string[]
  });
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [stableOrderData] = useState(orderData);
  const mode = useSelector((state:RootState)=> state.modal.mode)
  const dataType = useSelector((state:RootState)=> state.modal.dataType)

  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL
    const [pageSize, setPageSize] = useState<number>(10);
      
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageWindowStart, setPageWindowStart] = useState(0); // index of the first visible pagination button
  const visiblePageCount = 3; // number of pagination buttons shown at a time
 
  const [orders,setOrders] = useState([])
  const [orderNumbers,setOrderNumbers] = useState()
  const [statuses, setStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentStatuses, setPaymentStatuses] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const [totalOrders,setTotalOrders] = useState(0);

  const getStatsForPeriod = useCallback(() => {
    return statsByPeriod[selectedPeriod as keyof typeof statsByPeriod] || statsByPeriod.today;
  }, [selectedPeriod]);
  
  const periodStats = useMemo(() => getStatsForPeriod(), [getStatsForPeriod]);

  const handlePeriodChange = useCallback((period: PeriodType, customDateRange?: DateRange) => {
    if (period === selectedPeriod && 
        (!customDateRange || 
          (dateRange?.from === customDateRange.from && 
           dateRange?.to === customDateRange.to))) {
      return;
    }
    
    setSelectedPeriod(period);
    
    if (customDateRange) {
      setDateRange(customDateRange);
    } else {
      setDateRange(getDateRangeFromPeriod(period));
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [selectedPeriod, dateRange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = useCallback((filterName: keyof typeof filters, item: string) => {
    setFilters(prev => {
      const currentItems = prev[filterName] as string[];
      return {
        ...prev,
        [filterName]: currentItems.includes(item)
          ? currentItems.filter(i => i !== item)
          : [...currentItems, item]
      };
    });
  }, []);

  const filteredOrders = useMemo(() => {
    return stableOrderData.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.storeName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filters.status.length === 0 || filters.status.includes(order.status);
      const matchesPaymentMethod = filters.paymentMethod.length === 0 || filters.paymentMethod.includes(order.paymentMethod);
      const matchesPaymentStatus = filters.paymentStatus.length === 0 || filters.paymentStatus.includes(order.paymentStatus);
      const matchesDeliveryType = filters.deliveryType.length === 0 || filters.deliveryType.includes(order.deliveryType);
      const matchesDeliveryPartner = filters.deliveryPartner.length === 0 || filters.deliveryPartner.includes(order.deliveryPartner);
      
      return matchesSearch && matchesStatus && matchesPaymentMethod && 
             matchesPaymentStatus && matchesDeliveryType && matchesDeliveryPartner;
    });
  }, [stableOrderData, searchQuery, filters]);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: "all",
      city: "",
      status: [],
      paymentMethod: [],
      paymentStatus: [],
      deliveryType: [],
      deliveryPartner: []
    });
    setDateRange({ from: undefined, to: undefined });
  }, []);


  useEffect(()=>{
    async function getOrders(){
      try{
        const response = await axios.get(`${baseURL}api/v2/admin/getall-orders?is_test=${dataType}&date=${selectedPeriod}&page=${currentPage}&order_status=${filters.status}&payment_mode=${filters.paymentMethod}&delivery_type=${filters.deliveryType}&delivery_partner=${filters.deliveryPartner}&query=${searchQuery}&rows_per_page=${pageSize}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setOrders(response.data.getOrderDetails)
        setTotalOrders(response.data.total)

      }
      catch(err){
        console.log(err)
      }
    }
    getOrders()
  },[dataType,dateRange,mode,selectedPeriod,filters,searchQuery,currentPage,pageSize])

  useEffect(()=>{
    async function getOrderNumberData() {
       let url = !selectedPeriod ?  `${baseURL}api/v1/admin/orders/order-data?is_test=${dataType}&from=${dateRange.from}&to=${dateRange.to}` :  `${baseURL}api/v1/admin/orders/order-data?is_test=${dataType}&date=${selectedPeriod}`
       try{
        const response = await axios.get(url,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setOrderNumbers(response.data.data)

      }
      catch(err){
        console.log(err)
      }
      }

      getOrderNumberData()
  },[dataType,dateRange,mode,selectedPeriod])

  useEffect(()=>{
    async function getFilters() {
    
      try{
       const response = await axios.get(`${baseURL}api/v2/admin/order/get-filters`,{
         headers:{
           Authorization:`Bearer ${token}`
         }
       })

       setStatuses(response.data.data.statuses)
      setPaymentMethods(response.data.data.paymentModes)
      setDeliveryTypes(response.data.data.orderType)
      setDeliveryPartners(response.data.data.deliveryPartner)
       
     }
     catch(err){
       console.log(err)
     }
     }

     getFilters()

  },[])

  const data = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return orders.slice(start, start + pageSize);
  }, [totalOrders, currentPage, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalOrders / pageSize)),
    [totalOrders, pageSize]
  );
  const handlePreviousPage = () => {
    setCurrentPage((prev) => {
      const newPage = Math.max(prev - 1, 1);
      if (newPage <= pageWindowStart + 1 && pageWindowStart > 0) {
        setPageWindowStart(pageWindowStart - visiblePageCount);
      }
      return newPage;
    });
  };
  
  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const newPage = Math.min(prev + 1, totalPages);
      if (newPage > pageWindowStart + visiblePageCount) {
        setPageWindowStart(pageWindowStart + visiblePageCount);
      }
      return newPage;
    });
  };

        async function getOrderData() {
          const loadId = toast.loading('Downloading Seller Data')
          try {
             let url = `${baseURL}api/v1/admin/orders/download-order-data?is_test=${dataType}&date=${selectedPeriod}&page=${currentPage}&order_status=${filters.status}&payment_mode=${filters.paymentMethod}&delivery_type=${filters.deliveryType}&delivery_partner=${filters.deliveryPartner}&query=${searchQuery}&rows_per_page=${pageSize}`
    
            const storesResponse = await axios.get(
              url,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
    
            let data = storesResponse.data.getOrderDetails.map(order => ({
                    Order_ID: order.id,
                    Customer: order?.revcivers_name || 'NA',
                    Store: order.vendorsDetails?.businessDetails?.business_name || 'NA',
                    Date: order.order_date ? formatDateTime(order.order_date) : 'NA',
                    Time: order.order_date ? new Date(order.order_date).toLocaleTimeString() : 'NA',
                    Amount: `RS ${order.payable_amount || 0}`,
                    Status: order.status || 'NA',
                    Delivery_Type: order.order_type || 'NA',
                    Delivery_Partner: order.shipmentDetails?.delivery_partner_name || 'NA',
                    Payment_Mode: order.payment_mode || 'NA',
                    Payment_Status: order.paymentStatus || 'NA'
                  }));
            
            const formattedData = formatTableDataForDownload(data);
            downloadTableAsCSV(formattedData, 'orders-list');
            toast.success("Download Completed")
            
          } catch (err) {
            toast.error("Error downloading order history")
            console.error("Error fetching store data:", err);
          }
          finally{
            toast.dismiss(loadId)
          }
        }
  
  return (
    <DashboardLayout title="Orders Management" subtitle="View and manage all customer orders">
      <div className="flex justify-end mb-4">
        <PeriodFilter 
          onPeriodChange={handlePeriodChange} 
          defaultPeriod="today"
        />
      </div>
      
      <OrderStatistics periodStats={orderNumbers} loading={loading} />
      
      <OrderFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        statuses={statuses}
        paymentMethods={paymentMethods}
        paymentStatuses={paymentStatuses}
        deliveryTypes={deliveryTypes}
        deliveryPartners={deliveryPartners}
      />
        <div className="flex justify-end my-6">
      <DownloadButton filename="sellers-list" data={orders} customDownload={getOrderData}/>
      </div>

      <Card className={`transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <OrdersTable 
              filteredOrders={orders} 
              loading={loading} 
              statusColors={statusColors}
              paymentStatusColors={paymentStatusColors}
              deliveryTypeColors={deliveryTypeColors}
              total={totalOrders}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
              <div className="w-full mt-4 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              
              {/* Left: Rows per page selector */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * pageSize  }-
                  { Math.min(currentPage * pageSize, totalOrders)} out of {totalOrders}
                </span>
              </div>
          
                    {/* Right: Pagination */}
                    <div className="flex items-center justify-end">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                          onClick={handlePreviousPage}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : " cursor-pointer"}
                            />
                          </PaginationItem>
                   {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(pageWindowStart, pageWindowStart + visiblePageCount)
                  .map((pageNum) => (
                    <PaginationItem key={pageNum}>
                      <button
                        className={cn(
                          "h-9 w-9 rounded-md border border-input flex items-center justify-center text-sm",
                          currentPage === pageNum
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        )}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </PaginationItem>
                ))}

                          <PaginationItem>
                            <PaginationNext
                              onClick={handleNextPage}
                              aria-disabled={currentPage === totalPages}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "  cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  </div>
                </div>

        </CardFooter>
      </Card>
    </DashboardLayout>
  );
}
