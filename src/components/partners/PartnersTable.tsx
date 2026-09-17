
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDate } from "@/lib/formatters";
import { ArrowUpDown, Eye, Edit, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Partner, PartnerType } from "@/types/partners";

interface PartnersTableProps {
  partners: Partner[];
  onPartnerClick: (id: string) => void;
}

type SortKey = 'name' | 'type' | 'referralCount' | 'totalCommissionEarned' | 'status' | 'joinDate';

export function PartnersTable({ partners, onPartnerClick }: PartnersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedPartners = [...partners].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortKey) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'type':
        return multiplier * a.type.localeCompare(b.type);
      case 'referralCount':
        return multiplier * (a.referralCount - b.referralCount);
      case 'totalCommissionEarned':
        return multiplier * (a.totalCommissionEarned - b.totalCommissionEarned);
      case 'status':
        return multiplier * a.status.localeCompare(b.status);
      case 'joinDate':
        return multiplier * (a.joinDate.getTime() - b.joinDate.getTime());
      default:
        return 0;
    }
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return null;
    }
  };

  const renderTypeBadge = (type: PartnerType) => {
    const colors: Record<PartnerType, { bg: string, text: string }> = {
      "digital-marketing": { bg: "bg-blue-100", text: "text-blue-800" },
      "social-media": { bg: "bg-purple-100", text: "text-purple-800" },
      "software-development": { bg: "bg-green-100", text: "text-green-800" },
      "ca-cs-firm": { bg: "bg-amber-100", text: "text-amber-800" },
      "sales-agency": { bg: "bg-orange-100", text: "text-orange-800" },
      "freelancer": { bg: "bg-indigo-100", text: "text-indigo-800" },
      "other": { bg: "bg-gray-100", text: "text-gray-800" }
    };
    
    const { bg, text } = colors[type];
    const label = type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    return <Badge className={`${bg} ${text}`}>{label}</Badge>;
  };

  const SortButton = ({ column }: { column: SortKey }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => handleSort(column)}
    >
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="bg-white dark:bg-[#020817] rounded-md shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Partner Name
                <SortButton column="name" />
              </TableHead>
              <TableHead>
                Type
                <SortButton column="type" />
              </TableHead>
              <TableHead>
                Join Date
                <SortButton column="joinDate" />
              </TableHead>
              <TableHead>
                Referrals
                <SortButton column="referralCount" />
              </TableHead>
              <TableHead>
                Commission Earned
                <SortButton column="totalCommissionEarned" />
              </TableHead>
              <TableHead>
                Status
                <SortButton column="status" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPartners.length > 0 ? (
              sortedPartners.map((partner) => (
                <TableRow 
                  key={partner.id}
                  className="hover:opacity-90"
                >
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell>{renderTypeBadge(partner.type)}</TableCell>
                  <TableCell>{formatDate(partner.joinDate)}</TableCell>
                  <TableCell>{partner.referralCount}</TableCell>
                  <TableCell className="font-medium">₹{partner.totalCommissionEarned.toLocaleString()}</TableCell>
                  <TableCell>{renderStatusBadge(partner.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onPartnerClick(partner.id)}>
                        <Eye size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit size={16} className="text-amber-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Users size={16} className="text-green-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">No partners found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
