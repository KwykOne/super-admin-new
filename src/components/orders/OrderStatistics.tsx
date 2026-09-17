import { CheckCircle, PackageCheck, ShoppingCart, XCircle } from "lucide-react";
import { StatCard } from "../dashboard/StatCard";
import { convertNumber } from "@/utils/dataUtils";

export function OrderStatistics({ periodStats, loading }) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        <StatCard
          title="Total Orders"
          value={convertNumber(periodStats?.totalOrders) || 0}
          icon={<ShoppingCart size={22} />}
          description="From all stores"
          trend={periodStats?.totalTrend || 10}
          loading={loading}
          variant="primary"
        />
        <StatCard
          title="Delivered"
          value={convertNumber(periodStats?.deliveredOrders) || 0}
          icon={<CheckCircle size={22} />}
          description="Successfully delivered"
          trend={periodStats?.deliveredTrend || 10}
          loading={loading}
          variant="success"
        />
        <StatCard
          title="In Progress"
          value={convertNumber(periodStats?.preparingOrders) || 0}
          icon={<PackageCheck size={22} />}
          description="Currently processing"
          trend={periodStats?.preparingOrders || 'NA'}
          loading={loading}
          variant="warning"
        />
        <StatCard
          title="Cancelled"
          value={convertNumber(periodStats?.cancelledOrders) || 0}
          icon={<XCircle size={22} />}
          description="Cancelled or rejected"
          trend={periodStats?.cancelledTrend || 10}
          loading={loading}
          variant="danger"
        />
      </div>
    );
  }