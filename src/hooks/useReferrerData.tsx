import { useState, useEffect } from "react";

// Types for our referrer data
interface Referral {
  id: string;
  storeName: string;
  registrationDate: Date;
  planType: string;
  pointsEligible: boolean;
  pointsEarned: number;
  status: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  category?: string;
}

interface PartnerCommissionPlan {
  commissionRate: number;
  durationMonths: number;
  startDate: Date;
}

interface ReferrerData {
  id: string;
  name: string;
  category: string;
  specialty: string;
  status: string;
  joinDate: Date;
  referralCount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  referralLink: string;
  storeCount: number;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  commissionPlan?: PartnerCommissionPlan;
}

interface ReferrerDetail {
  referrer: ReferrerData;
  referrals: Referral[];
}

export function useReferrerData(id: string): ReferrerDetail {
  const [data, setData] = useState<ReferrerDetail>(() => {
    const isPartner = !id.startsWith("REF1");
    
    const referrerData = {
      id,
      name: isPartner ? "GlobalMarketing" : "TechGadgets",
      category: isPartner ? "partner" : "seller",
      specialty: isPartner ? "Business Consultant" : "Electronics Store",
      status: "active",
      joinDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)),
      referralCount: isPartner ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 30) + 5,
      pointsEarned: isPartner ? Math.floor(Math.random() * 50000) + 10000 : Math.floor(Math.random() * 5000) + 1000,
      pointsRedeemed: 0,
      referralLink: `https://bharatgo.in/ref/${id.toLowerCase()}`,
      storeCount: isPartner ? 0 : 1,
      email: isPartner ? "contact@globalmarketing.com" : "store@techgadgets.com",
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: isPartner ? "456 Business Hub, Mumbai" : "123 Tech Park, Bengaluru",
      contactPerson: isPartner ? "Priya Patel" : "Rahul Sharma",
      commissionPlan: isPartner ? {
        commissionRate: 20,
        durationMonths: 24,
        startDate: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000))
      } : undefined,
    };

    // Generate referrals
    const referrals = Array.from({ length: referrerData.referralCount }, (_, i) => {
      const isPaidPlan = Math.random() > 0.3;
      const planType = isPaidPlan 
        ? Math.random() > 0.5 ? "standard" : "pro"
        : Math.random() > 0.5 ? "standard-trial" : "pro-trial";
      
      return {
        id: `REF-USER-${1000 + i}`,
        storeName: `Store${1000 + i}`,
        registrationDate: new Date(Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000)),
        planType,
        pointsEligible: isPaidPlan,
        pointsEarned: isPaidPlan ? (isPartner ? (planType === "pro" ? 399 : 199) : 200) : 0,
        status: Math.random() > 0.2 ? "active" : "inactive",
      };
    });

    return {
      referrer: referrerData,
      referrals
    };
  });
  
  return data;
}
