
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ArrowLeft, Gift, Users, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ReferrerSummaryCard } from "@/components/referrals/ReferrerSummaryCard";
import { ReferrerReferralsList } from "@/components/referrals/ReferrerReferralsList";
import { ActionDialog } from "@/components/referrals/ActionDialog";
import { useReferrerData } from "@/hooks/useReferrerData";

// Mock statuses for referrals
const statusOptions = [
  { value: "free", label: "Free Plan" },
  { value: "standard-trial", label: "Standard Trial (₹999/mo)" },
  { value: "pro-trial", label: "Pro Trial (₹1999/mo)" },
  { value: "standard", label: "Standard Plan Active" },
  { value: "pro", label: "Pro Plan Active" },
  { value: "expired", label: "Plan Expired" },
];

export default function ReferralDetail() {
  useScrollToTop();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState("");
  const [actionReason, setActionReason] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  
  if (!id) {
    return <div>Referrer ID not found</div>;
  }
  
  const { referrer, referrals } = useReferrerData(id);

  // Function to handle status change actions
  const handleStatusAction = (action: string) => {
    toast({
      title: `Seller ${action}`,
      description: actionReason 
        ? `${referrer.name} has been ${action.toLowerCase()}. Reason: ${actionReason}`
        : `${referrer.name} has been ${action.toLowerCase()}.`,
    });
    setConfirmAction("");
    setActionReason("");
  };

  const handleActivate = () => {
    toast({
      title: "Seller Activated",
      description: `${referrer.name} has been activated and can now participate in the referral program.`,
    });
  };

  const toggleWallet = () => {
    setShowWallet(!showWallet);
  };

  return (
    <DashboardLayout 
      title={`${referrer.name} Referral Details`} 
      subtitle={`Detailed view of all referrals by ${referrer.name}`}
    >
      <div className="mb-4 flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/referrals')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Referrals
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleWallet}
        >
          <Wallet className="mr-2 h-4 w-4" />
          {showWallet ? "Hide Wallet" : "View Wallet"}
        </Button>
      </div>
      
      {/* Referrer Summary */}
      <ReferrerSummaryCard 
        referrer={referrer}
        onActivate={handleActivate}
        onSuspend={(reason) => handleStatusAction("Suspended")}
        onDelete={(reason) => {
          handleStatusAction("Deleted");
          setTimeout(() => navigate('/referrals'), 1000);
        }}
        confirmAction={confirmAction}
        setConfirmAction={setConfirmAction}
        actionReason={actionReason}
        setActionReason={setActionReason}
      />
      
      {/* Action Dialogs */}
      <ActionDialog 
        action="Suspended"
        open={confirmAction === "Suspended"}
        onOpenChange={(open) => !open && setConfirmAction("")}
        onConfirm={(reason) => handleStatusAction("Suspended")}
        referrerName={referrer.name}
        reason={actionReason}
        setReason={setActionReason}
      />
      
      <ActionDialog 
        action="Deleted"
        open={confirmAction === "Deleted"}
        onOpenChange={(open) => !open && setConfirmAction("")}
        onConfirm={(reason) => {
          handleStatusAction("Deleted");
          setTimeout(() => navigate('/referrals'), 1000);
        }}
        referrerName={referrer.name}
        reason={actionReason}
        setReason={setActionReason}
      />
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Referrals"
          value={referrer.referralCount.toString()}
          icon={<Gift size={20} />}
          description="All time referrals"
          variant="primary"
        />
        
        <StatCard
          title="Points Earned"
          value={referrer.pointsEarned.toLocaleString()}
          icon={<Wallet size={20} />}
          description="50 points per free referral, 200 per paid"
          variant="success"
        />
        
        <StatCard
          title="Active Referrals"
          value={referrals.filter(r => r.status === "active").length.toString()}
          icon={<Users size={20} />}
          description={`${referrals.filter(r => r.pointsEligible).length} paid plans`}
          variant="warning"
        />
      </div>
      
      {/* Referrals Table */}
      <ReferrerReferralsList 
        referrals={referrals}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        statusOptions={statusOptions}
        referrerDetails={referrer}
        showWallet={showWallet}
      />
    </DashboardLayout>
  );
}
