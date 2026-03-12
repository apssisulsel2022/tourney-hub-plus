import React, { useState, useMemo } from "react";
import { Calendar, Filter, ChevronLeft, ChevronRight, Clock, MapPin, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Match {
  id: string;
  home: string;
  away: string;
  time: string;
  date: Date;
  venue: string;
  status: "confirmed" | "pending" | "cancelled";
  tournament: string;
  category: string;
}

const mockMatches: Match[] = [
  { id: "1", home: "FC Thunder", away: "Red Lions", time: "14:00", date: new Date(), venue: "National Stadium", status: "confirmed", tournament: "Premier Cup", category: "Adult" },
  { id: "2", home: "Blue Eagles", away: "Golden Stars", time: "16:30", date: new Date(), venue: "City Arena", status: "pending", tournament: "Premier Cup", category: "Adult" },
  { id: "3", home: "United FC", away: "Dynamo City", time: "10:00", date: new Date(Date.now() + 86400000), venue: "Olympic Park", status: "confirmed", tournament: "City League", category: "Adult" },
  { id: "4", home: "Phoenix SC", away: "Metro FC", time: "13:30", date: new Date(Date.now() + 86400000 * 2), venue: "Phoenix Ground", status: "cancelled", tournament: "Youth Cup", category: "U16" },
  { id: "5", home: "Copa FC", away: "Real Soccer", time: "15:00", date: new Date(Date.now() + 86400000 * 3), venue: "National Stadium", status: "confirmed", tournament: "Premier Cup", category: "Adult" },
];

export function DashboardTimeline() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState("All");

  const dates = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  const filteredMatches = useMemo(() => {
    return mockMatches.filter(m => {
      const isSameDate = m.date.toDateString() === selectedDate.toDateString();
      const matchesFilter = filter === "All" || m.tournament === filter;
      return isSameDate && matchesFilter;
    });
  }, [selectedDate, filter]);

  return (
    <div className="bg-card rounded-xl border p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">14-Day Match Timeline</h2>
          <p className="text-sm text-muted-foreground">Interact with upcoming matches</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" /> Today
          </Button>
        </div>
      </div>

      {/* Date Scroller */}
      <div className="relative flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {dates.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex flex-col items-center justify-center min-w-[64px] h-20 rounded-xl border transition-all shrink-0",
                isSelected 
                  ? "bg-secondary border-secondary text-secondary-foreground ring-4 ring-secondary/10" 
                  : "bg-background border-border hover:border-secondary/50 text-muted-foreground"
              )}
            >
              <span className="text-[10px] uppercase font-bold opacity-70">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-xl font-bold">{date.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Match Cards */}
      <div className="space-y-3">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div 
              key={match.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-background hover:border-secondary transition-all cursor-pointer group gap-4"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border-2",
                  match.status === "confirmed" && "border-success/20 bg-success/5 text-success",
                  match.status === "pending" && "border-warning/20 bg-warning/5 text-warning",
                  match.status === "cancelled" && "border-destructive/20 bg-destructive/5 text-destructive",
                )}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold flex items-center gap-2">
                    {match.home} <span className="text-muted-foreground font-normal text-xs italic">vs</span> {match.away}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {match.venue}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Trophy className="h-3 w-3" /> {match.tournament}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="text-right">
                  <p className="text-sm font-bold">{match.time}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{match.status}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground">
            <Calendar className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">No matches scheduled for this date</p>
          </div>
        )}
      </div>
    </div>
  );
}
