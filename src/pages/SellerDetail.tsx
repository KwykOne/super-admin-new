
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDateTime,convertNumber,formatNumberWithCommas } from "@/utils/dataUtils";
import { 
  ArrowLeft, 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Globe, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  Settings2,
  PackageCheck,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Power,
  Edit3
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { updateVendorStatus, updateVendorDetails } from "@/features/todoSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { getVendorStoreUrl, getSellerDashboardUrl, openSellerDashboard } from "@/utils/vendorUtils";

// Mock seller data
const sellerDetails = {
  id: "SLR-2023-001",
  name: "Sharma Electronics",
  ownerName: "Rajesh Sharma",
  description: "One of the leading electronics retailers in Delhi with a wide range of products including smartphones, laptops, and home appliances.",
  logo: "https://placehold.co/100x100?text=SE",
  address: "22 Market Road, Karol Bagh",
  city: "Delhi",
  state: "Delhi",
  pincode: "110005",
  phone: "+91 9876543210",
  alternatePhone: "+91 1123456789",
  email: "sharma@example.com",
  website: "www.sharmaelectronics.com",
  category: "Electronics",
  subcategories: ["Smartphones", "Laptops", "Home Appliances", "Accessories"],
  gst: "07AABCS1429B1Z",
  pan: "AABCS1429B",
  bankDetails: {
    accountName: "Sharma Electronics Pvt Ltd",
    accountNumber: "**********6789",
    ifsc: "HDFC0001234",
    bankName: "HDFC Bank",
    branch: "Karol Bagh"
  },
  onboardingStage: "Live!",
  status: "Active",
  plan: "PRO",
  planFeatures: [
    "Unlimited products",
    "Custom domain",
    "24/7 support",
    "Advanced analytics",
    "Multi-user access",
    "Marketing tools"
  ],
  planExpiryDate: "15 Jan 2024",
  joinDate: "15 Jan 2023",
  lastActive: "2 hours ago",
  storeUrl: "sharma-electronics.bharatgo.com",
  customDomain: "www.sharmaelectronics.com",
  totalOrders: 156,
  totalRevenue: "₹2,45,000",
  stats: {
    lastMonth: {
      orders: 23,
      revenue: "₹35,500",
      viewsCount: 1245,
      conversionRate: "3.2%"
    }
  },
  recentOrders: [
    { id: "ORD-2023-1001", date: "15 May 2023", amount: "₹12,500", status: "Delivered" },
    { id: "ORD-2023-1010", date: "12 May 2023", amount: "₹8,200", status: "Delivered" },
    { id: "ORD-2023-1015", date: "10 May 2023", amount: "₹4,500", status: "Delivered" },
    { id: "ORD-2023-1022", date: "5 May 2023", amount: "₹10,300", status: "Delivered" }
  ],
  topProducts: [
    { id: "PRD-001", name: "Samsung Galaxy M14", sales: 16, revenue: "₹1,28,000" },
    { id: "PRD-005", name: "Wireless Earbuds Pro", sales: 22, revenue: "₹55,000" },
    { id: "PRD-018", name: "HP Laptop 15s", sales: 8, revenue: "₹3,20,000" },
    { id: "PRD-042", name: "Smart Watch X1", sales: 15, revenue: "₹45,000" }
  ],
  timeline: [
    { time: "15 Jan 2023, 10:15", event: "Account Created", description: "Seller registered on the platform" },
    { time: "15 Jan 2023, 10:30", event: "Mobile Verified", description: "Verified mobile number +91 9876543210" },
    { time: "15 Jan 2023, 14:20", event: "Profile Completed", description: "Added store and personal information" },
    { time: "16 Jan 2023, 11:35", event: "Documents Uploaded", description: "Uploaded GST certificate and PAN card" },
    { time: "17 Jan 2023, 09:45", event: "Store Customized", description: "Added logo and customized store appearance" },
    { time: "18 Jan 2023, 16:15", event: "Products Added", description: "Added first batch of 25 products" },
    { time: "20 Jan 2023, 12:00", event: "Went Live", description: "Store made public and received first order" }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800";
    case "Inactive": return "bg-gray-100 text-gray-800";
    case "Lapsed": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "Delivered": return "bg-green-100 text-green-800";
    case "In Transit": return "bg-indigo-100 text-indigo-800";
    case "Cancelled": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getPlanColor = (plan: string) => {
  if (plan.includes("Trial")) return "bg-blue-100 text-blue-800";
  if (plan === "Free") return "bg-gray-100 text-gray-800";
  if (plan === "Standard") return "bg-purple-100 text-purple-800";
  if (plan === "PRO") return "bg-indigo-100 text-indigo-800";
  if (plan === "Enterprise") return "bg-amber-100 text-amber-800";
  return "bg-gray-100 text-gray-800";
};

export default function SellerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [createdOn,setCreatedOn] = useState('')
  const [expiresOn,setExpiresOn] = useState('2045-04-28')
  const [recentPerformance,setRecentPerformance]= useState({}) as any
  const [topSellingProducts,setTopProducts] = useState([])
  const [financeDetails,setFinanceDetails] = useState({}) as any
  const [documentLinks,setDocumentLinks] = useState({}) as any

  const [orders,setOrders] = useState([])
  const [ordersCount,setOrdersCount] = useState(0)
  const [orderPages,setOrderPages]= useState(0)
  const [page,setPage] = useState(1)

  const [products,setProducts] = useState([])
  const [productsCount,setProductsCount] = useState(0)
  const [productPages,setProductsPage]= useState(0)
  const [productPageNo,setProductPageNo] = useState(1)
  const [isToggling, setIsToggling] = useState(false)
  const [isTogglingTest, setIsTogglingTest] = useState(false)
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false)
  const [isLoginCredentialsModalOpen, setIsLoginCredentialsModalOpen] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [billingData, setBillingData] = useState({
    billing_business_name: '',
    billing_mobile: '',
    billing_email: '',
    billing_address: '',
    billing_gstin: '',
    tax: 18,
    walletAmount: 0,
    paymentMethod: 'CASH',
    payment_channel: 'HDFC BANK'
  })
  const [loginCredentials, setLoginCredentials] = useState({
    login_username: '',
    password: '',
    enable_password_login: false
  })
  const [isAssigningPlan, setIsAssigningPlan] = useState(false)
  const [isUpdatingCredentials, setIsUpdatingCredentials] = useState(false)
  const dispatch = useDispatch()
  
  // In a real app, we would fetch seller data based on the ID
  // For demo purposes, we'll use the mock data
  const seller = sellerDetails;

  const token = localStorage.getItem('userToken')
  const details: any = useSelector((state:RootState) => state.modal.sellerDetails);
  const mode = useSelector((state: RootState) => state.modal.mode)
  
  const baseURL = mode === 'dev' ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL
  useEffect(() => {
    if (details === null) {
      navigate('/sellers');
    }
  
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };

    if (details.created_on) {
      const joinedOnRaw = new Date(details.created_on);
      const formattedJoinedOn = joinedOnRaw.toLocaleDateString('en-GB', options); 
      setCreatedOn(formattedJoinedOn);
    }
  
    // Format expiry_date only if planDetails is available
    if (details.planDetails && details.planDetails.expiry_date) {
      const expiresRaw = new Date(details.planDetails.expiry_date);
      const formattedExpires = expiresRaw.toLocaleDateString('en-GB', options); 
      setExpiresOn(formattedExpires);
    } else {
      setExpiresOn('N/A'); 
    }

  }, [details, navigate]);

  useEffect(()=>{
    async function getRecentPerformance() {
      try{
 
        let response = await axios.get(`${baseURL}api/v1/admin/sellers/recent-performance/${id}?date=all`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setRecentPerformance(response.data.data)
      }
      catch(err){
        console.log(err)
      }
    } 

    async function getTopPerformingProducts(){
      try{
 
        let response = await axios.get(`${baseURL}api/v1/admin/sellers/top-products/${id}?date=all`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setTopProducts(response.data.popularProducts)
      }
      catch(err){
        console.log(err)
      }
    }

    async function getFinancialInforamtion() {
      try{
 
        let response = await axios.get(`${baseURL}api/v1/admin/seller/finances/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setFinanceDetails(response.data.payload)
      }
      catch(err){
        console.log(err)
      }
    }
    async function getDocumentLinks() {
      try{
 
        let response = await axios.get(`${baseURL}api/v1/admin/seller/documents/${id}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setDocumentLinks(response.data.payload)
      }
      catch(err){
        console.log(err)
      }
    }

    getDocumentLinks()
    getFinancialInforamtion()
    getRecentPerformance()
    getTopPerformingProducts()
    fetchSubscriptionPlans()
  },[])

  useEffect(()=>{
    async function getOrders() {
      try{
        
        let response = await axios.get(`${baseURL}api/v1/admin/seller/orders/${id}?date=all&page=${page}&order_type=all&payment_mode=all&status=all&search=`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setOrders(response.data.payload)
        setOrdersCount(response.data.totalCount)
        setOrderPages(response.data.totalPages)
      }
      catch(err){
        console.log(err)
      }
    }
    getOrders()
  },[page])

  useEffect(()=>{
    async function getProducts() {
      try{
        
        let response = await axios.get(`${baseURL}api/v1/admin/seller/products/${id}?date=all&page=${productPageNo}`,{
          headers:{
            Authorization:`Bearer ${token}`
          }
        })
      
        setProducts(response.data.payload)
        setProductsPage(response.data.totalPages)
      }
      catch(err){
        console.log(err)
      }
    }
    getProducts()
  },[productPageNo])
  

  const getBadgeBgColor = (status) => {
    switch (status) {
      case "DETAILS":
        return "bg-red-100 text-red-700";
      case "BRANDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONTACT":
        return "bg-blue-100 text-blue-600";
      case "ONLINE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }; 

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    
      setPage(page + 1)
    
  }

  const handleToggleVendorStatus = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      const response = await axios.post(`${baseURL}api/v1/admin/toggle-vendor-status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        // Update Redux store with the new status
        const newIsActive = response.data.data?.is_active ?? (details.is_active === 1 ? 0 : 1);
        dispatch(updateVendorStatus(newIsActive));
        
        toast.success(response.data.message || 'Vendor status updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update vendor status');
      } 
    } catch (error) {
      console.error('Error toggling vendor status:', error);
      toast.error('Failed to update vendor status. Please try again.');
    } finally {
      setIsToggling(false);
    }
  }

  const handleToggleVendorTestStatus = async () => {
    if (isTogglingTest) return;
    
    setIsTogglingTest(true);
    try {
      const response = await axios.post(`${baseURL}api/v1/admin/toggle-vendor-test-status/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        const newIsTest = response.data.data?.is_test ?? (details.is_test === true ? false : true);
        dispatch(updateVendorDetails({
          ...details,
          is_test: newIsTest
        }));
        
        toast.success(response.data.message || 'Vendor test status updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update vendor test status');
      } 
    } catch (error) {
      console.error('Error toggling vendor test status:', error);
      toast.error('Failed to update vendor test status. Please try again.');
    } finally {
      setIsTogglingTest(false);
    }
  }

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get(`${baseURL}api/v1/admin/sellers/subscription-plans?date=all&oneTimePlans=true`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSubscriptionPlans(response.data.subscriptionData || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Failed to fetch subscription plans');
    }
  }

  const handleEditPlan = () => {
    // Pre-fill billing data with vendor details
    setBillingData({
      billing_business_name: details.businessDetails?.business_name || '',
      billing_mobile: details.registered_mobileno || '',
      billing_email: details.vendor_emailid || '',
      billing_address: details.businessDetails?.address_line1 || '',
      billing_gstin: details.businessDetails?.gst_number || '',
      tax: 18,
      walletAmount: 0,
      paymentMethod: 'CASH',
      payment_channel: 'HDFC BANK'
    });
    // Don't pre-select the current plan since it's disabled
    setSelectedPlan('');
    setIsEditPlanModalOpen(true);
  }

  const handleAssignPlan = async () => {
    if (!selectedPlan) {
      toast.error('Please select a plan');
      return;
    }

    setIsAssigningPlan(true);
    try {
      const response = await axios.post(`${baseURL}api/v1/admin/assign-plan/${id}`, {
        plan_id: parseInt(selectedPlan),
        ...billingData
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response)
      if (response.status === 200) {
        toast.success('Plan assigned successfully');
        setIsEditPlanModalOpen(false);
        
        // Update local state instead of reloading
        const updatedPlan = subscriptionPlans.find(plan => plan.id.toString() === selectedPlan);
        if (updatedPlan) {
          // Update the details object with new plan information
          const updatedDetails = {
            ...details,
            planDetails: {
              ...details.planDetails,
              plan_id: selectedPlan,
              globalPlanMaster: {
                plan_name: updatedPlan.plan_name
              }
            }
          };
          
          // Update the Redux store/context with new details
          dispatch(updateVendorDetails(updatedDetails));
          
          console.log('Plan updated successfully:', updatedDetails);
        }
      } else {
        toast.error(response.data.message || 'Failed to assign plan');
      }
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Failed to assign plan. Please try again.');
    } finally {
      setIsAssigningPlan(false);
    }
  }

  const handleEditLoginCredentials = () => {
    // Pre-fill login credentials with current vendor data
    setLoginCredentials({
      login_username: details.login_username || '',
      password: '',
      enable_password_login: details.enable_password_login || false
    });
    setIsLoginCredentialsModalOpen(true);
  }

  const handleUpdateLoginCredentials = async () => {
    if (!loginCredentials.login_username || !loginCredentials.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate username (10 digits)
    if (!/^\d{10}$/.test(loginCredentials.login_username)) {
      toast.error('Username must be exactly 10 digits');
      return;
    }

    // Validate password (6 digits)
    if (!/^\d{6}$/.test(loginCredentials.password)) {
      toast.error('Password must be exactly 6 digits');
      return;
    }

    setIsUpdatingCredentials(true);
    try {
      const response = await axios.put(`${baseURL}api/v1/admin/update-vendor-login-credentials/${id}`, {
        ...loginCredentials
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        toast.success('Login credentials updated successfully');
        setIsLoginCredentialsModalOpen(false);
        
        // Update local state
        const updatedDetails = {
          ...details,
          login_username: loginCredentials.login_username,
          enable_password_login: loginCredentials.enable_password_login
        };
        
        dispatch(updateVendorDetails(updatedDetails));
      } else {
        toast.error(response.data.message || 'Failed to update login credentials');
      }
    } catch (error) {
      console.error('Error updating login credentials:', error);
      toast.error('Failed to update login credentials. Please try again.');
    } finally {
      setIsUpdatingCredentials(false);
    }
  }
  console.log(details)
  const vendorStoreUrl = getVendorStoreUrl(details);
  const sellerDashboardUrl = getSellerDashboardUrl(mode);

  const handleOpenStoreDashboard = async () => {
    if (!details.registered_mobileno) {
      toast.error("Seller mobile number not available");
      return;
    }

    try {
      const opened = await openSellerDashboard({
        mobile: details?.registered_mobileno,
        token,
        mode,
      });
      if (!opened) {
        toast.error("Error Redirecting to Vendors dashboard");
      }
    } catch (err) {
      toast.error("Error Redirecting to Vendors dashboard");
    }
  };

  return (
    <DashboardLayout 
      title={details.businessDetails?.business_name || 'NA'} 
      subtitle={`Seller ID: ${details.id || 'NA'} • ${'status: NA'} • ${ details.businessDetails.city || 'NA'}`}
    >
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sellers
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={handleEditPlan}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Plan
          </Button>
          
          <Button
            onClick={handleEditLoginCredentials}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Settings2 className="mr-2 h-4 w-4" />
            Login Credentials
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Seller Status Card */}
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Seller Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium `}>Stage</span>
                <Badge className={getBadgeBgColor(details.store_status)}>
                  {details.store_status || 'NA'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge >
                  {details.planDetails?.globalPlanMaster?.plan_name || 'NA'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Joined On</span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {createdOn || 'NA'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Active</span>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  {'NA'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan Expires</span>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-1 h-4 w-4" />
                  {expiresOn || 'NA'}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Status</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={details.is_active === 1}
                    onCheckedChange={handleToggleVendorStatus}
                    disabled={isToggling}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className={`text-sm font-medium ${details.is_active === 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {details.is_active === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Mode</span>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={details.is_test === false}
                    onCheckedChange={handleToggleVendorTestStatus}
                    disabled={isTogglingTest}
                    className="data-[state=checked]:bg-green-600"
                  />
                  <span className={`text-sm font-medium ${details.is_test === false ? 'text-green-600' : 'text-orange-600'}`}>
                    {details.is_test === false ? 'Live' : 'Test'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Orders</span>
                <div className="flex items-center font-medium">
                  <ShoppingBag className="mr-1 h-4 w-4 text-gray-500" />
                  {'NA'}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Revenue</span>
                <div className="flex items-center font-medium">
                ₹
                  {'NA'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Contact Info Card */}
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Owner</p>
                  <p className="text-sm text-gray-600">{details.vendor_name || 'NA'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{details.registered_mobileno || 'NA'}</p>
                  {seller.alternatePhone && (
                    <p className="text-sm text-gray-600">{details.alternatePhone || 'NA'}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-600">{details.vendor_emailid || 'NA'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <p
                    onClick={() => vendorStoreUrl && window.open(vendorStoreUrl)}
                    className={`text-sm ${vendorStoreUrl ? "text-blue-600 hover:underline cursor-pointer" : "text-gray-500"}`}
                  >
                    {vendorStoreUrl || "NA"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Store Info Card */}
        <Card className="w-full md:w-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Store Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <Store className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Store Type</p>
              
                  <div className="flex flex-wrap gap-1 mt-1">
                  {
                      details.businessDetails.shop_category
                        ? details.businessDetails.shop_category.split(',').map((cat, id) => (
                            <Badge key={id} variant="outline" className="mr-1 my-0.5">
                              {cat.trim()}
                            </Badge>
                          ))
                        : 'NA'
                    }
              
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-gray-600">{details.businessDetails.address_line1 || 'NA'}</p>
                  <p className="text-sm text-gray-600">
                    {details.businessDetails.city || 'NA'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">Store URL</p>
                  <p
                    onClick={handleOpenStoreDashboard}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    {sellerDashboardUrl}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
   
      <Tabs defaultValue="overview" className="mb-6 w-full md:w-auto">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Performance Card */}
            <Card className="w-full md:w-auto">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Performance</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Orders</p>
                    <p className="text-xl font-bold">{recentPerformance?.ordersCount ? formatNumberWithCommas(recentPerformance?.ordersCount) : 'NA'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-xl font-bold">{recentPerformance?.totalSalesAmount ? formatNumberWithCommas(recentPerformance?.totalSalesAmount): 'NA'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="text-xl font-bold">
                    {recentPerformance?.pageViews || '0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Conversion Rate</p>
                    <p className="text-xl font-bold">{'NA'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Top Products Card */}
            <Card className="w-full md:w-auto">
              <CardHeader>
                <CardTitle className="text-lg font-medium">Top Products</CardTitle>
                <CardDescription>Best selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellingProducts.map((product, index) => (
                    <div key={product.product_id|| index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{product.product_name || 'na'}</p>
                        <p className="text-sm text-gray-500">{product.total_quantity_sold || 'NA'} units sold</p>
                      </div>
                      <p className="font-medium">₹ {formatNumberWithCommas(product.unit_sale_price) || 'NA '}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Onboarding Timeline Card */}
          <Card className="mt-6 w-full md:w-auto">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Seller Timeline</CardTitle>
              <CardDescription>Registration and onboarding journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gray-200">
                {seller.timeline.map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-8 mt-1.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500"></div>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                      <p className="font-medium">{event.event}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.time}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Orders</CardTitle>
              <CardDescription>Latest orders from this seller</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Order ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      
                    orders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-3 font-medium">{order.id || 'NA'}</td>
                        <td className="px-4 py-3">{formatDateTime(order.order_date) || 'NA'}</td>
                        <td className="px-4 py-3">Rs {formatNumberWithCommas(order.payable_amount) || 'NA'}</td>
                        <td className="px-4 py-3">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/orders/${order.id}`)}>
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
                      
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Page {page} of {orderPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page === orderPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
                  
             
            </CardContent>
          </Card>
        </TabsContent>
   <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Products</CardTitle>
              <CardDescription>All products of this seller</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Product ID</th>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Quantity Sold</th>
                      <th className="px-4 py-3">Total Sales</th>
                      <th className="px-4 py-3">Created Date</th>
  
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.product_id} className="border-b">
                          <td className="px-4 py-3 font-medium">{product.product_id || 'NA'}</td>
                          <td className="px-4 py-3">{product.product_name || 'NA'}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">
                              {product.category || 'NA'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">{product.total_quantity_sold || '0'}</td>
                          <td className="px-4 py-3">₹{formatNumberWithCommas(parseFloat(product.total_sold_amount)) || '0.00'}</td>
                          <td className="px-4 py-3">{formatDateTime(product.created_on) || 'NA'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                          <PackageCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p>No products found for this seller</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Page {productPageNo} of {productPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProductPageNo(productPageNo - 1)}
                    disabled={productPageNo === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setProductPageNo(productPageNo + 1)}
                    disabled={productPageNo === productPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Financial Details</CardTitle>
              <CardDescription>Banking and tax information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tax Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                    <div>
                      <p className="text-xs text-gray-500">GST Number</p>
                      <p className="font-medium">{financeDetails?.tax_information?.gst_number || 'NA'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">PAN</p>
                      <p className="font-medium">{financeDetails?.bank_details?.pan_card_number || 'NA'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Bank Details</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Account Name</p>
                        <p className="font-medium">{financeDetails?.bank_details?.account_holder_name || 'NA'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="font-medium">{financeDetails?.bank_details?.account_number || 'NA'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bank Name</p>
                        <p className="font-medium">{financeDetails?.bank_details?.bank_name || 'NA'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IFSC Code</p>
                        <p className="font-medium">{financeDetails?.bank_details?.ifsc || 'NA'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Revenue Chart</h3>
                  <div className="p-8 text-center text-gray-500">
                    <BarChart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Revenue analysis coming soon</h3>
                    <p>Detailed revenue charts will be available soon.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Documents</CardTitle>
              <CardDescription>Identification and business documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-md">
                  <p className="font-medium mb-2">GST Certificate</p>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <Button variant="outline" 
                    onClick={()=>
                      {
                        if(documentLinks?.GSTCertificateFile?.file_s3_url)
                        {
                          window.open(documentLinks?.GSTCertificateFile?.file_s3_url)
                        }  
                        else{
                          toast.error('GST Certificate Not Available')
                        }                     
                      }}>
                        View Document</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="font-medium mb-2">PAN Card</p>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <Button
                    onClick={()=>
                      {

                        if(documentLinks?.panCardFile?.file_s3_url)
                        {
                          window.open(documentLinks?.panCardFile?.file_s3_url,)
                        }  
                        else{
                          toast.error('PAN Card  Not Available')
                        }                     
                      }}
                    variant="outline">View Document</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="font-medium mb-2">Shop License</p>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <Button
                      onClick={()=>
                        {
                          if(documentLinks?.ShopActFile?.file_s3_url)
                          {
                            window.open(documentLinks.ShopActFile?.file_s3_url)
                          }  
                          else{
                            toast.error('Shop License  Not Available')
                          }                     
                        }}
                     variant="outline">View Document</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-md">
                  <p className="font-medium mb-2">Adhaar Card</p>
                  <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                    <Button
                        onClick={()=>
                          {
                            console.log(documentLinks?.PersonalAdharFile?.file_s3_url)
                            if(documentLinks?.PersonalAdharFile?.file_s3_url)
                            {
                              window.open(documentLinks?.PersonalAdharFile?.file_s3_url)
                            }  
                            else{
                              toast.error('Adhaar Card  Not Available')
                            }                     
                          }}
                    variant="outline">View Document</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Plan Modal */}
      <Dialog open={isEditPlanModalOpen} onOpenChange={setIsEditPlanModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor Plan</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Plan Selection */}
            <div className="space-y-2">
              <Label htmlFor="plan">Select Plan</Label>
              <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionPlans.map((plan: any) => {
                    const isCurrentPlan = plan.id.toString() === details.planDetails?.plan_id?.toString();
                    return (
                      <SelectItem 
                        key={plan.id} 
                        value={plan.id.toString()}
                        disabled={isCurrentPlan}
                        className={isCurrentPlan ? 'bg-blue-50 opacity-60 cursor-not-allowed' : ''}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span className="font-medium">{plan.plan_name}</span>
                            <span className="text-sm text-gray-500">
                              {plan.plan_type && `(${plan.plan_type}`}
                              {plan.plan_type && plan.payment_type && ` - ${plan.payment_type})`}
                              {plan.plan_type && !plan.payment_type && ')'}
                              {!plan.plan_type && plan.payment_type && `(${plan.payment_type})`}
                            </span>
                          </div>
                          {isCurrentPlan && (
                            <Badge variant="secondary" className="ml-2">Current</Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Billing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Billing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={billingData.billing_business_name}
                    onChange={(e) => setBillingData(prev => ({ ...prev, billing_business_name: e.target.value }))}
                    placeholder="Enter business name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={billingData.billing_mobile}
                    onChange={(e) => setBillingData(prev => ({ ...prev, billing_mobile: e.target.value }))}
                    placeholder="Enter mobile number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingData.billing_email}
                    onChange={(e) => setBillingData(prev => ({ ...prev, billing_email: e.target.value }))}
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gstin">GSTIN</Label>
                  <Input
                    id="gstin"
                    value={billingData.billing_gstin}
                    onChange={(e) => setBillingData(prev => ({ ...prev, billing_gstin: e.target.value }))}
                    placeholder="Enter GSTIN"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Billing Address</Label>
                <Input
                  id="address"
                  value={billingData.billing_address}
                  onChange={(e) => setBillingData(prev => ({ ...prev, billing_address: e.target.value }))}
                  placeholder="Enter billing address"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Payment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tax">Tax Percentage</Label>
                  <Input
                    id="tax"
                    type="number"
                    value={billingData.tax}
                    onChange={(e) => setBillingData(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter tax percentage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="walletAmount">Wallet Amount</Label>
                  <Input
                    id="walletAmount"
                    type="number"
                    value={billingData.walletAmount}
                    onChange={(e) => setBillingData(prev => ({ ...prev, walletAmount: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter wallet amount"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select value={billingData.paymentMethod} onValueChange={(value) => setBillingData(prev => ({ ...prev, paymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CASH">Cash</SelectItem>
                      <SelectItem value="CARD">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentChannel">Payment Channel</Label>
                  <Select value={billingData.payment_channel} onValueChange={(value) => setBillingData(prev => ({ ...prev, payment_channel: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HDFC BANK">HDFC Bank</SelectItem>
                      <SelectItem value="Promotional">Promotional</SelectItem>
                      <SelectItem value="RazorPay">RazorPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditPlanModalOpen(false)}
                disabled={isAssigningPlan}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAssignPlan}
                disabled={isAssigningPlan || !selectedPlan}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAssigningPlan ? 'Assigning...' : 'Assign Plan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Login Credentials Modal */}
      <Dialog open={isLoginCredentialsModalOpen} onOpenChange={setIsLoginCredentialsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Login Credentials</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Login Username */}
            <div className="space-y-2">
              <Label htmlFor="login_username">Login Username (10 digits)</Label>
              <Input
                id="login_username"
                type="text"
                value={loginCredentials.login_username}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 10) {
                    setLoginCredentials(prev => ({ ...prev, login_username: value }));
                  }
                }}
                placeholder="Enter 10-digit username"
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password (6 digits)</Label>
              <Input
                id="password"
                type="password"
                value={loginCredentials.password}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 6) {
                    setLoginCredentials(prev => ({ ...prev, password: value }));
                  }
                }}
                placeholder="Enter 6-digit password"
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
            
            {/* Enable Password Login */}
            <div className="flex items-center space-x-2">
              <Switch
                id="enable_password_login"
                checked={loginCredentials.enable_password_login}
                onCheckedChange={(checked) => setLoginCredentials(prev => ({ ...prev, enable_password_login: checked }))}
              />
              <Label htmlFor="enable_password_login">Enable Password Login</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsLoginCredentialsModalOpen(false)}
              disabled={isUpdatingCredentials}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateLoginCredentials}
              disabled={isUpdatingCredentials || !loginCredentials.login_username || !loginCredentials.password}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isUpdatingCredentials ? 'Updating...' : 'Update Credentials'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
