import axios from "axios";

type VendorStoreLink = {
  custom_domain?: string | null;
  bharatgo_unique_id?: string | null;
};

export function getVendorStoreUrl(vendor: VendorStoreLink): string | null {
  const customDomain = vendor.custom_domain?.trim();

  if (customDomain) {
    const domain = customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${domain}`;
  }

  if (vendor.bharatgo_unique_id) {
    return `https://bharatgo.com/${vendor?.bharatgo_unique_id}`;
  }

  return null;
}

export function getSellerDashboardUrl(mode: string): string {
  return mode === "dev" ? "https://app-dev.bharatgo.com" : "https://seller.bharatgo.com";
}

export async function openSellerDashboard({
  mobile,
  token,
  mode,
}: {
  mobile: string;
  token: string | null;
  mode: string;
}): Promise<boolean> {
  const baseURL = import.meta.env.VITE_BACKEND_PROD_URL;

  const response = await axios.get(`${baseURL}api/v1/admin/getStoreToken/${mobile}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response?.data?.token) {
    window.open(`${getSellerDashboardUrl(mode)}?token=${response?.data?.token}`);
    return true;
  }

  return false;
}
