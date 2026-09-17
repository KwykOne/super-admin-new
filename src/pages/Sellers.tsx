import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellerStatsCards } from "@/components/sellers/SellerStatsCards";
import { SellerDistributionCharts } from "@/components/sellers/SellerDistributionCharts";
import { SellerFilters } from "@/components/sellers/SellerFilters";
import { SellerListTable } from "@/components/sellers/SellerListTable";
import { DailyStatsChart } from "@/components/dashboard/DailyStatsChart";
import { PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { DownloadButton } from "@/components/ui/download-button";
import { downloadTableAsCSV, formatDate, formatDateTime, formatTableDataForDownload } from "@/utils/dataUtils";
import { toast } from "sonner";

const sellersData = [{
  id: "SLR-2023-001",
  name: "Sharma Electronics",
  ownerName: "Rajesh Sharma",
  city: "Delhi",
  phone: "+91 9876543210",
  email: "sharma@example.com",
  category: "Electronics",
  onboardingStage: "Live!",
  status: "Active",
  plan: "PRO",
  joinDate: "15 Jan 2023",
  lastActive: "2 hours ago",
  storeUrl: "sharma-electronics.bharatgo.com",
  totalOrders: 156,
  totalRevenue: "₹2,45,000"
}, {
  id: "SLR-2023-002",
  name: "Patel Fashion",
  ownerName: "Anil Patel",
  city: "Mumbai",
  phone: "+91 9876543211",
  email: "patel@example.com",
  category: "Apparel",
  onboardingStage: "Product Added",
  status: "Active",
  plan: "Standard-Trial",
  joinDate: "20 Jan 2023",
  lastActive: "5 hours ago",
  storeUrl: "patel-fashion.bharatgo.com",
  totalOrders: 89,
  totalRevenue: "₹1,23,000"
}, {
  id: "SLR-2023-003",
  name: "Kumar Furniture",
  ownerName: "Sunil Kumar",
  city: "Bengaluru",
  phone: "+91 9876543212",
  email: "kumar@example.com",
  category: "Furniture",
  onboardingStage: "Contact Info Verified",
  status: "Active",
  plan: "Standard",
  joinDate: "25 Jan 2023",
  lastActive: "1 day ago",
  storeUrl: "kumar-furniture.bharatgo.com",
  totalOrders: 37,
  totalRevenue: "₹87,000"
}, {
  id: "SLR-2023-004",
  name: "Joshi Jewellers",
  ownerName: "Amit Joshi",
  city: "Jaipur",
  phone: "+91 9876543213",
  email: "joshi@example.com",
  category: "Jewelry",
  onboardingStage: "Customization Done",
  status: "Active",
  plan: "PRO-Trial",
  joinDate: "30 Jan 2023",
  lastActive: "3 days ago",
  storeUrl: "joshi-jewellers.bharatgo.com",
  totalOrders: 18,
  totalRevenue: "₹2,15,000"
}, {
  id: "SLR-2023-005",
  name: "Reddy Handicrafts",
  ownerName: "Meena Reddy",
  city: "Hyderabad",
  phone: "+91 9876543214",
  email: "reddy@example.com",
  category: "Handicrafts",
  onboardingStage: "Mobile Verified",
  status: "Inactive",
  plan: "Free",
  joinDate: "5 Feb 2023",
  lastActive: "15 days ago",
  storeUrl: "reddy-handicrafts.bharatgo.com",
  totalOrders: 0,
  totalRevenue: "₹0"
}, {
  id: "SLR-2023-006",
  name: "Gupta Stationery",
  ownerName: "Rahul Gupta",
  city: "Kolkata",
  phone: "+91 9876543215",
  email: "gupta@example.com",
  category: "Stationery",
  onboardingStage: "OTP Not Entered",
  status: "Inactive",
  plan: "Free",
  joinDate: "10 Feb 2023",
  lastActive: "20 days ago",
  storeUrl: "gupta-stationery.bharatgo.com",
  totalOrders: 0,
  totalRevenue: "₹0"
}, {
  id: "SLR-2023-007",
  name: "Singh Optics",
  ownerName: "Manjeet Singh",
  city: "Chandigarh",
  phone: "+91 9876543216",
  email: "singh@example.com",
  category: "Eyewear",
  onboardingStage: "Profile Created",
  status: "Active",
  plan: "Enterprise",
  joinDate: "15 Feb 2023",
  lastActive: "4 hours ago",
  storeUrl: "singh-optics.bharatgo.com",
  totalOrders: 112,
  totalRevenue: "₹1,75,000"
}, {
  id: "SLR-2023-008",
  name: "Desai Pharmaceuticals",
  ownerName: "Vikram Desai",
  city: "Ahmedabad",
  phone: "+91 9876543217",
  email: "desai@example.com",
  category: "Pharmacy",
  onboardingStage: "Live!",
  status: "Active",
  plan: "PRO",
  joinDate: "20 Feb 2023",
  lastActive: "1 hour ago",
  storeUrl: "desai-pharma.bharatgo.com",
  totalOrders: 78,
  totalRevenue: "₹95,000"
}, {
  id: "SLR-2023-009",
  name: "Agarwal Books",
  ownerName: "Deepak Agarwal",
  city: "Lucknow",
  phone: "+91 9876543218",
  email: "agarwal@example.com",
  category: "Books",
  onboardingStage: "Product Skipped",
  status: "Lapsed",
  plan: "Standard",
  joinDate: "25 Feb 2023",
  lastActive: "30 days ago",
  storeUrl: "agarwal-books.bharatgo.com",
  totalOrders: 25,
  totalRevenue: "₹15,000"
}, {
  id: "SLR-2023-010",
  name: "Mehta Sports",
  ownerName: "Ravi Mehta",
  city: "Pune",
  phone: "+91 9876543219",
  email: "mehta@example.com",
  category: "Sports Goods",
  onboardingStage: "Customization Skipped",
  status: "Active",
  plan: "Standard",
  joinDate: "1 Mar 2023",
  lastActive: "12 hours ago",
  storeUrl: "mehta-sports.bharatgo.com",
  totalOrders: 45,
  totalRevenue: "₹67,000"
}];

const onboardingStages = ["OTP Not Entered", "Mobile Verified", "Profile Created", "Customization Done", "Customization Skipped", "Contact Info Verified", "Product Added", "Product Skipped", "Live!"];
const statuses = ["Active", "Inactive", "Lapsed"];
const plans = ["Free", "Standard-Trial", "Standard", "PRO-Trial", "PRO", "Enterprise"];
const cities = Array.from(new Set(sellersData.map(seller => seller.city)));
const categories = Array.from(new Set(sellersData.map(seller => seller.category)));

const stageData = onboardingStages.map(stage => ({
  name: stage,
  value: sellersData.filter(seller => seller.onboardingStage === stage).length
})).filter(item => item.value > 0);

const planData = plans.map(plan => ({
  name: plan,
  value: sellersData.filter(seller => seller.plan === plan).length
})).filter(item => item.value > 0);

const statusData = statuses.map(status => ({
  name: status,
  value: sellersData.filter(seller => seller.status === status).length
})).filter(item => item.value > 0);

const sellerDataByPeriod = {
  today: {
    totalSellers: 24,
    liveSellers: 8,
    onboardingSellers: 16
  },
  yesterday: {
    totalSellers: 22,
    liveSellers: 7,
    onboardingSellers: 15
  },
  last7days: {
    totalSellers: 20,
    liveSellers: 10,
    onboardingSellers: 10
  },
  last30days: {
    totalSellers: 18,
    liveSellers: 12,
    onboardingSellers: 6
  },
  thisMonth: {
    totalSellers: 15,
    liveSellers: 9,
    onboardingSellers: 6
  },
  lastMonth: {
    totalSellers: 12,
    liveSellers: 7,
    onboardingSellers: 5
  },
  allTime: {
    totalSellers: 10,
    liveSellers: 6,
    onboardingSellers: 4
  }
};

const PAGE_SIZE = 20;

export default function Sellers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    cities: [] as string[],
    categories: [] as string[],
    storeStatuses: [] as string[],
    statuses: [] as string[],
    plans: [] as string[]
  });

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeStatuses, setStoreStatuses] = useState([]);
  const token = localStorage.getItem('userToken')
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sellerData, setSellerData] = useState({}) as any
  const [periodStats, setPeriodStats] = useState(sellerDataByPeriod.today);
  const [sellerStatusData, setSellerStatusData] = useState([])
  const [sellerPlanData, setSellerPlanData] = useState([]);
  const [sellerCityData, setSellerCityData] = useState([]);
  const [sellerCategoryData, setSellerCategoryData] = useState([]);
  const [allStoreData, setAllStoreData] = useState([])

  const [activityData, setActivityData] = useState([]) as any;
  const [totalStore,setTotalStores] = useState(0);

  // both , test or real
  const dataType = useSelector((state: RootState) => state.modal.dataType)
  const mode = useSelector((state: RootState) => state.modal.mode)

  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL
  
  const [pageSize, setPageSize] = useState<number>(10);
    
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageWindowStart, setPageWindowStart] = useState(0); // index of the first visible pagination button
    const visiblePageCount = 3; // number of pagination buttons shown at a time

  useEffect(() => {
    (async () => {
      try {
        const isCustom = selectedPeriod === "customRange";
        // Seller Data API URL
        let sellerUrl = isCustom
          ? `${baseURL}api/v1/admin/sellers?is_test=${dataType}&date=customData&startDate=${dateRange.from}&endDate=${dateRange.to}`
          : `${baseURL}api/v1/admin/sellers?is_test=${dataType}&date=${selectedPeriod}`;
        const sellerResponse = await axios.get(sellerUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSellerData(sellerResponse.data);
        // Seller Status Funnel API
        let funnelUrl = isCustom
          ? `${baseURL}api/v1/admin/dashboard/selling-funnel?is_test=${dataType}&date=customData&startDate=${dateRange.from}&endDate=${dateRange.to}`
          : `${baseURL}api/v1/admin/dashboard/selling-funnel?is_test=${dataType}&date=${selectedPeriod}`;
        const funnelResponse = await axios.get(funnelUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sellerStatusData = funnelResponse.data.sellerStatusData.map((item) => ({
          name: item.status,
          value: item.count,
        }));
        setSellerStatusData(sellerStatusData);
        // Seller Subscription Plans API
        let planUrl = isCustom
          ? `${baseURL}api/v1/admin/sellers/subscription-plans?is_test=${dataType}&date=customData&startDate=${dateRange.from}&endDate=${dateRange.to}`
          : `${baseURL}api/v1/admin/sellers/subscription-plans?is_test=${dataType}&date=${selectedPeriod}`;
        const planResponse = await axios.get(planUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const subscriptionPlans = planResponse.data.subscriptionData.map(
          ({ plan_name, ...rest }) => ({
            ...rest,
            name: plan_name,
          })
        );
        setSellerPlanData(subscriptionPlans);
        // Seller City Distribution API
        let cityDataUrl = `${baseURL}api/v1/admin/sellers/sellers-by-city?is_test=${dataType}&date=all`;
        try {
          const cityResponse = await axios.get(cityDataUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (cityResponse.data && cityResponse.data.data) {

            setSellerCityData( cityResponse.data.data);
          } 
        } catch (err) {
          console.error("Error fetching seller city data:", err);

        }

        let categoryDataUrl = `${baseURL}api/v1/admin/sellers/sellers-by-category?is_test=${dataType}&date=all`;
        try {
          const categoryResponse = await axios.get(categoryDataUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (categoryResponse.data && categoryResponse.data.data) {
            const processedCategoryData = categoryResponse.data.categoryData.map(item => ({
              name: item.category || "Other",
              value: item.value
            }));
            setSellerCategoryData(processedCategoryData);
          } 
        } catch (err) {
          console.error("Error fetching seller category data:", err);

        }
      } catch (err) {
        console.error("Error fetching seller data:", err);
      }
    })();
  }, [selectedPeriod, dateRange, dataType, mode]);

  useEffect(() => {
    async function getFilterData() {
      try {
        const filterResponse = await axios.get(`${baseURL}api/v2/admin/filterData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { cities, storeStatuses, categories } = filterResponse.data.payload;

        //update the array and set null to stringified null so that we can  pass it as filter to the backend
        const updatedCityArray = cities.map((city) => city === null ? 'null' : city)
        setCities(updatedCityArray);
        setStoreStatuses(storeStatuses);
        setCategories(categories);
      } catch (err) {
        console.error("Error fetching filter data:", err);
      }
    }

    getFilterData();
  }, [mode]);

  // Fetch store data - run when filters or dataType changes
  useEffect(() => {
    async function getStoreData() {
      try {

        const storesResponse = await axios.get(
          `${baseURL}api/v2/admin/stores?page=${currentPage}&status=&is_test=${dataType}&q=${searchQuery}&categories=${filters.categories}&cities=${filters.cities}&stages=${filters.storeStatuses}&rows_per_page=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
 
        setAllStoreData(storesResponse.data.payload);
        setTotalStores(storesResponse.data.totalStore)
      } catch (err) {
        console.error("Error fetching store data:", err);
      }
    }
    getStoreData();
  }, [dataType, filters, searchQuery, currentPage, mode,pageSize]);

  useEffect(() => {
    fetchActiveSellers();
  }, [])


  const handlePeriodChange = useCallback((period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
    const periodData = sellerDataByPeriod[period as keyof typeof sellerDataByPeriod] || sellerDataByPeriod.today;
    setPeriodStats(periodData);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  const handleFilterChange = useCallback((filterName: keyof typeof filters, item: string) => {
    setFilters(prev => {
      const currentItems = prev[filterName];
      return {
        ...prev,
        [filterName]: currentItems.includes(item)
          ? currentItems.filter(i => i !== item)
          : [...currentItems, item]
      };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      cities: [],
      categories: [],
      storeStatuses: [],
      statuses: [],
      plans: []
    });
  }, []);

  const getFilteredSellers = useCallback(() => {
    return sellersData.filter(seller => {
      const matchesSearch = searchQuery === "" ||
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" ||
        (activeTab === "active" && seller.status === "Active") ||
        (activeTab === "inactive" && seller.status === "Inactive") ||
        (activeTab === "lapsed" && seller.status === "Lapsed") ||
        (activeTab === "onboarding" && seller.onboardingStage !== "Live!");
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(seller.city);
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(seller.category);
      const matchesStage = filters.storeStatuses.length === 0 || filters.storeStatuses.includes(seller.onboardingStage);
      return matchesSearch && matchesTab && matchesCity && matchesCategory && matchesStage;
    });
  }, [searchQuery, activeTab, filters]);

  const getDailySellersData = useCallback((startDate: Date, endDate: Date) => {
    const days = [];
    let currentDate = new Date(startDate);
    const getRandomValueForDate = (date: Date) => {
      const dateNum = date.getDate() + date.getMonth() * 31;
      return Math.floor((Math.sin(dateNum) * 10000) % 15) + 5;
    };
    while (currentDate <= endDate) {
      days.push({
        date: new Date(currentDate),
        value: getRandomValueForDate(currentDate)
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  }, []);

  // Add handlers for city and category chart period filters
  const handleChartPeriodChange = useCallback((chartType: string, period: PeriodType, dateRange?: DateRange) => {
    // Set loading state to show loading indicators
    setLoading(true);

    let dataUrl;
    const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL;
    const isCustom = period === "customRange";
    if (chartType === 'city') {
      dataUrl = isCustom
        ? `${baseURL}api/v1/admin/sellers/sellers-by-city?is_test=${dataType}&date=customData&startDate=${dateRange?.from}&endDate=${dateRange?.to}`
        : `${baseURL}api/v1/admin/sellers/sellers-by-city?is_test=${dataType}&date=${period}`;


      axios.get(dataUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.data && response.data.data) {

            setSellerCityData(response.data.data);
          }
        })
        .catch(err => {
          console.error("Error fetching seller city data by period:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (chartType === 'category') {
      dataUrl = isCustom
        ? `${baseURL}api/v1/admin/sellers/sellers-by-category?is_test=${dataType}&date=customData&startDate=${dateRange?.from}&endDate=${dateRange?.to}`
        : `${baseURL}api/v1/admin/sellers/sellers-by-category?is_test=${dataType}&date=${period}`;

      // Fetch category data with period  
      axios.get(dataUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (response.data && response.data.data) {

            setSellerCategoryData(response.data.data);
          }
        })
        .catch(err => {
          console.error("Error fetching seller category data by period:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, dataType, mode,]);


  const statusPieData = activityData && activityData?.summary
    ? [
      { name: "Active", value: activityData?.summary?.activeCount || 0 },
      { name: "Inactive", value: activityData?.summary?.inactiveCount || 0 },
      { name: "Lapsed", value: activityData?.summary?.lapsedCount || 0 },
    ]
    : [];

  const fetchActiveSellers = async () => {
    try {
      const response = await axios.get(`${baseURL}api/v1/analytics/seller-activity-status`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.POSTHOG_API_KEY}`,
          },
        });

      setActivityData(response.data);
    } catch (error) {
      console.error("Error fetching active sellers:", error);
    }
  }

  const activeSellers = activityData?.sellers?.active || [];
  const inactiveSellers = activityData?.sellers?.inactive || [];
  const lapsedSellers = activityData?.sellers?.lapsed || [];

  const isApiTab = ["active", "inactive", "lapsed"].includes(activeTab);

  const tabToSellersMap: Record<string, any[]> = {
    all: allStoreData,
    active: activeSellers,
    inactive: inactiveSellers,
    lapsed: lapsedSellers,
  };
  const sellersToShow = tabToSellersMap[activeTab] ?? allStoreData;

  const paginatedSellers = isApiTab
    ? sellersToShow.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : sellersToShow;

      const data = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return allStoreData.slice(start, start + pageSize);
      }, [totalStore, currentPage, pageSize]);
    
      const totalPages = useMemo(
        () => Math.max(1, Math.ceil(totalStore / pageSize)),
        [totalStore, pageSize]
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
      async function getStoreData() {
        const loadId = toast.loading('Downloading Seller Data')
        try {
  
          const storesResponse = await axios.get(
            `${baseURL}api/v1/admin/sellers/download-seller-data?status=&is_test=${dataType}&q=${searchQuery}&categories=${filters.categories}&cities=${filters.cities}&stages=${filters.storeStatuses}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          let data = storesResponse.data.payload.map(seller => ({
            Store_ID: seller.bharatgo_unique_id || '',
            Store_Name: seller.businessDetails?.business_name || 'NA',
            Owner_Name: seller.vendor_name || 'NA',
            City: seller.businessDetails?.city || 'NA',
            Category: seller.businessDetails?.shop_category || 'NA',
            Onboarding_Stage: seller.store_status || 'NA',
            Plan: seller.planDetails?.globalPlanMaster?.plan_name || 'NA',
            Registration_Date: seller.created_on ? formatDate(seller.created_on) :'NA',
            Mobile: seller.registered_mobileno || 'NA',
            Email: seller.email || 'NA'
          }));
    
          const formattedData = formatTableDataForDownload(data);
          downloadTableAsCSV(formattedData, 'sellers-list');
          toast.success("Download Completed")
          
        } catch (err) {
          console.error("Error fetching store data:", err);
        }
        finally{
          toast.dismiss(loadId)
        }
      }
  return (
    <DashboardLayout title="Seller Management" subtitle="View and manage all registered sellers">
      <SellerStatsCards
        totalSellers={sellerData.total}
        liveSellers={sellerData.liveSellers}
        onboardingSellers={sellerData.onboarding}
        loading={loading}
        onPeriodChange={handlePeriodChange}
      />

      <Card className="animate-fade-in mb-4">
        <CardHeader>
          <CardTitle>Seller List</CardTitle>
          <CardDescription>View and manage all registered sellers</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Sellers</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="lapsed">Lapsed</TabsTrigger>
            </TabsList>
          </Tabs>

          <SellerFilters
            filters={filters}
            cities={cities}
            categories={categories}
            storeStatuses={storeStatuses}
            statuses={statuses}
            plans={plans}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
          />
        <div className="flex justify-end mt-6">
        <DownloadButton filename="sellers-list" data={allStoreData} customDownload={getStoreData}/>
        </div>
                    
          <div className="mt-6 overflow-x-auto">
            <SellerListTable sellers={paginatedSellers} loading={loading}  />
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
                { Math.min(currentPage * pageSize, totalStore)} out of {totalStore}
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

      <SellerDistributionCharts
        stageData={sellerStatusData}
        planData={sellerPlanData}
        statusData={statusPieData}
        cityData={sellerCityData}
        categoryData={sellerCategoryData}
        loading={loading}
        onPeriodChange={handleChartPeriodChange}
      />

      <div className="mt-6">
        <DailyStatsChart
          title="New Sellers"
          description="Number of new sellers registered per day"
          metricName="newSellers"

        />
      </div>
    </DashboardLayout>
  );
}
