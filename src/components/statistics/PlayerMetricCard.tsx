import React from "react";
import { ArrowDownRight, ArrowUpRight, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PlayerMetric, assistsPerGame, disciplineScore, goalsPerGame } from "@/lib/playerMetrics";

export type PlayerMetricCardVariant = "scorer" | "assist" | "discipline";

export interface PlayerMetricCardProps {
  player: PlayerMetric;
  rank: number;
  variant: PlayerMetricCardVariant;
  locale?: string;
}

export function PlayerMetricCard({ player, rank, variant, locale = "en-US" }: PlayerMetricCardProps) {
  const numberFmt = new Intl.NumberFormat(locale);
  const percentFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const avgFmt = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });

  const primary =
    variant === "scorer"
      ? { label: "Goals", value: player.goals, icon: Target, color: "text-secondary", bg: "bg-secondary/10" }
      : variant === "assist"
        ? { label: "Assists", value: player.assists, icon: TrendingUp, color: "text-info", bg: "bg-info/10" }
        : { label: "Cards", value: disciplineScore(player), icon: ShieldAlert, color: "text-warning", bg: "bg-warning/10" };

  const delta =
    variant === "scorer"
      ? goalsPerGame(player) - 0.4
      : variant === "assist"
        ? assistsPerGame(player) - 0.25
        : disciplineScore(player) - 3;

  const TrendIcon = delta >= 0 ? ArrowUpRight : ArrowDownRight;

  const line2 =
    variant === "scorer"
      ? `${avgFmt.format(goalsPerGame(player))} / game`
      : variant === "assist"
        ? `${avgFmt.format(assistsPerGame(player))} / game`
        : `${numberFmt.format(player.suspensionDays)} suspension days`;

  const badgeText =
    variant === "discipline"
      ? `${numberFmt.format(player.yellowCards)}Y / ${numberFmt.format(player.redCards)}R`
      : `Pass ${percentFmt.format(player.passAccuracyPct)}%`;

  return (
    <div className="bg-card rounded-3xl border p-5 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs border", primary.bg)}>
            #{rank}
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm truncate" title={player.name}>{player.name}</p>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold text-muted-foreground truncate" title={player.team.name}>{player.team.name}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-xs font-black text-muted-foreground">{player.position}</span>
            </div>
          </div>
        </div>
        <Avatar className="h-10 w-10 rounded-2xl border">
          <AvatarImage src={player.photoUrl} alt={player.name} className="object-cover" />
          <AvatarFallback className="bg-muted text-muted-foreground font-black text-xs">
            {player.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center border", primary.bg)} aria-hidden="true">
            <primary.icon className={cn("h-5 w-5", primary.color)} />
          </div>
          <div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{primary.label}</p>
            <p className={cn("text-2xl font-black leading-none", primary.color)}>{numberFmt.format(primary.value)}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Indicator</p>
          <div className={cn("inline-flex items-center gap-1.5 text-sm font-black", delta >= 0 ? "text-success" : "text-destructive")}>
            <TrendIcon className="h-4 w-4" />
            {line2}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 pt-4 border-t">
        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
          {badgeText}
        </Badge>
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          Updated {new Date(player.updatedAt).toLocaleDateString(locale)}
        </span>
      </div>
    </div>
  );
}

