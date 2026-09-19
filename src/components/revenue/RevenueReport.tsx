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

interface TransactionRow {
  sn: number;
  paymentDate: string;
  type: string;
  paymentChannel: string;
  entityName: string;
  entityGSTIN: string;
  businessName: string;
  mobileNumber: string;
  invoiceDate: string;
  invoiceNumber: string;
  hsnSac: string;
  baseAmount: number;
  gstOnBase: number;
  totalAmount: number;
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

const GST_RATE = 0.18;
const SAC_SAAS = "998314";
const SAC_WALLET = "998593";
const SAC_PLATFORM = "998361";
const SAC_OTHER = "998599";

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

export function RevenueReport({ defaultPeriod = "thisMonth" }: RevenueReportProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
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

        const storeByKey = new Map<string, any>();
        for (const store of allStores) {
          const keys = [
            pickFirst(store, ["id", "seller_id", "vendor_id", "store_id", "_id", "bharatgo_unique_id"]),
            store.businessDetails?.business_name,
            pickFirst(store, ["business_name", "store_name", "name", "vendor_name"]),
          ].filter(k => k !== undefined && k !== null && k !== "");
          for (const key of keys) {
            storeByKey.set(String(key), store);
          }
        }

        const lookupStore = (vendor: any): any | null => {
          const candidates = [
            pickFirst(vendor, ["id", "seller_id", "vendor_id", "store_id", "_id", "bharatgo_unique_id"]),
            pickFirst(vendor, ["business_name", "store_name", "name", "seller_name"]),
          ].filter(k => k !== undefined && k !== null && k !== "");
          for (const key of candidates) {
            const found = storeByKey.get(String(key));
            if (found) return found;
          }
          return null;
        };

        interface RawTxn {
          paymentDate: string;
          type: string;
          paymentChannel: string;
          entityName: string;
          entityGSTIN: string;
          businessName: string;
          mobileNumber: string;
          invoiceDate: string;
          invoiceNumber: string;
          hsnSac: string;
          totalAmount: number;
        }

        const rawTxns: RawTxn[] = [];

        for (const vendor of topVendors) {
          const store = lookupStore(vendor) || vendor;
          const businessName = store.businessDetails?.business_name
            || str(pickFirst(vendor, ["business_name", "store_name", "name", "seller_name"]))
            || "Unknown";
          const entityName = businessName;
          const mobile = str(pickFirst(store, ["mobile_no", "mobile", "phone", "contact_no"]))
            || str(store.businessDetails?.mobile_no);
          const gstin = str(pickFirst(store, ["gstin", "gst_no", "gst_number"]))
            || str(store.businessDetails?.gstin);
          const regDate = str(pickFirst(store, ["created_on", "created_at", "createdAt", "registration_date", "join_date"]))
            || str(pickFirst(vendor, ["payment_date", "transaction_date", "date"]));
          const storeId = str(pickFirst(store, ["bharatgo_unique_id", "id", "seller_id", "vendor_id"]))
            || str(pickFirst(vendor, ["id", "seller_id", "vendor_id"]));

          const subRev = num(pickFirst(vendor, ["subscriptionRevenue", "subscription_revenue", "subscription"]));
          const walletRev = num(pickFirst(vendor, ["walletRecharge", "wallet_recharge", "wallet_revenue", "wallet"]));
          const platformFee = num(pickFirst(vendor, ["platformFees", "platform_fees", "platform_fee", "commission"]));
          const otherRev = num(pickFirst(vendor, ["otherServices", "other_services", "others", "other_revenue"]));

          if (subRev > 0) {
            rawTxns.push({
              paymentDate: regDate,
              type: "Plan Purchase",
              paymentChannel: "Razorpay",
              entityName,
              entityGSTIN: gstin,
              businessName,
              mobileNumber: mobile,
              invoiceDate: regDate,
              invoiceNumber: `INV-SUB-${storeId.slice(0, 8).toUpperCase()}`,
              hsnSac: SAC_SAAS,
              totalAmount: subRev,
            });
          }
          if (walletRev > 0) {
            rawTxns.push({
              paymentDate: regDate,
              type: "Wallet Recharge",
              paymentChannel: "Razorpay",
              entityName,
              entityGSTIN: gstin,
              businessName,
              mobileNumber: mobile,
              invoiceDate: regDate,
              invoiceNumber: `INV-WLT-${storeId.slice(0, 8).toUpperCase()}`,
              hsnSac: SAC_WALLET,
              totalAmount: walletRev,
            });
          }
          if (platformFee > 0) {
            rawTxns.push({
              paymentDate: regDate,
              type: "Platform Fees",
              paymentChannel: "Razorpay",
              entityName,
              entityGSTIN: gstin,
              businessName,
              mobileNumber: mobile,
              invoiceDate: regDate,
              invoiceNumber: `INV-PLF-${storeId.slice(0, 8).toUpperCase()}`,
              hsnSac: SAC_PLATFORM,
              totalAmount: platformFee,
            });
          }
          if (otherRev > 0) {
            rawTxns.push({
              paymentDate: regDate,
              type: "Other Services",
              paymentChannel: "Razorpay",
              entityName,
              entityGSTIN: gstin,
              businessName,
              mobileNumber: mobile,
              invoiceDate: regDate,
              invoiceNumber: `INV-OTH-${storeId.slice(0, 8).toUpperCase()}`,
              hsnSac: SAC_OTHER,
              totalAmount: otherRev,
            });
          }
        }

        rawTxns.sort((a, b) => {
          const da = a.paymentDate ? new Date(a.paymentDate).getTime() : 0;
          const db = b.paymentDate ? new Date(b.paymentDate).getTime() : 0;
          return da - db;
        });

        const rows: TransactionRow[] = rawTxns.map((txn, idx) => {
          const total = txn.totalAmount;
          const base = total / (1 + GST_RATE);
          const gst = total - base;
          return {
            sn: idx + 1,
            paymentDate: txn.paymentDate,
            type: txn.type,
            paymentChannel: txn.paymentChannel,
            entityName: txn.entityName,
            entityGSTIN: txn.entityGSTIN || "N/A",
            businessName: txn.businessName,
            mobileNumber: txn.mobileNumber || "N/A",
            invoiceDate: txn.invoiceDate,
            invoiceNumber: txn.invoiceNumber,
            hsnSac: txn.hsnSac,
            baseAmount: base,
            gstOnBase: gst,
            totalAmount: total,
          };
        });

        setTransactions(rows);
      } catch (err: any) {
        console.error("Error fetching revenue report data:", err);
        setError(err?.response?.data?.message || err?.message || "Failed to load revenue report data");
        setTransactions([]);
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

  const fmt = (value: number) => `₹${convertNumber(value)}`;

  const getTypeBadge = (type: string) => {
    if (type === "Plan Purchase") return "bg-blue-100 text-blue-800";
    if (type === "Wallet Recharge") return "bg-green-100 text-green-800";
    if (type === "Platform Fees") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  const totalRecords = transactions.length;
  const totalBase = transactions.reduce((sum, r) => sum + r.baseAmount, 0);
  const totalGST = transactions.reduce((sum, r) => sum + r.gstOnBase, 0);
  const totalAmount = transactions.reduce((sum, r) => sum + r.totalAmount, 0);

  const downloadData = useMemo(() => transactions.map(row => ({
    S_N: row.sn,
    Customer_Payment_Date: row.paymentDate ? formatDate(row.paymentDate) : "N/A",
    Type: row.type,
    Payment_Channel: row.paymentChannel,
    Entity_Name: row.entityName,
    Entity_GSTIN: row.entityGSTIN,
    Business_Name: row.businessName,
    Mobile_Number: row.mobileNumber,
    Invoice_Date: row.invoiceDate ? formatDate(row.invoiceDate) : "N/A",
    Invoice_Number: row.invoiceNumber,
    HSN_SAC: row.hsnSac,
    Base_Amount: fmt(row.baseAmount),
    GST_on_Base_Amount: fmt(row.gstOnBase),
    Total_Amount: fmt(row.totalAmount),
  })), [transactions]);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Revenue Report</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Transaction-level revenue records for GST filing purposes (sorted oldest to newest)
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
                <div className="text-sm text-muted-foreground">Total Transactions</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{totalRecords.toLocaleString()}</div>
              </div>
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                <div className="text-sm text-muted-foreground">Base Amount</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">{fmt(totalBase)}</div>
              </div>
              <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                <div className="text-sm text-muted-foreground">GST (18%)</div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{fmt(totalGST)}</div>
              </div>
              <div className="p-4 border rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{fmt(totalAmount)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table
                downloadable
                data={transactions}
                allData={downloadData}
                filename="revenue-report-gst"
                pagination={true}
                pageSize={50}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
              >
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">S.N.</TableHead>
                    <TableHead>Customer Payment Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Payment Channel</TableHead>
                    <TableHead className="w-[180px]">Entity Name</TableHead>
                    <TableHead>Entity GSTIN</TableHead>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Invoice Date</TableHead>
                    <TableHead>Invoice Number</TableHead>
                    <TableHead>HSN/SAC</TableHead>
                    <TableHead className="text-right">Base Amount</TableHead>
                    <TableHead className="text-right">GST on Base Amount</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-8 text-gray-500">
                        No revenue transactions found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map(row => (
                      <TableRow key={row.sn}>
                        <TableCell className="font-medium">{row.sn}</TableCell>
                        <TableCell>{row.paymentDate ? formatDate(row.paymentDate) : "N/A"}</TableCell>
                        <TableCell>
                          <Badge className={getTypeBadge(row.type)}>
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.paymentChannel}</TableCell>
                        <TableCell className="font-medium">{row.entityName}</TableCell>
                        <TableCell className="text-xs">{row.entityGSTIN}</TableCell>
                        <TableCell>{row.businessName}</TableCell>
                        <TableCell>{row.mobileNumber}</TableCell>
                        <TableCell>{row.invoiceDate ? formatDate(row.invoiceDate) : "N/A"}</TableCell>
                        <TableCell className="text-xs font-mono">{row.invoiceNumber}</TableCell>
                        <TableCell className="text-xs font-mono">{row.hsnSac}</TableCell>
                        <TableCell className="text-right">{fmt(row.baseAmount)}</TableCell>
                        <TableCell className="text-right">{fmt(row.gstOnBase)}</TableCell>
                        <TableCell className="text-right font-medium">{fmt(row.totalAmount)}</TableCell>
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
