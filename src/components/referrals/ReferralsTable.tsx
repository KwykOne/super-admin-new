
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
import { ArrowUpDown, Eye, Edit, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Referrer {
  id: string;
  name: string;
  category: string;
  referralCount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  status: string;
  joinDate: Date;
}

interface ReferralsTableProps {
  referrers: Referrer[];
  onReferrerClick: (id: string) => void;
}

type SortKey = 'name' | 'category' | 'referralCount' | 'pointsEarned' | 'status' | 'joinDate';

export function ReferralsTable({ referrers, onReferrerClick }: ReferralsTableProps) {
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

  const sortedReferrers = [...referrers].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    switch (sortKey) {
      case 'name':
        return multiplier * a.name.localeCompare(b.name);
      case 'category':
        return multiplier * a.category.localeCompare(b.category);
      case 'referralCount':
        return multiplier * (a.referralCount - b.referralCount);
      case 'pointsEarned':
        return multiplier * (a.pointsEarned - b.pointsEarned);
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

  const renderCategoryBadge = (category: string) => {
    switch (category) {
      case "seller":
        return <Badge className="bg-blue-100 text-blue-800">Seller</Badge>;
      case "partner":
        return <Badge className="bg-purple-100 text-purple-800">Partner</Badge>;
      default:
        return null;
    }
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
                Name
                <SortButton column="name" />
              </TableHead>
              <TableHead>
                Category
                <SortButton column="category" />
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
                Points Earned
                <SortButton column="pointsEarned" />
              </TableHead>
              <TableHead>
                Status
                <SortButton column="status" />
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReferrers.length > 0 ? (
              sortedReferrers.map((referrer) => (
                <TableRow 
                  key={referrer.id}
                  className="hover:opacity-90"
                >
                  <TableCell className="font-medium">{referrer.name}</TableCell>
                  <TableCell>{renderCategoryBadge(referrer.category)}</TableCell>
                  <TableCell>{formatDate(referrer.joinDate)}</TableCell>
                  <TableCell>{referrer.referralCount}</TableCell>
                  <TableCell className="font-medium">{referrer.pointsEarned.toLocaleString()}</TableCell>
                  <TableCell>{renderStatusBadge(referrer.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onReferrerClick(referrer.id)}>
                        <Eye size={16} className="text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit size={16} className="text-amber-600" />
                      </Button>
                      {referrer.category === "seller" && (
                        <Button variant="ghost" size="icon">
                          <Globe size={16} className="text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-muted-foreground">No referrers found</p>
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
