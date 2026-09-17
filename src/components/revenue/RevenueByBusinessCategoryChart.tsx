
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as Bars, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { useState } from "react";

interface CategoryRevenueData {
  category: string;
  revenue: number;
  percentage?: number;
}

interface RevenueByBusinessCategoryChartProps {
  data: CategoryRevenueData[];
  loading: boolean;
  onPeriodChange?: (period: PeriodType, dateRange?: DateRange) => void;
}

export function RevenueByBusinessCategoryChart({ data, loading, onPeriodChange }: RevenueByBusinessCategoryChartProps) {
  const handlePeriodChange = (period: PeriodType, dateRange?: DateRange) => {
    if (onPeriodChange) {
      onPeriodChange(period, dateRange);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue by Business Category</CardTitle>
          <CardDescription>Distribution of revenue across different business categories</CardDescription>
        </div>
        {onPeriodChange && (
          <PeriodFilter 
            onPeriodChange={handlePeriodChange}
            defaultPeriod="all"
            className="ml-auto"
          />
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-64 bg-gray-100 animate-pulse rounded" />
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <Bars
              data={data}
              margin={{
                top: 20,
                right: 15,
                left: 15,
                bottom: 60,
              }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
                tickFormatter={(value) => `₹${(value/1000).toFixed(1)}K`}
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
                formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
                cursor={{ fill: "rgba(236, 240, 243, 0.6)" }}
              />
              <Bar
                dataKey="revenue"
                fill="#10B981"
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
              />
            </Bars>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
