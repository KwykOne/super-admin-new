
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";

export const EmptySellerTable = () => {
  return (
    <TableRow>
      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
        No sellers found matching your filters
      </TableCell>
    </TableRow>
  );
};
