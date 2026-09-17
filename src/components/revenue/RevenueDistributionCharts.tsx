
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/dashboard/BarChart";
import { PieChart } from "@/components/dashboard/PieChart";

interface RevenueChartProps {
  monthlyData: any[];
  sourcesData: any[];
  loading: boolean;
}

export function RevenueDistributionCharts({ monthlyData, sourcesData, loading }: RevenueChartProps) {
  const revenueColors = ["#3B82F6", "#10B981", "#F59E0B", "#6366F1"];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <BarChart 
        title="Monthly Revenue Breakdown"
        description="Revenue sources over time"
        data={monthlyData}
        xAxisKey="month"
        categories={[
          { name: "subscription", color: "#3B82F6" },
          { name: "platform", color: "#10B981" },
          { name: "wallet", color: "#F59E0B" },
          { name: "other", color: "#6366F1" },
        ]}
        loading={loading}
      />
      <PieChart
        title="Revenue Source Distribution"
        description="Percentage breakdown by revenue stream"
        data={sourcesData}
        dataKey="value"
        nameKey="name"
        colors={revenueColors}
        loading={loading}
      />
    </div>
  );
}
