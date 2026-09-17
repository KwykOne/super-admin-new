import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { useToast } from "@/components/ui/use-toast";
import { EditPartnerDialog } from "./EditPartnerDialog";  // Added import for EditPartnerDialog

interface ReferrerData {
  id: string;
  name: string;
  category: string;
  specialty: string;
  status: string;
  joinDate: Date;
  referralCount: number;
  pointsEarned: number;
  pointsRedeemed: number;
  referralLink: string;
  storeCount: number;
  email: string;
  phone: string;
  address: string;
  contactPerson: string;
  commissionPlan?: {
    commissionRate: number;
    durationMonths: number;
    startDate: Date;
  };
}

interface ReferrerSummaryCardProps {
  referrer: ReferrerData;
  onActivate: () => void;
  onSuspend: (reason: string) => void;
  onDelete: (reason: string) => void;
  confirmAction: string;
  setConfirmAction: (action: string) => void;
  actionReason: string;
  setActionReason: (reason: string) => void;
  onPartnerUpdate?: (partnerId: string, updates: any) => void;
}

export function ReferrerSummaryCard({
  referrer,
  onActivate,
  onSuspend,
  onDelete,
  confirmAction,
  setConfirmAction,
  actionReason,
  setActionReason,
  onPartnerUpdate
}: ReferrerSummaryCardProps) {
  const { toast } = useToast();
  const isPartner = referrer.category === "partner";

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

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              {referrer.name}
              <Badge className="ml-2">
                {isPartner ? "Partner" : "Seller"}
              </Badge>
              <Badge className="ml-2 bg-purple-100 text-purple-800">
                {referrer.specialty}
              </Badge>
              {renderStatusBadge(referrer.status)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Joined on {formatDate(referrer.joinDate)}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            {referrer.status === "active" ? (
              <Button variant="outline" size="sm" onClick={() => setConfirmAction("Suspended")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M21 12a9 9 0 1 1-9-9"></path><path d="M9 15V9"></path><path d="M9 15H4.5"></path><path d="M14.5 12H20"></path></svg>
                Suspend
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={onActivate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Activate
              </Button>
            )}
            
            <Button variant="destructive" size="sm" onClick={() => setConfirmAction("Deleted")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Referral Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Category:</span>
                <span className="text-sm font-medium">
                  {isPartner ? "Partner" : "Seller"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Specialty:</span>
                <span className="text-sm font-medium">{referrer.specialty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Status:</span>
                <span className="text-sm font-medium">
                  {referrer.status.charAt(0).toUpperCase() + referrer.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Join Date:</span>
                <span className="text-sm font-medium">{formatDate(referrer.joinDate)}</span>
              </div>
              {!isPartner && (
                <div className="flex justify-between">
                  <span className="text-sm">Store Count:</span>
                  <span className="text-sm font-medium">{referrer.storeCount}</span>
                </div>
              )}
              {isPartner && referrer.commissionPlan && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Commission Rate:</span>
                    <span className="text-sm font-medium">{referrer.commissionPlan.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Commission Duration:</span>
                    <span className="text-sm font-medium">{referrer.commissionPlan.durationMonths} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Plan Start Date:</span>
                    <span className="text-sm font-medium">{formatDate(referrer.commissionPlan.startDate)}</span>
                  </div>
                  {onPartnerUpdate && (
                    <div className="mt-2">
                      <EditPartnerDialog
                        partner={referrer}
                        onSave={onPartnerUpdate}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Contact Person:</span>
                <span className="text-sm font-medium">{referrer.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Email:</span>
                <span className="text-sm font-medium">{referrer.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Phone:</span>
                <span className="text-sm font-medium">{referrer.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Address:</span>
                <span className="text-sm font-medium">{referrer.address}</span>
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-muted-foreground mb-2 mt-4">Performance Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Referrals:</span>
                <span className="text-sm font-medium">{referrer.referralCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{isPartner ? "Commission Earned:" : "Points Earned:"}</span>
                <span className="text-sm font-medium">
                  {isPartner ? `₹${referrer.pointsEarned.toLocaleString()}` : referrer.pointsEarned.toLocaleString()}
                </span>
              </div>
              {!isPartner && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Points Redeemed:</span>
                    <span className="text-sm font-medium">{referrer.pointsRedeemed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Points Balance:</span>
                    <span className="text-sm font-medium">
                      {(referrer.pointsEarned - referrer.pointsRedeemed).toLocaleString()}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Referral Link</h3>
            <div className="flex">
              <Input 
                value={referrer.referralLink}
                readOnly
                className="text-sm"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-2"
                onClick={() => {
                  navigator.clipboard.writeText(referrer.referralLink);
                  toast({
                    title: "Copied to clipboard",
                    description: "Referral link has been copied to clipboard.",
                  });
                }}
              >
                Copy
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Referral Program Terms</h3>
            <p className="text-xs text-muted-foreground">
              {isPartner 
                ? `Partners earn ${referrer.commissionPlan?.commissionRate}% commission on plan amount for ${referrer.commissionPlan?.durationMonths} months when their referrals activate a paid plan.`
                : "Sellers earn 200 points per successful referral when their referral activates a paid plan."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
