
import { useState, useEffect, useCallback } from 'react';
import { PeriodType } from '@/components/PeriodFilter';
import { DateRange } from 'react-day-picker';
import { PartnerSummaryStats } from '@/types/partners';

// Mock period data
const partnerStatsByPeriod: Record<string, PartnerSummaryStats> = {
  today: {
    totalPartners: 8,
    activePartners: 6,
    totalSellersByPartners: 15,
    totalCommissionPaid: 35000,
    partnersByType: {
      "digital-marketing": 2,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 0
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 65
  },
  yesterday: {
    totalPartners: 8,
    activePartners: 6,
    totalSellersByPartners: 14,
    totalCommissionPaid: 32000,
    partnersByType: {
      "digital-marketing": 2,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 0
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 64
  },
  last7days: {
    totalPartners: 10,
    activePartners: 8,
    totalSellersByPartners: 85,
    totalCommissionPaid: 220000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 68
  },
  last30days: {
    totalPartners: 15,
    activePartners: 12,
    totalSellersByPartners: 230,
    totalCommissionPaid: 580000,
    partnersByType: {
      "digital-marketing": 4,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 2,
      "sales-agency": 2,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 72
  },
  thisWeek: {
    totalPartners: 9,
    activePartners: 7,
    totalSellersByPartners: 45,
    totalCommissionPaid: 120000,
    partnersByType: {
      "digital-marketing": 2,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 66
  },
  lastWeek: {
    totalPartners: 9,
    activePartners: 7,
    totalSellersByPartners: 40,
    totalCommissionPaid: 110000,
    partnersByType: {
      "digital-marketing": 2,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 65
  },
  thisMonth: {
    totalPartners: 12,
    activePartners: 10,
    totalSellersByPartners: 130,
    totalCommissionPaid: 340000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 70
  },
  lastMonth: {
    totalPartners: 11,
    activePartners: 9,
    totalSellersByPartners: 120,
    totalCommissionPaid: 320000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 3,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 69
  },
  thisQuarter: {
    totalPartners: 13,
    activePartners: 11,
    totalSellersByPartners: 180,
    totalCommissionPaid: 450000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 2,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 71
  },
  lastQuarter: {
    totalPartners: 12,
    activePartners: 10,
    totalSellersByPartners: 160,
    totalCommissionPaid: 420000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 70
  },
  thisYear: {
    totalPartners: 15,
    activePartners: 12,
    totalSellersByPartners: 350,
    totalCommissionPaid: 950000,
    partnersByType: {
      "digital-marketing": 4,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 2,
      "sales-agency": 2,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 74
  },
  lastYear: {
    totalPartners: 10,
    activePartners: 8,
    totalSellersByPartners: 280,
    totalCommissionPaid: 750000,
    partnersByType: {
      "digital-marketing": 3,
      "social-media": 2,
      "software-development": 1,
      "ca-cs-firm": 1,
      "sales-agency": 1,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "DigitalAgency Pro",
    conversionRate: 70
  },
  allTime: {
    totalPartners: 15,
    activePartners: 12,
    totalSellersByPartners: 450,
    totalCommissionPaid: 1250000,
    partnersByType: {
      "digital-marketing": 4,
      "social-media": 3,
      "software-development": 2,
      "ca-cs-firm": 2,
      "sales-agency": 2,
      "freelancer": 1,
      "other": 1
    },
    topPartner: "GlobalMarketing Solutions",
    conversionRate: 72
  }
};

export function usePartnerPeriodData() {
  const [period, setPeriod] = useState<PeriodType>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [summaryStats, setSummaryStats] = useState<PartnerSummaryStats>(partnerStatsByPeriod.today);
  
  const handlePeriodChange = useCallback((newPeriod: PeriodType, customDateRange?: DateRange) => {
    setPeriod(newPeriod);
    setDateRange(customDateRange);
    
    // Get data for the selected period
    const data = partnerStatsByPeriod[newPeriod] || partnerStatsByPeriod.today;
    setSummaryStats(data);
  }, []);

  useEffect(() => {
    // Initialize with default period data
    const initialData = partnerStatsByPeriod.today;
    setSummaryStats(initialData);
  }, []);

  return { 
    summaryStats,
    period,
    dateRange,
    handlePeriodChange
  };
}
