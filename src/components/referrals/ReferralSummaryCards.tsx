
import { Gift, TrendingUp, Users, Wallet, UserPlus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/formatters";

interface ReferralSummaryStats {
  totalReferrals: number;
  totalReferrers: number;
  totalPointsEarned: number;
  totalSellerReferrers: number;
  totalPartnerReferrers: number;
  topReferrer: string;
  conversionRate: number;
}

interface ReferralSummaryCardsProps {
  stats: ReferralSummaryStats;
}

export function ReferralSummaryCards({ stats }: ReferralSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Referrals"
        value={stats.totalReferrals.toString()}
        icon={<Gift size={20} />}
        description={`From ${stats.totalReferrers} referrers`}
        variant="primary"
      />
      
      <StatCard
        title="Points Earned"
        value={stats.totalPointsEarned.toLocaleString()}
        icon={<Wallet size={20} />}
        description="Total points from all referrals"
        variant="success"
      />
      
      <StatCard
        title="Active Referrers"
        value={`${stats.totalSellerReferrers + stats.totalPartnerReferrers}`}
        icon={<Users size={20} />}
        description={`${stats.totalSellerReferrers} Sellers, ${stats.totalPartnerReferrers} Partners`}
        variant="default"
      />
      
      <StatCard
        title="Conversion Rate"
        value={`${stats.conversionRate}%`}
        icon={<TrendingUp size={20} />}
        description={`Top referrer: ${stats.topReferrer}`}
        trend={8}
        variant="warning"
      />
    </div>
  );
}
