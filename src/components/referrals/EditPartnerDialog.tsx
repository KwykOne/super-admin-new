
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Referrer, PartnerCommissionPlan } from "@/types/referrals";

interface EditPartnerDialogProps {
  partner: Referrer;
  onSave: (partnerId: string, updates: any) => void;
}

export function EditPartnerDialog({ partner, onSave }: EditPartnerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [commissionRate, setCommissionRate] = useState(
    partner.commissionPlan?.commissionRate.toString() || "20"
  );
  const [durationMonths, setDurationMonths] = useState(
    partner.commissionPlan?.durationMonths.toString() || "12"
  );

  const handleSave = () => {
    const updates = {
      commissionPlan: {
        commissionRate: parseFloat(commissionRate),
        durationMonths: parseInt(durationMonths),
        startDate: partner.commissionPlan?.startDate || new Date(),
      },
    };

    onSave(partner.id, updates);
    setIsOpen(false);
    
    toast.success("Partner details updated", {
      description: `Commission plan updated for ${partner.name}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Edit size={16} className="text-amber-600" />
          <span>Edit Plan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Partner Commission Plan</DialogTitle>
          <DialogDescription>
            Update commission rate and duration for {partner.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="commission" className="text-right">
              Commission %
            </Label>
            <Input
              id="commission"
              type="number"
              min="0"
              max="100"
              className="col-span-3"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="duration" className="text-right">
              Duration (months)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              className="col-span-3"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
