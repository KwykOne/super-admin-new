import * as React from "react"
import { cn } from "@/lib/utils"
import { DownloadButton } from "./download-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "./pagination"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  downloadable?: boolean;
  data?: any[];
  allData?: any[];
  filename?: string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  pageSizeLabel?: string;
  total?: number;
}

const Table = React.forwardRef<
  HTMLTableElement,
  TableProps
>(({ className, downloadable, data, allData, filename, pagination = false, total, pageSize: initialPageSize = 10, pageSizeOptions = [10, 20, 50, 100], pageSizeLabel = "Rows per page", children, ...props }, ref) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const totalRecords = total ?? data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  const paginatedChildren = React.useMemo(() => {
    if (!pagination || !data) return children;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const tableChildren = React.Children.toArray(children);

    return tableChildren.map((child) => {
      if (!React.isValidElement(child) || child.type !== TableBody) return child;
      const bodyRows = React.Children.toArray(child.props.children);
      return React.cloneElement(child, {
        children: bodyRows.slice(start, end),
      });
    });
  }, [children, data, currentPage, pageSize, pagination]);

  const visiblePages = React.useMemo<(number | "ellipsis")[]>(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "ellipsis", totalPages];
    if (currentPage >= totalPages - 2) return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  }, [currentPage, totalPages]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data, pageSize]);

  return (
    <div className="relative w-full overflow-auto">
      {downloadable &&
        <div className="flex justify-end mb-2">
          <DownloadButton
            data={allData || data}
            filename={filename || "table-data"}
          />
        </div>
      }
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {paginatedChildren}
      </table>

      {pagination && data && data.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 px-4 pb-2 text-sm text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>{pageSizeLabel}:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => setPageSize(Number(value))}
            >
              <SelectTrigger className="h-8 w-[78px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>
              Viewing {Math.min(totalRecords, (currentPage - 1) * pageSize + 1)}–{Math.min(totalRecords, currentPage * pageSize)} of {totalRecords.toLocaleString()}
            </span>
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {visiblePages.map((page, index) => (
                <PaginationItem key={`${page}-${index}`} className="hidden sm:inline-flex">
                  {page === "ellipsis" ? (
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  ) : (
                    <button
                      className={cn(
                        "h-9 w-9 rounded-md border border-input flex items-center justify-center text-sm",
                        currentPage === page ? "bg-primary text-primary-foreground" : "hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
})
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
