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

export function SellerRevenueTable({ defaultPeriod = "allTime" }: SellerRevenueTableProps) {
  const [loading, setLoading] = useState(true);
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
      try {
        // In a real implementation, this would be an API call
        // const url = dateRange ? 
        //   `${baseURL}api/v1/admin/revenue/seller-revenue?is_test=${dataType}&from=${dateRange.from}&to=${dateRange.to}` : 
        //   `${baseURL}api/v1/admin/revenue/seller-revenue?is_test=${dataType}&date=${selectedPeriod}`;
        
        // const response = await axios.get(url, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // setSellerRevenues(response.data.sellerRevenues);
        
        // Mock data for demonstration
        const mockData: SellerRevenue[] = [
          {
            id: "1",
            storeName: "Joshi Jewellers",
            ownerName: "Rahul Joshi",
            plan: "Enterprise",
            city: "Jaipur",
            subscriptionRevenue: 24000,
            platformFees: 62250,
            walletRecharge: 10000,
            otherServices: 5000,
            totalRevenue: 101250,
            totalOrders: 421,
            totalGMV: 1245000,
            registrationDate: "2023-01-15",
            status: "Active"
          },
          {
            id: "2",
            storeName: "Sharma Electronics",
            ownerName: "Vivek Sharma",
            plan: "PRO",
            city: "Delhi",
            subscriptionRevenue: 12000,
            platformFees: 27100,
            walletRecharge: 5000,
            otherServices: 3000,
            totalRevenue: 47100,
            totalOrders: 532,
            totalGMV: 542000,
            registrationDate: "2023-02-20",
            status: "Active"
          },
          {
            id: "3",
            storeName: "Reddy Handicrafts",
            ownerName: "Suresh Reddy",
            plan: "PRO",
            city: "Hyderabad",
            subscriptionRevenue: 12000,
            platformFees: 14250,
            walletRecharge: 3000,
            otherServices: 2000,
            totalRevenue: 31250,
            totalOrders: 310,
            totalGMV: 285000,
            registrationDate: "2023-03-05",
            status: "Active"
          },
          {
            id: "4",
            storeName: "Kumar Furniture",
            ownerName: "Anil Kumar",
            plan: "PRO-Trial",
            city: "Bengaluru",
            subscriptionRevenue: 0,
            platformFees: 16250,
            walletRecharge: 2000,
            otherServices: 1000,
            totalRevenue: 19250,
            totalOrders: 156,
            totalGMV: 325000,
            registrationDate: "2023-04-10",
            status: "Active"
          },
          {
            id: "5",
            storeName: "Patel Fashion",
            ownerName: "Nikhil Patel",
            plan: "Standard",
            city: "Mumbai",
            subscriptionRevenue: 6000,
            platformFees: 10500,
            walletRecharge: 1500,
            otherServices: 1000,
            totalRevenue: 19000,
            totalOrders: 230,
            totalGMV: 210000,
            registrationDate: "2023-05-22",
            status: "Active"
          }
        ];
        setSellerRevenues(mockData);
        setTimeout(() => setLoading(false), 500);
      } catch (error) {
        console.error("Error fetching seller revenue data:", error);
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
    Registration_Date: formatDate(seller.registrationDate),
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
                          <div className="text-xs text-gray-500">Owner: {seller.ownerName}</div>
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
                      <TableCell>{formatDate(seller.registrationDate)}</TableCell>
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
