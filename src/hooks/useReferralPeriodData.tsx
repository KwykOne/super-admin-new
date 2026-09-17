
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { PeriodType } from "@/components/PeriodFilter";
import { ReferralSummaryStats } from "@/types/referrals";

// Mock data by period
const summaryStatsByPeriod = {
  today: {
    totalReferrers: 42,
    activeReferrers: 28,
    totalSellerReferrers: 30,
    totalPartnerReferrers: 12,
    totalReferrals: 15,
    conversionRate: 32,
    totalPointsEarned: 12500,
    topReferrer: "TechGadgets Store"
  },
  last7days: {
    totalReferrers: 85,
    activeReferrers: 52,
    totalSellerReferrers: 60,
    totalPartnerReferrers: 25,
    totalReferrals: 120,
    conversionRate: 35,
    totalPointsEarned: 45800,
    topReferrer: "FashionHub India"
  },
  last30days: {
    totalReferrers: 180,
    activeReferrers: 110,
    totalSellerReferrers: 135,
    totalPartnerReferrers: 45,
    totalReferrals: 450,
    conversionRate: 38,
    totalPointsEarned: 124500,
    topReferrer: "GlobalMarketing Solutions"
  },
  thisMonth: {
    totalReferrers: 150,
    activeReferrers: 95,
    totalSellerReferrers: 110,
    totalPartnerReferrers: 40,
    totalReferrals: 320,
    conversionRate: 36,
    totalPointsEarned: 98750,
    topReferrer: "RetailConsultants.in"
  },
  allTime: {
    totalReferrers: 350,
    activeReferrers: 210,
    totalSellerReferrers: 260,
    totalPartnerReferrers: 90,
    totalReferrals: 1250,
    conversionRate: 42,
    totalPointsEarned: 385000,
    topReferrer: "BusinessGrowth Partners"
  }
};

export function useReferralPeriodData() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [summaryStats, setSummaryStats] = useState<ReferralSummaryStats>(
    summaryStatsByPeriod[selectedPeriod as keyof typeof summaryStatsByPeriod] || summaryStatsByPeriod.today
  );

  const handlePeriodChange = (period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
    
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setSummaryStats(summaryStatsByPeriod[period as keyof typeof summaryStatsByPeriod] || summaryStatsByPeriod.today);
      setLoading(false);
    }, 500);
  };

  return {
    selectedPeriod,
    dateRange,
    loading,
    summaryStats,
    handlePeriodChange
  };
}
