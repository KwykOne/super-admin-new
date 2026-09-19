import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";

interface RevenueReportProps {
  defaultPeriod?: PeriodType;
}

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

const REPORT_COLUMNS = [
  "S.N.",
  "Customer Payment Date",
  "Type",
  "Payment Channel",
  "Entity Name",
  "Entity GSTIN",
  "Business Name",
  "Mobile Number",
  "Invoice Date",
  "Invoice Number",
  "HSN/SAC",
  "Base Amount",
  "GST on Base Amount",
  "Total Amount",
] as const;

export function RevenueReport({ defaultPeriod = "thisMonth" }: RevenueReportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("thisMonth");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handlePeriodChange = (period: PeriodType, customDateRange?: DateRange) => {
    setSelectedPeriod(period);
    setDateRange(customDateRange);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Revenue Report</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Transaction-level revenue records for GST filing purposes (oldest to newest)
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
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-950/30 p-4 mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Backend transaction endpoint required</h3>
          <p className="text-sm text-muted-foreground max-w-2xl mb-4">
            This report needs a backend endpoint that returns individual revenue transactions
            (from tables such as <code className="text-xs bg-muted px-1 py-0.5 rounded">vendor_plan_payment_master</code> or an invoice ledger)
            with real per-transaction fields: customer payment date, type, payment channel, invoice number,
            invoice date, HSN/SAC, base amount, GST, and total amount.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mb-4">
            No such endpoint was found in the existing BharatGo API. The confirmed revenue endpoints
            (<code className="text-xs bg-muted px-1 py-0.5 rounded">revenue-data</code>,
            <code className="text-xs bg-muted px-1 py-0.5 rounded">monthly-breakdown</code>,
            <code className="text-xs bg-muted px-1 py-0.5 rounded">subscription-revenue</code>,
            <code className="text-xs bg-muted px-1 py-0.5 rounded">top-performing</code>)
            only return per-seller aggregates and cannot produce transaction-level rows.
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Please provide the transaction ledger endpoint path and its response structure,
            and this report will be wired to display real data with the columns below.
          </p>
        </div>

        <div className="overflow-x-auto mt-4">
          <Table
            pagination={true}
            pageSize={50}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          >
            <TableHeader>
              <TableRow>
                {REPORT_COLUMNS.map(col => (
                  <TableHead
                    key={col}
                    className={col === "Base Amount" || col === "GST on Base Amount" || col === "Total Amount" ? "text-right" : ""}
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={REPORT_COLUMNS.length} className="text-center py-8 text-gray-400">
                  No transaction data — waiting for backend endpoint
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
