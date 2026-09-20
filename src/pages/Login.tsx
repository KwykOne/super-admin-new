
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag } from "lucide-react";

import { toast } from "sonner"
import axios from "axios"
import { setCurrentRole, setCurrentUserName } from "@/lib/roles";


const Login = () => {
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_BACKEND_PROD_URL as string;


  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault()

    if(!number || !password){
      toast.error("Please Enter All the details")
      return;
    }

    const loadId = toast.loading("Logging In")
    setIsLoading(true)
    try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_PROD_URL}api/v1/admin/login`,{
          mobile_no:number,
          password:password
        })

        localStorage.setItem("userToken",response.data.token)

        try {
          const meRes = await axios.get(`${baseURL}api/v1/admin/get-superadmins`, {
            headers: { Authorization: `Bearer ${response.data.token}` },
          });
          const admins = meRes.data.data || [];
          const me = admins.find((a: any) => a.mobile_no === number) || admins[0];
          const roleName = me?.role_master?.role_name || "Team";
          const userName = me?.name || "";
          setCurrentRole(roleName);
          setCurrentUserName(userName);
        } catch {
          setCurrentRole("Team");
        }

        toast.success("Logged In successfully !! ")
        navigate("/dashboard")
        setIsLoading(false)
    }
    catch(err){
      if (err.response) {
        if (err.response.status === 400) {
          toast.error("Invalid credentials");
        } else if (err.response.status === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Network error or server not reachable");
      }
    }
    finally{
      setIsLoading(false)
      toast.dismiss(loadId)
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
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
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
                    onChange={(e) => {
                      const input = e.target.value;
                      const numberRegex = /^\d*$/; 
                      if (numberRegex.test(input)) {
                        setNumber(input);
                      }
                    }}
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
              <Button
                type="submit"
                className="w-full bg-bharatgo-primary hover:bg-bharatgo-primary-dark"
                disabled={isLoading}
              >
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
