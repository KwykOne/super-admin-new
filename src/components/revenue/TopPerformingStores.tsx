
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { convertNumber } from "@/utils/dataUtils";

interface Store {
  name: string;
  city: string;
  plan: string;
  ordersCount: number;
  gmv: string;
  revenue: string;
  isTest: boolean;
  business_category?: string; // Add business category
}

interface TopStoresProps {
  stores: Store[];
  loading: boolean;
}

export function TopPerformingStores({ stores, loading }: any) {
  const getPlanColor = (plan: string) => {
    if (plan.includes("Trial")) return "bg-blue-100 text-blue-800";
    if (plan === "Free") return "bg-gray-100 text-gray-800";
    if (plan === "Standard") return "bg-purple-100 text-purple-800";
    if (plan === "PRO") return "bg-indigo-100 text-indigo-800";
    if (plan === "Enterprise") return "bg-amber-100 text-amber-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Top Performing Stores</CardTitle>
        <CardDescription>Stores generating highest revenue</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>GMV</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store,id) => (
                <TableRow key={id} className={""}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{store.business_name || 'na'}</div>
                      <div className="text-xs text-gray-500">{store.city || 'NA'}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {store.business_category || 'NA'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={""}>
                      {store.plan_name || 'NA'}
                    </Badge>
                  </TableCell>
                  <TableCell>{store.delivered_orders || 'NA'}</TableCell>
                  <TableCell>{  store.gmv ? `Rs ${convertNumber(store.gmv.toFixed(2))}` : 'NA'}</TableCell>

                  <TableCell className="font-medium">{convertNumber(store.total_revenue) || 'NA'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
