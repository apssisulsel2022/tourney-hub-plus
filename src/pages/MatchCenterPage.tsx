import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Clock, ExternalLink, MapPin, Shield, TrendingUp, Users, Video, Zap } from "lucide-react";
import { matchService, Match, MatchEvent, MatchLineupPlayer, MatchStatus } from "@/lib/matches";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { MatchTimeline, MatchTimelineEvent, MatchTimelineEventType } from "@/components/MatchTimeline";
import { ShareButton } from "@/components/public/ShareButton";

const tabItems = [
  { value: "overview", label: "Overview" },
  { value: "lineups", label: "Lineups" },
  { value: "timeline", label: "Timeline" },
  { value: "statistics", label: "Statistics" },
];

const eventMeta: Record<MatchEvent["type"], { label: string; icon: React.ReactNode; border: string }> = {
  goal: { label: "Goal", icon: <span className="text-lg">⚽</span>, border: "border-l-success" },
  yellow: { label: "Yellow Card", icon: <span className="text-lg">🟨</span>, border: "border-l-warning" },
  red: { label: "Red Card", icon: <span className="text-lg">🟥</span>, border: "border-l-destructive" },
  substitution: { label: "Substitution", icon: <span className="text-lg">🔄</span>, border: "border-l-info" },
  var: { label: "VAR", icon: <span className="text-lg">📺</span>, border: "border-l-info" },
};

const initials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 3).toUpperCase();

const statusLabel = (status: MatchStatus) => {
  if (status === "completed") return "Finished";
  if (status === "delayed") return "Delayed";
  return undefined;
};

const teamIcon = (team: Match["home"], className?: string) => (
  <div className={cn("h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center text-sm font-black border border-white/10", className)}>
    {initials(team.name)}
  </div>
);

const playerChip = (p: MatchLineupPlayer) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="h-10 w-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-black">
      {p.number}
    </div>
    <div className="text-[10px] font-black text-white/80 max-w-[80px] truncate">{p.name}</div>
  </div>
);

const formationRows = (formation: string) => {
  const parts = formation.split("-").map((n) => Number(n)).filter((n) => Number.isFinite(n));
  return parts.length ? parts : [4, 4, 2];
};

export default function MatchCenterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isPublic = location.pathname.startsWith("/public");
  const matchesIndexPath = isPublic ? "/public/matches" : "/matches";
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<Match | null>(null);
  const tickRef = useRef<number | null>(null);
  const liveMatchId = match?.id;
  const isLive = match?.status === "live";
  const [timelineOrder, setTimelineOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const matchId = id ?? (await matchService.list({ page: 1, limit: 1 })).items[0]?.id;
        if (!matchId) {
          toast.error("No matches available");
          navigate(matchesIndexPath);
          return;
        }
        const m = await matchService.getById(matchId);
        if (!m) {
          toast.error("Match not found");
          navigate(matchesIndexPath);
          return;
        }
        setMatch(m);
      } catch (e) {
        toast.error("Failed to load match center");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate, matchesIndexPath]);

  useEffect(() => {
    if (!isLive || !liveMatchId) return;
    if (tickRef.current) window.clearInterval(tickRef.current);
    tickRef.current = window.setInterval(() => {
      setMatch((prev) => {
        if (!prev) return prev;
        const minute = Math.min(90, (prev.minute ?? 0) + 1);
        const shouldScore = minute % 13 === 0;
        if (!shouldScore) return { ...prev, minute };
        const scoredBy: "home" | "away" = Math.random() > 0.55 ? "home" : "away";
        const nextScore = {
          home: prev.score.home + (scoredBy === "home" ? 1 : 0),
          away: prev.score.away + (scoredBy === "away" ? 1 : 0),
        };
        const nextEvent: MatchEvent = {
          id: `EV-${Date.now()}`,
          minute,
          type: "goal",
          team: scoredBy,
          player: scoredBy === "home" ? prev.home.name : prev.away.name,
          description: `${scoredBy === "home" ? prev.home.name : prev.away.name} scored`,
        };
        return {
          ...prev,
          minute,
          score: nextScore,
          events: [...prev.events, nextEvent].slice(-80),
        };
      });
    }, 2500);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
      tickRef.current = null;
    };
  }, [isLive, liveMatchId]);

  const dateLabel = useMemo(() => {
    if (!match) return "";
    return new Date(match.dateTime).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [match]);

  const eventFeed = useMemo(() => {
    if (!match) return [];
    return [...match.events].sort((a, b) => b.minute - a.minute);
  }, [match]);

  const timelineEvents: MatchTimelineEvent[] = useMemo(() => {
    if (!match) return [];
    return match.events
      .filter((e): e is MatchEvent & { type: MatchTimelineEventType } => e.type !== "var")
      .map((e) => ({
        id: e.id,
        type: e.type,
        minute: e.minute,
        teamName: e.team === "home" ? match.home.name : match.away.name,
        playerName: e.player ?? e.description,
        playerInName: e.playerIn,
        playerOutName: e.playerOut,
      }));
  }, [match]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-52 rounded-xl" />
        <Skeleton className="h-[220px] w-full rounded-3xl" />
        <Skeleton className="h-[620px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!match) return null;

  const matchDetailPath = isPublic ? `/public/matches/${match.id}` : `/matches/${match.id}`;
  const matchCenterShareUrl = `${window.location.origin}${isPublic ? `/public/matches/${match.id}/center` : `/matches/${match.id}/center`}`;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto pb-24 sm:pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to={matchesIndexPath}>
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">Match Center</h1>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest truncate">{match.id}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ShareButton title={`${match.home.name} vs ${match.away.name}`} text={`Match Center · ${match.tournament}`} url={matchCenterShareUrl} size="icon" />
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" asChild>
            <Link to={matchDetailPath}>
              <ExternalLink className="h-4 w-4 text-secondary" /> Match Detail
            </Link>
          </Button>
        </div>
      </div>

      <div className="sm:hidden sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-black truncate">{match.home.name} vs {match.away.name}</div>
            <div className="text-[11px] font-bold text-muted-foreground truncate">{match.status === "live" ? `${match.minute ?? 0}'` : dateLabel}</div>
          </div>
          <div className={cn("text-lg font-black tabular-nums", match.status === "live" && "text-destructive")}>
            {match.status === "upcoming" ? "—" : `${match.score.home}-${match.score.away}`}
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/60 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-gradient-primary rounded-3xl p-4 sm:p-6 md:p-8 text-primary-foreground overflow-hidden border border-sidebar-border">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="h-64 w-64 -rotate-12" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/20 text-white/80 font-black text-[10px] uppercase tracking-widest">
                  {match.tournament}
                </Badge>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{match.round}</span>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  status={match.status === "delayed" ? "upcoming" : match.status}
                  label={statusLabel(match.status) ?? (match.status === "live" ? `${match.minute ?? 0}'` : undefined)}
                />
                <div className="text-xs font-bold text-white/70 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {match.venue.name}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-12">
              <div className="flex flex-col items-center gap-3 min-w-[120px]">
                {teamIcon(match.home)}
                <span className="font-black text-sm md:text-base text-center">{match.home.name}</span>
              </div>

              <div className="flex flex-col items-center min-w-[180px]">
                <div className="flex items-center gap-4">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`home-${match.score.home}`}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn("text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter", match.status === "live" && "text-destructive")}
                      aria-label="Home score"
                    >
                      {match.status === "upcoming" ? "—" : match.score.home}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-3xl text-primary-foreground/40 font-black">-</span>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={`away-${match.score.away}`}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 10, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn("text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter", match.status === "live" && "text-destructive")}
                      aria-label="Away score"
                    >
                      {match.status === "upcoming" ? "—" : match.score.away}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="mt-3 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/70">
                  <Clock className="h-4 w-4" />
                  {match.status === "live" ? `${match.minute ?? 0}'` : dateLabel}
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 min-w-[120px]">
                {teamIcon(match.away)}
                <span className="font-black text-sm md:text-base text-center">{match.away.name}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-bold text-white/60">
              <span className="flex items-center gap-2"><Users className="h-4 w-4" /> {match.venue.capacity.toLocaleString()} capacity</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Referee: {match.referees.find(r => r.role === "referee")?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="rounded-2xl h-12 w-full md:w-auto overflow-x-auto justify-start [-webkit-overflow-scrolling:touch]">
            {tabItems.map((t) => (
              <TabsTrigger key={t.value} value={t.value} className="rounded-xl font-black text-xs uppercase tracking-widest min-w-[120px] h-11">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2">
              <Video className="h-4 w-4 text-secondary" /> VAR Log
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2">
              <TrendingUp className="h-4 w-4 text-secondary" /> Refresh Stats
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black tracking-tight">Key Events</h2>
                  <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{eventFeed.length} events</Badge>
                </div>
                <div className="space-y-0">
                  {eventFeed.slice(0, 8).map((e) => (
                    <div key={e.id} className={cn("timeline-event", eventMeta[e.type].border)}>
                      {eventMeta[e.type].icon}
                      <div className="flex-1">
                        <p className="text-sm font-black">{e.type === "substitution" ? `${e.playerOut} → ${e.playerIn}` : e.player ?? e.description}</p>
                        <p className="text-xs text-muted-foreground font-bold">{e.team === "home" ? match.home.name : match.away.name}</p>
                      </div>
                      <span className="text-sm font-black text-muted-foreground">{e.minute}'</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black tracking-tight">Possession & Control</h2>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Live comparison
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-black">{match.stats.possessionPct.home}%</span>
                      <span className="text-muted-foreground font-bold">Possession</span>
                      <span className="font-black">{match.stats.possessionPct.away}%</span>
                    </div>
                    <div className="flex gap-1 h-3 rounded-full overflow-hidden bg-muted">
                      <div className="bg-secondary" style={{ width: `${match.stats.possessionPct.home}%` }} />
                      <div className="bg-info/30 flex-1" />
                    </div>
                  </div>
                  <div className="h-[240px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { label: "Shots", home: match.stats.shots.home, away: match.stats.shots.away },
                          { label: "On Target", home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
                          { label: "Corners", home: match.stats.corners.home, away: match.stats.corners.away },
                          { label: "Fouls", home: match.stats.fouls.home, away: match.stats.fouls.away },
                        ]}
                        layout="vertical"
                        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                        <RechartsTooltip />
                        <Bar dataKey="home" fill="#10b981" radius={[6, 6, 6, 6]} barSize={10} />
                        <Bar dataKey="away" fill="#38bdf8" radius={[6, 6, 6, 6]} barSize={10} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Notable Performers</h2>
                <div className="space-y-4">
                  {[
                    { name: `${match.home.name} Captain`, team: match.home.name, metric: "Rating", value: "8.4" },
                    { name: `${match.away.name} Playmaker`, team: match.away.name, metric: "Key Passes", value: "4" },
                    { name: "Top Runner", team: "Both", metric: "Distance", value: "10.8 km" },
                  ].map((p, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-sm">{p.name}</p>
                          <p className="text-xs text-muted-foreground font-bold">{p.team}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{p.metric}</p>
                          <p className="text-lg font-black text-secondary">{p.value}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Quick Snapshot</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Shots on Target", value: `${match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away}` },
                    { label: "Passing Accuracy", value: `${Math.round((match.stats.passingAccuracyPct.home + match.stats.passingAccuracyPct.away) / 2)}%` },
                    { label: "Cards", value: `${match.stats.yellowCards.home + match.stats.yellowCards.away}` },
                    { label: "Corners", value: `${match.stats.corners.home + match.stats.corners.away}` },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/30 border border-muted/50 text-center">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                      <p className="text-2xl font-black mt-1">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lineups" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-card rounded-3xl border p-8 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black tracking-tight">Field Diagram</h2>
                  <p className="text-sm text-muted-foreground font-medium">Starting formations and player positions</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{match.lineups.home.formation}</Badge>
                  <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{match.lineups.away.formation}</Badge>
                </div>
              </div>

              <div className="relative rounded-3xl border overflow-hidden bg-gradient-to-b from-emerald-600/20 to-emerald-600/5">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="p-6 border-b md:border-b-0 md:border-r border-white/15">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white font-black">{match.home.name}</span>
                      <Badge className="bg-white/10 text-white border border-white/15">{match.lineups.home.formation}</Badge>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">{playerChip(match.lineups.home.starters[0])}</div>
                      {formationRows(match.lineups.home.formation).map((count, rowIdx) => {
                        const startIndex = 1 + formationRows(match.lineups.home.formation).slice(0, rowIdx).reduce((a, b) => a + b, 0);
                        const rowPlayers = match.lineups.home.starters.slice(startIndex, startIndex + count);
                        return (
                          <div key={rowIdx} className="flex items-center justify-center gap-3">
                            {rowPlayers.map((p) => (
                              <div key={p.id} className="relative">
                                {playerChip(p)}
                                {p.cards.yellow > 0 && <span className="absolute -top-2 -right-2 text-xs">🟨</span>}
                                {p.cards.red > 0 && <span className="absolute -top-2 -right-2 text-xs">🟥</span>}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/10 text-white border border-white/15">{match.lineups.away.formation}</Badge>
                      <span className="text-white font-black">{match.away.name}</span>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">{playerChip(match.lineups.away.starters[0])}</div>
                      {formationRows(match.lineups.away.formation).map((count, rowIdx) => {
                        const startIndex = 1 + formationRows(match.lineups.away.formation).slice(0, rowIdx).reduce((a, b) => a + b, 0);
                        const rowPlayers = match.lineups.away.starters.slice(startIndex, startIndex + count);
                        return (
                          <div key={rowIdx} className="flex items-center justify-center gap-3">
                            {rowPlayers.map((p) => (
                              <div key={p.id} className="relative">
                                {playerChip(p)}
                                {p.cards.yellow > 0 && <span className="absolute -top-2 -right-2 text-xs">🟨</span>}
                                {p.cards.red > 0 && <span className="absolute -top-2 -right-2 text-xs">🟥</span>}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">{match.home.name} Squad</h2>
                <div className="space-y-3">
                  {match.lineups.home.starters.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-background border flex items-center justify-center text-[10px] font-black">{p.number}</div>
                        <div>
                          <p className="font-black text-sm">{p.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.cards.yellow > 0 && <span>🟨</span>}
                        {p.cards.red > 0 && <span>🟥</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">{match.away.name} Squad</h2>
                <div className="space-y-3">
                  {match.lineups.away.starters.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-background border flex items-center justify-center text-[10px] font-black">{p.number}</div>
                        <div>
                          <p className="font-black text-sm">{p.name}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{p.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.cards.yellow > 0 && <span>🟨</span>}
                        {p.cards.red > 0 && <span>🟥</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <div className="bg-card rounded-3xl border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black tracking-tight">Match Timeline</h2>
                <p className="text-sm text-muted-foreground font-medium">Goals, cards, and substitutions with live updates</p>
              </div>
              <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{timelineEvents.length} total</Badge>
            </div>
            <MatchTimeline events={timelineEvents} order={timelineOrder} onOrderChange={setTimelineOrder} />
          </div>
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-card rounded-3xl border p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black tracking-tight">Team Comparison</h2>
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">Live</Badge>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Shots", home: match.stats.shots.home, away: match.stats.shots.away },
                  { label: "Shots on Target", home: match.stats.shotsOnTarget.home, away: match.stats.shotsOnTarget.away },
                  { label: "Corners", home: match.stats.corners.home, away: match.stats.corners.away },
                  { label: "Fouls", home: match.stats.fouls.home, away: match.stats.fouls.away },
                  { label: "Offsides", home: match.stats.offsides.home, away: match.stats.offsides.away },
                  { label: "Passing Accuracy", home: match.stats.passingAccuracyPct.home, away: match.stats.passingAccuracyPct.away, suffix: "%" },
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

            <div className="space-y-6">
              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Heat Map (Mock)</h2>
                <div className="rounded-3xl border overflow-hidden bg-muted/30">
                  <div className="h-64 w-full" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(16,185,129,0.65), transparent 45%), radial-gradient(circle at 70% 60%, rgba(56,189,248,0.55), transparent 50%)" }} />
                </div>
                <p className="text-xs text-muted-foreground font-medium mt-4">Interactive heat maps can be sourced from tracking providers or event-based estimation.</p>
              </div>

              <div className="bg-card rounded-3xl border p-8 shadow-sm">
                <h2 className="text-xl font-black tracking-tight mb-6">Discipline</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-warning/5 border border-warning/10 text-center">
                    <p className="text-[10px] font-black text-warning uppercase tracking-widest mb-1">Yellow Cards</p>
                    <p className="text-3xl font-black">{match.stats.yellowCards.home + match.stats.yellowCards.away}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-center">
                    <p className="text-[10px] font-black text-destructive uppercase tracking-widest mb-1">Red Cards</p>
                    <p className="text-3xl font-black">{match.stats.redCards.home + match.stats.redCards.away}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
