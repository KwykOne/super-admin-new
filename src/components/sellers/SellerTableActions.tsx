
import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Globe, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSellerDetails } from "@/features/todoSlice";
import { toast } from "sonner";
import { RootState } from '@/store';
import { getVendorStoreUrl } from '@/utils/vendorUtils';

interface SellerTableActionsProps {
  seller: any;
  token: string | null;
}

export const SellerTableActions = ({ seller, token }: SellerTableActionsProps) => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.modal.mode)
  const handleOpenStoreDashboardClick = async (mobile: string) => {
    try {
      const baseURL = import.meta.env.VITE_BACKEND_PROD_URL;

      const response = await axios.get(`${baseURL}api/v1/admin/getStoreToken/${mobile}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data.token) {
        window.open(
          mode === "dev"
            ? `https://app-dev.bharatgo.com?token=${response?.data?.token}`
            : `https://seller.bharatgo.com?token=${response?.data?.token}`
        );
      } else {
        toast.error("Error Redirecting to Vendors dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const storeUrl = getVendorStoreUrl(seller);

  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => {
          dispatch(setSellerDetails(seller));
        }}
        variant="ghost" 
        size="icon" 
        asChild
      >
        <Link to={`/sellers/${seller.id}`}>
          <Eye size={16} />
        </Link>
      </Button>
      {storeUrl ? (
        <Button variant="ghost" size="icon" asChild>
          <a href={storeUrl} target="_blank" rel="noopener noreferrer">
            <Globe size={16} />
          </a>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toast.error("Store URL not available")}
        >
          <Globe size={16} />
        </Button>
      )}
      <Button
        onClick={() => handleOpenStoreDashboardClick(seller.registered_mobileno)}
        variant="ghost" 
        size="icon"
      >
        <Settings2 size={16} />
      </Button>
    </div>
  );
};
