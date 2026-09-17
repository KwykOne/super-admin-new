
import { ReferralSummaryCards } from "@/components/referrals/ReferralSummaryCards";
import { ReferralsFilters } from "@/components/referrals/ReferralsFilters";
import { ReferralsTable } from "@/components/referrals/ReferralsTable";
import { ReferralSummaryStats } from "@/types/referrals";

interface ReferralTabContentProps {
  summaryStats: ReferralSummaryStats;
  filteredReferrers: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  categoryOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  onReferrerClick: (id: string) => void;
  tabType: 'all' | 'sellers' | 'partners';
}

export function ReferralTabContent({
  summaryStats,
  filteredReferrers,
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedStatuses,
  setSelectedStatuses,
  categoryOptions,
  statusOptions,
  onReferrerClick,
  tabType
}: ReferralTabContentProps) {
  // Adjust stats based on tab type
  const adjustedStats = (() => {
    if (tabType === 'sellers') {
      return {
        ...summaryStats,
        totalReferrers: summaryStats.totalSellerReferrers,
        totalPartnerReferrers: 0
      };
    } else if (tabType === 'partners') {
      return {
        ...summaryStats,
        totalReferrers: summaryStats.totalPartnerReferrers,
        totalSellerReferrers: 0
      };
    }
    return summaryStats;
  })();

  // Determine search placeholder based on tab type
  const searchPlaceholder = tabType === 'sellers' 
    ? "Search by store name..."
    : tabType === 'partners'
    ? "Search by partner name..."
    : "Search by name...";

  // Hide category options for sellers and partners tabs
  const showCategoryOptions = tabType === 'all';
  const usedCategoryOptions = showCategoryOptions ? categoryOptions : [];

  return (
    <div className="space-y-4">
      <ReferralSummaryCards stats={adjustedStats} />
      
      <ReferralsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={showCategoryOptions ? selectedCategories : []}
        setSelectedCategories={showCategoryOptions ? setSelectedCategories : () => {}}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        categoryOptions={usedCategoryOptions}
        statusOptions={statusOptions}
        filteredCount={filteredReferrers.length}
        totalCount={adjustedStats.totalReferrers}
        searchPlaceholder={searchPlaceholder}
      />
      
      <ReferralsTable 
        referrers={filteredReferrers} 
        onReferrerClick={onReferrerClick} 
      />
    </div>
  );
}
