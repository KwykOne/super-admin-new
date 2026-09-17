
import { useState, useMemo } from 'react';
import { Partner, PartnerType, CommissionStructure, PartnerSummaryStats } from '@/types/partners';

// Filter options
export const partnerTypeOptions = [
  { value: "digital-marketing", label: "Digital Marketing Agency" },
  { value: "social-media", label: "Social Media Marketing Agency" },
  { value: "software-development", label: "Software Development Firm" },
  { value: "ca-cs-firm", label: "CA/CS Firm" },
  { value: "sales-agency", label: "Sales Agency" },
  { value: "freelancer", label: "Freelancer" },
  { value: "other", label: "Others" },
];

export const statusOptions = [
  { value: "active", label: "Currently Active" },
  { value: "inactive", label: "Temporarily Inactive" },
  { value: "suspended", label: "Account Suspended" },
];

export function usePartnersData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  
  // Generate mock partners data
  const mockPartners = useMemo(() => generateMockPartners(), []);
  
  // Filter partners based on search and filters
  const filteredPartners = useMemo(() => {
    return mockPartners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           partner.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(partner.type);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(partner.status);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [mockPartners, searchQuery, selectedTypes, selectedStatuses]);
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return calculateSummary(mockPartners);
  }, [mockPartners]);
  
  return {
    partners: mockPartners,
    filteredPartners,
    summaryStats,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    setSelectedTypes,
    selectedStatuses,
    setSelectedStatuses,
  };
}

// Generate mock data for partners
function generateMockPartners(): Partner[] {
  const types: PartnerType[] = [
    "digital-marketing", "social-media", "software-development", 
    "ca-cs-firm", "sales-agency", "freelancer", "other"
  ];
  
  const statuses: ("active" | "inactive" | "suspended")[] = ["active", "inactive", "suspended"];
  
  // Company names for partners
  const partnerNames = [
    "GlobalMarketing Solutions", "DigitalAgency Pro", "BusinessGrowth Partners", 
    "MarketExperts India", "Growth Accelerators", "IndiaSME Solutions", 
    "RetailConsultants.in", "E-CommAlliance", "WebDevelopers Pro", "TechConsultancy Plus"
  ];
  
  return Array.from({ length: 15 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const name = partnerNames[Math.floor(Math.random() * partnerNames.length)];
    const referralCount = Math.floor(Math.random() * 50) + 5;
    const totalCommissionEarned = Math.floor(Math.random() * 500000) + 10000;
    
    // Generate current commission structure
    const currentCommission: CommissionStructure = {
      type: Math.random() > 0.3 ? "percentage" : Math.random() > 0.5 ? "flat-fee" : "none",
      value: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 5000) + 1000,
      recurring: Math.random() > 0.5,
      durationMonths: Math.floor(Math.random() * 12) + 1,
      effectiveFrom: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
    };

    // Generate historical commission structures
    const historyCount = Math.floor(Math.random() * 3);
    const commissionHistory: CommissionStructure[] = Array.from({ length: historyCount }, (_, j) => {
      const startDate = new Date(Date.now() - Math.floor(Math.random() * 1000 * 24 * 60 * 60 * 1000));
      const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 200 * 24 * 60 * 60 * 1000));
      
      return {
        type: Math.random() > 0.3 ? "percentage" : Math.random() > 0.5 ? "flat-fee" : "none",
        value: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 5000) + 1000,
        recurring: Math.random() > 0.5,
        durationMonths: Math.floor(Math.random() * 12) + 1,
        effectiveFrom: startDate,
        effectiveTo: endDate,
        notes: "Previous agreement"
      };
    });
    
    return {
      id: `PART${10000 + i}`,
      name,
      type,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      contactPerson: `${["Raj", "Priya", "Amit", "Deepika", "Karan"][Math.floor(Math.random() * 5)]} ${["Sharma", "Patel", "Singh", "Gupta", "Verma"][Math.floor(Math.random() * 5)]}`,
      email: `contact@${name.toLowerCase().replace(/\s/g, '')}.com`,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 999) + 1}, ${["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata"][Math.floor(Math.random() * 6)]}`,
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 730 * 24 * 60 * 60 * 1000)), // Up to 2 years ago
      commissionStructure: currentCommission,
      commissionHistory,
      referralCount,
      totalCommissionEarned,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      referralLink: `https://bharatgo.in/partner/${`PART${10000 + i}`.toLowerCase()}`
    };
  });
}

// Calculate summary statistics
function calculateSummary(partners: Partner[]): PartnerSummaryStats {
  const activePartners = partners.filter(p => p.status === "active").length;
  const totalSellersByPartners = partners.reduce((acc, curr) => acc + curr.referralCount, 0);
  const totalCommissionPaid = partners.reduce((acc, curr) => acc + curr.totalCommissionEarned, 0);
  
  // Count partners by type
  const partnersByType = partners.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<PartnerType, number>);
  
  // Find top partner
  const topPartner = [...partners].sort((a, b) => b.referralCount - a.referralCount)[0]?.name || "None";
  
  return {
    totalPartners: partners.length,
    activePartners,
    totalSellersByPartners,
    totalCommissionPaid,
    partnersByType,
    topPartner,
    conversionRate: 72 // Dummy percentage
  };
}
