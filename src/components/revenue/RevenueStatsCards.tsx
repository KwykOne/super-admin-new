
import { DollarSign, IndianRupee, CreditCard, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { convertNumber } from "@/utils/dataUtils";

interface RevenueStatsProps {
  revenueData :any
  loading:boolean
}



export function RevenueStatsCards({ revenueData, loading }: any) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
      <StatCard
      
        title="Total Revenue"
        value={convertNumber(revenueData?.totalRevenue)}
        icon={<DollarSign size={22} />}
        description="Overall business revenue"
        trend={null}
        loading={loading}
        variant="primary"
      />
      <StatCard
        title="Subscription Revenue"
        value={convertNumber(revenueData?.subscriptionFees)}
        icon={<CreditCard size={22} />}
        description="From all subscription plans"
        trend={0}
        loading={loading}
        variant="success"
      />
      <StatCard
        title="Platform Fees"
        value={convertNumber(revenueData?.platformFees)}
        icon={<IndianRupee size={22} />}
        description="Commission from orders"
        trend={0}
        loading={loading}
        variant="warning"
      />
      <StatCard
        title="Wallet Recharges"
        value={convertNumber(revenueData?.walletRecharge)}
        icon={<Wallet size={22} />}
        description="From seller wallet recharges"
        trend={0}
        loading={loading}
        variant="danger"
      />
    </div>
  );
}
