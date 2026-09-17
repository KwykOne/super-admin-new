
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeIndianRupee, CircleDollarSign, ArrowUpCircle, Clock, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface SettlementSummaryCardProps {
  title: string;
  amount: number;
  count: number;
  className?: string;
  loading?: boolean;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: {
    icon: "text-blue-500",
    border: "border-l-blue-500",
    bg: "bg-blue-50"
  },
  success: {
    icon: "text-green-500",
    border: "border-l-green-500",
    bg: "bg-green-50"
  },
  warning: {
    icon: "text-amber-500",
    border: "border-l-amber-500",
    bg: "bg-amber-50"
  },
  danger: {
    icon: "text-red-500",
    border: "border-l-red-500",
    bg: "bg-red-50"
  }
};

const variantIcons = {
  default: CircleDollarSign,
  success: ArrowUpCircle,
  warning: Clock,
  danger: AlertCircle
};

export function SettlementSummaryCard({ 
  title, 
  amount, 
  count, 
  className,
  loading = false,
  variant = "default"
}: SettlementSummaryCardProps) {
  const Icon = variantIcons[variant];
  
  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-md border-l-4",
      variantStyles[variant].border,
      variantStyles[variant].bg,
      className
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-4 w-4", variantStyles[variant].icon)} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-9 bg-gray-200 rounded animate-pulse" />
        ) : (
          <>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                {formatCurrency(amount)}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{count} settlements</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
