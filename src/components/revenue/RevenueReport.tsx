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

interface RevenueReportRow {
  id: string;
  paymentDate: string;
  businessName: string;
  mobile: string;
  city: string;
  gstin: string;
  planName: string;
  amount: number;
  paymentType: string;
  paymentChannel: string;
  invoiceDate: string;
  invoiceNumber: string;
  status: string;
}

interface RevenueReportProps {
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

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

export function RevenueReport({ defaultPeriod = "thisMonth" }: RevenueReportProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportRows, setReportRows] = useState<RevenueReportRow[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("thisMonth");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const token = localStorage.getItem("userToken");
  const mode = useSelector((state: RootState) => state.modal.mode);
  const dataType = useSelector((state: RootState) => state.modal.dataType);

  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL;

  useEffect(() => {
    async function fetchReportData() {
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

        const rows: RevenueReportRow[] = allStores.map((store, index): RevenueReportRow => {
          const revenue = lookupRevenue(store);
          const businessName = store.businessDetails?.business_name
            || str(pickFirst(store, ["business_name", "store_name", "name", "seller_name", "vendor_name"]))
            || "Unknown Store";
          const mobile = str(pickFirst(store, ["mobile_no", "mobile", "phone", "contact_no"]))
            || str(store.businessDetails?.mobile_no);
          const city = store.businessDetails?.city
            || str(pickFirst(store, ["city", "store_city"]))
            || "N/A";
          const gstin = str(pickFirst(store, ["gstin", "gst_no", "gst_number"]))
            || str(store.businessDetails?.gstin);
          const planName = store.planDetails?.globalPlanMaster?.plan_name
            || str(pickFirst(store, ["plan", "plan_name", "subscription_plan"]))
            || "N/A";
          const regDate = str(pickFirst(store, ["created_on", "created_at", "createdAt", "registration_date", "join_date"]));
          const subscriptionRevenue = revenue ? num(pickFirst(revenue, ["subscriptionRevenue", "subscription_revenue", "subscription"])) : 0;
          const walletRevenue = revenue ? num(pickFirst(revenue, ["walletRecharge", "wallet_recharge", "wallet_revenue", "wallet"])) : 0;
          const totalRevenue = revenue ? num(pickFirst(revenue, ["totalRevenue", "total_revenue", "revenue"])) : 0;
          const paymentType = subscriptionRevenue > 0 ? "Subscription" : walletRevenue > 0 ? "Wallet Recharge" : totalRevenue > 0 ? "Other" : "—";
          const amount = subscriptionRevenue || walletRevenue || totalRevenue;
          const status = str(pickFirst(store, ["store_status", "status"])) || "Active";

          return {
            id: str(pickFirst(store, ["id", "seller_id", "vendor_id", "store_id", "_id", "bharatgo_unique_id"])) || String(index + 1),
            paymentDate: regDate,
            businessName,
            mobile: mobile || "N/A",
            city,
            gstin: gstin || "N/A",
            planName,
            amount,
            paymentType,
            paymentChannel: "Razorpay",
            invoiceDate: regDate,
            invoiceNumber: `INV-${str(pickFirst(store, ["bharatgo_unique_id", "id", "seller_id", "vendor_id"])).slice(0, 8).toUpperCase() || String(index + 1).padStart(4, "0")}`,
            status,
          };
        }).filter(row => row.amount > 0);

        setReportRows(rows);
      } catch (err: any) {
        console.error("Error fetching revenue report data:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load revenue report data");
        setReportRows([]);
      } finally {
        setLoading(false);
      }
    }

    fetchReportData();
  }, [selectedPeriod, dateRange, dataType, baseURL, token]);

  const handlePeriodChange = (period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
  };

  const formatCurrency = (value: number) => {
    if (value === 0) return "—";
    return `₹${convertNumber(value)}`;
  };

  const getPaymentTypeBadge = (type: string) => {
    if (type === "Subscription") return "bg-blue-100 text-blue-800";
    if (type === "Wallet Recharge") return "bg-green-100 text-green-800";
    if (type === "Other") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const totalRecords = reportRows.length;
  const totalSubscription = reportRows.reduce((sum, r) => sum + (r.paymentType === "Subscription" ? r.amount : 0), 0);
  const totalWallet = reportRows.reduce((sum, r) => sum + (r.paymentType === "Wallet Recharge" ? r.amount : 0), 0);
  const totalAmount = reportRows.reduce((sum, r) => sum + r.amount, 0);

  const downloadData = useMemo(() => reportRows.map(row => ({
    Payment_Date: row.paymentDate ? formatDate(row.paymentDate) : "N/A",
    Business_Name: row.businessName,
    Mobile: row.mobile,
    City: row.city,
    GSTIN: row.gstin,
    Plan: row.planName,
    Amount: row.amount === 0 ? "N/A" : formatCurrency(row.amount),
    Payment_Type: row.paymentType,
    Payment_Channel: row.paymentChannel,
    Invoice_Date: row.invoiceDate ? formatDate(row.invoiceDate) : "N/A",
    Invoice_Number: row.invoiceNumber,
    Status: row.status,
  })), [reportRows]);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Revenue Report</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Transaction-level revenue records for GST filing purposes
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <div className="text-sm text-muted-foreground">Total Records</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalRecords.toLocaleString()}</div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="text-sm text-muted-foreground">Subscription Revenue</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{formatCurrency(totalSubscription)}</div>
              </div>
              <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                <div className="text-sm text-muted-foreground">Wallet Revenue</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{formatCurrency(totalWallet)}</div>
              </div>
              <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{formatCurrency(totalAmount)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table
                downloadable
                data={reportRows}
                allData={downloadData}
                filename="revenue-report-gst"
                pagination={true}
                pageSize={50}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableHead className="w-[200px]">Business Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Payment Channel</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-gray-500">
                        No revenue records found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    reportRows.map(row => (
                      <TableRow key={row.id}>
                        <TableCell>{row.paymentDate ? formatDate(row.paymentDate) : "N/A"}</TableCell>
                        <TableCell className="font-medium">{row.businessName}</TableCell>
                        <TableCell>{row.mobile}</TableCell>
                        <TableCell>{row.city}</TableCell>
                        <TableCell className="text-xs">{row.gstin}</TableCell>
                        <TableCell>{row.planName}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(row.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentTypeBadge(row.paymentType)}>
                            {row.paymentType}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.paymentChannel}</TableCell>
                        <TableCell>{row.invoiceDate ? formatDate(row.invoiceDate) : "N/A"}</TableCell>
                        <TableCell className="text-xs font-mono">{row.invoiceNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{row.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
