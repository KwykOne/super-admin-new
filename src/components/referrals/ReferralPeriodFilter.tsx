
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";

interface ReferralPeriodFilterProps {
  onPeriodChange: (period: PeriodType, customDateRange?: DateRange) => void;
}

export function ReferralPeriodFilter({ onPeriodChange }: ReferralPeriodFilterProps) {
  return (
    <div className="flex justify-end mb-4">
      <PeriodFilter 
        onPeriodChange={onPeriodChange} 
        defaultPeriod="today"
      />
    </div>
  );
}
