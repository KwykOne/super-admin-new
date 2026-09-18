import { useState, useEffect, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import axios from "axios";
import { formatDate } from "@/utils/dataUtils";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface SellerRevenue {
  id: string;
  storeName: string;
  ownerName: string;
  plan: string;
  city: string;
  subscriptionRevenue: number;
  platformFees: number;
  walletRecharge: number;
  otherServices: number;
  totalRevenue: number;
  totalOrders: number;
  totalGMV: number;
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

function mapApiResponse(item: any, index: number): SellerRevenue {
  return {
    id: str(pickFirst(item, ["id", "seller_id", "vendor_id", "store_id", "_id"])) || String(index + 1),
    storeName: str(pickFirst(item, ["storeName", "store_name", "business_name", "name", "seller_name", "vendor_name"])) || "Unknown Store",
    ownerName: str(pickFirst(item, ["ownerName", "owner_name", "seller_name", "vendor_name", "name"])),
    plan: str(pickFirst(item, ["plan", "plan_name", "subscription_plan", "current_plan"])) || "N/A",
    city: str(pickFirst(item, ["city", "store_city", "location"])) || "N/A",
    subscriptionRevenue: num(pickFirst(item, ["subscriptionRevenue", "subscription_revenue", "subscription_revenue_amount", "subscription"])),
    platformFees: num(pickFirst(item, ["platformFees", "platform_fees", "platform_fee", "platformFee", "commission"])),
    walletRecharge: num(pickFirst(item, ["walletRecharge", "wallet_recharge", "wallet_revenue", "wallet", "wallet_amount"])),
    otherServices: num(pickFirst(item, ["otherServices", "other_services", "others", "other_revenue", "other"])),
    totalRevenue: num(pickFirst(item, ["totalRevenue", "total_revenue", "revenue", "total_revenue_amount"])),
    totalOrders: num(pickFirst(item, ["totalOrders", "total_orders", "orders", "order_count", "delivered_orders", "orders_count"])),
    totalGMV: num(pickFirst(item, ["totalGMV", "total_gmv", "gmv", "total_gmv_amount", "total_sales", "gross_merchandise_value"])),
    registrationDate: str(pickFirst(item, ["registrationDate", "registration_date", "created_at", "createdAt", "joined_date", "join_date"])),
    status: str(pickFirst(item, ["status", "store_status", "is_active", "active"])) || "Active",
  };
}

export function SellerRevenueTable({ defaultPeriod = "allTime" }: SellerRevenueTableProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sellerRevenues, setSellerRevenues] = useState<SellerRevenue[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
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
        const url = dateRange
          ? `${baseURL}api/v1/admin/revenue/seller-revenue?is_test=${dataType}&from=${dateRange.from}&to=${dateRange.to}`
          : `${baseURL}api/v1/admin/revenue/seller-revenue?is_test=${dataType}&date=${selectedPeriod}`;

        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const rawData: any[] =
          response.data.sellerRevenues ||
          response.data.seller_revenues ||
          response.data.data ||
          response.data.vendors ||
          response.data.sellers ||
          [];

        const mapped = rawData.map(mapApiResponse);
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

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
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
    Owner: seller.ownerName,
    City: seller.city,
    Plan: seller.plan,
    Subscription_Revenue: formatCurrency(seller.subscriptionRevenue),
    Platform_Fees: formatCurrency(seller.platformFees),
    Wallet_Recharge: formatCurrency(seller.walletRecharge),
    Other_Services: formatCurrency(seller.otherServices),
    Total_Revenue: formatCurrency(seller.totalRevenue),
    Total_Orders: seller.totalOrders,
    Total_GMV: formatCurrency(seller.totalGMV),
    Registration_Date: seller.registrationDate ? formatDate(seller.registrationDate) : "N/A",
    Status: seller.status
  })), [sellerRevenues]);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue by Seller</CardTitle>
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
            {[1, 2, 3, 4].map(i => (
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
              filename="seller-revenue-report"
              pagination={true}
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
                      <TableCell className="text-right">{seller.totalOrders}</TableCell>
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
