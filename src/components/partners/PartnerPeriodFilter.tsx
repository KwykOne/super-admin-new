
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { useEffect, useState, useCallback } from "react";

interface PartnerPeriodFilterProps {
  onPeriodChange: (period: PeriodType, customDateRange?: DateRange) => void;
  defaultPeriod?: PeriodType;
}

export function PartnerPeriodFilter({ 
  onPeriodChange, 
  defaultPeriod = "today" 
}: PartnerPeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const handlePeriodChange = useCallback((period: PeriodType, customDateRange?: DateRange) => {
    // Prevent unnecessary updates if period hasn't changed
    if (period === selectedPeriod && Date.now() - lastUpdateTime < 500) {
      return;
    }
    
    setSelectedPeriod(period);
    setLastUpdateTime(Date.now());
    onPeriodChange(period, customDateRange);
  }, [selectedPeriod, lastUpdateTime, onPeriodChange]);

  useEffect(() => {
    // Initialize with default period
    const timer = setTimeout(() => {
      onPeriodChange(defaultPeriod);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [defaultPeriod, onPeriodChange]);

  return (
    <div className="flex justify-end mb-4">
      <PeriodFilter 
        onPeriodChange={handlePeriodChange} 
        defaultPeriod={defaultPeriod}
      />
    </div>
  );
}
