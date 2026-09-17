
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SubscriptionPlanProps {
  plans: Array<{
    plan: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  loading: boolean;
}

export function SubscriptionPlanCards({ plans, loading }: any) {
  const getPlanColor = (plan: string) => {
    if (plan === "Enterprise") return "bg-amber-500";
    if (plan === "PRO") return "bg-teal-500";
    return "bg-indigo-500";
  };



  return (
    <Card >
      <CardHeader>
        <CardTitle>Subscription Revenue by Plan</CardTitle>
        <CardDescription>Distribution across different plans</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    {item.name}           (Plan Type : {item.plan_type || 'NA'})              (Payment Type:{item.payment_type || 'NA' } )
                  </Badge>
                  <span className="font-medium">₹{(item.revenue / 1000).toFixed(1)}K</span>
                </div>
                <Progress 
                  value={item.percentage} 
                  className="h-2" 
                  indicatorClassName={getPlanColor(item.plan)}
                />
                <p className="text-xs text-gray-500 text-right">{item.percentage.toFixed(2)}% of subscription revenue</p>
              </div>
            ))}

          </div>
        )}
      </CardContent>
    </Card>
  );
}
