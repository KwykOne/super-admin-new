
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Globe } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setReferrealDetails } from "@/features/todoSlice";
import { EditPartnerDialog } from "./EditPartnerDialog";
import { Referrer } from "@/types/referrals";
import { SellerWalletView } from "./SellerWalletView";

interface Referral {
  id: string;
  storeName: string;
  registrationDate: Date;
  planType: string;
  pointsEligible: boolean;
  pointsEarned: number;
  status: string;
  email?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  category?: string;
}

interface ReferrerReferralsListProps {
  referrals: Referral[];
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  statusOptions: { value: string; label: string }[];
  isPartnerView?: boolean;
  referrerDetails?: Referrer;
  showWallet?: boolean;
}

export function ReferrerReferralsList({
  referrals,
  selectedStatuses,
  setSelectedStatuses,
  statusOptions,
  isPartnerView = false,
  referrerDetails,
  showWallet = false
}: ReferrerReferralsListProps) {
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  
  const filteredReferrals = referrals.filter(referral => 
    selectedStatuses.length === 0 || selectedStatuses.includes(referral.planType)
  );

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handlePartnerUpdate = (partnerId: string, updates: any) => {
    console.log("Updating partner:", partnerId, updates);
    // In a real application, this would call an API to update the partner details
  };

  return (
    <>
      <Card className="mb-6">
        {isPartnerView && referrerDetails?.category === "partner" && referrerDetails?.commissionPlan && (
          <CardContent className="pt-6 pb-2">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="text-sm">
                  Commission Rate: {referrerDetails.commissionPlan.commissionRate}%
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Duration: {referrerDetails.commissionPlan.durationMonths} months
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Start Date: {formatDate(referrerDetails.commissionPlan.startDate)}
                </Badge>
              </div>
              <EditPartnerDialog
                partner={referrerDetails}
                onSave={handlePartnerUpdate}
              />
            </div>
          </CardContent>
        )}
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <h3 className="text-lg font-medium">Referral List</h3>
              
              <div className="w-full md:w-1/3">
                <MultiSelectFilter
                  options={statusOptions}
                  selected={selectedStatuses}
                  onChange={setSelectedStatuses}
                  placeholder="Filter by Plan"
                />
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredReferrals.length} of {referrals.length} referrals
            </div>
          </div>
        </CardContent>
      </Card>

      {showWallet && referrerDetails && !isPartnerView && (
        <div className="mb-6">
          <SellerWalletView 
            referrerId={referrerDetails.id}
            totalPoints={referrerDetails.pointsEarned}
            availablePoints={referrerDetails.pointsEarned - referrerDetails.pointsRedeemed}
            redeemedPoints={referrerDetails.pointsRedeemed}
          />
        </div>
      )}
      
      <div className="bg-white dark:bg-[#020817] rounded-md shadow">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Referral Status</TableHead>
                <TableHead>{isPartnerView ? "Commission Eligible" : "Points Eligible"}</TableHead>
                <TableHead>{isPartnerView ? "Commission Earned" : "Points Earned"}</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.storeName}</TableCell>
                    <TableCell>{formatDate(referral.registrationDate)}</TableCell>
                    <TableCell>
                      <Badge className={`
                        ${referral.planType.includes('standard') ? 'bg-blue-100 text-blue-800' : 
                          referral.planType.includes('pro') ? 'bg-purple-100 text-purple-800' : 
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {referral.planType.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={referral.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"}>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {referral.pointsEligible ? (
                        <Badge className="bg-green-100 text-green-800">Yes</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {isPartnerView 
                        ? `₹${(referral.pointsEarned * 10).toLocaleString()}`
                        : referral.pointsEarned.toLocaleString()
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => {
                            setSelectedReferral(referral);
                            navigate(`${location.pathname}/${referral.storeName}`);
                            dispatch(setReferrealDetails(referral));
                          }}
                        >
                          <Eye size={16} className="text-blue-600" />
                        </Button>
                        
                        {referral.category === "seller" && (
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
                      <p className="text-muted-foreground">No referrals found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
