import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "finished" | "active" | "upcoming" | "cancelled" | "pending" | "accepted" | "rejected" | "confirmed" | "completed";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  finished: { label: "Finished", variant: "secondary" },
  active: { label: "Active", variant: "default" },
  upcoming: { label: "Upcoming", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  pending: { label: "Pending", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  confirmed: { label: "Confirmed", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn("font-medium", className)}
    >
      {config.label}
    </Badge>
  );
}
