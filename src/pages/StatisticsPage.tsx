import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Filter, RefreshCw, Trophy, Users } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  MetricsFilters,
  PlayerMetric,
  applyLiveUpdate,
  assistsPerGame,
  defaultFilters,
  disciplineScore,
  filterMetrics,
  generateMockPlayerMetrics,
  goalsPerGame,
  metricCompetitions,
  metricSeasons,
  metricTeams,
  toCsv,
} from "@/lib/playerMetrics";
import { PlayerMetricCard } from "@/components/statistics/PlayerMetricCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ScorersChartRow = { name: string; team: string; value: number; avg: number };
type AssistsChartRow = { name: string; team: string; value: number; pass: number };
type DisciplineChartRow = { name: string; team: string; yellow: number; red: number; susp: number };

const exportCsv = (filename: string, csv: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportPdfViaPrint = (title: string, html: string) => {
  const w = window.open("", "_blank", "noopener,noreferrer");
  if (!w) {
    toast.error("Popup blocked. Please allow popups to export PDF.");
    return;
  }
  w.document.open();
  w.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${title}</title></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
};

const leaderboardContainer = "bg-card rounded-3xl border p-6 shadow-sm";

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [live, setLive] = useState(true);
  const [filters, setFilters] = useState<MetricsFilters>(defaultFilters);
  const [data, setData] = useState<PlayerMetric[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setData(generateMockPlayerMetrics(32));
    } catch (e) {
      setError("Unable to load statistics.");
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!live) return;
    const id = window.setInterval(() => {
      setData((prev) => applyLiveUpdate(prev));
    }, 2500);
    return () => window.clearInterval(id);
  }, [live]);

  const filtered = useMemo(() => filterMetrics(data, filters), [data, filters]);

  const topScorers = useMemo(() => {
    return [...filtered]
      .sort((a, b) => b.goals - a.goals || goalsPerGame(b) - goalsPerGame(a))
      .slice(0, 10);
  }, [filtered]);

  const topAssists = useMemo(() => {
    return [...filtered]
      .sort((a, b) => b.assists - a.assists || assistsPerGame(b) - assistsPerGame(a))
      .slice(0, 10);
  }, [filtered]);

  const disciplinary = useMemo(() => {
    return [...filtered]
      .sort((a, b) => disciplineScore(b) - disciplineScore(a) || b.redCards - a.redCards)
      .slice(0, 10);
  }, [filtered]);

  const chartScorers = useMemo(
    () =>
      topScorers
        .slice(0, 8)
        .map((p) => ({ name: p.name, team: p.team.name, value: p.goals, avg: goalsPerGame(p) }) satisfies ScorersChartRow),
    [topScorers]
  );

  const chartAssists = useMemo(
    () =>
      topAssists
        .slice(0, 8)
        .map((p) => ({ name: p.name, team: p.team.name, value: p.assists, pass: p.passAccuracyPct }) satisfies AssistsChartRow),
    [topAssists]
  );

  const chartDiscipline = useMemo(
    () =>
      disciplinary
        .slice(0, 8)
        .map((p) => ({ name: p.name, team: p.team.name, yellow: p.yellowCards, red: p.redCards, susp: p.suspensionDays }) satisfies DisciplineChartRow),
    [disciplinary]
  );

  const onExportCsv = () => {
    const rows = filtered.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      team: p.team.name,
      season: p.season,
      competition: p.competition,
      matchesPlayed: p.matchesPlayed,
      goals: p.goals,
      assists: p.assists,
      passAccuracyPct: p.passAccuracyPct.toFixed(0),
      yellowCards: p.yellowCards,
      redCards: p.redCards,
      suspensionDays: p.suspensionDays,
    }));
    exportCsv(`stats_export_${new Date().toISOString().split("T")[0]}.csv`, toCsv(rows));
    toast.success("CSV export successful");
  };

  const onExportPdf = () => {
    const makeTable = (title: string, rows: PlayerMetric[], metric: (p: PlayerMetric) => string) => {
      const head = `<h2 style="font-family: Arial; margin: 0 0 12px 0;">${title}</h2>`;
      const table = `<table style="width:100%; border-collapse:collapse; font-family: Arial; font-size: 12px;">
        <thead><tr>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:8px;">Player</th>
          <th style="text-align:left; border-bottom:1px solid #ddd; padding:8px;">Team</th>
          <th style="text-align:right; border-bottom:1px solid #ddd; padding:8px;">Metric</th>
        </tr></thead>
        <tbody>
          ${rows.map((p) => `<tr>
            <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${p.name}</td>
            <td style="padding:8px; border-bottom:1px solid #f0f0f0;">${p.team.name}</td>
            <td style="padding:8px; border-bottom:1px solid #f0f0f0; text-align:right;">${metric(p)}</td>
          </tr>`).join("")}
        </tbody>
      </table>`;
      return `${head}${table}`;
    };

    const html = `
      <div style="padding:24px;">
        <h1 style="font-family: Arial; margin: 0 0 16px 0;">Performance Dashboard Export</h1>
        <div style="margin-bottom: 18px; font-family: Arial; font-size: 12px; color: #555;">
          Filters: Season=${filters.season}, Competition=${filters.competition}, Team=${filters.teamId}, Period=${filters.period}
        </div>
        ${makeTable("Top Scorers", topScorers, (p) => String(p.goals))}
        <div style="height:18px;"></div>
        ${makeTable("Top Assists", topAssists, (p) => String(p.assists))}
        <div style="height:18px;"></div>
        ${makeTable("Disciplinary Record", disciplinary, (p) => `${p.yellowCards}Y / ${p.redCards}R · ${p.suspensionDays} days`)}
      </div>
    `;
    exportPdfViaPrint("Statistics Export", html);
  };

  const setFilter = <K extends keyof MetricsFilters>(key: K, value: MetricsFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Statistics Dashboard</h1>
          <p className="text-muted-foreground mt-1">Interactive performance leaderboards with live updates</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-11 rounded-2xl font-bold gap-2"
            onClick={() => setLive((v) => !v)}
            aria-pressed={live}
          >
            <Badge variant={live ? "destructive" : "secondary"} className="font-black text-[10px] uppercase tracking-widest">
              {live ? "Live" : "Paused"}
            </Badge>
            Live Updates
          </Button>
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" onClick={fetchData}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" onClick={onExportCsv}>
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white" onClick={onExportPdf}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Filter className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Filters</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{filtered.length} players</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Select value={filters.season} onValueChange={(v) => setFilter("season", v)}>
            <SelectTrigger className="h-12 rounded-2xl font-bold">
              <SelectValue placeholder="Season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Seasons</SelectItem>
              {metricSeasons.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.competition} onValueChange={(v) => setFilter("competition", v)}>
            <SelectTrigger className="h-12 rounded-2xl font-bold">
              <SelectValue placeholder="Competition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Competitions</SelectItem>
              {metricCompetitions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.teamId} onValueChange={(v) => setFilter("teamId", v)}>
            <SelectTrigger className="h-12 rounded-2xl font-bold">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {metricTeams.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.period} onValueChange={(v) => setFilter("period", v as MetricsFilters["period"])}>
            <SelectTrigger className="h-12 rounded-2xl font-bold">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[240px] w-full rounded-3xl" />
          <Skeleton className="h-[240px] w-full rounded-3xl" />
          <Skeleton className="h-[240px] w-full rounded-3xl" />
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-10 text-center" role="alert">
          <p className="text-lg font-black text-destructive">Unable to load</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button className="mt-6 h-11 rounded-2xl font-black" onClick={fetchData}>Try again</Button>
        </div>
      ) : (
        <div className="space-y-8">
          <section className={leaderboardContainer} aria-label="Top scorers section">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Top Scorers</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Goals • per-game averages</p>
                </div>
              </div>
              <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{topScorers.length} ranked</Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartScorers} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const v = payload[0].payload as ScorersChartRow;
                        return (
                          <div className="bg-card border rounded-2xl p-3 shadow-xl">
                            <div className="font-black text-sm">{v.name}</div>
                            <div className="text-xs text-muted-foreground font-bold">{v.team}</div>
                            <div className="mt-2 text-sm font-black text-secondary">{v.value} goals</div>
                            <div className="text-xs font-bold text-muted-foreground">{v.avg.toFixed(2)} / game</div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[8, 8, 8, 8]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topScorers.map((p, i) => (
                  <PlayerMetricCard key={p.id} player={p} rank={i + 1} variant="scorer" />
                ))}
              </div>
            </div>
          </section>

          <section className={leaderboardContainer} aria-label="Top assists section">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Top Assists</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Assists • pass accuracy</p>
                </div>
              </div>
              <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{topAssists.length} ranked</Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartAssists} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const v = payload[0].payload as AssistsChartRow;
                        return (
                          <div className="bg-card border rounded-2xl p-3 shadow-xl">
                            <div className="font-black text-sm">{v.name}</div>
                            <div className="text-xs text-muted-foreground font-bold">{v.team}</div>
                            <div className="mt-2 text-sm font-black text-info">{v.value} assists</div>
                            <div className="text-xs font-bold text-muted-foreground">{v.pass.toFixed(0)}% pass accuracy</div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 8, 8]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topAssists.map((p, i) => (
                  <PlayerMetricCard key={p.id} player={p} rank={i + 1} variant="assist" />
                ))}
              </div>
            </div>
          </section>

          <section className={leaderboardContainer} aria-label="Disciplinary record section">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight">Disciplinary Record</h2>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Cards • suspensions • violations</p>
                </div>
              </div>
              <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest">{disciplinary.length} ranked</Badge>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartDiscipline} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={90} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: "bold" }} />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const v = payload[0].payload as DisciplineChartRow;
                        return (
                          <div className="bg-card border rounded-2xl p-3 shadow-xl">
                            <div className="font-black text-sm">{v.name}</div>
                            <div className="text-xs text-muted-foreground font-bold">{v.team}</div>
                            <div className="mt-2 text-sm font-black">{v.yellow}Y / {v.red}R</div>
                            <div className="text-xs font-bold text-muted-foreground">{v.susp} suspension days</div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="yellow" fill="#f59e0b" radius={[8, 8, 8, 8]} barSize={12} />
                    <Bar dataKey="red" fill="#ef4444" radius={[8, 8, 8, 8]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {disciplinary.map((p, i) => (
                  <PlayerMetricCard key={p.id} player={p} rank={i + 1} variant="discipline" />
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
