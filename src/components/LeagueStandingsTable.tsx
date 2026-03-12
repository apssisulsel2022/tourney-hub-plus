import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type StandingsSortDirection = "asc" | "desc";

export type StandingsSortKey =
  | "position"
  | "teamName"
  | "played"
  | "win"
  | "draw"
  | "loss"
  | "goalsFor"
  | "goalsAgainst"
  | "points";

export interface StandingsTeamRow {
  position: number;
  teamName: string;
  teamLogoUrl?: string;
  played: number;
  win: number;
  draw: number;
  loss: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface LeagueStandingsLabels {
  position: string;
  team: string;
  played: string;
  win: string;
  draw: string;
  loss: string;
  goalsFor: string;
  goalsAgainst: string;
  points: string;
  tableAriaLabel: string;
  empty: string;
  invalid: string;
  retry: string;
  loading: string;
}

export interface LeagueStandingsTableProps {
  data: StandingsTeamRow[];
  locale?: string;
  labels?: Partial<LeagueStandingsLabels>;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  maxHeightPx?: number;
  initialSort?: { key: StandingsSortKey; direction: StandingsSortDirection };
}

const defaultLabels: LeagueStandingsLabels = {
  position: "Position",
  team: "Team",
  played: "Played",
  win: "Win",
  draw: "Draw",
  loss: "Loss",
  goalsFor: "Goals For",
  goalsAgainst: "Goals Against",
  points: "Points",
  tableAriaLabel: "League standings table",
  empty: "No standings data available.",
  invalid: "Standings data is invalid.",
  retry: "Try again",
  loading: "Loading standings…",
};

const ordinalEn = (n: number) => {
  const pr = new Intl.PluralRules("en", { type: "ordinal" });
  const rule = pr.select(n);
  const suffix: Record<Intl.LDMLPluralRule, string> = { one: "st", two: "nd", few: "rd", other: "th", many: "th", zero: "th" };
  return `${n}${suffix[rule] ?? "th"}`;
};

const isValidRow = (row: StandingsTeamRow) => {
  const requiredNumberFields: Array<keyof StandingsTeamRow> = [
    "position",
    "played",
    "win",
    "draw",
    "loss",
    "goalsFor",
    "goalsAgainst",
    "points",
  ];
  for (const key of requiredNumberFields) {
    const val = row[key];
    if (typeof val !== "number" || !Number.isFinite(val)) return false;
  }
  if (!row.teamName || typeof row.teamName !== "string") return false;
  return true;
};

const rowHighlightClass = (position: number) => {
  if (position === 1) return "bg-yellow-500/15 hover:bg-yellow-500/20";
  if (position === 2) return "bg-muted/60 hover:bg-muted/70";
  if (position === 3) return "bg-amber-700/15 hover:bg-amber-700/20";
  return "hover:bg-muted/30";
};

const sortComparator = (key: StandingsSortKey, direction: StandingsSortDirection) => {
  const dir = direction === "asc" ? 1 : -1;
  return (a: StandingsTeamRow, b: StandingsTeamRow) => {
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    const cmpNum = (x: number, y: number) => {
      const cmp = x - y;
      return cmp === 0 ? 0 : cmp * dir;
    };

    const tieBreak = () => {
      if (a.points !== b.points) return cmpNum(a.points, b.points);
      if (gdA !== gdB) return cmpNum(gdA, gdB);
      if (a.goalsFor !== b.goalsFor) return cmpNum(a.goalsFor, b.goalsFor);
      return a.position - b.position;
    };

    if (key === "teamName") {
      const cmp = a.teamName.localeCompare(b.teamName);
      return cmp === 0 ? tieBreak() : cmp * dir;
    }

    const aVal = a[key];
    const bVal = b[key];
    if (typeof aVal === "number" && typeof bVal === "number") {
      const cmp = cmpNum(aVal, bVal);
      return cmp === 0 ? tieBreak() : cmp;
    }

    return tieBreak();
  };
};

export function LeagueStandingsTable({
  data,
  locale = "en-US",
  labels,
  loading = false,
  error = null,
  onRetry,
  maxHeightPx = 560,
  initialSort = { key: "points", direction: "desc" },
}: LeagueStandingsTableProps) {
  const t = { ...defaultLabels, ...labels };
  const [sortKey, setSortKey] = useState<StandingsSortKey>(initialSort.key);
  const [sortDirection, setSortDirection] = useState<StandingsSortDirection>(initialSort.direction);

  const numberFmt = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const positionLabel = useMemo(() => {
    const isEnglish = locale.toLowerCase().startsWith("en");
    return (n: number) => (isEnglish ? ordinalEn(n) : numberFmt.format(n));
  }, [locale, numberFmt]);

  const validationError = useMemo(() => {
    if (!data) return t.invalid;
    for (const row of data) {
      if (!isValidRow(row)) return t.invalid;
    }
    return null;
  }, [data, t.invalid]);

  const sortedData = useMemo(() => {
    const list = [...data];
    list.sort(sortComparator(sortKey, sortDirection));
    return list;
  }, [data, sortKey, sortDirection]);

  const toggleSort = (key: StandingsSortKey) => {
    if (sortKey === key) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection(key === "teamName" ? "asc" : "desc");
    }
  };

  const sortIcon = (key: StandingsSortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
    );
  };

  const ariaSort = (key: StandingsSortKey): "none" | "ascending" | "descending" => {
    if (sortKey !== key) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  if (error) {
    return (
      <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-8 text-center" role="alert" aria-label={error}>
        <div className="text-lg font-black text-destructive">Error</div>
        <div className="text-sm text-muted-foreground mt-2">{error}</div>
        {onRetry && (
          <Button className="mt-6 h-11 rounded-2xl font-black" onClick={onRetry}>
            {t.retry}
          </Button>
        )}
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="bg-warning/5 border border-warning/10 rounded-3xl p-8 text-center" role="alert" aria-label={validationError}>
        <div className="text-lg font-black text-warning">{t.invalid}</div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl border shadow-sm overflow-hidden">
      <div className="sm:hidden">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sort</div>
            <div className="flex gap-2 overflow-x-auto py-1 [-webkit-overflow-scrolling:touch]">
              <Button
                type="button"
                variant={sortKey === "points" ? "default" : "outline"}
                className={cn("h-11 rounded-2xl font-bold", sortKey === "points" && "bg-secondary hover:bg-secondary/90 text-white")}
                onClick={() => toggleSort("points")}
              >
                {t.points} {sortIcon("points")}
              </Button>
              <Button
                type="button"
                variant={sortKey === "teamName" ? "default" : "outline"}
                className={cn("h-11 rounded-2xl font-bold", sortKey === "teamName" && "bg-secondary hover:bg-secondary/90 text-white")}
                onClick={() => toggleSort("teamName")}
              >
                {t.team} {sortIcon("teamName")}
              </Button>
              <Button
                type="button"
                variant={sortKey === "position" ? "default" : "outline"}
                className={cn("h-11 rounded-2xl font-bold", sortKey === "position" && "bg-secondary hover:bg-secondary/90 text-white")}
                onClick={() => toggleSort("position")}
              >
                {t.position} {sortIcon("position")}
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : sortedData.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground font-medium">{t.empty}</div>
        ) : (
          <Accordion type="single" collapsible className="divide-y">
            {sortedData.map((row) => {
              const gd = row.goalsFor - row.goalsAgainst;
              return (
                <AccordionItem
                  key={`${row.teamName}-${row.position}`}
                  value={`${row.teamName}-${row.position}`}
                  className={cn("px-4", rowHighlightClass(row.position))}
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="text-xs font-black text-muted-foreground tabular-nums w-10 shrink-0">{positionLabel(row.position)}</div>
                        {row.teamLogoUrl ? (
                          <img
                            src={row.teamLogoUrl}
                            alt={row.teamName}
                            className="h-9 w-9 rounded-xl object-contain bg-muted p-1 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black shrink-0">
                            {row.teamName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-sm font-black truncate">{row.teamName}</div>
                          <div className="text-xs text-muted-foreground font-bold tabular-nums">
                            P {numberFmt.format(row.played)} · GD {gd >= 0 ? "+" : ""}{numberFmt.format(gd)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg font-black tabular-nums">{numberFmt.format(row.points)}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.points}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.win}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.win)}</div>
                      </div>
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.draw}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.draw)}</div>
                      </div>
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.loss}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.loss)}</div>
                      </div>
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.goalsFor}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.goalsFor)}</div>
                      </div>
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.goalsAgainst}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.goalsAgainst)}</div>
                      </div>
                      <div className="rounded-2xl border bg-background/60 p-3">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t.played}</div>
                        <div className="text-sm font-black tabular-nums">{numberFmt.format(row.played)}</div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <div className="overflow-y-auto" style={{ maxHeight: maxHeightPx }}>
          <table className="w-full min-w-[920px]" aria-label={t.tableAriaLabel}>
            <thead className="sticky top-0 z-10 bg-muted/70 backdrop-blur supports-[backdrop-filter]:bg-muted/50 border-b">
              <tr>
                <th
                  scope="col"
                  aria-sort={ariaSort("position")}
                  className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort("position")}
                    className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    aria-label={`Sort by ${t.position}`}
                  >
                    {t.position} {sortIcon("position")}
                  </button>
                </th>
                <th
                  scope="col"
                  aria-sort={ariaSort("teamName")}
                  className="px-4 py-3.5 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort("teamName")}
                    className="inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    aria-label={`Sort by ${t.team}`}
                  >
                    {t.team} {sortIcon("teamName")}
                  </button>
                </th>
                {[
                  { key: "played" as const, label: t.played },
                  { key: "win" as const, label: t.win },
                  { key: "draw" as const, label: t.draw },
                  { key: "loss" as const, label: t.loss },
                  { key: "goalsFor" as const, label: t.goalsFor },
                  { key: "goalsAgainst" as const, label: t.goalsAgainst },
                  { key: "points" as const, label: t.points },
                ].map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort(col.key)}
                    className="px-4 py-3.5 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center justify-end gap-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label} {sortIcon(col.key)}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-4"><Skeleton className="h-5 w-14 rounded" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-44 rounded" /></td>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-4 py-4 text-right"><Skeleton className="h-5 w-10 rounded ml-auto" /></td>
                    ))}
                  </tr>
                ))
              ) : sortedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-sm text-muted-foreground font-medium">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                sortedData.map((row) => (
                  <tr
                    key={`${row.teamName}-${row.position}`}
                    className={cn("border-b last:border-0 transition-colors", rowHighlightClass(row.position))}
                  >
                    <td className="px-4 py-4 text-sm font-black text-foreground whitespace-nowrap">
                      <span className="tabular-nums" title={positionLabel(row.position)}>
                        {positionLabel(row.position)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {row.teamLogoUrl ? (
                          <img
                            src={row.teamLogoUrl}
                            alt={row.teamName}
                            className="h-9 w-9 rounded-xl object-contain bg-muted p-1 shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black shrink-0">
                            {row.teamName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <span className="font-black text-sm truncate" title={row.teamName}>
                          {row.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.played)}</td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.win)}</td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.draw)}</td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.loss)}</td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.goalsFor)}</td>
                    <td className="px-4 py-4 text-right text-sm font-bold tabular-nums">{numberFmt.format(row.goalsAgainst)}</td>
                    <td className="px-4 py-4 text-right text-sm font-black tabular-nums">{numberFmt.format(row.points)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {loading && (
        <div className="px-4 py-3 border-t bg-muted/20 text-xs font-bold text-muted-foreground" aria-label={t.loading}>
          {t.loading}
        </div>
      )}
    </div>
  );
}
