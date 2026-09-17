import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Filter, RefreshCw } from "lucide-react";
import { formatDateTime } from "@/lib/formatters";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";

interface VendorExpiryTableProps {
  className?: string;
}

interface VendorData {
  vendor_id: number;
  vendor_name: string;
  vendor_uid: string;
  store_status: string;
  is_test: boolean;
  business_name: string;
  registered_mobileno: string;
  email: string;
  plan_details: {
    plan_id: number;
    plan_name: string;
    plan_type: string;
    payment_type: string;
    activation_date: string;
    expiry_date: string;
    days_until_expiry: number;
    plan_status: string;
  } | null;
  created_on: string;
  modified_on: string;
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: {
    vendors: VendorData[];
    pagination: {
      current_page: number;
      per_page: number;
      total_count: number;
      total_pages: number;
    };
  };
}

interface PlanCountsResponse {
  status: boolean;
  message: string;
  data: {
    active_plans: number;
    expired_plans: number;
    expiring_soon: number;
    expiring_this_month: number;
    total_plans: number;
  };
}

export function VendorExpiryTable({ className }: VendorExpiryTableProps) {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_count: 0,
    total_pages: 0,
  });
  const [planCounts, setPlanCounts] = useState({
    active_plans: 0,
    expired_plans: 0,
    expiring_soon: 0,
    expiring_this_month: 0,
    total_plans: 0,
  });


  // Filter states
  const [filters, setFilters] = useState({
    expiryDateFrom: "",
    expiryDateTo: "",
    status: "active", // active, expired, all
    page: 1,
    limit: 10,
  });
  const [dateError, setDateError] = useState<string>("");

  const token = localStorage.getItem('userToken');
  const mode = useSelector((state: RootState) => state.modal.mode);
  const dataType = useSelector((state: RootState) => state.modal.dataType);
  
  const baseURL = mode === 'dev'
    ? import.meta.env.VITE_BACKEND_DEV_URL
    : import.meta.env.VITE_BACKEND_PROD_URL;

  const fetchPlanCounts = async () => {
    try {
      const params = new URLSearchParams();
      
      if (filters.expiryDateFrom) params.append('expiryDateFrom', filters.expiryDateFrom);
      if (filters.expiryDateTo) params.append('expiryDateTo', filters.expiryDateTo);

      const response = await axios.get(
        `${baseURL}api/v1/admin/get-plan-counts?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: PlanCountsResponse = response.data;
      if (data.status) {
        setPlanCounts(data.data);
      }
    } catch (error) {
      console.error('Error fetching plan counts:', error);
    }
  };

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.expiryDateFrom) params.append('expiryDateFrom', filters.expiryDateFrom);
      if (filters.expiryDateTo) params.append('expiryDateTo', filters.expiryDateTo);
      if (filters.status) params.append('status', filters.status);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const response = await axios.get(
        `${baseURL}api/v1/admin/get-vendors-by-plan-expiry?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data: ApiResponse = response.data;
      if (data.status) {
        setVendors(data.data.vendors);
        setPagination(data.data.pagination);
      } else {
        setVendors([]);
        setPagination({
          current_page: 1,
          per_page: 10,
          total_count: 0,
          total_pages: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
      setPagination({
        current_page: 1,
        per_page: 10,
        total_count: 0,
        total_pages: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchPlanCounts();
  }, [filters]);

  const validateDateRange = (fromDate: string, toDate: string) => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      
      if (to < from) {
        setDateError("End date cannot be earlier than start date");
        toast.error("Invalid Date Range", {
          description: "End date cannot be earlier than start date",
        });
        return false;
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
    return true;
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value || "",
      page: 1, // Reset to first page when filters change
    };

    // Validate date range if both dates are provided
    if (key === 'expiryDateFrom' || key === 'expiryDateTo') {
      const fromDate = key === 'expiryDateFrom' ? value : filters.expiryDateFrom;
      const toDate = key === 'expiryDateTo' ? value : filters.expiryDateTo;
      
      if (!validateDateRange(fromDate, toDate)) {
        return; // Don't update filters if validation fails
      }
    }

    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const getStatusBadge = (vendor: VendorData) => {
    if (!vendor.plan_details) return <Badge variant="secondary">No Plan</Badge>;
    
    const { plan_status } = vendor.plan_details;
    
    switch (plan_status) {
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'expiring_soon':
        return <Badge variant="destructive">Expires Soon</Badge>;
      case 'expiring_this_month':
        return <Badge variant="secondary">Expires This Month</Badge>;
      case 'active':
        return <Badge variant="outline">Active</Badge>;
      default:
        return <Badge variant="outline">Active</Badge>;
    }
  };

  const getPlanBadge = (plan: VendorData['plan_details']) => {
    if (!plan) return <Badge variant="outline">No Plan</Badge>;
    
    const colors = {
      'Pro': 'bg-blue-100 text-blue-800',
      'Standard': 'bg-green-100 text-green-800',
      'Basic': 'bg-gray-100 text-gray-800',
      'Enterprise': 'bg-purple-100 text-purple-800',
    };
    
    const colorClass = colors[plan.plan_name as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    
    return <Badge className={colorClass}>{plan.plan_name}</Badge>;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-4">
              Vendors by Plan Expiry
              <div className="flex gap-2 text-sm">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active: {planCounts.active_plans}
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Expired: {planCounts.expired_plans}
                </Badge>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  Expiring Soon: {planCounts.expiring_soon}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  This Month: {planCounts.expiring_this_month}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>Monitor vendor plan expiration dates</CardDescription>
          </div>
          <Button onClick={() => { fetchVendors(); fetchPlanCounts(); }} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="expiryDateFrom">Date Range From</Label>
              <Input
                id="expiryDateFrom"
                type="date"
                value={filters.expiryDateFrom}
                onChange={(e) => handleFilterChange('expiryDateFrom', e.target.value)}
                className={dateError ? "border-red-500" : ""}
              />
            </div>
            
            <div>
              <Label htmlFor="expiryDateTo">Date Range To</Label>
              <Input
                id="expiryDateTo"
                type="date"
                value={filters.expiryDateTo}
                onChange={(e) => handleFilterChange('expiryDateTo', e.target.value)}
                className={dateError ? "border-red-500" : ""}
              />
              {dateError && (
                <p className="text-sm text-red-500 mt-1">{dateError}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Plan Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Plans</SelectItem>
                  <SelectItem value="expired">Expired Plans</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon (≤7 days)</SelectItem>
                  <SelectItem value="expiring_this_month">Expiring This Month (≤30 days)</SelectItem>
                  <SelectItem value="all">All Plans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({
                    expiryDateFrom: "",
                    expiryDateTo: "",
                    status: "active",
                    page: 1,
                    limit: 10,
                  });
                  setDateError("");
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Expiry Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Days Left</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></TableCell>
                    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></TableCell>
                  </TableRow>
                ))
              ) : !loading && vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No vendors found matching the criteria
                  </TableCell>
                </TableRow>
              ) : !loading && vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <TableRow key={vendor.vendor_id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.vendor_name}</div>
                        <div className="text-sm text-gray-500">No: {vendor.registered_mobileno}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vendor.business_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">Email : {vendor.email || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(vendor.plan_details)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(vendor)}
                    </TableCell>
                    <TableCell>
                      {vendor.plan_details?.expiry_date 
                        ? formatDateTime(vendor.plan_details.expiry_date)
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        vendor.plan_details?.days_until_expiry < 0 
                          ? 'text-red-600' 
                          : vendor.plan_details?.days_until_expiry <= 7 
                          ? 'text-orange-600' 
                          : 'text-green-600'
                      }`}>
                        {vendor.plan_details?.days_until_expiry ?? 'N/A'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : null}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} of{' '}
              {pagination.total_count} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
