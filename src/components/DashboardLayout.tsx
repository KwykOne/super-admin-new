
import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeDataType, setDevMode, setProdMode } from "@/features/todoSlice";
import { Link } from "react-router-dom";
import { Switch } from "./ui/switch";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backLink?: string;
  wip?: boolean;
}

export function DashboardLayout({ children, title, subtitle, action, backLink, wip }: DashboardLayoutProps) {
  useScrollToTop(); // Add the hook here

  const isMobile = useIsMobile();
  const dispatch = useDispatch()


  const storeType: any = useSelector((state:RootState) => state.modal.dataType);
  const mode: any = useSelector((state:RootState) => state.modal.mode);

  // useEffect(() => {
  //   if (storeType !== "all") {
  //     toast(`Showing ${storeType} stores`);
  //   } else {
  //     toast("Showing all stores");
  //   }
  // }, [storeType]);

  const isCollapsed: any = useSelector((state:RootState) => state.modal.isSidebarCollapsed);

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 dark:bg-black ${ isMobile ? "ml-0" :  isCollapsed ? " ml-16" : " ml-64"}`}>
        <header className="bg-white dark:bg-black border-b border-gray-200/30 px-4 sm:px-6 py-4 flex items-center md:justify-center">
          <div className="md:w-[80vw] dark:bg-black flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between w-full">
            <div className="flex items-center justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
                  {wip && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-xs font-semibold">
                      WIP
                    </Badge>
                  )}
                </div>
                {subtitle && <p className="text-gray-500 mt-1 text-sm">{subtitle}</p>}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">

              <div className="flex items-center gap-1">
                <h1 className={` ${mode === 'dev' ? ' text-black ' : ' text-gray-500/50 '} text-xs md:text-sm`}>Test Mode</h1>
                <Switch  defaultValue={mode} checked={mode === 'production'} onCheckedChange={()=>mode === 'dev'? dispatch(setProdMode()): dispatch(setDevMode()) }/>
                <h1 className={`${mode === 'production' ? ' text-black ' : ' text-gray-500/50 '} text-xs md:text-sm`}>Production Mode</h1>
               
              </div>

              <StoreTypeTabs value={storeType} onValueChange={changeDataType} />
              <Badge variant="outline">
                Super Admin
              </Badge>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function StoreTypeTabs({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void 
}) {
  const isMobile = useIsMobile();
  const dispatch = useDispatch()

  const handleTabChange = (newValue: string) => {
    dispatch(changeDataType(newValue)); // dispatch your redux action
    onValueChange(newValue);         
  };
 
  
  return (
    <div className={cn("bg-gray-100 rounded-lg p-1 ", isMobile ? " md:w-full" : "")}>
      <Tabs value={value} onValueChange={handleTabChange} className="w-full">
        <TabsList className={cn("grid grid-cols-3 h-8")}>
          <TabsTrigger value="both" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="real" className="text-xs">Actual</TabsTrigger>
          <TabsTrigger value="test" className="text-xs">Test</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
