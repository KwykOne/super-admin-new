
import { useState, useMemo } from 'react';

// Types
export interface Referrer {
  id: string;
  name: string;
  category: string;
  referralCount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  status: string;
  joinDate: Date;
}

// Filter options
export const categoryOptions = [
  { value: "seller", label: "Online Store Owners" },
  { value: "partner", label: "Channel Partners" },
];

export const statusOptions = [
  { value: "active", label: "Currently Active" },
  { value: "inactive", label: "Temporarily Inactive" },
  { value: "suspended", label: "Account Suspended" },
];

export interface ReferralsSummary {
  totalReferrals: number;
  totalReferrers: number;
  totalPointsEarned: number;
  totalSellerReferrers: number;
  totalPartnerReferrers: number;
  topReferrer: string;
  conversionRate: number;
}

export function useReferralsData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  
  // Generate mock referrers data
  const mockReferrers = useMemo(() => generateMockReferrers(), []);
  
  // Filter referrers based on search, filters, and active tab
  const filteredReferrers = useMemo(() => {
    return mockReferrers.filter(referrer => {
      const matchesSearch = referrer.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(referrer.category);
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(referrer.status);
      
      if (activeTab === "sellers" && referrer.category !== "seller") return false;
      if (activeTab === "partners" && referrer.category !== "partner") return false;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [mockReferrers, searchQuery, selectedCategories, selectedStatuses, activeTab]);
  
  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    return calculateSummary(mockReferrers);
  }, [mockReferrers]);
  
  return {
    referrers: mockReferrers,
    filteredReferrers,
    summaryStats,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedStatuses,
    setSelectedStatuses,
    activeTab,
    setActiveTab
  };
}

// Generate mock data for referrers
function generateMockReferrers(): Referrer[] {
  const categories = ["seller", "partner"];
  const statuses = ["active", "inactive", "suspended"];
  
  // Names for sellers (store names) and partners (company/individual names)
  const sellerNames = [
    "TechGadgets Store", "FashionHub India", "HomeDécor Plus", "BookHaven Store", "SportsZone India",
    "BeautyBoutique.in", "PetSupplies Store", "GourmetFoods Market", "ArtisanCrafts India", "MusicStore.in"
  ];
  
  const partnerNames = [
    "GlobalMarketing Solutions", "DigitalAgency Pro", "BusinessGrowth Partners", "MarketExperts India", 
    "Growth Accelerators", "IndiaSME Solutions", "RetailConsultants.in", "E-CommAlliance", 
    "WebDevelopers Pro", "TechConsultancy Plus"
  ];

  return Array.from({ length: 20 }, (_, i) => {
    const isPartner = categories[Math.floor(Math.random() * categories.length)] === "partner";
    const name = isPartner 
      ? partnerNames[Math.floor(Math.random() * partnerNames.length)]
      : sellerNames[Math.floor(Math.random() * sellerNames.length)];
    
    const referralCount = Math.floor(Math.random() * 30);
    const pointsEarned = isPartner 
      ? Math.floor(Math.random() * 15000)
      : referralCount * 200;

    const pointsRedeemed = isPartner ? Math.floor(pointsEarned * 0.7) : 0;
    
    return {
      id: `REF${10000 + i}`,
      name,
      category: isPartner ? "partner" : "seller",
      referralCount,
      pointsEarned,
      pointsRedeemed,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000))
    };
  });
}

// Calculate summary statistics
function calculateSummary(referrers: Referrer[]): ReferralsSummary {
  return {
    totalReferrals: referrers.reduce((acc, curr) => acc + curr.referralCount, 0),
    totalReferrers: referrers.length,
    totalPointsEarned: referrers.reduce((acc, curr) => acc + curr.pointsEarned, 0),
    totalSellerReferrers: referrers.filter(r => r.category === "seller").length,
    totalPartnerReferrers: referrers.filter(r => r.category === "partner").length,
    topReferrer: [...referrers].sort((a, b) => b.referralCount - a.referralCount)[0]?.name || "None",
    conversionRate: 68 // Dummy percentage
  };
}
