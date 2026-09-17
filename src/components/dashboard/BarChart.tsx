
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as Bars, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from "recharts";

interface BarChartProps {
  title: string;
  description?: string;
  data: any[];
  categories: {
    name: string;
    color: string;
  }[];
  xAxisKey: string;
  loading?: boolean;
}

export function BarChart({
  title,
  description,
  data,
  categories,
  xAxisKey,
  loading = false,
}: BarChartProps) {

  return (
    <Card className="h-full min-w-0">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
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
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
                tickFormatter={(value) => `${value}`}
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
              {categories.map((category, index) => (
                <Bar
                  key={index}
                  dataKey={category.name}
                  fill={category.color}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              ))}
            </Bars>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
