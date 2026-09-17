
import { DateRange } from "react-day-picker";
import { PeriodType } from "@/components/PeriodFilter";
import { 
  startOfDay, 
  endOfDay, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  startOfMonth, 
  endOfMonth, 
  subMonths, 
  startOfQuarter, 
  endOfQuarter, 
  subQuarters, 
  startOfYear, 
  endOfYear, 
  subYears 
} from "date-fns";

export function getDateRangeFromPeriod(period: PeriodType, customRange?: DateRange): DateRange {
  const today = new Date();
  
  switch (period) {
    case "today":
      return {
        from: startOfDay(today),
        to: endOfDay(today)
      };
    case "yesterday": {
      const yesterday = subDays(today, 1);
      return {
        from: startOfDay(yesterday),
        to: endOfDay(yesterday)
      };
    }
    case "lastSeven":
    case "last7days":
      return {
        from: startOfDay(subDays(today, 6)),
        to: endOfDay(today)
      };
    case "lastThirty":
    case "last30days":
      return {
        from: startOfDay(subDays(today, 29)),
        to: endOfDay(today)
      };
    case "thisWeek":
      return {
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfDay(today)
      };
    case "lastWeek": {
      const lastWeek = subWeeks(today, 1);
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 })
      };
    }
    case "thisMonth":
      return {
        from: startOfMonth(today),
        to: endOfDay(today)
      };
    case "lastMonth": {
      const lastMonth = subMonths(today, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    }
    case "thisQuarter":
      return {
        from: startOfQuarter(today),
        to: endOfDay(today)
      };
    case "lastQuarter": {
      const lastQuarter = subQuarters(today, 1);
      return {
        from: startOfQuarter(lastQuarter),
        to: endOfQuarter(lastQuarter)
      };
    }
    case "thisYear":
      return {
        from: startOfYear(today),
        to: endOfDay(today)
      };
    case "lastYear": {
      const lastYear = subYears(today, 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear)
      };
    }
    case "allTime":
      return {
        from: new Date(2020, 0, 1), // Arbitrary start date
        to: endOfDay(today)
      };
    case "customRange":
      if (customRange?.from && customRange?.to) {
        return {
          from: startOfDay(customRange.from),
          to: endOfDay(customRange.to)
        };
      }
      return {
        from: startOfDay(today),
        to: endOfDay(today)
      };
    default:
      return {
        from: startOfDay(today),
        to: endOfDay(today)
      };
  }
}

export function formatPeriodLabel(period: PeriodType, dateRange?: DateRange): string {
  switch (period) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "lastSeven":
    case "last7days":
      return "Last 7 days";
    case "lastThirty":
    case "last30days":
      return "Last 30 days";
    case "thisWeek":
      return "This week";
    case "lastWeek":
      return "Last week";
    case "thisMonth":
      return "This month";
    case "lastMonth":
      return "Last month";
    case "thisQuarter":
      return "This quarter";
    case "lastQuarter":
      return "Last quarter";
    case "thisYear":
      return "This year";
    case "lastYear":
      return "Last year";
    case "allTime":
      return "All time";
    case "customRange":
      if (dateRange?.from && dateRange?.to) {
        return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
      }
      return "Custom Range";
    default:
      return "Today";
  }
}

export function convertUTCToLocalTime(utcString, pretty = false) {
  const date = new Date(utcString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const millis = String(date.getMilliseconds()).padStart(3, "0");

  // AM/PM formatting
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = String(hours % 12 || 12).padStart(2, "0"); // convert 0 -> 12

  if (pretty) {
    // Human-friendly format with AM/PM
    return `${day}-${month}-${year} at ${hour12}:${minutes}:${seconds} ${ampm}`;
  } else {
    // Standard DB-style format
    return `${year}-${month}-${day} ${String(hours).padStart(2, "0")}:${minutes}:${seconds}.${millis}`;
  }
}