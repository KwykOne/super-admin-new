import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { convertNumber, formatDate } from "@/utils/dataUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface SellerRevenue {
  id: string;
  storeName: string;
  ownerName: string;
  plan: string;
  city: string;
  subscriptionRevenue: number | null;
  platformFees: number | null;
  walletRecharge: number | null;
  otherServices: number | null;
  totalRevenue: number | null;
  totalOrders: number | null;
  totalGMV: number | null;
  registrationDate: string;
  status: string;
}

interface SellerRevenueTableProps {
  defaultPeriod?: PeriodType;
}

function num(v: any): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function str(v: any): string {
  if (v === null || v === undefined || v === "") return "";
  return String(v);
}

function pickFirst(obj: any, keys: string[]): any {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
  }
  return undefined;
}

function amount(item: any, keys: string[]): number | null {
  const value = pickFirst(item, keys);
  return value === undefined ? null : num(value);
}

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

export function SellerRevenueTable({ defaultPeriod = "thisMonth" }: SellerRevenueTableProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerRevenues, setSellerRevenues] = useState<SellerRevenue[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("thisMonth");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const token = localStorage.getItem("userToken");
  const mode = useSelector((state: RootState) => state.modal.mode);
  const dataType = useSelector((state: RootState) => state.modal.dataType);

  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL;

  useEffect(() => {
    async function fetchSellerRevenueData() {
      setLoading(true);
      setError(null);
      try {
        const periodParam = dateRange
          ? `from=${dateRange.from}&to=${dateRange.to}`
          : `date=${selectedPeriod}`;

        const topPerformingUrl = `${baseURL}api/v1/admin/revenue/top-performing?is_test=${dataType}&${periodParam}`;
        const storesUrl = `${baseURL}api/v2/admin/stores?page=1&status=&is_test=${dataType}&q=&categories=&cities=&stages=&rows_per_page=10000`;

        const [topRes, storesRes] = await Promise.all([
          axios.get(topPerformingUrl, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(storesUrl, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const topVendors: any[] = topRes.data.topVendors || topRes.data.data || [];
        const allStores: any[] = storesRes.data.payload || storesRes.data.stores || [];

        const revenueByStoreKey = new Map<string, any>();
        for (const vendor of topVendors) {
          const keys = [
            pickFirst(vendor, ["id", "seller_id", "vendor_id", "store_id", "_id"]),
            pickFirst(vendor, ["business_name", "store_name", "name", "seller_name"]),
          ].filter(k => k !== undefined && k !== null && k !== "");
          for (const key of keys) {
            revenueByStoreKey.set(String(key), vendor);
          }
        }

        const lookupRevenue = (store: any): any | null => {
          const candidates = [
            pickFirst(store, ["id", "seller_id", "vendor_id", "store_id", "_id", "bharatgo_unique_id"]),
            store.businessDetails?.business_name,
            pickFirst(store, ["business_name", "store_name", "name", "vendor_name"]),
          ].filter(k => k !== undefined && k !== null && k !== "");
          for (const key of candidates) {
            const found = revenueByStoreKey.get(String(key));
            if (found) return found;
          }
          return null;
        };

        const mapped: SellerRevenue[] = allStores.map((store, index): SellerRevenue => {
          const revenue = lookupRevenue(store);
          const businessName = store.businessDetails?.business_name
            || str(pickFirst(store, ["business_name", "store_name", "name", "seller_name", "vendor_name"]))
            || "Unknown Store";
          const ownerName = str(pickFirst(store, ["vendor_name", "owner_name", "ownerName"]))
            || str(store.businessDetails?.owner_name);
          const plan = store.planDetails?.globalPlanMaster?.plan_name
            || str(pickFirst(store, ["plan", "plan_name", "subscription_plan"]))
            || "N/A";
          const city = store.businessDetails?.city
            || str(pickFirst(store, ["city", "store_city"]))
            || "N/A";
          const regDate = str(pickFirst(store, ["created_on", "created_at", "createdAt", "registration_date", "join_date"]));
          const status = str(pickFirst(store, ["store_status", "status", "is_active"]))
            || "Active";

          return {
            id: str(pickFirst(store, ["id", "seller_id", "vendor_id", "store_id", "_id", "bharatgo_unique_id"])) || String(index + 1),
            storeName: businessName,
            ownerName,
            plan,
            city,
            subscriptionRevenue: revenue ? amount(revenue, ["subscriptionRevenue", "subscription_revenue", "subscription"]) : null,
            platformFees: revenue ? amount(revenue, ["platformFees", "platform_fees", "platform_fee", "commission"]) : null,
            walletRecharge: revenue ? amount(revenue, ["walletRecharge", "wallet_recharge", "wallet_revenue", "wallet"]) : null,
            otherServices: revenue ? amount(revenue, ["otherServices", "other_services", "others", "other_revenue"]) : null,
            totalRevenue: revenue ? amount(revenue, ["totalRevenue", "total_revenue", "revenue"]) : null,
            totalOrders: revenue ? amount(revenue, ["totalOrders", "total_orders", "delivered_orders", "orders", "order_count"]) : null,
            totalGMV: revenue ? amount(revenue, ["totalGMV", "total_gmv", "gmv", "total_sales"]) : null,
            registrationDate: regDate,
            status,
          };
        }).filter(seller =>
          (seller.totalRevenue !== null && seller.totalRevenue > 0) ||
          (seller.subscriptionRevenue !== null && seller.subscriptionRevenue > 0) ||
          (seller.platformFees !== null && seller.platformFees > 0) ||
          (seller.walletRecharge !== null && seller.walletRecharge > 0) ||
          (seller.otherServices !== null && seller.otherServices > 0)
        );

        setSellerRevenues(mapped);
      } catch (err: any) {
        console.error("Error fetching seller revenue data:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load seller revenue data");
        setSellerRevenues([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSellerRevenueData();
  }, [selectedPeriod, dateRange, dataType, baseURL, token]);

  const handlePeriodChange = (period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
  };

  const formatCurrency = (value: number | null) => {
    return value === null ? "—" : `₹${convertNumber(value)}`;
  };

  const getPlanColor = (plan: string) => {
    if (plan.includes("Trial")) return "bg-blue-100 text-blue-800";
    if (plan === "Free") return "bg-gray-100 text-gray-800";
    if (plan === "Standard") return "bg-purple-100 text-purple-800";
    if (plan === "PRO") return "bg-indigo-100 text-indigo-800";
    if (plan === "Enterprise") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const downloadData = useMemo(() => sellerRevenues.map(seller => ({
    Store_Name: seller.storeName,
    Owner: seller.ownerName || "N/A",
    City: seller.city,
    Plan: seller.plan,
    Subscription_Revenue: seller.subscriptionRevenue === null ? "N/A" : formatCurrency(seller.subscriptionRevenue),
    Platform_Fees: seller.platformFees === null ? "N/A" : formatCurrency(seller.platformFees),
    Wallet_Recharge: seller.walletRecharge === null ? "N/A" : formatCurrency(seller.walletRecharge),
    Other_Services: seller.otherServices === null ? "N/A" : formatCurrency(seller.otherServices),
    Total_Revenue: seller.totalRevenue === null ? "N/A" : formatCurrency(seller.totalRevenue),
    Total_Orders: seller.totalOrders === null ? "N/A" : seller.totalOrders,
    Total_GMV: seller.totalGMV === null ? "N/A" : formatCurrency(seller.totalGMV),
    Registration_Date: seller.registrationDate ? formatDate(seller.registrationDate) : "N/A",
    Status: seller.status
  })), [sellerRevenues]);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Revenue by Seller</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Total revenue by seller across all revenue heads for management overview
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <PeriodFilter
            onPeriodChange={handlePeriodChange}
            defaultPeriod={defaultPeriod}
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 font-medium mb-2">Failed to load data</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              downloadable
              data={sellerRevenues}
              allData={downloadData}
              filename="seller-revenue-summary"
              pagination={true}
              pageSize={50}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
            >
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Store</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead className="text-right">Subscription Revenue</TableHead>
                  <TableHead className="text-right">Platform Fees</TableHead>
                  <TableHead className="text-right">Wallet Recharge</TableHead>
                  <TableHead className="text-right">Other Services</TableHead>
                  <TableHead className="text-right">Total Revenue</TableHead>
                  <TableHead className="text-right">Total Orders</TableHead>
                  <TableHead className="text-right">Total GMV</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerRevenues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      No revenue data found for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  sellerRevenues.map(seller => (
                    <TableRow key={seller.id}>
                      <TableCell className="font-medium">
                        <div>
                          {seller.storeName}
                          {seller.ownerName && (
                            <div className="text-xs text-gray-500">Owner: {seller.ownerName}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{seller.city}</TableCell>
                      <TableCell>
                        <Badge className={getPlanColor(seller.plan)}>
                          {seller.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(seller.subscriptionRevenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(seller.platformFees)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(seller.walletRecharge)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(seller.otherServices)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(seller.totalRevenue)}</TableCell>
                      <TableCell className="text-right">{seller.totalOrders === null ? "—" : seller.totalOrders}</TableCell>
                      <TableCell className="text-right">{formatCurrency(seller.totalGMV)}</TableCell>
                      <TableCell>{seller.registrationDate ? formatDate(seller.registrationDate) : "N/A"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
