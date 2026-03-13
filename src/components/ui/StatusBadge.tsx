import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "live" | "upcoming" | "completed" | "delayed" | "active" | "inactive" | "draft";
  label?: string;
}

const statusMap: Record<string, { className: string; label: string }> = {
  live: { className: "status-badge-live", label: "Live" },
  upcoming: { className: "status-badge-upcoming", label: "Upcoming" },
  completed: { className: "status-badge-completed", label: "Completed" },
  delayed: { className: "status-badge bg-warning/10 text-warning", label: "Delayed" },
  active: { className: "status-badge-active", label: "Active" },
  inactive: { className: "status-badge bg-muted text-muted-foreground", label: "Inactive" },
  draft: { className: "status-badge bg-accent/10 text-accent", label: "Draft" },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusMap[status];
  return (
    <span className={cn(config.className)}>
      {status === "live" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse-live inline-block" />}
      {label || config.label}
    </span>
  );
}
