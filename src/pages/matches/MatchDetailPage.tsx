import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users, CloudRain, Wind, Droplets, Shield, User, Swords, ExternalLink, ChevronRight } from "lucide-react";
import { matchService, Match } from "@/lib/matches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const m = await matchService.getById(id);
        if (!m) {
          toast.error("Match not found");
          navigate("/matches");
          return;
        }
        setMatch(m);
      } catch (e) {
        toast.error("Failed to load match details");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const statusLabel = useMemo(() => {
    if (!match) return undefined;
    if (match.status === "completed") return "Finished";
    if (match.status === "delayed") return "Delayed";
    return undefined;
  }, [match]);

  const weatherIcon = (condition: Match["weather"]["condition"]) => {
    if (condition === "rain" || condition === "storm") return <CloudRain className="h-5 w-5 text-info" />;
    return <CloudRain className="h-5 w-5 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-[220px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[240px] w-full rounded-3xl" />
          <Skeleton className="h-[240px] w-full rounded-3xl" />
          <Skeleton className="h-[240px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!match) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/matches">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight">Match Detail</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/matches" className="hover:text-secondary transition-colors">Matches</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{match.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" asChild>
            <Link to={`/matches/${match.id}/center`}>
              <Swords className="h-4 w-4 text-secondary" /> Open Match Center
            </Link>
          </Button>
          <Button className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20" asChild>
            <Link to={`/matches/${match.id}/center`}>
              <ExternalLink className="h-4 w-4" /> Live View
            </Link>
          </Button>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/60 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-card rounded-3xl border p-8 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Swords className="h-64 w-64 -rotate-12" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center relative z-10">
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
                  <StatusBadge status={match.status === "delayed" ? "upcoming" : match.status} label={statusLabel ?? (match.status === "live" ? `${match.minute ?? 0}'` : undefined)} />
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-black text-2xl tracking-tight">{match.away.name}</div>
                  <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center text-xs font-black">
                    {match.away.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-secondary" /> {match.venue.name}, {match.venue.city}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-secondary" /> Capacity {match.venue.capacity.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full lg:w-[360px]">
              <div className="p-5 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Home Win</p>
                <p className="text-2xl font-black text-secondary">{match.preMatch.predictedWinPct.home}%</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Draw</p>
                <p className="text-2xl font-black">{match.preMatch.predictedWinPct.draw}%</p>
              </div>
              <div className="p-5 rounded-2xl bg-muted/30 border border-muted text-center">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Away Win</p>
                <p className="text-2xl font-black text-info">{match.preMatch.predictedWinPct.away}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Venue Details</h2>
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
            <div className="pt-4 border-t border-muted text-xs text-muted-foreground font-bold">
              Scheduled: {new Date(match.dateTime).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Referees</h2>
          </div>
          <div className="space-y-4">
            {match.referees.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-background flex items-center justify-center border">
                    <Shield className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-black text-sm">{r.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{r.role.replace(/_/g, " ")}</p>
                  </div>
                </div>
                <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest">{r.role === "referee" ? "MAIN" : r.role === "var" ? "VAR" : "ASSIST"}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              {weatherIcon(match.weather.condition)}
            </div>
            <h2 className="text-xl font-black tracking-tight">Weather</h2>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-muted/30 border border-muted/50">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Condition</p>
              <p className="text-2xl font-black capitalize">{match.weather.condition}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                <Wind className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Wind</p>
                <p className="text-sm font-black">{match.weather.windKph} kph</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                <Droplets className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Humidity</p>
                <p className="text-sm font-black">{match.weather.humidityPct}%</p>
              </div>
              <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                <CloudRain className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Temp</p>
                <p className="text-sm font-black">{match.weather.temperatureC}°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <h2 className="text-xl font-black tracking-tight mb-6">Pre-Match Form</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">{match.home.name}</p>
              <div className="flex items-center gap-2">
                {match.preMatch.homeForm.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black border",
                      r === "W" && "bg-success/10 text-success border-success/20",
                      r === "D" && "bg-info/10 text-info border-info/20",
                      r === "L" && "bg-destructive/10 text-destructive border-destructive/20",
                    )}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 text-right">{match.away.name}</p>
              <div className="flex items-center justify-end gap-2">
                {match.preMatch.awayForm.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center text-xs font-black border",
                      r === "W" && "bg-success/10 text-success border-success/20",
                      r === "D" && "bg-info/10 text-info border-info/20",
                      r === "L" && "bg-destructive/10 text-destructive border-destructive/20",
                    )}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-3xl border p-8 shadow-sm">
          <h2 className="text-xl font-black tracking-tight mb-6">Pre-Match Snapshot</h2>
          <div className="space-y-5">
            {[
              { label: "Shots", home: match.stats.shots.home, away: match.stats.shots.away },
              { label: "Passing Accuracy", home: match.stats.passingAccuracyPct.home, away: match.stats.passingAccuracyPct.away, suffix: "%" },
              { label: "Corners", home: match.stats.corners.home, away: match.stats.corners.away },
            ].map((s) => {
              const total = (s.home + s.away) || 1;
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-black">{s.home}{s.suffix ?? ""}</span>
                    <span className="text-muted-foreground font-bold">{s.label}</span>
                    <span className="font-black">{s.away}{s.suffix ?? ""}</span>
                  </div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
                    <div className="bg-secondary" style={{ width: `${(s.home / total) * 100}%` }} />
                    <div className="bg-info/30 flex-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

