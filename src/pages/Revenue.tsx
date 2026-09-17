import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RevenueStatsCards } from "@/components/revenue/RevenueStatsCards";
import { RevenueDistributionCharts } from "@/components/revenue/RevenueDistributionCharts";
import { SubscriptionPlanCards } from "@/components/revenue/SubscriptionPlanCards";
import { TopPerformingStores } from "@/components/revenue/TopPerformingStores";
import { RevenueByCityChart } from "@/components/revenue/RevenueByCityChart";
import { RevenueByBusinessCategoryChart } from "@/components/revenue/RevenueByBusinessCategoryChart";
import { RevenueStatsChart } from "@/components/revenue/RevenuStatsChart";
import { SellerRevenueTable } from "@/components/revenue/SellerRevenueTable";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";

export default function Revenue() {
 
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("today");
  const [dateRange, setDateRange] = useState<DateRange>();
  const [cityChartPeriod, setCityChartPeriod] = useState<PeriodType>("allTime");
  const [cityChartDateRange, setCityChartDateRange] = useState<DateRange>();
  const [categoryChartPeriod, setCategoryChartPeriod] =useState<PeriodType>("allTime");
  const [categoryChartDateRange, setCategoryChartDateRange] =useState<DateRange>();

  const [revenueData,                   setRevenueData]                   = useState<any>();
  const [monthlyGrowth,                 setMonthlyGrowth]                 = useState<any[]>([]);
  const [revenueSources,                setRevenueSources]                = useState<any[]>([]);
  const [subscriptionData,              setSubscriptionData]              = useState<any[]>([]);
  const [topPerformingStores,           setTopPerformingStores]           = useState<any[]>([]);
  const [revenueByCityData,             setRevenueByCityData]             = useState<any[]>([]);
  const [revenueByBusinessCategoryData, setRevenueByBusinessCategoryData] = useState<any[]>([]);

 
  const [revenueDataLoading,   setRevenueDataLoading]   = useState(false);
  const [growthLoading,        setGrowthLoading]        = useState(false);
  const [sourcesLoading,       setSourcesLoading]       = useState(false);
  const [subscriptionLoading,  setSubscriptionLoading]  = useState(false);
  const [topStoresLoading,     setTopStoresLoading]     = useState(false);
  const [cityLoading,          setCityLoading]          = useState(false);
  const [categoryLoading,      setCategoryLoading]      = useState(false);


  const distributionLoading = growthLoading || sourcesLoading;


  const token    = localStorage.getItem("userToken");
  const mode     = useSelector((s: RootState) => s.modal.mode);
  const dataType = useSelector((s: RootState) => s.modal.dataType);
  const baseURL  =
    mode === "dev"
      ? import.meta.env.VITE_BACKEND_DEV_URL
      : import.meta.env.VITE_BACKEND_PROD_URL;


  useEffect(() => {
    const fetchRevenueData = async () => {
      setRevenueDataLoading(true);
      try {
        const url = dateRange
          ? `${baseURL}api/v1/admin/revenue/revenue-data?is_test=${dataType}&startDate=${dateRange.from}&endDate=${dateRange.to}`
          : `${baseURL}api/v1/admin/revenue/revenue-data?is_test=${dataType}&date=${selectedPeriod}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRevenueData(res.data.revenueData);
      } catch (err) {
        console.error("Revenue data:", err);
      } finally {
        setRevenueDataLoading(false);
      }
    };
    fetchRevenueData();
  }, [selectedPeriod, dateRange, dataType, mode]);

  useEffect(() => {
    const fetchMonthlyGrowth = async () => {
      setGrowthLoading(true);
      try {
        const res = await axios.get(
          `${baseURL}api/v1/admin/revenue/monthly-breakdown?is_test=${dataType}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const data = res.data.monthlyBreakdown.map((m: any) => ({
          month: m.monthName,
          subscription: +m.subscriptionRevenue || 0,
          platform: +m.totalPlatformFee       || 0,
          wallet: +m.walletRevenue            || 0,
          other: +m.others                    || 0,
        }));
        setMonthlyGrowth(data.reverse());
      } catch (e) {
        console.error("Monthly growth:", e);
      } finally {
        setGrowthLoading(false);
      }
    };

    const fetchRevenueSources = async () => {
      setSourcesLoading(true);
      try {
        const res = await axios.get(
          `${baseURL}api/v1/admin/dashboard/revenue-sources?is_test=${dataType}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setRevenueSources(res.data.revenueSourcesData);
      } catch (e) {
        console.error("Revenue sources:", e);
      } finally {
        setSourcesLoading(false);
      }
    };

    fetchMonthlyGrowth();
    fetchRevenueSources();
  }, [dataType, mode]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setSubscriptionLoading(true);
      try {
        const url = dateRange
          ? `${baseURL}api/v1/admin/revenue/subscription-revenue?is_test=${dataType}&from=${dateRange.from}&to=${dateRange.to}`
          : `${baseURL}api/v1/admin/revenue/subscription-revenue?is_test=${dataType}&date=${selectedPeriod}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscriptionData(
          res.data.subscriptionData.sort((a: any, b: any) => b.revenue - a.revenue),
        );
      } catch (e) {
        console.error("Subscription data:", e);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    const fetchTopStores = async () => {
      setTopStoresLoading(true);
      try {
        const url = dateRange
          ? `${baseURL}api/v1/admin/revenue/top-performing?is_test=${dataType}&from=${dateRange.from}&to=${dateRange.to}`
          : `${baseURL}api/v1/admin/revenue/top-performing?is_test=${dataType}&date=${selectedPeriod}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopPerformingStores(res.data.topVendors);
      } catch (e) {
        console.error("Top stores:", e);
      } finally {
        setTopStoresLoading(false);
      }
    };

    fetchSubscriptionData();
    fetchTopStores();
  }, [selectedPeriod, dateRange, dataType, mode]);


  const fetchRevenueByCity = useCallback((period: PeriodType, range?: DateRange) => {
    setCityLoading(true);
    const url = range
      ? `${baseURL}api/v1/admin/revenue/revenue-by-city?is_test=${dataType}&from=${range.from}&to=${range.to}`
      : `${baseURL}api/v1/admin/revenue/revenue-by-city?is_test=${dataType}&date=${period}`;

    axios
      .get(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setRevenueByCityData(res.data.data))
      .catch(err => console.error("Revenue by city:", err))
      .finally(() => setCityLoading(false));
  }, [baseURL, dataType, token]);


  useEffect(() => {
    fetchRevenueByCity(cityChartPeriod, cityChartDateRange);
  }, [fetchRevenueByCity, cityChartPeriod, cityChartDateRange]);


  const fetchRevenueByCategory = useCallback(
    (period: PeriodType, range?: DateRange) => {
      setCategoryLoading(true);
      const url = range
        ? `${baseURL}api/v1/admin/revenue/revenue-by-category?is_test=${dataType}&from=${range.from}&to=${range.to}`
        : `${baseURL}api/v1/admin/revenue/revenue-by-category?is_test=${dataType}&date=${period}`;

      axios
        .get(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setRevenueByBusinessCategoryData(res.data.data))
        .catch(err => console.error("Revenue by category:", err))
        .finally(() => setCategoryLoading(false));
    },
    [baseURL, dataType, token],
  );


  useEffect(() => {
    fetchRevenueByCategory(categoryChartPeriod, categoryChartDateRange);
  }, [fetchRevenueByCategory, categoryChartPeriod, categoryChartDateRange]);

  const handlePeriodChange = useCallback(
    (period: PeriodType, range?: DateRange) => {
      setSelectedPeriod(period);
      setDateRange(range);
    },
    [],
  );

  const handleCityChartPeriodChange = useCallback(
    (period: PeriodType, range?: DateRange) => {
      setCityChartPeriod(period);
      setCityChartDateRange(range);
      fetchRevenueByCity(period, range);
    },
    [fetchRevenueByCity],
  );

  const handleCategoryChartPeriodChange = useCallback(
    (period: PeriodType, range?: DateRange) => {
      setCategoryChartPeriod(period);
      setCategoryChartDateRange(range);
      fetchRevenueByCategory(period, range);
    },
    [fetchRevenueByCategory],
  );

  return (
    <DashboardLayout
      title="Revenue Analytics"
      subtitle="Financial overview and revenue metrics"
    >
      <div className="flex justify-end mb-6">
        <PeriodFilter onPeriodChange={handlePeriodChange} defaultPeriod="today" />
      </div>

      <RevenueStatsCards revenueData={revenueData} loading={revenueDataLoading} />

      <RevenueDistributionCharts
        monthlyData={monthlyGrowth}
        sourcesData={revenueSources}
        loading={distributionLoading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SubscriptionPlanCards plans={subscriptionData} loading={subscriptionLoading} />
        <TopPerformingStores stores={topPerformingStores} loading={topStoresLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <RevenueByCityChart
          data={revenueByCityData}
          loading={cityLoading}
          onPeriodChange={handleCityChartPeriodChange}
        />
        <RevenueByBusinessCategoryChart
          data={revenueByBusinessCategoryData}
          loading={categoryLoading}
          onPeriodChange={handleCategoryChartPeriodChange}
        />
      </div>

      <div className="mt-6">
        <RevenueStatsChart
          title="Daily Revenue"
          description="Revenue generated per day"
          metricName="revenue"
        />
      </div>

      <SellerRevenueTable defaultPeriod="allTime" />
    </DashboardLayout>
  );
}
