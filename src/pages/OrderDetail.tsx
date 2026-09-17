
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  DollarSign, 
  Truck, 
  ShoppingBag,
  Clock,
  CreditCard,
  CheckCircle,
  Store
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { convertNumber, formatDateTime } from "@/utils/dataUtils";

// Mock order data
const orderDetails = {
  id: "ORD-2023-1001",
  customerId: "CUST-12345",
  customerName: "Rajesh Kumar",
  customerEmail: "rajesh.kumar@example.com",
  customerPhone: "+91 98765 43210",
  storeName: "Sharma Electronics",
  storeId: "SLR-2023-001",
  storeCity: "Delhi",
  storeAddress: "22 Market Road, Delhi",
  amount: "₹12,500",
  items: [
    { id: "ITEM-001", name: "Samsung Galaxy M14", price: "₹8,000", quantity: 1, total: "₹8,000" },
    { id: "ITEM-002", name: "Wireless Earbuds", price: "₹2,500", quantity: 1, total: "₹2,500" },
    { id: "ITEM-003", name: "Phone Case", price: "₹500", quantity: 4, total: "₹2,000" }
  ],
  status: "Delivered",
  paymentMethod: "Online",
  paymentStatus: "Paid",
  date: "15 May 2023",
  time: "14:30",
  deliveryType: "Home Delivery",
  deliveryPartner: "Own Delivery",
  trackingId: "TRK-23456789",
  deliveryAddress: "42 Patel Nagar, Delhi 110008",
  orderNotes: "Please deliver after 6 PM",
  timeline: [
    { time: "15 May, 14:30", status: "Order Placed", description: "Order was placed by customer" },
    { time: "15 May, 14:45", status: "Payment Confirmed", description: "Payment of ₹12,500 was confirmed" },
    { time: "15 May, 16:20", status: "Processing", description: "Order is being prepared by Sharma Electronics" },
    { time: "16 May, 10:15", status: "Ready for Delivery", description: "Order packed and ready for pickup" },
    { time: "16 May, 12:30", status: "Out for Delivery", description: "Order picked up by delivery partner" },
    { time: "16 May, 18:45", status: "Delivered", description: "Order delivered successfully" }
  ],
  isTest: false
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800";
    case "In Transit": return "bg-indigo-100 text-indigo-800";
    case "Ready": return "bg-amber-100 text-amber-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    case "New Order": return "bg-blue-100 text-blue-800";
    case "Confirmed": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Paid": return "bg-green-100 text-green-800";
    case "Pending": return "bg-amber-100 text-amber-800";
    case "Refunded": return "bg-blue-100 text-blue-800";
    case "Failed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderInfo,setOrderInfo] = useState({}) as any
  let [orderTimeline,setOrderTimeLine]= useState([])
  const mode = useSelector((state:RootState)=> state.modal.mode)
  const dataType = useSelector((state:RootState)=> state.modal.dataType)
  const token = localStorage.getItem('userToken')
  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL
  // In a real app, we would fetch order data based on the ID
  // For demo purposes, we'll use the mock data
  const order = orderDetails;


  useEffect(()=>{
    async function getOrderData() {
      try{
        const response = await axios.get(`${baseURL}api/v2/admin/order-info/${id}`,{
          headers:{
            Authorization : `Bearer ${token}`
          }
        })


        setOrderInfo(response.data.orderDetails)
      }
      catch(err){
        console.log(err)
      }
    }

    async function  getOrderTimeline() {
      try{
        const response = await axios.get(`${baseURL}api/v1/admin/order-timeline/${id}`,{
          headers:{
            Authorization : `Bearer ${token}`
          }
        })

        console.log(response)
        setOrderTimeLine(response.data.timeline)
      }
      catch(err){
        console.log(err)
      }
    }

    getOrderData()
    getOrderTimeline()

  },[])

  return (
    <DashboardLayout 
      title={`Order ${id}`} 
      subtitle="View and manage order details"
    >
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Orders
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Order Status Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className={""}>
                  {orderInfo?.status || 'NA'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Status</span>
                <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                  {'NA'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Order Date</span>
                <span className="text-sm text-gray-600">
                  {formatDateTime(orderInfo?.order_date) || 'NA'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Method</span>
                <div className="flex items-center">
                  <CreditCard className="mr-1 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{  orderInfo?.payment_mode|| 'NA'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Amount</span>
                <div className="flex items-center font-semibold">
                  <DollarSign className="mr-1 h-4 w-4 text-gray-500" />
                  <span>{convertNumber(orderInfo?.payable_amount) || 'NA'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{orderInfo?.revcivers_name || 'NA'}</p>
                  <p className="text-sm text-gray-600">{orderInfo?.email_id || 'NA'}</p>
                  <p className="text-sm text-gray-600">{orderInfo?.mobile_number || 'NA'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-sm text-gray-600">{orderInfo?.deliveryAddress?.geolocation || 'NA'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-start">
                <Store className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{orderInfo.vendorsDetails?.businessDetails?.business_name || 'NA'}</p>
                  <p className="text-sm text-gray-600">{orderInfo.vendorsDetails?.businessDetails?.geolocation || 'NA'}</p>
  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Delivery Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Type</span>
                <span className="text-sm text-gray-600">{orderInfo?.order_type || 'NA'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Delivery Partner</span>
                <span className="text-sm text-gray-600">{orderInfo?.shipmentDetails?.delivery_partner_name || 'NA'}</span>
              </div>
              
              
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tracking ID</span>
                  <span className="text-sm text-gray-600">{orderInfo?.shipmentDetails?.task_id || 'NA'}</span>
                </div>
                              
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tracking URL</span>
                  <span className="text-sm text-gray-600">{orderInfo?.shipmentDetails?.tracking_url || 'NA'}</span>
                </div>
            
              
              {order.orderNotes && (
                <>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium block mb-1">Order Notes</span>
                    <p className="text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
                      {order.orderNotes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Items */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderInfo.productDetails?.map((item) => (
                  <tr key={item.product_id} className="border-b">
                    <td className="px-4 py-3 font-medium">{item.product_name}</td>
                    <td className="px-4 py-3">Rs {convertNumber(item.mrp)}</td>
                    <td className="px-4 py-3">{1}</td>
                    <td className="px-4 py-3 font-medium">Rs {convertNumber(item.mrp)}</td>
                  </tr>
                ))}
               <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold">Sub Total</td>
                  <td className="px-4 py-3 font-semibold">Rs {convertNumber(orderInfo?.sub_total) || 'NA'}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold">Tax On products </td>
                  <td className="px-4 py-3 font-semibold">Rs {convertNumber(orderInfo?.tax_on_products) || 'NA'}</td>
                </tr>
               
                <tr className="bg-gray-50 border-t ">
                  <td colSpan={3} className="px-4 py-3 text-right font-semibold">Total</td>
                  <td className="px-4 py-3 font-semibold">Rs {convertNumber(orderInfo?.payable_amount) || 'NA'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Order Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-200">
            {orderTimeline.map((order,id) => (
              <div key={id} className="relative">
                <div className="absolute -left-8 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500"></div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                  <p className="font-medium">{order?.status || 'NA'}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    { order.time && formatDateTime(order.time) || 'NA'}
                  </p>
                </div>
    
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
