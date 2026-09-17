
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

export type PeriodType = 
  | "today"
  | "yesterday"
  | "lastSeven"
  | "lastThirty"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisQuarter"
  | "lastQuarter"
  | "thisYear"
  | "lastYear"
  | "allTime"
  | "customRange"
  | "last7days"  // Added for compatibility
  | "last30days" // Added for compatibility
  | "all";       // Added to fix the type error

export interface PeriodFilterProps {
  onPeriodChange: (period: PeriodType, dateRange?: DateRange) => void;
  className?: string;
  defaultPeriod?: PeriodType;
}

export function PeriodFilter({ 
  onPeriodChange, 
  className, 
  defaultPeriod = "today" 
}: PeriodFilterProps) {
  const [period, setPeriod] = useState<PeriodType>(defaultPeriod);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const handlePeriodChange = (value: PeriodType) => {
    setPeriod(value);
    if (value !== "customRange") {
      onPeriodChange(value);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onPeriodChange("customRange", range);
    }
  };

  useEffect(() => {
    // Set initial period
    onPeriodChange(defaultPeriod);
  }, []);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
        <SelectItem value="all">All time</SelectItem>

          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="lastSeven">Last 7 days</SelectItem>
          <SelectItem value="lastThirty">Last 30 days</SelectItem>
          <SelectItem value="thisWeek">This week</SelectItem>
          <SelectItem value="lastWeek">Last week</SelectItem>
          <SelectItem value="thisMonth">This month</SelectItem>
          <SelectItem value="lastMonth">Last month</SelectItem>
          <SelectItem value="thisQuarter">This quarter</SelectItem>
          <SelectItem value="lastQuarter">Last quarter</SelectItem>
          <SelectItem value="thisYear">This year</SelectItem>
          <SelectItem value="lastYear">Last year</SelectItem>
          <SelectItem value="customRange">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {period === "customRange" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "LLL dd, y")} -{" "}
                    {format(dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
