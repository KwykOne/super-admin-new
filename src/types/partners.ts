
import { DateRange } from "react-day-picker";

export type PartnerType = 
  | "digital-marketing"
  | "social-media"
  | "software-development"
  | "ca-cs-firm"
  | "sales-agency"
  | "freelancer"
  | "other";

export interface CommissionStructure {
  type: "percentage" | "flat-fee" | "none";
  value: number; // Percentage or amount
  recurring: boolean;
  durationMonths: number; // 0 for one-time
  effectiveFrom: Date;
  effectiveTo?: Date;
  notes?: string;
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: "active" | "inactive" | "suspended";
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  joinDate: Date;
  commissionStructure: CommissionStructure;
  commissionHistory: CommissionStructure[];
  referralCount: number;
  totalCommissionEarned: number;
  lastUpdated: Date;
  referralLink: string;
}

export interface PartnerSummaryStats {
  totalPartners: number;
  activePartners: number;
  totalSellersByPartners: number;
  totalCommissionPaid: number;
  partnersByType: Record<PartnerType, number>;
  topPartner: string;
  conversionRate: number;
}

export interface PartnerPeriodStats {
  [key: string]: PartnerSummaryStats;
}
