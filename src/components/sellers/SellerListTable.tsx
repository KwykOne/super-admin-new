import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo } from "react";
import { EmptySellerTable } from "./EmptySellerTable";
import { SellerTableLoading } from "./SellerTableLoading";
import { prepareSellerDataForDownload } from "@/utils/sellerExportUtils";
import { SellerTableRow } from "./SellerTableRow";
import { formatDateTime } from "@/lib/formatters";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { downloadTableAsCSV, formatDate, formatTableDataForDownload } from "@/utils/dataUtils";
import { DownloadButton } from "../ui/download-button";

interface SellerListTableProps {
  sellers: any[];
  loading: boolean;

}

export function SellerListTable({ sellers, loading }: SellerListTableProps) {
  const token = localStorage.getItem('userToken');
  const mode = useSelector((state: RootState) => state.modal.mode)

  
  const isApiSeller =
    sellers.length > 0 &&
    sellers[0].seller_id !== undefined &&
    sellers[0].seller_name !== undefined;

  if (loading) {
    return <SellerTableLoading />;
  }

  return (
    <div>
         <Table
      downloadable={false}
      data={sellers}
      
      filename="sellers-list"
      pagination={true}
    >

      <TableHeader>

        <TableRow>
          <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">
            {isApiSeller ? "Seller Name" : "Store"}
          </TableHead>
          <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">
            {isApiSeller ? "Seller ID" : "City"}
          </TableHead>
          {isApiSeller ? (
            <>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Active Days</TableHead>
              {/* <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Active Dates</TableHead> */}
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Last Active</TableHead>
            </>
          ) : (
            <>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Category</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Onboarding Stage</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Plan</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Status</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Registration Date</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Last Active</TableHead>
              <TableHead className="bg-gray-200 dark:bg-[#1E293B] dark:text-white">Actions</TableHead>
            </>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="w-[100%] overflow-x-auto md:overflow-hidden">
        {sellers.length === 0 ? (
          <EmptySellerTable />
        ) : isApiSeller ? (
          sellers.map(seller => (
            <TableRow key={seller.seller_id}>
              <TableCell>{seller.seller_name}</TableCell>
              <TableCell>{seller.seller_id}</TableCell>
              <TableCell>{seller.active_days ? (seller.active_days) : "-"}</TableCell>
              {/* <TableCell>{seller.active_dates ? (seller.active_dates) : "-"}</TableCell> */}
              <TableCell>{seller.last_active ?(seller.last_active) : "-"}</TableCell>
            </TableRow>
          ))
        ) : (
          sellers.map(seller => (
            <SellerTableRow
              key={seller.id}
              seller={seller}
              token={token}
            />
          ))
        )}
      </TableBody>

    </Table>

    </div>
  )
 
}