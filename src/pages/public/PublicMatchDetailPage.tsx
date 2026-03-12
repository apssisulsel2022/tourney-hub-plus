import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CloudRain, Droplets, ExternalLink, MapPin, Shield, Users, Wind } from "lucide-react";
import PublicLayout from "@/components/layout/PublicLayout";
import { matchService, Match } from "@/lib/matches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/public/ShareButton";

export default function PublicMatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const m = await matchService.getById(id);
        setMatch(m ?? null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const statusLabel = useMemo(() => {
    if (!match) return undefined;
    if (match.status === "completed") return "Finished";
    if (match.status === "delayed") return "Delayed";
    return undefined;
  }, [match]);

  const dateLabel = useMemo(() => {
    if (!match) return "";
    return new Date(match.dateTime).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }, [match]);

  const weatherIcon = (condition: Match["weather"]["condition"]) => {
    if (condition === "rain" || condition === "storm") return <CloudRain className="h-5 w-5 text-info" />;
    return <CloudRain className="h-5 w-5 text-muted-foreground" />;
  };

  if (!id) return null;

  if (loading) {
    return (
      <PublicLayout seo={{ title: "Match · Premier Cup 2026", description: "Match details" }} tournamentName="Premier Cup 2026">
        <div className="space-y-8 max-w-6xl mx-auto">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-[220px] w-full rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[240px] w-full rounded-3xl" />
            <Skeleton className="h-[240px] w-full rounded-3xl" />
            <Skeleton className="h-[240px] w-full rounded-3xl" />
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!match) {
    return (
      <PublicLayout seo={{ title: "Match Not Found · Premier Cup 2026", description: "Match details not found" }} tournamentName="Premier Cup 2026">
        <div className="max-w-3xl mx-auto bg-card rounded-3xl border p-8 text-center">
          <div className="text-xl font-black">Match not found</div>
          <div className="text-sm text-muted-foreground mt-2">The requested match does not exist.</div>
          <div className="mt-6">
            <Link to="/public/matches" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-2xl px-5 font-black bg-secondary text-white">
              Browse matches
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const shareUrl = `${window.location.origin}/public/matches/${match.id}`;

  return (
    <PublicLayout
      seo={{
        title: `${match.home.name} vs ${match.away.name} · Match · Premier Cup 2026`,
        description: `Match details, venue info, and live view for ${match.home.name} vs ${match.away.name}.`,
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/public/matches" className="h-11 w-11 rounded-2xl border bg-card flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to matches</span>
            </Link>
            <div className="space-y-0.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Match Detail</h1>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{match.id} · {dateLabel}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton title={`${match.home.name} vs ${match.away.name}`} text={`${match.tournament} · ${dateLabel}`} url={shareUrl} />
            <Button className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white" asChild>
              <Link to={`/public/matches/${match.id}/center`}>
                <ExternalLink className="h-4 w-4" aria-hidden="true" /> Live View
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-3xl border p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{match.tournament}</Badge>
                <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">{match.round}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-xs font-black">
                    {match.home.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="font-black text-2xl tracking-tight">{match.home.name}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={cn("text-4xl font-black tracking-tighter", match.status === "live" && "text-destructive")}>
                    {match.status === "upcoming" ? "—" : `${match.score.home} - ${match.score.away}`}
                  </div>
                  <StatusBadge
                    status={match.status === "delayed" ? "upcoming" : match.status}
                    label={statusLabel ?? (match.status === "live" ? `${match.minute ?? 0}'` : undefined)}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-black text-2xl tracking-tight">{match.away.name}</div>
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-xs font-black">
                    {match.away.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" aria-hidden="true" /> {match.venue.name}, {match.venue.city}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-secondary" aria-hidden="true" /> Capacity {match.venue.capacity.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full lg:w-[360px]">
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Home Win</p>
                <p className="text-2xl font-black text-secondary">{match.preMatch.predictedWinPct.home}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Draw</p>
                <p className="text-2xl font-black">{match.preMatch.predictedWinPct.draw}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Away Win</p>
                <p className="text-2xl font-black text-info">{match.preMatch.predictedWinPct.away}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black tracking-tight">Venue</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold">Venue</span>
                <span className="font-black">{match.venue.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold">City</span>
                <span className="font-black">{match.venue.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold">Capacity</span>
                <span className="font-black">{match.venue.capacity.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Shield className="h-5 w-5 text-secondary" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-black tracking-tight">Officials</h2>
            </div>
            <div className="space-y-3 text-sm">
              {match.referees.map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <span className="text-muted-foreground font-bold capitalize">{r.role.replace("_", " ")}</span>
                  <span className="font-black">{r.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                {weatherIcon(match.weather.condition)}
              </div>
              <h2 className="text-xl font-black tracking-tight">Weather</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold">Condition</span>
                <span className="font-black capitalize">{match.weather.condition}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold flex items-center gap-2"><Wind className="h-4 w-4" aria-hidden="true" /> Wind</span>
                <span className="font-black">{match.weather.windKph} kph</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-bold flex items-center gap-2"><Droplets className="h-4 w-4" aria-hidden="true" /> Humidity</span>
                <span className="font-black">{match.weather.humidityPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

