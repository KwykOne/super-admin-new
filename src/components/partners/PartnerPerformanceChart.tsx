
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as Bars, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";

interface PartnerPerformanceChartProps {
  title?: string;
  description?: string;
}

export function PartnerPerformanceChart({
  title = "Monthly Partner Performance",
  description = "Referrals completed by partners each month"
}: PartnerPerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate random data for the chart
  const generateMockData = useCallback(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentMonth = new Date().getMonth();
    const lastSixMonths = months
      .slice(currentMonth - 5 >= 0 ? currentMonth - 5 : (currentMonth - 5 + 12), currentMonth + 1)
      .concat(months.slice(0, currentMonth - 5 < 0 ? Math.abs(currentMonth - 5) : 0));
    
    return lastSixMonths.map(month => ({
      month,
      referrals: Math.floor(Math.random() * 50) + 10,
      commission: Math.floor(Math.random() * 150000) + 30000
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [generateMockData]);

  const chartContent = useMemo(() => {
    if (loading) {
      return <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded" />;
    }
    
    return (
      <ResponsiveContainer width="100%" height={350}>
        <Bars
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `₹${(value/1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            formatter={(value, name) => {
              if (name === "referrals") return [`${value} referrals`, "Referrals"];
              if (name === "commission") return [`₹${value.toLocaleString()}`, "Commission"];
              return [value, name];
            }}
            cursor={{ fill: "rgba(236, 240, 243, 0.6)" }}
          />
          <Bar
            yAxisId="left"
            dataKey="referrals"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            name="Referrals"
          />
          <Bar
            yAxisId="right"
            dataKey="commission"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            name="Commission"
          />
        </Bars>
      </ResponsiveContainer>
    );
  }, [data, loading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">
          {chartContent}
        </div>
      </CardContent>
    </Card>
  );
}
