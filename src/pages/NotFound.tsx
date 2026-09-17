import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full text-center border-gray-200/50 shadow-sm">
        <CardContent className="pt-10 pb-10 px-6">
          <h1 className="text-6xl font-bold text-bharatgo-primary mb-3">404</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="gap-2">
            <Home size={16} />
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
