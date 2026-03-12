import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type MatchTimelineEventType = "goal" | "yellow" | "red" | "substitution";

export interface MatchTimelineEvent {
  id: string;
  type: MatchTimelineEventType;
  minute: number | string;
  teamName: string;
  playerName: string;
  playerInName?: string;
  playerOutName?: string;
}

export type MatchTimelineOrder = "asc" | "desc";

export interface MatchTimelineProps {
  events: MatchTimelineEvent[];
  order?: MatchTimelineOrder;
  onOrderChange?: (order: MatchTimelineOrder) => void;
  className?: string;
}

const parseMinuteSortKey = (minute: number | string) => {
  if (typeof minute === "number") return minute * 1000;
  const trimmed = minute.trim();
  const m = trimmed.match(/^(\d+)\+(\d+)$/);
  if (m) return Number(m[1]) * 1000 + Number(m[2]);
  const n = Number(trimmed.replace(/[^0-9]/g, ""));
  if (Number.isFinite(n)) return n * 1000;
  return 0;
};

const iconFor = (type: MatchTimelineEventType) => {
  if (type === "goal") return "⚽";
  if (type === "yellow") return "🟨";
  if (type === "red") return "🟥";
  return "🔄";
};

const borderFor = (type: MatchTimelineEventType) => {
  if (type === "goal") return "border-l-success";
  if (type === "yellow") return "border-l-warning";
  if (type === "red") return "border-l-destructive";
  return "border-l-info";
};

const labelFor = (e: MatchTimelineEvent) => {
  if (e.type === "substitution") {
    const outName = e.playerOutName ?? e.playerName;
    const inName = e.playerInName ?? "Sub";
    return `${outName} → ${inName}`;
  }
  return e.playerName;
};

export function MatchTimeline({ events, order = "desc", onOrderChange, className }: MatchTimelineProps) {
  const sorted = useMemo(() => {
    const withIndex = events.map((e, index) => ({ e, index }));
    withIndex.sort((a, b) => {
      const keyA = parseMinuteSortKey(a.e.minute);
      const keyB = parseMinuteSortKey(b.e.minute);
      if (keyA === keyB) return a.index - b.index;
      return order === "asc" ? keyA - keyB : keyB - keyA;
    });
    return withIndex.map((x) => x.e);
  }, [events, order]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
          Timeline
        </div>
        {onOrderChange && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOrderChange("asc")}
              className={cn(
                "h-9 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors",
                order === "asc" ? "bg-secondary text-white border-secondary" : "bg-card hover:bg-muted"
              )}
              aria-label="Sort timeline ascending"
              aria-pressed={order === "asc"}
            >
              Asc
            </button>
            <button
              type="button"
              onClick={() => onOrderChange("desc")}
              className={cn(
                "h-9 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-colors",
                order === "desc" ? "bg-secondary text-white border-secondary" : "bg-card hover:bg-muted"
              )}
              aria-label="Sort timeline descending"
              aria-pressed={order === "desc"}
            >
              Desc
            </button>
          </div>
        )}
      </div>

      <div role="list" className="bg-card rounded-3xl border shadow-sm overflow-hidden">
        <AnimatePresence initial={false}>
          {sorted.map((e) => {
            const aria = `${e.type} at ${e.minute}' for ${e.teamName}: ${labelFor(e)}`;
            return (
              <motion.div
                key={e.id}
                role="listitem"
                aria-label={aria}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "flex items-center gap-3 py-3 border-b last:border-0 border-l-2 pl-4 pr-4",
                  borderFor(e.type)
                )}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-muted shrink-0" aria-hidden="true">
                  <span className="text-base">{iconFor(e.type)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black truncate" title={labelFor(e)}>{labelFor(e)}</p>
                      <p className="text-xs text-muted-foreground font-bold truncate" title={e.teamName}>{e.teamName}</p>
                    </div>
                    <span className="text-xs font-black text-muted-foreground shrink-0">{e.minute}'</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

