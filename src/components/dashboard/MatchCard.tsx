import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  time: string;
  venue: string;
  status: "live" | "upcoming" | "completed" | "delayed";
  tournament?: string;
}

export function MatchCard({ homeTeam, awayTeam, homeScore, awayScore, time, venue, status, tournament }: MatchCardProps) {
  return (
    <div className="match-card cursor-pointer">
      {tournament && <p className="text-xs text-muted-foreground mb-2">{tournament}</p>}
      <div className="flex items-center justify-between">
        {/* Home */}
        <div className="flex items-center gap-3 flex-1">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {homeTeam.slice(0, 2).toUpperCase()}
          </div>
          <span className={cn("font-medium text-sm", status === "completed" && homeScore !== undefined && awayScore !== undefined && homeScore > awayScore && "font-bold")}>
            {homeTeam}
          </span>
        </div>

        {/* Score / Time */}
        <div className="flex flex-col items-center px-4 min-w-[80px]">
          {status === "upcoming" || status === "delayed" ? (
            <span className="text-sm font-semibold text-muted-foreground">{time}</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className={cn("text-xl font-bold", status === "live" && "text-destructive")}>{homeScore}</span>
              <span className="text-muted-foreground">-</span>
              <span className={cn("text-xl font-bold", status === "live" && "text-destructive")}>{awayScore}</span>
            </div>
          )}
          <StatusBadge status={status} />
        </div>

        {/* Away */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className={cn("font-medium text-sm text-right", status === "completed" && homeScore !== undefined && awayScore !== undefined && awayScore > homeScore && "font-bold")}>
            {awayTeam}
          </span>
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
            {awayTeam.slice(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">{venue}</p>
    </div>
  );
}
