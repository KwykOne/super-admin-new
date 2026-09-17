
import { formatDate } from "@/lib/formatters";

export const prepareSellerDataForDownload = (sellers: any[]) => {
  if (!sellers || sellers.length === 0) return [];
  
  return sellers.map(seller => ({
    Store_ID: seller.bharatgo_unique_id || '',
    Store_Name: seller.businessDetails?.business_name || 'NA',
    Owner_Name: seller.vendor_name || 'NA',
    City: seller.businessDetails?.city || 'NA',
    Category: seller.businessDetails?.shop_category || 'NA',
    Onboarding_Stage: seller.store_status || 'NA',
    Plan: seller.planDetails?.globalPlanMaster?.plan_name || 'NA',
    Registration_Date: seller.created_on ? formatDate(seller.created_on) : 'NA',
    Mobile: seller.registered_mobileno || 'NA',
    Email: seller.email || 'NA'
  }));
};
