import React from "react";
import { Player } from "../types/player";
import { Swords, Calendar, Trophy, Star, ChevronRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileMatchesTab({ player }: { player: Player }) {
  const matchHistory = [
    { id: "m1", date: "2026-03-10", opponent: "Red Lions", competition: "Premier Cup", score: "2 - 1", result: "win", rating: 8.5, goals: 1, assists: 0 },
    { id: "m2", date: "2026-03-05", opponent: "Blue Eagles", competition: "Premier Cup", score: "3 - 1", result: "win", rating: 7.2, goals: 0, assists: 2 },
    { id: "m3", date: "2026-02-28", opponent: "Golden Stars", competition: "Friendly", score: "0 - 0", result: "draw", rating: 6.8, goals: 0, assists: 0 },
    { id: "m4", date: "2026-02-20", opponent: "United FC", competition: "City League", score: "1 - 2", result: "loss", rating: 7.5, goals: 1, assists: 0 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between bg-card p-6 rounded-3xl border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Swords className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight">Match History</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{matchHistory.length} GAMES PLAYED</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 px-5 rounded-2xl font-bold gap-2 hover:bg-muted/50 transition-all">
            <Filter className="h-4 w-4 text-secondary" /> FILTER BY DATE
          </Button>
          <Button variant="outline" className="h-11 px-5 rounded-2xl font-bold gap-2 hover:bg-muted/50 transition-all">
            <Trophy className="h-4 w-4 text-secondary" /> COMPETITIONS
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden border-muted">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-muted">
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date & Competition</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Opponent</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Score</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Stats</th>
                <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Rating</th>
                <th className="px-6 py-5 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {matchHistory.map((match) => (
                <tr key={match.id} className="hover:bg-muted/20 transition-all group cursor-pointer">
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-black text-sm">
                        <Calendar className="h-3.5 w-3.5 text-secondary" />
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-widest border-muted-foreground/30 px-2 py-0.5 rounded-lg">
                        {match.competition}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-[10px] font-black">
                        {match.opponent.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-black text-sm group-hover:text-secondary transition-colors">{match.opponent}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-black text-lg tracking-tighter leading-none">{match.score}</span>
                      <Badge variant={match.result === 'win' ? 'success' : match.result === 'loss' ? 'destructive' : 'secondary'} className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                        {match.result}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase leading-none mb-1">Goals</span>
                        <span className="font-black text-secondary">{match.goals}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase leading-none mb-1">Assists</span>
                        <span className="font-black text-orange-500">{match.assists}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Star className={cn("h-4 w-4", match.rating >= 8 ? "text-yellow-500" : "text-muted-foreground")} />
                      <span className="font-black text-lg">{match.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
