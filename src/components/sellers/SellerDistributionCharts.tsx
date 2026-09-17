
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/dashboard/PieChart";
import { BarChart as Bars, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";

interface ChartData {
  name: string;
  value: number;
}

interface DistributionChartsProps {
  stageData: ChartData[];
  planData: ChartData[];
  statusData: ChartData[];
  cityData: ChartData[];
  categoryData: ChartData[];
  loading: boolean;
  onPeriodChange?: (chartType: string, period: PeriodType, dateRange?: DateRange) => void;
}

export function SellerDistributionCharts({ 
  stageData, 
  planData, 
  statusData,
  cityData,
  categoryData,
  loading,
  onPeriodChange 
}: any) {
  const stageColors = [
    "#a7f3d0",  // Light Green
    "#22d3ee",  // Light Blue
    "#9333ea",  // Purple
    "#f97316",  // Orange
    "#10b981",  // Green
    "#3b82f6",  // Blue
    "#e11d48",  // Red
    "#f59e0b",  // Amber
    "#4b5563"   // Gray
  ];
  
  const planColors = [
    "#f9a8d4",  // Pink
    "#fbbf24",  // Yellow
    "#34d399",  // Teal
    "#60a5fa",  // Light Blue
    "#8b5cf6",  // Indigo
    "#d97706"   // Amber
  ];
  
  const statusColors = ["#4ade80", "#d1d5db", "#f87171"];

  const cityColors = [
    "#3B82F6",  // Blue
    "#10B981",  // Green
    "#F59E0B",  // Amber
    "#EF4444",  // Red
    "#8B5CF6",  // Indigo
    "#EC4899",  // Pink
    "#06B6D4",  // Cyan
    "#14B8A6",  // Teal
    "#F97316",  // Orange
    "#A855F7",  // Purple
  ];
  
  const categoryColors = [
    "#0EA5E9",  // Sky
    "#84CC16",  // Lime
    "#F43F5E",  // Rose
    "#6366F1",  // Indigo
    "#D946EF",  // Fuchsia
    "#22D3EE",  // Cyan
    "#F59E0B",  // Amber
    "#10B981",  // Emerald
    "#6D28D9",  // Violet
    "#EC4899",  // Pink
  ];

  // Create horizontal bar chart data for city and category
  const cityChartData = cityData.map(item => ({
    city: item.city,
    value: item.value
  }));

  const categoryChartData = categoryData.map(item => ({
    category: item.category,
    value: item.value
  }));
  
  const handleCityPeriodChange = (period: PeriodType, dateRange?: DateRange) => {
    if (onPeriodChange) {
      onPeriodChange('city', period, dateRange);
    }
  };

  const handleCategoryPeriodChange = (period: PeriodType, dateRange?: DateRange) => {
    if (onPeriodChange) {
      onPeriodChange('category', period, dateRange);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 animate-fade-in">
      <Card className="col-span-1 w-[90vw] md:w-[85vw] lg:w-auto ">
        <CardHeader>
          <CardTitle>Onboarding Stages</CardTitle>
          <CardDescription>Seller distribution by stage</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]  flex items-center justify-center">
          <PieChart 
            title="" 
            data={stageData} 
            dataKey="value" 
            nameKey="name" 
            colors={stageColors} 
            loading={loading} 
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 w-[90vw] md:w-[85vw] lg:w-auto ">
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Seller distribution by plan</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <PieChart 
            title="" 
            data={planData} 
            dataKey="value" 
            nameKey="name" 
            colors={planColors} 
            loading={loading}
          />
        </CardContent>
      </Card>
      
      <Card className="col-span-1 w-[90vw] md:w-[85vw] lg:w-auto" >
        <CardHeader>
          <CardTitle>Status</CardTitle>
          <CardDescription>Seller distribution by status</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <PieChart 
            title="" 
            data={statusData} 
            dataKey="value" 
            nameKey="name" 
            colors={statusColors} 
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modified layout: City and Category charts side by side with equal width */}
      <div className="col-span-1 lg:col-span-3 xl:col-span-3 md:col-span-3 w-full ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City chart */}
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cities</CardTitle>
                <CardDescription>Seller distribution by city</CardDescription>
              </div>
              {onPeriodChange && (
                <PeriodFilter 
                  onPeriodChange={handleCityPeriodChange} 
                  //@ts-ignore
                  defaultPeriod="all"
                  className="ml-auto"
                />
              )}
            </CardHeader>
            <CardContent className="">
              {loading ? (
                <div className="w-full h-64 bg-gray-100 animate-pulse rounded" />
              ) : (
                <ResponsiveContainer width="100%" height={cityData.length * 30}>
                  <Bars
                    data={cityChartData}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 15,
                      bottom: 20,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis 
                      dataKey="city" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value) => [value, "Sellers"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                      cursor={{ fill: "rgba(236, 240, 243, 0.6)" }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3B82F6"
                      radius={[0, 4, 4, 0]}
                    />
                  </Bars>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Category chart */}
          <Card className="w-full h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Business Categories</CardTitle>
                <CardDescription>Seller distribution by business category</CardDescription>
              </div>
              {onPeriodChange && (
                <PeriodFilter 
                  onPeriodChange={handleCategoryPeriodChange} 
                  //@ts-ignore
                  defaultPeriod="all"
                  className="ml-auto"
                />
              )}
            </CardHeader>
            <CardContent className="">
              {loading ? (
                <div className="w-full h-64 bg-gray-100 animate-pulse rounded" />
              ) : (
                <ResponsiveContainer width="100%" height={categoryChartData.length * 70}>
                  <Bars
                    data={categoryChartData}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 15,
                      bottom: 20,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                    />
                    <YAxis 
                      dataKey="category" 
                      type="category" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={{ stroke: "#E5E7EB" }}
                      width={120}
                    />
                    <Tooltip 
                      formatter={(value) => [value, "Sellers"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: "none",
                      }}
                      cursor={{ fill: "rgba(236, 240, 243, 0.6)" }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#10B981"
                      radius={[0, 4, 4, 0]}
                    />
                  </Bars>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
