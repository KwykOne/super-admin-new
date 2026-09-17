
import { PeriodFilter, PeriodType } from "@/components/PeriodFilter";
import { DateRange } from "react-day-picker";
import { useEffect, useState, useCallback } from "react";

interface SettlementPeriodFilterProps {
  onDataUpdate: (data: any) => void;
  defaultPeriod?: PeriodType;
}

// Mock data by period
const settlementDataByPeriod = {
  today: {
    totalAmount: "₹2.5 Lakh",
    pendingAmount: "₹1.2 Lakh",
    completedAmount: "₹1.3 Lakh",
    pendingCount: 42,
    completedCount: 38,
    settlementTrend: 4,
    pendingTrend: 2,
    completedTrend: 5
  },
  last7days: {
    totalAmount: "₹18.2 Lakh",
    pendingAmount: "₹8.5 Lakh",
    completedAmount: "₹9.7 Lakh",
    pendingCount: 185,
    completedCount: 210,
    settlementTrend: 6,
    pendingTrend: 3,
    completedTrend: 8
  },
  last30days: {
    totalAmount: "₹65.8 Lakh",
    pendingAmount: "₹28.2 Lakh",
    completedAmount: "₹37.6 Lakh",
    pendingCount: 420,
    completedCount: 580,
    settlementTrend: 9,
    pendingTrend: 5,
    completedTrend: 12
  },
  thisMonth: {
    totalAmount: "₹52.4 Lakh",
    pendingAmount: "₹22.8 Lakh",
    completedAmount: "₹29.6 Lakh",
    pendingCount: 340,
    completedCount: 460,
    settlementTrend: 8,
    pendingTrend: 4,
    completedTrend: 10
  },
  allTime: {
    totalAmount: "₹2.85 Cr",
    pendingAmount: "₹1.2 Cr",
    completedAmount: "₹1.65 Cr",
    pendingCount: 1250,
    completedCount: 1850,
    settlementTrend: 15,
    pendingTrend: 8,
    completedTrend: 18
  }
};

export function SettlementPeriodFilter({ onDataUpdate, defaultPeriod = "today" }: SettlementPeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const handlePeriodChange = useCallback((period: PeriodType, customDateRange?: DateRange) => {
    // Prevent unnecessary updates if period hasn't changed
    if (period === selectedPeriod && Date.now() - lastUpdateTime < 500) {
      return;
    }
    
    setSelectedPeriod(period);
    setLastUpdateTime(Date.now());
    
    // Get data for the selected period
    const data = settlementDataByPeriod[period as keyof typeof settlementDataByPeriod] || settlementDataByPeriod.today;
    onDataUpdate(data);
  }, [selectedPeriod, lastUpdateTime, onDataUpdate]);

  useEffect(() => {
    // Initialize with default period data
    // Use timeout to prevent initial flickering
    const timer = setTimeout(() => {
      const initialData = settlementDataByPeriod[defaultPeriod as keyof typeof settlementDataByPeriod] || settlementDataByPeriod.today;
      onDataUpdate(initialData);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [defaultPeriod, onDataUpdate]);

  return (
    <div className="flex justify-end mb-4">
      <PeriodFilter 
        onPeriodChange={handlePeriodChange} 
        defaultPeriod={defaultPeriod}
      />
    </div>
  );
}
