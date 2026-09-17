
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as Pie, ResponsiveContainer, Tooltip, Legend, Cell, Pie as PieComponent } from "recharts";
import { PartnerSummaryStats, PartnerType } from "@/types/partners";

interface PartnerTypesChartProps {
  stats: PartnerSummaryStats;
}

export function PartnerTypesChart({ stats }: PartnerTypesChartProps) {
  const chartData = useMemo(() => {
    // Convert partnersByType object to array
    return Object.entries(stats.partnersByType).map(([type, count]) => {
      // Convert type names to readable format
      const readableType = type
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        name: readableType,
        value: count
      };
    }).filter(item => item.value > 0); // Only show types with partners
  }, [stats.partnersByType]);

  // Colors for the pie chart segments
  const COLORS = [
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#F97316', // orange-500
    '#6366F1', // indigo-500
    '#9CA3AF'  // gray-400
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partner Types Distribution</CardTitle>
        <CardDescription>
          Distribution of partners by their business type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Pie>
              <PieComponent
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </PieComponent>
              <Tooltip
                formatter={(value: number) => [`${value} partners`, '']}
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                }}
              />
              <Legend />
            </Pie>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
