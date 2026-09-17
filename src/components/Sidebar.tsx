import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  UserCog,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  IndianRupee,
  Menu,
  X,
  Gift,
  PanelRightClose,
  PanelLeftClose,
  Briefcase,
  Wallet2Icon,
  Wallet,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { toggleDashboard } from "@/features/todoSlice";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
  wip?: boolean;
};

const mainItems: SidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Sellers", icon: Users, path: "/sellers" },
  { title: "Orders", icon: ShoppingCart, path: "/orders" },
  { title: "Settlements", icon: Wallet, path: "/settlements", wip: true },
  { title: "Revenue", icon: IndianRupee, path: "/revenue" },
  { title: "Referrals", icon: Gift, path: "/referrals", wip: true },
  { title: "Partners", icon: Briefcase, path: "/partners", wip: true },
  { title: "Team", icon: UserCog, path: "/team" },
  { title: "Announcements", icon: Megaphone, path: "/announcements" },
];

const bottomItems: SidebarItem[] = [
  { title: "Settings", icon: Settings, path: "/settings" },
  { title: "Help", icon: HelpCircle, path: "/help" },
];

export function Sidebar() {

  const isCollapsed: any = useSelector((state:RootState) => state.modal.isSidebarCollapsed);
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    });
    navigate("/");
  };

  // For desktop view
  if (!isMobile) {
   
    return (
      <div
        className={cn(
          "h-screen fixed hidden  md:flex flex-col bg-white dark:bg-black border-r border-gray-200/30 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo and collapse button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/30">
  {!isCollapsed && (
    <div
      className="flex items-center space-x-2 cursor-pointer transition-all duration-200"
      onClick={() => navigate("/dashboard")}
    >
      <ShoppingBag className="text-bharatgo-primary" size={24} />
      <span className="font-bold text-xl">BharatGo</span>
    </div>
  )}
<button
  onClick={() => {
    dispatch(toggleDashboard())
  }}
  className={cn(
    "p-2 rounded-md transition-all duration-200 text-gray-500 hover:text-gray-700 hover:bg-blue-600/20",
    isCollapsed && "ml-auto"
  )}
>
  {isCollapsed ? (
    <PanelRightClose className="text-bharatgo-primary" size={24} />
  ) : (
    <PanelLeftClose className="text-bharatgo-primary" size={24} />
  )}
</button>

</div>

        {/* Main navigation */}
        <div className="flex-1 py-6 space-y-1 overflow-y-auto">
          {mainItems.map((item) => (
            <NavItem
              key={item.title}
              item={item}
              collapsed={isCollapsed}
              active={location.pathname === item.path}
            />
          ))}
        </div>

        {/* Bottom navigation */}
        <div className="py-6 space-y-1 border-t border-gray-200/15">
          {bottomItems.map((item) => (
            <NavItem
              key={item.title}
              item={item}
              collapsed={isCollapsed}
              active={location.pathname === item.path}
            />
          ))}
          <TooltipProvider >
            <Tooltip >
              <TooltipTrigger asChild>
                <div className="mx-2">
                <button
                  onClick={handleLogout}
                  className={cn(
                    "w-full flex items-center   gap-2  py-2  text-gray-500 dark:text-white hover:text-bharatgo-primary hover:bg-blue-600/15 rounded-md transition-colors",
                    isCollapsed ? "justify-center" : "px-4"
                  )}
                >
                  <LogOut size={20} />
                  {!isCollapsed && <span className="">Log Out</span>}
                </button>
                </div>

              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Log Out</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }

  // For mobile view - sheet sidebar and bottom navigation
  return (
    <>
      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200/15 flex justify-around py-2 z-50">
        {mainItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center py-1 px-3 text-xs",
              isActive
                ? "text-bharatgo-primary"
                : "text-gray-500 hover:text-bharatgo-primary"
            )}
          >
            <item.icon size={20} />
            <span className="mt-1 flex items-center gap-1">
              {item.title}
              {item.wip && (
                <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-amber-100 text-amber-800">
                  WIP
                </span>
              )}
            </span>
          </NavLink>
        ))}
        
        {/* More menu for additional items */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col items-center py-1 px-3 text-xs text-gray-500 hover:text-bharatgo-primary">
              <Menu size={20} />
              <span className="mt-1">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] sm:w-[350px]">
            <div className="py-4">
              <div className="flex items-center mb-6">
                <ShoppingBag className="text-bharatgo-primary mr-2" size={24} />
                <span className="font-bold text-xl">BharatGo</span>
              </div>
              
              <div className="space-y-4">
                {/* Extra main items that didn't fit in bottom nav */}
                {mainItems.slice(5).map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center p-2 rounded-md",
                      isActive
                        ? "bg-bharatgo-primary-light text-bharatgo-primary font-medium"
                        : "text-gray-500 hover:text-bharatgo-primary hover:bg-gray-100"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="ml-3 flex items-center gap-2">
                      {item.title}
                      {item.wip && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          WIP
                        </span>
                      )}
                    </span>
                  </NavLink>
                ))}
                
                {/* Separator */}
                <div className="border-t border-gray-200/15 my-2"></div>
                
                {/* Bottom items */}
                {bottomItems.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center p-2 rounded-md",
                      isActive
                        ? "bg-bharatgo-primary-light text-bharatgo-primary font-medium"
                        : "text-gray-500 hover:text-bharatgo-primary hover:bg-blue-600/30"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="ml-3">{item.title}</span>
                  </NavLink>
                ))}
                
                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center p-2 rounded-md text-gray-500 dark:text-white hover:text-bharatgo-primary hover:bg-blue-600/30"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Log Out</span>
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Add padding to main content to avoid overlap with bottom navigation */}
      <div className="pb-16"></div>
    </>
  );
}

function NavItem({ item, collapsed, active }: { item: SidebarItem; collapsed: boolean; active: boolean }) {
  const { title, icon: Icon, path } = item;
  const isMobile = useIsMobile();
  
  if (isMobile) return null; // Mobile nav items are rendered separately
  
  return (
    <TooltipProvider>
      <Tooltip >
        <TooltipTrigger asChild>
          <NavLink
            to={path}
            className={cn(
              "flex items-center p-2 rounded-md transition-colors mx-2",
              collapsed ? "justify-center" : "px-4",
              active
                ? "bg-blue-600/30 text-bharatgo-primary font-medium"
                : "text-gray-500 dark:text-white hover:text-bharatgo-primary hover:bg-blue-600/15"
            )}
          >
            <Icon size={20} />
            {!collapsed && (
              <span className="ml-3 flex items-center gap-2">
                {title}
                {item.wip && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    WIP
                  </span>
                )}
              </span>
            )}
          </NavLink>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{title}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
