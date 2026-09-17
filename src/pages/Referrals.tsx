
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useReferralPeriodData } from "@/hooks/useReferralPeriodData";
import { ReferralPeriodFilter } from "@/components/referrals/ReferralPeriodFilter";
import { categoryOptions, statusOptions, useReferralsData } from "@/hooks/useReferralsData";
import { ReferralTabContent } from "@/components/referrals/ReferralTabContent";

export default function Referrals() {
  useScrollToTop();
  const navigate = useNavigate();
  
  const {
    filteredReferrers,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedStatuses,
    setSelectedStatuses,
  } = useReferralsData();

  // Use the period data hook
  const { 
    summaryStats, 
    handlePeriodChange 
  } = useReferralPeriodData();

  const handleReferrerClick = (id: string) => {
    navigate(`/referrals/${id}`);
  };

  // Filter to only include sellers
  const sellerReferrers = filteredReferrers.filter(ref => ref.category === "seller");

  return (
    <DashboardLayout
      title="Seller Referral Program"
      subtitle="Track and manage sellers who refer new merchants to BharatGo"
      wip
    >
      <ReferralPeriodFilter onPeriodChange={handlePeriodChange} />
      
      <ReferralTabContent
        summaryStats={{
          ...summaryStats,
          totalReferrers: summaryStats.totalSellerReferrers,
          totalPartnerReferrers: 0
        }}
        filteredReferrers={sellerReferrers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={[]}
        setSelectedCategories={() => {}}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        categoryOptions={[]}
        statusOptions={statusOptions}
        onReferrerClick={handleReferrerClick}
        tabType="sellers"
      />
    </DashboardLayout>
  );
}
