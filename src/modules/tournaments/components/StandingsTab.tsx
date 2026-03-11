import React, { useState } from "react";
import { ArrowUpDown, Info, Trophy, ChevronRight, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const standingsData = [
  { pos: 1, team: "FC Thunder", p: 10, w: 8, d: 1, l: 1, gf: 24, ga: 8, gd: 16, pts: 25, form: ["W", "W", "D", "W", "W"] },
  { pos: 2, team: "Red Lions", p: 10, w: 7, d: 2, l: 1, gf: 20, ga: 10, gd: 10, pts: 23, form: ["W", "D", "W", "L", "W"] },
  { pos: 3, team: "Blue Eagles", p: 10, w: 6, d: 2, l: 2, gf: 18, ga: 12, gd: 6, pts: 20, form: ["L", "W", "W", "D", "W"] },
  { pos: 4, team: "Golden Stars", p: 10, w: 5, d: 3, l: 2, gf: 16, ga: 11, gd: 5, pts: 18, form: ["D", "W", "L", "W", "D"] },
  { pos: 5, team: "United FC", p: 10, w: 4, d: 3, l: 3, gf: 14, ga: 13, gd: 1, pts: 15, form: ["W", "L", "D", "D", "L"] },
  { pos: 6, team: "Dynamo City", p: 10, w: 3, d: 2, l: 5, gf: 12, ga: 16, gd: -4, pts: 11, form: ["L", "L", "W", "L", "D"] },
  { pos: 7, team: "Phoenix SC", p: 10, w: 2, d: 1, l: 7, gf: 9, ga: 20, gd: -11, pts: 7, form: ["L", "L", "L", "D", "L"] },
  { pos: 8, team: "Metro FC", p: 10, w: 1, d: 0, l: 9, gf: 5, ga: 28, gd: -23, pts: 3, form: ["L", "L", "L", "L", "L"] },
];

export function StandingsTab() {
  const [sortBy, setSortBy] = useState("pts");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Trophy className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold">League Standings</h3>
            <p className="text-xs text-muted-foreground">Season 2026 · Matchday 10 of 14</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          <Button variant="outline" size="sm" className="gap-2"><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      {/* Standings Table */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted">
                <th className="px-4 py-4 text-center w-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pos</th>
                <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Team</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">P</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">W</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">D</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">L</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">GF</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell">GA</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">GD</th>
                <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-secondary/5 font-black text-secondary">Pts</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden lg:table-cell">Last 5</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {standingsData.map((row) => (
                <tr key={row.pos} className={cn(
                  "hover:bg-muted/20 transition-colors group cursor-pointer",
                  row.pos <= 2 && "bg-green-500/[0.02]",
                  row.pos >= 7 && "bg-red-500/[0.02]"
                )}>
                  <td className="px-4 py-4 text-center">
                    <span className={cn(
                      "inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-black",
                      row.pos <= 2 ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : 
                      row.pos >= 7 ? "bg-red-500/10 text-red-600" : "bg-muted text-muted-foreground"
                    )}>
                      {row.pos}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-black border group-hover:border-secondary/50 transition-colors">
                        {row.team.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-bold text-sm group-hover:text-secondary transition-colors">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-medium">{row.p}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium">{row.w}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium">{row.d}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium">{row.l}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium hidden md:table-cell text-muted-foreground">{row.gf}</td>
                  <td className="px-4 py-4 text-center text-sm font-medium hidden md:table-cell text-muted-foreground">{row.ga}</td>
                  <td className="px-4 py-4 text-center text-sm font-bold">
                    <span className={cn(row.gd > 0 ? "text-green-600" : row.gd < 0 ? "text-red-600" : "")}>
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-black bg-secondary/[0.03] text-secondary">{row.pts}</td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex gap-1">
                      {row.form.map((res, i) => (
                        <span 
                          key={i} 
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-black",
                            res === "W" ? "bg-green-500 text-white" : 
                            res === "D" ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                          )}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl border p-6 space-y-4 shadow-sm">
          <h4 className="font-bold flex items-center gap-2">
            <Info className="h-4 w-4 text-secondary" /> Promotion & Relegation
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded bg-green-500" />
              <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">Promotion / Finals:</span> Top 2 teams qualify for the championship playoffs.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded bg-red-500" />
              <p className="text-xs text-muted-foreground"><span className="font-bold text-foreground">Relegation Zone:</span> Bottom 2 teams will be relegated to Division 2.</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-6 space-y-4 shadow-sm">
          <h4 className="font-bold flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-secondary" /> Tie-breaker Rules
          </h4>
          <div className="space-y-2">
            {[
              "1. Point total",
              "2. Goal difference",
              "3. Goals scored",
              "4. Head-to-head record"
            ].map((rule, i) => (
              <p key={i} className="text-xs text-muted-foreground font-medium">{rule}</p>
            ))}
          </div>
          <Button variant="link" className="p-0 h-auto text-xs text-secondary font-bold">View Full Rules Document</Button>
        </div>
      </div>
    </div>
  );
}
