
import { Store, Globe, UserCog } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";

interface SellerStatsProps {
  totalSellers: number;
  liveSellers: number;
  onboardingSellers: number;
  loading: boolean;
  onPeriodChange?: (period: PeriodType, dateRange?: DateRange) => void;
}

export function SellerStatsCards({ 
  totalSellers, 
  liveSellers, 
  onboardingSellers, 
  loading,
  onPeriodChange
}: SellerStatsProps) {

  
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold">Seller Statistics</h2>
        {onPeriodChange && (
          <PeriodFilter 
            onPeriodChange={onPeriodChange}
     />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <StatCard 
          
          title="Total Sellers" 
          value={totalSellers} 
          icon={<Store size={22} />} 
          description="Registered businesses" 
          trend={12} 
          loading={loading} 
          variant="primary" 
        />
        <StatCard 
          title="Live Sellers" 
          value={liveSellers } 
          icon={<Globe size={22} />} 
          description="Fully onboarded" 
          trend={8} 
          loading={loading} 
          variant="success" 
        />
        <StatCard 
          title="Onboarding" 
          value={ onboardingSellers } 
          icon={<UserCog size={22} />} 
          description="In progress" 
          loading={loading} 
          variant="warning" 
        />
      </div>
    </div>
  );
}
