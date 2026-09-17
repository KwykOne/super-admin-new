
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { PieChart } from "@/components/dashboard/PieChart";
import { VendorExpiryTable } from "@/components/vendors/VendorExpiryTable";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Users, ShoppingCart, DollarSign, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { getDateRangeFromPeriod, formatPeriodLabel } from "@/utils/dateUtils";
import { convertNumber } from "@/utils/dataUtils";
import axios from "axios"
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Mock data
// const sellerStatusData = [
//   { status: "Live!", count: 100, color: "#16a34a", percentage: 40 },
//   { status: "Product Added", count: 120, color: "#1E40AF", percentage: 48 },
//   { status: "Contact Info Verified", count: 150, color: "#2563EB", percentage: 60 },
//   { status: "Customization Done", count: 180, color: "#3B82F6", percentage: 72 },
//   { status: "Profile Created", count: 210, color: "#60A5FA", percentage: 84 },
//   { status: "Mobile Verified", count: 250, color: "#93C5FD", percentage: 100 },
// ];



// Data by period
const dataByPeriod = {
  today: {
    sellerCount: "1,250",
    orderCount: "560",
    gmv: "₹14.8 L",
    revenue: "₹3.5 L",
    sellerTrend: 5,
    orderTrend: 3,
    gmvTrend: 4,
    revenueTrend: 6,
    monthlyGrowthData: [
      { month: "Jan", sellers: 120, orders: 1800, revenue: 40000 },
      { month: "Feb", sellers: 150, orders: 2200, revenue: 50000 },
      { month: "Mar", sellers: 180, orders: 2500, revenue: 62000 },
      { month: "Apr", sellers: 210, orders: 2800, revenue: 75000 },
      { month: "May", sellers: 250, orders: 3200, revenue: 90000 },
      { month: "Jun", sellers: 300, orders: 3800, revenue: 110000 },
    ],
    revenueSourcesData: [
      { name: "Subscription Fees", value: 50000 },
      // { name: "Platform Fees", value: 30000 },
      { name: "Wallet Recharge", value: 20000 },
      // { name: "Other Services", value: 10000 },
    ],
  },
  last7days: {
    sellerCount: "1,320",
    orderCount: "3,240",
    gmv: "₹1.2 Cr",
    revenue: "₹28.5 L",
    sellerTrend: 8,
    orderTrend: 5,
    gmvTrend: 7,
    revenueTrend: 10,
    monthlyGrowthData: [
      { month: "Jan", sellers: 150, orders: 2100, revenue: 48000 },
      { month: "Feb", sellers: 180, orders: 2500, revenue: 60000 },
      { month: "Mar", sellers: 210, orders: 2900, revenue: 72000 },
      { month: "Apr", sellers: 240, orders: 3200, revenue: 85000 },
      { month: "May", sellers: 280, orders: 3600, revenue: 98000 },
      { month: "Jun", sellers: 320, orders: 4000, revenue: 120000 },
    ],
    revenueSourcesData: [
      { name: "Subscription Fees", value: 60000 },
      { name: "Platform Fees", value: 35000 },
      { name: "Wallet Recharge", value: 22000 },
      { name: "Other Services", value: 12000 },
    ],
  },
  last30days: {
    sellerCount: "1,550",
    orderCount: "12,420",
    gmv: "₹3.8 Cr",
    revenue: "₹92 L",
    sellerTrend: 12,
    orderTrend: 9,
    gmvTrend: 11,
    revenueTrend: 15,
    monthlyGrowthData: [
      { month: "Jan", sellers: 180, orders: 2500, revenue: 55000 },
      { month: "Feb", sellers: 220, orders: 2900, revenue: 68000 },
      { month: "Mar", sellers: 260, orders: 3300, revenue: 82000 },
      { month: "Apr", sellers: 300, orders: 3700, revenue: 95000 },
      { month: "May", sellers: 350, orders: 4200, revenue: 110000 },
      { month: "Jun", sellers: 400, orders: 4800, revenue: 135000 },
    ],
    revenueSourcesData: [
      { name: "Subscription Fees", value: 70000 },
      { name: "Platform Fees", value: 42000 },
      { name: "Wallet Recharge", value: 25000 },
      { name: "Other Services", value: 15000 },
    ],
  },
  thisMonth: {
    sellerCount: "1,450",
    orderCount: "10,240",
    gmv: "₹3.2 Cr",
    revenue: "₹78 L",
    sellerTrend: 10,
    orderTrend: 7,
    gmvTrend: 9,
    revenueTrend: 12,
    monthlyGrowthData: [
      { month: "Jan", sellers: 160, orders: 2200, revenue: 50000 },
      { month: "Feb", sellers: 200, orders: 2600, revenue: 62000 },
      { month: "Mar", sellers: 240, orders: 3000, revenue: 75000 },
      { month: "Apr", sellers: 280, orders: 3400, revenue: 88000 },
      { month: "May", sellers: 320, orders: 3800, revenue: 100000 },
      { month: "Jun", sellers: 360, orders: 4200, revenue: 120000 },
    ],
    revenueSourcesData: [
      { name: "Subscription Fees", value: 65000 },
      { name: "Platform Fees", value: 38000 },
      { name: "Wallet Recharge", value: 22000 },
      { name: "Other Services", value: 13000 },
    ],
  },
  allTime: {
    sellerCount: "2,250",
    orderCount: "35,240",
    gmv: "₹8.5 Cr",
    revenue: "₹2.1 Cr",
    sellerTrend: 25,
    orderTrend: 18,
    gmvTrend: 22,
    revenueTrend: 30,
    monthlyGrowthData: [
      { month: "Jan", sellers: 220, orders: 3000, revenue: 70000 },
      { month: "Feb", sellers: 280, orders: 3500, revenue: 85000 },
      { month: "Mar", sellers: 340, orders: 4000, revenue: 100000 },
      { month: "Apr", sellers: 400, orders: 4500, revenue: 120000 },
      { month: "May", sellers: 460, orders: 5000, revenue: 140000 },
      { month: "Jun", sellers: 520, orders: 5500, revenue: 160000 },
    ],
    revenueSourcesData: [
      { name: "Subscription Fees", value: 90000 },
      { name: "Platform Fees", value: 55000 },
      { name: "Wallet Recharge", value: 35000 },
      { name: "Other Services", value: 20000 },
    ],
  }
};

const revenueColors = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];


export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('today');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const token = localStorage.getItem('userToken');

  
  const [dashboardData,      setDashboardData]      = useState({}) as any;
  const [monthlyGrowth,      setMonthlyGrowth]      = useState([]) as any;
  const [revenueSources,     setRevenueSources]     = useState([]);
  const [orderStatusData,    setOrderStatusData]    = useState([]);
  const [sellerStatusData,   setSellerStatusData]   = useState([]);

  const [loadingDashboard,   setLoadingDashboard]   = useState(true);
  const [loadingGrowth,      setLoadingGrowth]      = useState(true);
  const [loadingRevenue,     setLoadingRevenue]     = useState(true);
  const [loadingOrderStatus, setLoadingOrderStatus] = useState(true);
  const [loadingSeller,      setLoadingSeller]      = useState(true);

  /* ---------- APP CONFIG ---------- */
  const dataType = useSelector((s: RootState) => s.modal.dataType);
  const mode     = useSelector((s: RootState) => s.modal.mode);
  const baseURL  =
    mode === 'dev'
      ? import.meta.env.VITE_BACKEND_DEV_URL
      : import.meta.env.VITE_BACKEND_PROD_URL;

  /* ---------- 1. STATS OVERVIEW ---------- */
  useEffect(() => {
    (async () => {
      setLoadingDashboard(true);
      try {
        const url =
          selectedPeriod === 'customRange'
            ? `${baseURL}api/v1/admin/dashboard?is_test=${dataType}&date=customData&startDate=${dateRange?.from}&endDate=${dateRange?.to}`
            : `${baseURL}api/v1/admin/dashboard?is_test=${dataType}&date=${selectedPeriod}`;

        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(data.payload);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDashboard(false);
      }
    })();
  }, [selectedPeriod, dateRange, dataType, mode]);

  /* ---------- 2. ALL OTHER DASHBOARD CHARTS ---------- */
  useEffect(() => {
    async function fetchData() {
      /* start all loaders */
      setLoadingGrowth(true);
      setLoadingRevenue(true);
      setLoadingOrderStatus(true);
      setLoadingSeller(true);

      try {
        /* monthly growth */
        const growthRes = await axios.get(
          `${baseURL}api/v1/admin/dashboard/monthly-growth?is_test=${dataType}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const monthlyGrowth = growthRes.data.payload.map((i: any) => ({
          month: i.monthName,
          sellers: i.storeCount,
          orders: i.orderCount,
          revenue: i.revenueData,
        }));
        setMonthlyGrowth(monthlyGrowth.reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingGrowth(false);
      }

      try {
        /* revenue sources */
        const revRes = await axios.get(
          `${baseURL}api/v1/admin/dashboard/revenue-sources?is_test=${dataType}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRevenueSources([...revRes.data.revenueSourcesData]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRevenue(false);
      }

      try {
        /* order status */
        const orderRes = await axios.get(
          `${baseURL}api/v1/admin/dashboard/order-status?is_test=${dataType}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrderStatusData([...orderRes.data.orderStatusData]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingOrderStatus(false);
      }

      try {
        /* seller funnel */
        const sellerRes = await axios.get(
          `${baseURL}api/v1/admin/dashboard/selling-funnel?is_test=${dataType}&date=all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSellerStatusData([...sellerRes.data.sellerStatusData]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingSeller(false);
      }
    }

    fetchData();
  }, [dataType, mode]);

  /* ---------- PERIOD PICKER HELPERS ---------- */
  const getDataForPeriod = () =>
    dataByPeriod[selectedPeriod as keyof typeof dataByPeriod] ||
    dataByPeriod.today;
  const periodData = getDataForPeriod();

  const handlePeriodChange = (p: PeriodType, dr?: DateRange) => {
    setSelectedPeriod(p);
    setDateRange(dr);
  };

  return (
    <DashboardLayout
      title="Dashboard Overview"
      subtitle="Welcome to BharatGo Super Admin Dashboard"
    >
      <div className="flex justify-end mb-6">
        <PeriodFilter onPeriodChange={handlePeriodChange} />
      </div>

      {/* --- Stat cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">
        <StatCard
          title="Total Sellers"
          value={convertNumber(dashboardData.storeCount)}
          icon={<Users size={22} />}
          description="Across all stages"
          trend={periodData.sellerTrend}
          loading={loadingDashboard}
          variant="primary"
          onClick={() => navigate('/sellers')}
        />
        <StatCard
          title="Total Orders"
          value={convertNumber(dashboardData.orderCount)}
          icon={<ShoppingCart size={22} />}
          description="From all stores"
          trend={periodData.orderTrend}
          loading={loadingDashboard}
          variant="success"
          onClick={() => navigate('/orders')}
        />
        <StatCard
          title="GMV Powered"
          value={convertNumber(dashboardData.totalOrderSales)}
          icon={<IndianRupee size={22} />}
          description="Total order value"
          trend={periodData.gmvTrend}
          loading={loadingDashboard}
          variant="warning"
          onClick={() => navigate('/revenue')}
        />
        <StatCard
          title="BharatGo Revenue"
          value={convertNumber(dashboardData.revenueData)}
          icon={<DollarSign size={22} />}
          description="All revenue sources"
          trend={dashboardData.revenueData}
          loading={loadingDashboard}
          variant="danger"
          onClick={() => navigate('/revenue')}
        />
      </div>

      {/* --- Charts --- */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          <BarChart
            title="Monthly Growth"
            description="Sellers, orders and revenue trends"
            data={monthlyGrowth}
            xAxisKey="month"
            categories={[
              { name: 'sellers', color: '#3B82F6' },
              { name: 'orders', color: '#10B981' },
              { name: 'revenue', color: '#F59E0B' },
            ]}
            loading={loadingGrowth}
          />
          <PieChart
            title="Revenue Sources"
            description="Breakdown of BharatGo revenue streams"
            data={revenueSources}
            dataKey="value"
            nameKey="name"
            colors={revenueColors}
            loading={loadingRevenue}
          />
        </div>
      </div>

      {/* --- Funnel & Order status --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 min-w-0">
        <Card className="h-80">
          <CardHeader>
            <CardTitle>Seller Onboarding Funnel</CardTitle>
            <CardDescription>Sellers at different stages</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSeller ? (
              /* skeleton placeholders */
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sellerStatusData.map((item) => (
                  <div key={item.status}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          item.status === 'Live!' && 'text-green-600 font-bold'
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.count} sellers (
                        {Math.round(item.percentage * 100) / 100}%)
                      </span>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Order Status</CardTitle>
            <CardDescription>Distribution of orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingOrderStatus ? (
              /* skeleton placeholders */
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {orderStatusData.map((item) => (
                  <div key={item.status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.status}</span>
                      <span className="text-sm text-gray-500">
                        {item.count} orders (
                        {Math.round(item.percentage * 100) / 100}%)
                      </span>
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2"
                      indicatorClassName={
                        item.status === 'Cancelled'
                          ? 'bg-red-500'
                          : item.status === 'Delivered'
                          ? 'bg-green-500'
                          : 'bg-bharatgo-primary'
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Vendor Plan Expiry Table --- */}
      <div className="mt-10">
        <VendorExpiryTable />
      </div>
    </DashboardLayout>
  );
}

