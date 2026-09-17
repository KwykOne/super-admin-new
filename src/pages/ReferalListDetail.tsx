
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { RootState } from "@/store";
import { ArrowLeft, Calendar, Clock, ShoppingBag, CreditCard, User, Store, FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ReferalListDetails(){
    
    const navigate = useNavigate()
    const details: any = useSelector((state:RootState) => state.modal.referrealGivenDetails);
    const {id, storeName} = useParams()

    // Format the registration date
    const formattedDate = details.registrationDate ? 
        new Date(details.registrationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Not available';
    
    // Format the registration time
    const formattedTime = details.registrationDate ? 
        new Date(details.registrationDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Not available';

    // Mock order summary data (replace with real data when available)
    const orderSummary = {
        totalOrders: 24,
        recentOrders: 5,
        totalSales: '₹38,450',
        averageOrderValue: '₹1,602',
        completionRate: '92%'
    };

    return(
        <>
        <DashboardLayout
        title={`${details.storeName}`}
        subtitle="Details"
        wip
        >
            <div className="mb-4">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/referrals/${id}`)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back 
                </Button>
            </div>

            {/* Main Detail Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Referral Basic Details */}
                <div className="lg:col-span-2">
                    <Card className="bg-white dark:bg-[#020817] shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Store className="mr-2 h-5 w-5 text-primary" />
                                Referral Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-white">
                                <div>
                                    <span className="font-medium">Store Name:</span> {details.storeName}
                                </div>
                                <div>
                                    <span className="font-medium">Contact Person:</span> {details.contactPerson}
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span> {details.email}
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span> {details.phone}
                                </div>
                                <div>
                                    <span className="font-medium">Address:</span> {details.address}
                                </div>
                                <div>
                                    <span className="font-medium">Category:</span> {details.category}
                                </div>
                                <div>
                                    <span className="font-medium">Plan Type:</span> 
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${details.planType === 'expired' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {details.planType}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span> 
                                    <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${details.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {details.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium">Points Earned:</span> {details.pointsEarned}
                                </div>
                                <div>
                                    <span className="font-medium">Points Eligible:</span> {details.pointsEligible ? 'Yes' : 'No'}
                                </div>
                                <div>
                                    <span className="font-medium">Referral ID:</span> {details.id}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Registration Information Card */}
                    <Card className="mt-6 bg-white dark:bg-[#020817] dark:text-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-primary" />
                                Registration Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium">Registration Date</div>
                                        <div className="text-sm text-gray-500">{formattedDate}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="h-5 w-5 mr-2 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium">Registration Time</div>
                                        <div className="text-sm text-gray-500">{formattedTime}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <User className="h-5 w-5 mr-2 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium">Registered By</div>
                                        <div className="text-sm text-gray-500">{details.contactPerson}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                                    <div>
                                        <div className="text-sm font-medium">Initial Plan</div>
                                        <div className="text-sm text-gray-500">{details.planType}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Order Summary Card */}
                <div>
                    <Card className="bg-white dark:bg-[#020817] shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                                Sales Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Order Statistics</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Total Orders:</span>
                                            <span className="text-sm font-bold">{orderSummary.totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Recent Orders (30d):</span>
                                            <span className="text-sm font-bold">{orderSummary.recentOrders}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Order Completion Rate:</span>
                                            <span className="text-sm font-bold">{orderSummary.completionRate}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Revenue Information</h3>
                                    <Separator className="my-2" />
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Total Sales:</span>
                                            <span className="text-sm font-bold">{orderSummary.totalSales}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Average Order Value:</span>
                                            <span className="text-sm font-bold">{orderSummary.averageOrderValue}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Recent Activity</h3>
                                    <Separator className="my-2" />
                                    <div className="text-sm text-gray-500 italic">
                                        Last order placed on {new Date(Date.now() - 1000*60*60*24*3).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
        </>
    )
}
