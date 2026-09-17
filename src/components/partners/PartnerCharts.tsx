
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as RechartsLineChart, Line } from 'recharts';
import { PieChart as RechartsPieChart, Pie, Cell, Legend } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export interface ChartData {
  name: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  yAxisWidth?: number;
  showLegend?: boolean;
}

export function BarChart({ data, yAxisWidth = 40, showLegend = true }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis width={yAxisWidth} />
        <Tooltip formatter={(value: number) => [`${value}`, '']} />
        {showLegend && <Legend />}
        <Bar dataKey="value" fill="#3b82f6" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export function LineChart({ data, yAxisWidth = 40, showLegend = true }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis width={yAxisWidth} />
        <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, '']} />
        {showLegend && <Legend />}
        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export function PieChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}

export function ChartCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}
