import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Calendar, MapPin } from "lucide-react";

interface Match {
  id: string;
  opponent: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  venue: string;
  status: "completed" | "upcoming" | "live";
  competition: string;
}

interface TeamMatchHistoryProps {
  matches: Match[];
  teamName: string;
}

export function TeamMatchHistory({
  matches,
  teamName,
}: TeamMatchHistoryProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getResult = (match: Match) => {
    const isHome = match.homeTeam === teamName;
    const teamScore = isHome ? match.homeScore : match.awayScore;
    const opponentScore = isHome ? match.awayScore : match.homeScore;

    if (teamScore > opponentScore) return "won";
    if (teamScore < opponentScore) return "lost";
    return "drew";
  };

  const resultColors = {
    won: "bg-success/10 border-success/30",
    lost: "bg-destructive/10 border-destructive/30",
    drew: "bg-info/10 border-info/30",
  };

  if (matches.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <p>No match history yet</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Match History</h3>
        <span className="text-xs text-muted-foreground">
          {matches.length} matches
        </span>
      </div>

      <div className="space-y-3">
        {matches.map((match) => {
          const isHome = match.homeTeam === teamName;
          const result = getResult(match);

          return (
            <Card
              key={match.id}
              className={`p-4 border ${resultColors[result]}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Date & Competition */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(match.date)}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {match.competition}
                  </p>
                </div>

                {/* Score */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    {/* Home Team */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {match.homeTeam}
                      </span>
                      <span className="font-bold">{match.homeScore}</span>
                    </div>
                    {/* Away Team */}
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {match.awayTeam}
                      </span>
                      <span className="font-bold">{match.awayScore}</span>
                    </div>
                  </div>
                </div>

                {/* Venue & Status */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span className="hidden sm:inline truncate">{match.venue}</span>
                  </div>
                  <StatusBadge status={match.status} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
