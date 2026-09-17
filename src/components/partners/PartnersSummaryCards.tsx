
import { Briefcase, TrendingUp, Users, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/formatters";
import { PartnerSummaryStats } from "@/types/partners";

interface PartnersSummaryCardsProps {
  stats: PartnerSummaryStats;
}

export function PartnersSummaryCards({ stats }: PartnersSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Partners"
        value={stats.totalPartners.toString()}
        icon={<Briefcase size={20} />}
        description={`${stats.activePartners} active partners`}
        variant="primary"
      />
      
      <StatCard
        title="Total Referred Sellers"
        value={stats.totalSellersByPartners.toString()}
        icon={<Users size={20} />}
        description="From all partner channels"
        variant="success"
      />
      
      <StatCard
        title="Commission Paid"
        value={`₹${(stats.totalCommissionPaid/100000).toFixed(2)}L`}
        icon={<Wallet size={20} />}
        description="Total commission to partners"
        variant="default"
      />
      
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        icon={<TrendingUp size={20} />}
        description={`Top partner: ${stats.topPartner}`}
        trend={5}
        variant="warning"
      />
    </div>
  );
}
