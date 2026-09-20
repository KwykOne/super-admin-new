import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { storeLoginIdentity } from "@/components/RoleProvider";

const getBaseURL = (): string => {
  const stored = localStorage.getItem("persist:root");
  let mode = "production";
  try {
    if (stored) {
      const parsed = JSON.parse(stored);
      const modal = typeof parsed.modal === "string" ? JSON.parse(parsed.modal) : parsed.modal;
      mode = modal?.mode || "production";
    }
  } catch {
    mode = "production";
  }
  return mode === "dev" ? import.meta.env.VITE_BACKEND_DEV_URL : import.meta.env.VITE_BACKEND_PROD_URL;
};

const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || !password) {
      toast.error("Please Enter All the details");
      return;
    }

    const loadId = toast.loading("Logging In");
    setIsLoading(true);
    try {
      const response = await axios.post(`${getBaseURL()}api/v1/admin/login`, {
        mobile_no: number,
        password,
      });
      const token = response.data?.token;
      if (!token) throw new Error("Login response did not include a token");

      localStorage.setItem("userToken", token);
      storeLoginIdentity(response.data, number);
      window.dispatchEvent(new Event("bharatgo-auth-changed"));

      toast.success("Logged In successfully !!");
      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.status === 400) toast.error("Invalid credentials");
      else if (error.response?.status === 500) toast.error("Server error. Please try again later.");
      else if (error.message === "Login response did not include a token") toast.error("Login response was incomplete");
      else toast.error(error.response ? "Something went wrong" : "Network error or server not reachable");
    } finally {
      setIsLoading(false);
      toast.dismiss(loadId);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-2 text-bharatgo-primary">
            <ShoppingBag size={32} />
            <span className="font-bold text-2xl">BharatGo</span>
          </div>
        </div>

        <Card className="animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Super Admin Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="number">Number</Label>
                <Input
                  id="number"
                  type="text"
                  value={number}
                  placeholder="1234567890"
                  onChange={(e) => /^\d*$/.test(e.target.value) && setNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-bharatgo-primary hover:bg-bharatgo-primary-dark" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
