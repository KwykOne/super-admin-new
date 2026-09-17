
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ActionDialogProps {
  action: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  referrerName: string;
  reason: string;
  setReason: (reason: string) => void;
}

export function ActionDialog({
  action,
  open,
  onOpenChange,
  onConfirm,
  referrerName,
  reason,
  setReason
}: ActionDialogProps) {
  const isDelete = action === "Deleted";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isDelete ? "Delete" : "Suspend"} Referrer</DialogTitle>
          <DialogDescription>
            This will {isDelete ? "permanently delete" : "suspend"} {referrerName} from the referral program. 
            {isDelete && " This action cannot be undone."}
            {!isDelete && " They will not be able to earn new referral points."}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="reason">Reason for {isDelete ? "deletion" : "suspension"} (optional)</Label>
          <Input 
            id="reason" 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
            className="mt-2" 
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={() => onConfirm(reason)}
          >
            {isDelete ? "Delete" : "Suspend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
