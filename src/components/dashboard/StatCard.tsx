
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: number;
  loading?: boolean;
  onClick?: () => void;
  variant?: "default" | "primary" | "success" | "warning" | "danger";
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  loading = false,
  onClick,
  variant = "default",
}: StatCardProps) {
  const variantClasses = {
    default: "",
    primary: "border-bharatgo-primary bg-bharatgo-primary/5",
    success: "border-bharatgo-accent bg-bharatgo-accent/5",
    warning: "border-bharatgo-warning bg-bharatgo-warning/5",
    danger: "border-bharatgo-danger bg-bharatgo-danger/5",
  };

  const renderTrend = () => {
    if (trend === undefined) return null;
    
    const isPositive = trend >= 0;
    return (
      <div className={cn(
        "flex items-center text-xs font-medium",
        isPositive ? "text-green-600" : "text-red-600"
      )}>
        {isPositive ? <TrendingUp className="mr-1" size={14} /> : <TrendingDown className="mr-1" size={14} />}
        <span>{Math.abs(trend)}%</span>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        "h-full transition-all duration-300 hover:shadow-md border-l-4 w-full",
        onClick && "cursor-pointer hover:-translate-y-1",
        variantClasses[variant]
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-bharatgo-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 bg-gray-200 rounded animate-pulse" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <div className="flex items-center justify-between mt-1">
          {description && <p className="text-xs text-gray-500">{description}</p>}
          {renderTrend()}
        </div>
      </CardContent>
    </Card>
  );
}
