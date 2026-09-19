import { useState, useEffect, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { convertNumber, formatDate } from "@/utils/dataUtils";
import axios from "axios";

interface RevenueReportProps {
  defaultPeriod?: PeriodType;
}

interface TransactionRow {
  sn: number;
  customerPaymentDate: string;
  amountReceivedDate: string;
  type: string;
  channel: string;
  entityName: string;
  gstin: string;
  businessName: string;
  businessMobile: string;
  planName: string;
  invoiceDate: string;
  invoiceManual: string;
  invoiceSystem: string;
  hsnSac: string;
  planPrice: number | string;
  gstOnPlan: number | string;
  otherFees: number | string;
  gstOnOtherFees: number | string;
  totalPaid: number | string;
  razorpayFee: number | string;
  razorpayTax: number | string;
  tds: number | string;
  amountReceived: number | string;
  comment: string;
}

interface Summary {
  subscriptionRevenue?: number;
  walletRevenue?: number;
  totalRevenue?: number;
  [key: string]: any;
}

interface ApiResponse {
  status: boolean;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: Summary;
  data: TransactionRow[];
}

const PAGE_SIZE_OPTIONS = [50, 100];

function mapIsTest(dataType: string): string {
  if (dataType === "both") return "both";
  if (dataType === "test") return "test";
  return "real";
}

function buildPeriodParams(
  period: PeriodType,
  dateRange?: DateRange,
): string {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  switch (period) {
    case "allTime":
    case "all":
      return "date=all";
    case "last7days":
    case "lastSeven":
      return "date=lastSeven";
    case "last30days":
    case "lastThirty":
      return "date=lastThirty";
    case "thisMonth":
      return `date=thisMonth&month=${month}&year=${year}`;
    case "lastMonth": {
      const lm = month === 1 ? 12 : month - 1;
      const ly = month === 1 ? year - 1 : year;
      return `date=lastMonth&month=${lm}&year=${ly}`;
    }
    case "customRange":
      if (dateRange?.from && dateRange?.to) {
        return `date=customData&startDate=${dateRange.from.toISOString()}&endDate=${dateRange.to.toISOString()}`;
      }
      return "date=all";
    default:
      return `date=${period}`;
  }
}

function numStr(v: any): string {
  if (v === null || v === undefined || v === "") return "-";
  if (typeof v === "number") return `₹${convertNumber(v)}`;
  const n = Number(v);
  if (!isNaN(n)) return `₹${convertNumber(n)}`;
  return String(v);
}

function textStr(v: any): string {
  if (v === null || v === undefined || v === "") return "-";
  return String(v);
}

const COLUMNS: { key: keyof TransactionRow; label: string; numeric?: boolean }[] = [
  { key: "sn", label: "S. N." },
  { key: "customerPaymentDate", label: "Customer Payment Date" },
  { key: "amountReceivedDate", label: "Amount Received Date" },
  { key: "type", label: "Type" },
  { key: "channel", label: "Channel" },
  { key: "entityName", label: "Entity Name" },
  { key: "gstin", label: "GSTIN" },
  { key: "businessName", label: "Business Name" },
  { key: "businessMobile", label: "Mobile Number" },
  { key: "planName", label: "Plan Name" },
  { key: "invoiceDate", label: "Invoice Date" },
  { key: "invoiceManual", label: "Invoice # (Manual)" },
  { key: "invoiceSystem", label: "Invoice # (System Generated)" },
  { key: "hsnSac", label: "HSN/SAC" },
  { key: "planPrice", label: "Plan Price", numeric: true },
  { key: "gstOnPlan", label: "GST on Plan Price", numeric: true },
  { key: "otherFees", label: "Other Fees", numeric: true },
  { key: "gstOnOtherFees", label: "GST on Other Fees", numeric: true },
  { key: "totalPaid", label: "Total Amount Paid by Customer", numeric: true },
  { key: "razorpayFee", label: "RazorPay Fees", numeric: true },
  { key: "razorpayTax", label: "Tax on RazorPay Fees", numeric: true },
  { key: "tds", label: "TDS Deducted", numeric: true },
  { key: "amountReceived", label: "Amount Received in BharatGo Bank", numeric: true },
  { key: "comment", label: "Comment" },
];

export function RevenueReport({ defaultPeriod = "thisMonth" }: RevenueReportProps) {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const token = localStorage.getItem("userToken");
  const mode = useSelector((state: RootState) => state.modal.mode);
  const dataType = useSelector((state: RootState) => state.modal.dataType);
  const baseURL = mode === "dev"
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL;

  const fetchData = useCallback(async (page: number, limit: number) => {
    setLoading(true);
    setError(null);
    try {
      const isTestParam = mapIsTest(dataType);
      const periodParam = buildPeriodParams(selectedPeriod, dateRange);
      const url = `${baseURL}api/v1/admin/revenue/vendor-plan-payment-data?is_test=${isTestParam}&page=${page}&limit=${limit}&${periodParam}`;
      const res = await axios.get<ApiResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = res.data;
      setTransactions(body.data || []);
      setSummary(body.summary || null);
      setTotalRecords(body.count || 0);
      setTotalPages(body.totalPages || 1);
      setCurrentPage(body.page || page);
    } catch (err: any) {
      console.error("Revenue report fetch error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load revenue report data");
      setTransactions([]);
      setSummary(null);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [baseURL, token, dataType, selectedPeriod, dateRange]);

  useEffect(() => {
    fetchData(1, pageSize);
  }, [fetchData, pageSize]);

  const handlePeriodChange = (period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const isTestParam = mapIsTest(dataType);
      const periodParam = buildPeriodParams(selectedPeriod, dateRange);
      const url = `${baseURL}api/v1/admin/export/filtered-vendor-plan-payment-data?is_test=${isTestParam}&${periodParam}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error("Export error:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(clamped);
    fetchData(clamped, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    const cards: { label: string; value: string; color: string }[] = [];
    if (summary.subscriptionRevenue !== undefined) {
      cards.push({ label: "Subscription Revenue", value: numStr(summary.subscriptionRevenue), color: "text-blue-600 dark:text-blue-400" });
    }
    if (summary.walletRevenue !== undefined) {
      cards.push({ label: "Wallet Revenue", value: numStr(summary.walletRevenue), color: "text-green-600 dark:text-green-400" });
    }
    if (summary.totalRevenue !== undefined) {
      cards.push({ label: "Total Revenue", value: numStr(summary.totalRevenue), color: "text-indigo-600 dark:text-indigo-400" });
    }
    return cards;
  }, [summary]);

  const getTypeBadge = (type: string) => {
    const t = (type || "").toLowerCase();
    if (t.includes("plan") || t.includes("subscription")) return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
    if (t.includes("wallet") || t.includes("recharge") || t.includes("topup")) return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";
    if (t.includes("platform") || t.includes("fee")) return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const renderCell = (row: TransactionRow, col: typeof COLUMNS[number]) => {
    const value = row[col.key];
    if (col.key === "type") {
      return <Badge className={getTypeBadge(textStr(value))}>{textStr(value)}</Badge>;
    }
    if (col.key === "customerPaymentDate" || col.key === "amountReceivedDate" || col.key === "invoiceDate") {
      const s = textStr(value);
      return s === "-" ? "-" : formatDate(s);
    }
    if (col.numeric) {
      return numStr(value);
    }
    return textStr(value);
  };

  const startRecord = totalRecords > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endRecord = Math.min(totalRecords, currentPage * pageSize);

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Revenue Report</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Transaction-level revenue records for GST filing (oldest to newest)
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <PeriodFilter onPeriodChange={handlePeriodChange} defaultPeriod={defaultPeriod} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting || loading || totalRecords === 0}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 font-medium mb-2">Failed to load data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchData(1, pageSize)}>
              Retry
            </Button>
          </div>
        ) : (
          <>
            {summaryCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {summaryCards.map(card => (
                  <div key={card.label} className="p-4 border rounded-lg bg-muted/30">
                    <div className="text-sm text-muted-foreground">{card.label}</div>
                    <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {COLUMNS.map(col => (
                      <TableHead
                        key={col.key}
                        className={col.numeric ? "text-right whitespace-nowrap" : "whitespace-nowrap"}
                      >
                        {col.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMNS.length} className="text-center py-8 text-muted-foreground">
                        No revenue transactions found for the selected period
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((row, idx) => (
                      <TableRow key={idx}>
                        {COLUMNS.map(col => (
                          <TableCell
                            key={col.key}
                            className={col.numeric ? "text-right whitespace-nowrap" : "whitespace-nowrap"}
                          >
                            {renderCell(row, col)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalRecords > 0 && (
              <div className="mt-4 flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span>Rows per page:</span>
                  <select
                    className="h-8 rounded border border-input bg-background px-2 text-sm"
                    value={pageSize}
                    onChange={e => handlePageSizeChange(Number(e.target.value))}
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span>
                    Viewing {startRecord}–{endRecord} of {totalRecords.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Button>
                  <span className="whitespace-nowrap">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
