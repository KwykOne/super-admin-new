
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Sellers from "./pages/Sellers";
import SellerDetail from "./pages/SellerDetail";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Revenue from "./pages/Revenue";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import Settlements from "./pages/Settlements";
import Referrals from "./pages/Referrals";
import ReferralDetail from "./pages/ReferralDetail";
import { ReferalListDetails } from "./pages/ReferalListDetail";
import Partners from "./pages/Partners";
import PartnerDetail from "./pages/PartnerDetail";
import { Provider } from 'react-redux';
import { store } from "./store";
import Login from "./pages/Login";
import Announcements from "./pages/Announcements";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <Provider store={store} >
    <Sonner position="bottom-right" />
    <QueryClientProvider client={queryClient}>

    <BrowserRouter>
      <TooltipProvider>
        <Routes>
         
          <Route path="/" element={<Login/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/sellers/:id" element={<SellerDetail />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/settlements" element={<Settlements />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/referrals/:id" element={<ReferralDetail />} />
          <Route path="/referrals/:id/:storeName" element={<ReferalListDetails />} />
          <Route path="/partners" element={<Partners/>}/>
          <Route path="/team" element={<Team />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
    
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
  </Provider>
);

export default App;
