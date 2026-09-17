
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-bharatgo-secondary mb-4">
            Welcome to 
            <span className="text-bharatgo-primary"> BharatGo</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Super Admin Dashboard for complete business overview
          </p>
        </div>
        
        <div className="flex justify-center">
          <Card className="border-l-4 border-bharatgo-primary shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>Get a complete view of your business metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Access GMV, seller analytics, order metrics, and revenue data all in one place.
              </p>
              <Button 
                onClick={() => navigate("/login")} 
                className="w-full bg-bharatgo-primary hover:bg-bharatgo-primary-dark"
              >
                Login
              </Button>
            </CardContent>
          </Card>
          
          {/* <Card className="border-l-4 border-bharatgo-accent shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>Seller Management</CardTitle>
              <CardDescription>Manage and monitor your sellers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                View seller onboarding stages, subscription plans, and performance metrics.
              </p>
              <Button 
                onClick={() => navigate("/sellers")} 
                variant="outline" 
                className="w-full border-bharatgo-accent text-bharatgo-accent hover:bg-bharatgo-accent hover:text-white"
              >
                Manage Sellers
              </Button>
            </CardContent>
          </Card> */}
        </div>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/orders")} 
                variant="ghost" 
                className="w-full text-bharatgo-primary hover:text-bharatgo-primary-dark"
              >
                View Orders
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/revenue")} 
                variant="ghost" 
                className="w-full text-bharatgo-warning hover:text-amber-700"
              >
                View Revenue
              </Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate("/team")} 
                variant="ghost" 
                className="w-full text-bharatgo-danger hover:text-red-700"
              >
                Manage Team
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Login with username: <strong>admin@bharatgo.com</strong> and password: <strong>superadmin123</strong></p>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
