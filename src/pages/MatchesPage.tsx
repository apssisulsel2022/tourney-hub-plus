import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, Radio, Clock, CalendarDays, TriangleAlert } from "lucide-react";
import { matchService, Match, MatchListSort, MatchStatus } from "@/lib/matches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function MatchesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MatchStatus | "all">("all");
  const [tournament, setTournament] = useState<string | "all">("all");
  const [sort, setSort] = useState<MatchListSort>("date_desc");
  const [page, setPage] = useState(1);
  const limit = 25;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ items: Match[]; total: number; totalPages: number }>({ items: [], total: 0, totalPages: 1 });

  const tournaments = useMemo(() => matchService.tournaments(), []);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await matchService.list({ page, limit, search, status, tournament, sort });
      setData({ items: res.items, total: res.total, totalPages: res.totalPages });
    } catch (e) {
      setError("Unable to load matches. Please try again.");
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status, tournament, sort]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const statusIcon = (s: MatchStatus | "all") => {
    if (s === "live") return <Radio className="h-4 w-4 text-destructive" />;
    if (s === "completed") return <Clock className="h-4 w-4 text-success" />;
    if (s === "upcoming") return <CalendarDays className="h-4 w-4 text-info" />;
    if (s === "delayed") return <TriangleAlert className="h-4 w-4 text-warning" />;
    return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const statusForBadge = (s: MatchStatus) => (s === "completed" ? "completed" : s);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Match Management</h1>
          <p className="text-muted-foreground mt-1">Search, filter, and manage all matches across competitions</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 font-bold h-11 rounded-2xl"
          onClick={fetchMatches}
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div className="bg-card rounded-3xl border p-6 shadow-sm space-y-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by teams, venue, tournament, or match ID..."
              aria-label="Search matches"
              className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm font-medium outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
            />
          </div>

          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as MatchStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-12 w-full lg:w-[190px] rounded-2xl font-bold">
              <div className="flex items-center gap-2">
                {statusIcon(status)}
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Finished</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={tournament}
            onValueChange={(v) => {
              setTournament(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-12 w-full lg:w-[240px] rounded-2xl font-bold">
              <SelectValue placeholder="Tournament" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tournaments</SelectItem>
              {tournaments.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(v) => {
              setSort(v as MatchListSort);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-12 w-full lg:w-[200px] rounded-2xl font-bold">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Date (Newest)</SelectItem>
              <SelectItem value="date_asc">Date (Oldest)</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="tournament">Tournament</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-muted-foreground">
          <span>Total Matches: <span className="text-foreground">{data.total}</span></span>
          <span>Page <span className="text-foreground">{page}</span> / <span className="text-foreground">{data.totalPages}</span></span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="h-[420px] w-full rounded-3xl" />
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-10 text-center">
          <p className="text-lg font-black text-destructive">Something went wrong</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button className="mt-6 h-11 rounded-2xl font-black" onClick={fetchMatches}>Try Again</Button>
        </div>
      ) : (
        <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-muted">
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Match</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden md:table-cell">Tournament</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest hidden lg:table-cell">Venue</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Score</th>
                  <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {data.items.map((m) => (
                  <tr
                    key={m.id}
                    className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/matches/${m.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 min-w-[150px]">
                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black">
                            {m.home.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-sm leading-tight">
                              {m.home.name} <span className="text-muted-foreground font-bold">vs</span> {m.away.name}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {formatDate(m.dateTime)} · {m.id}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={statusForBadge(m.status)} label={m.status === "completed" ? "Finished" : m.status === "delayed" ? "Delayed" : undefined} />
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="outline" className="font-black text-[10px] uppercase tracking-wider">{m.tournament}</Badge>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{m.round}</div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="font-bold">{m.venue.name}</div>
                      <div className="text-xs text-muted-foreground">{m.venue.city}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {m.status === "upcoming" ? (
                        <span className="text-sm font-black text-muted-foreground">—</span>
                      ) : (
                        <span className={cn("text-lg font-black tracking-tighter", m.status === "live" && "text-destructive")}>
                          {m.score.home} - {m.score.away}
                        </span>
                      )}
                      {m.status === "live" && <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{m.minute}'</div>}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 rounded-xl font-bold gap-2"
                          asChild
                        >
                          <Link to={`/matches/${m.id}`}>
                            <ExternalLink className="h-4 w-4 text-secondary" /> Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          className="h-9 rounded-xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20"
                          asChild
                        >
                          <Link to={`/matches/${m.id}/center`}>Center</Link>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-muted/20 gap-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              Showing <span className="text-foreground">{Math.min(data.total, (page - 1) * limit + 1)}-{Math.min(data.total, page * limit)}</span> of <span className="text-foreground">{data.total}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-9 rounded-xl font-bold gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === data.totalPages}
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                className="h-9 rounded-xl font-bold gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
