import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as RechartsSimplePieChart, Pie, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts";
import { useState } from "react";

interface PieChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  nameKey: string;
  colors: string[];
  loading?: boolean;
}

export function PieChart({
  title,
  description,
  data,
  dataKey,
  nameKey,
  colors,
  loading = false,
}: PieChartProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // If title is provided, render as Card, otherwise render just the chart
  if (title) {
    return (
      <Card className="h-full min-w-0">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="w-full h-64 bg-gray-100 animate-pulse rounded " />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <RechartsSimplePieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={30}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey={dataKey}
                  onMouseEnter={onPieEnter}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]}
                      name={entry[nameKey]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, ``]} />
                <Legend 
                  layout="horizontal"
                  verticalAlign="top"
                  align="center"
                  wrapperStyle={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", paddingTop: "20px" }}
                  content={({ payload }) => (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap" }}>
                    {payload?.map((entry, index) => (
                      <li
                        key={`item-${index}`}
                        style={{
                          color: "black",
                          display: "flex",
                          alignItems: "center",
                          padding: '2px'
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 10,
                            backgroundColor: entry.color,
                            marginRight: 8,
                          }}
                        />
                        {entry.value}
                      </li>
                    ))}
                  </ul>
                  )}
                />
              </RechartsSimplePieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    );
  }

  // Render just the chart without Card wrapper
  return loading ? (
    <div className="w-full h-64 bg-gray-100 animate-pulse rounded " />
  ) : (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsSimplePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          innerRadius={60}
          outerRadius={120}
          paddingAngle={10}
          dataKey={dataKey}
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell 
            className="ml-2"
              key={`cell-${index}`} 
              fill={colors[index % colors.length]}
              name={entry[nameKey]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}`, ``]} />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px", paddingTop: "20px" }}
          content={({ payload }) => (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexWrap: "wrap" }}>
              {payload?.map((entry, index) => (
                <li
                  key={`item-${index}`}
                  style={{
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    padding: '2px'
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      backgroundColor: entry.color,
                      marginRight: 8,
                    }}
                  />
                  {entry.value}
                </li>
              ))}
            </ul>
          )}
        />
      </RechartsSimplePieChart>
    </ResponsiveContainer>
  );
}
