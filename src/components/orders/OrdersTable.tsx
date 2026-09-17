
import { CheckCircle, CreditCard, Eye, Home, Package, PackageIcon, ShoppingCart, Store, TruckIcon, Wallet, XCircle } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Link } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { convertNumber, formatDate, formatDateTime } from "@/utils/dataUtils";
import { NewformatDateTime } from "@/lib/formatters";

export function OrdersTable({ filteredOrders, loading, statusColors, paymentStatusColors, deliveryTypeColors,total }) {
    const getStatusIcon = useCallback((status: string) => {
      switch (status) {
        case "Delivered": return <CheckCircle size={16} className="mr-1" />;
        case "In Transit": return <TruckIcon size={16} className="mr-1" />;
        case "Ready": return <PackageIcon size={16} className="mr-1" />;
        case "Cancelled": return <XCircle size={16} className="mr-1" />;
        case "New Order": return <Package size={16} className="mr-1" />;
        case "Confirmed": return <CheckCircle size={16} className="mr-1" />;
        default: return null;
      }
    }, []);
  
    const getDeliveryTypeIcon = useCallback((type: string) => {
      switch (type) {
        case "Home Delivery": return <Home size={16} className="mr-1" />;
        case "Store Pickup": return <Store size={16} className="mr-1" />;
        case "In-Store": return <ShoppingCart size={16} className="mr-1" />;
        default: return null;
      }
    }, []);
  
    const getPaymentMethodIcon = useCallback((method: string) => {
      switch (method) {
        case "Online": return <CreditCard size={16} className="mr-1" />;
        case "COD": return <Wallet size={16} className="mr-1" />;
        default: return null;
      }
    }, []);
  
    const downloadData = useMemo(() => {
      if (!filteredOrders || filteredOrders.length === 0) return [];
      
      return filteredOrders.map(order => ({
        Order_ID: order.id,
        Customer: order?.revcivers_name || 'NA',
        Store: order.vendorsDetails?.businessDetails?.business_name || 'NA',
        Date: order.order_date ? formatDate(order.order_date) : 'NA',
        Time: order.order_date ? new Date(order.order_date).toLocaleTimeString() : 'NA',
        Amount: `₹${convertNumber(order.payable_amount || 0)}`,
        Status: order.status || 'NA',
        Delivery_Type: order.order_type || 'NA',
        Delivery_Partner: order.shipmentDetails?.delivery_partner_name || 'NA',
        Payment_Mode: order.payment_mode || 'NA',
        Payment_Status: order.paymentStatus || 'NA'
      }));
    }, [filteredOrders]);

    if (loading) {
      return (
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      );
    }
  
    if (filteredOrders.length === 0) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Store</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Delivery Type</TableHead>
              <TableHead>Delivery Partner</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No orders found matching your filters
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    }
  
    return (
      <Table 
        downloadable ={false}
        data={filteredOrders} 
        allData={downloadData} 
        filename="orders-report" 
        pagination={true}
        total={total}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Delivery Type</TableHead>
            <TableHead>Delivery Partner</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} className={order.isTest ? "bg-gray-50" : ""}>
              <TableCell className="font-medium">
                <Link to={`/orders/${order.id}`} className="hover:underline text-blue-600">
                  {order.id}
                </Link>
                {order.isTest && (
                  <Badge variant="outline" className="ml-2 text-xs">Test</Badge>
                )}
              </TableCell>
              <TableCell>{order?.revcivers_name || 'NA'}</TableCell>
              <TableCell>{order.vendorsDetails?.businessDetails?.business_name || 'NA'}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{NewformatDateTime(order.order_date) || 'NA'}</span>
                </div>
              </TableCell>
              <TableCell>{convertNumber(order.payable_amount) || 'NA'}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={""}>
                  <span className="flex items-center">
                    {/* {getStatusIcon(order.status)} */}
                    {order.status}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={deliveryTypeColors[order.deliveryType]}>
                  <span className="flex items-center">
                    {/* {getDeliveryTypeIcon(order.deliveryType)} */}
                    {order.order_type ?? 'NA'}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>{order.shipmentDetails?.delivery_partner_name || 'NA'}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center text-xs text-gray-500">
                    {/* {getPaymentMethodIcon(order.paymentMethod)} */}
                    {order.payment_mode}
                  </span>
                  <Badge variant="outline" className={paymentStatusColors[order.paymentStatus]}>
                    {order.paymentStatus || 'NA'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/orders/${order.id}`}>
                    <Eye size={16} />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
