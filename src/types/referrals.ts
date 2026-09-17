
import { DateRange } from "react-day-picker";

export interface ReferralSummaryStats {
  totalReferrals: number;
  totalReferrers: number;
  activeReferrers: number;
  totalPointsEarned: number;
  totalSellerReferrers: number;
  totalPartnerReferrers: number;
  topReferrer: string;
  conversionRate: number;
}

export interface PartnerCommissionPlan {
  commissionRate: number;  // Percentage of revenue
  durationMonths: number; // Duration in months
  startDate: Date;
}

export interface Referrer {
  id: string;
  name: string;
  category: string;
  specialty?: string;
  status: string;
  joinDate: Date;
  referralCount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  referralLink?: string;
  storeCount?: number;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  commissionPlan?: PartnerCommissionPlan; // Only for partners
}

export interface ReferralPeriodStats {
  [key: string]: ReferralSummaryStats;
}
