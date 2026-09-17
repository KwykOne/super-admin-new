
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSellerDetails } from "@/features/todoSlice";
import { formatDate, formatDateTime, formatDateTimeInTimezone, NewformatDateTime } from "@/lib/formatters";
import { SellerStatusBadge } from './SellerStatusBadge';
import { SellerTableActions } from './SellerTableActions';
import {  convertUTCToLocalTime } from '@/utils/dateUtils';

interface SellerTableRowProps {
  seller: any;
  token: string | null;
}

export const SellerTableRow = ({ seller, token }: SellerTableRowProps) => {
  const dispatch = useDispatch();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      case "Lapsed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <TableRow>
      <TableCell>
        <Link onClick={() => {
          dispatch(setSellerDetails(seller));
        }} to={`/sellers/${seller.id}`} className="block hover:underline">
          <div className="font-medium">{seller.businessDetails?.business_name}</div>
          <div className="text-xs text-gray-500">ID: {seller?.bharatgo_unique_id || 'NA'}</div>
          <div className="text-xs text-gray-500">Owner: {seller?.vendor_name || 'NA'}</div>
        </Link>
      </TableCell>
      <TableCell>{seller.businessDetails?.city || 'NA'}</TableCell>
      <TableCell>
        {seller.businessDetails?.shop_category?.split(',').map((cat: string, id: number) => (
          <Badge key={id} variant="outline" className="mr-1 my-0.5">
            {cat.trim()}
          </Badge>
        ))}
      </TableCell>
      <TableCell>
        <SellerStatusBadge status={seller?.store_status || 'NA'} />
      </TableCell>
      <TableCell>
        <span className="flex items-center">
          {seller.planDetails?.globalPlanMaster?.plan_name || 'NA'}
        </span>
      </TableCell>
      <TableCell>
        <Badge className={getStatusColor(seller.status)}>
          {'NA'}
        </Badge>
      </TableCell>
      <TableCell>{seller.created_on ? convertUTCToLocalTime(seller.created_on,true) : 'NA'}</TableCell>
      <TableCell>{  seller.last_active ? convertUTCToLocalTime(seller?.last_active,true) :'NA'}</TableCell>
      <TableCell>
        <SellerTableActions seller={seller} token={token} />
      </TableCell>
    </TableRow>
  );
};
