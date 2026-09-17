
import { DashboardLayout } from "@/components/DashboardLayout";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { usePartnerPeriodData } from "@/hooks/usePartnerPeriodData";
import { usePartnersData, partnerTypeOptions, statusOptions } from "@/hooks/usePartnersData";
import { PartnerPeriodFilter } from "@/components/partners/PartnerPeriodFilter";
import { PartnersSummaryCards } from "@/components/partners/PartnersSummaryCards";
import { PartnersFilters } from "@/components/partners/PartnersFilters";
import { PartnersTable } from "@/components/partners/PartnersTable";
import { PartnerTypesChart } from "@/components/partners/PartnerTypesChart";
import { PartnerPerformanceChart } from "@/components/partners/PartnerPerformanceChart";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Partners() {
  useScrollToTop();
  const navigate = useNavigate();
  
  const {
    filteredPartners,
    summaryStats,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    selectedStatuses,
    setSelectedStatuses,
  } = usePartnersData();

  // Use the period data hook
  const { 
    summaryStats: periodStats, 
    handlePeriodChange 
  } = usePartnerPeriodData();

  const handlePartnerClick = (id: string) => {
    navigate(`/partners/${id}`);
  };

  const actionButton = (
    <Button onClick={() => navigate("/partners/new")}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Partner
    </Button>
  );

  return (
    <DashboardLayout
      title="Partner Program"
      subtitle="Manage and track channel partners who refer businesses to BharatGo"
      action={actionButton}
      wip
    >
      <PartnerPeriodFilter onPeriodChange={handlePeriodChange} />
      
      <PartnersSummaryCards stats={periodStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PartnerTypesChart stats={periodStats} />
        <PartnerPerformanceChart />
      </div>
      
      <PartnersFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        typeOptions={partnerTypeOptions}
        statusOptions={statusOptions}
        filteredCount={filteredPartners.length}
        totalCount={summaryStats.totalPartners}
      />
      
      <PartnersTable 
        partners={filteredPartners} 
        onPartnerClick={handlePartnerClick} 
      />
    </DashboardLayout>
  );
}
