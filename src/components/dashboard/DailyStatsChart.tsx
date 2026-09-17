import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart as Bars,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
} from "recharts";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const mockData = {
  thisWeek: [
    { date: "2025-04-28", revenue: 5000 },
    { date: "2025-04-29", revenue: 5400 },
    { date: "2025-04-30", revenue: 4800 },
    { date: "2025-05-01", revenue: 5200 },
    { date: "2025-05-02", revenue: 6100 },
    { date: "2025-05-03", revenue: 5900 },
    { date: "2025-05-04", revenue: 6500 },
  ],
};

interface DailyStatsProps {
  title: string;
  description: string;
  metricName: string;
}

export function DailyStatsChart({
  title,
  description,
  metricName,
}: DailyStatsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [period, setPeriod] = useState<PeriodType>("lastSeven");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sellerStatsData, setSellerStatsData] = useState<any[]>([]);
  const dataType = useSelector((state: RootState) => state.modal.dataType)
  const mode = useSelector((state:RootState)=> state.modal.mode)

  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL;

  const token = localStorage.getItem("userToken");

  const fetchSellerStats = useCallback(async () => {
    try {

      const res = await axios.get(
        `${baseURL}api/v1/admin/sellers/sellerStats?date=${period}&is_test=${dataType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSellerStatsData(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch seller stats:", err);
      setSellerStatsData([]); // fallback to empty
    }
  }, [period, token, dataType]);

  useEffect(() => {
    fetchSellerStats();
  }, [fetchSellerStats]);

  const handlePeriodChange = useCallback(
    (newPeriod: PeriodType, customDateRange?: DateRange) => {
      setPeriod(newPeriod);
      setDateRange(customDateRange);
      setLoading(true);
  
      let filteredData: any[] = [];
  
      if (
        newPeriod === "lastMonth" ||
        newPeriod === "thisMonth" ||
        newPeriod === "lastQuarter" ||
        newPeriod === "thisQuarter"
      ) {
        // Use backend-provided weekly or quarterly data (e.g. Week 17, Q1)
        filteredData = sellerStatsData.map((item: any) => ({
          date: item.date,
          [metricName]: parseInt(item.count),
        }));
      }else if (newPeriod === "thisWeek") {
        const today = new Date();
        const dayOfWeek = today.getDay(); // Sunday = 0, Monday = 1, etc.
        const startOfWeek = new Date(today);
        
        // Adjust the start date to Monday instead of Sunday
        startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // If Sunday, go back 6 days to get to Monday, otherwise, go back to previous Monday
      
        const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(startOfWeek);
          d.setDate(d.getDate() + i);
          return {
            date: d.toISOString().split("T")[0], // Format date as YYYY-MM-DD
            [metricName]: 0,  // Default count is 0
          };
        });
      
        // Update the filteredData with actual data from sellerStatsData
        filteredData = daysOfWeek.map((day) => {
          const match = sellerStatsData.find((item: any) => item.date === day.date);
          return {
            ...day,
            [metricName]: match ? parseInt(match.count) : 0,  // Set the count
          };
        });
      } else if (newPeriod === "lastWeek") {
        // Ensure there are 7 values for the last week (adjust if necessary)
        filteredData = sellerStatsData.map((item: any) => ({
          date: item.date,
          [metricName]: parseInt(item.count),
        }));
      } else {
        // Handle custom range, lastSeven, lastThirty, etc.
        let startDate = new Date();
        let endDate = new Date();
  
        if (customDateRange?.from && customDateRange?.to) {
          startDate = customDateRange.from;
          endDate = customDateRange.to;
        } else if (newPeriod === "lastSeven") {
          startDate.setDate(startDate.getDate() - 7);
        } else if (newPeriod === "lastThirty") {
          startDate.setDate(startDate.getDate() - 30);
          //@ts-ignore
        } else if (newPeriod === "thisMonth") {
          startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        }
  
        filteredData = sellerStatsData
          .filter((item: any) => {
            const itemDate = new Date(item.date);
            return itemDate >= startDate && itemDate <= endDate;
          })
          .map((item: any) => ({
            date: item.date,
            [metricName]: parseInt(item.count),
          }));
      }
  
      setTimeout(() => {
        setData(filteredData.length ? filteredData : mockData.thisWeek);
        setLoading(false);
      }, 200);
    },
    [metricName, sellerStatsData]
  );

  
  useEffect(() => {
    if (sellerStatsData.length) {
      handlePeriodChange(period, dateRange);
    }
  }, [sellerStatsData, handlePeriodChange]);

  const chartContent = useMemo(() => {
    if (loading) {
      return (
        <div className="w-full h-[350px] bg-gray-100 animate-pulse rounded" />
      );
    }

    return (
      <ResponsiveContainer width="100%" height={350}>
        <Bars
          data={data}
          margin={{ top: 20, right: 15, left: 15, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(date) => {
              if (typeof date === "string" && date.toLowerCase().includes("week")) return date;
              try {
                return format(new Date(date), "MMM dd");
              } catch {
                return date;
              }
            }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              border: "none",
            }}
            cursor={{ fill: "rgba(236, 240, 243, 0.6)" }}
          />
          <Bar
            dataKey={metricName}
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
        </Bars>
      </ResponsiveContainer>
    );
  }, [data, loading, metricName]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <CardDescription className="text-red-500">
            {sellerStatsData.length < 1 && "No data available to show!!"}
          </CardDescription>
          <PeriodFilter
            onPeriodChange={handlePeriodChange}
            defaultPeriod="lastSeven"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[350px]">{chartContent}</div>
      </CardContent>
    </Card>
  );
}

function thisPeriodToKey(period: PeriodType) {
  switch (period) {
    case "lastWeek":
      return "lastWeek";
    case "thisWeek":
      return "thisWeek";
    case "lastSeven":
      return "lastSeven";
    case "thisMonth":
      return "thisMonth";
    case "lastMonth":
      return "lastMonth";
    default:
      return "last7days";
  }
}
