import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TournamentScheduling, DEFAULT_SCHEDULING } from "../types/tournament";
import { Calendar, Clock } from "lucide-react";

interface SchedulingStepProps {
  initialData?: Partial<TournamentScheduling>;
  onSubmit: (scheduling: TournamentScheduling) => void;
  onBack: () => void;
}

const DAYS = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

export function SchedulingStep({ initialData, onSubmit, onBack }: SchedulingStepProps) {
  const [scheduling, setScheduling] = useState<TournamentScheduling>({
    ...DEFAULT_SCHEDULING,
    ...initialData,
  });
  const [newTime, setNewTime] = useState("15:00");

  const toggleDay = (day: string) => {
    setScheduling((prev) => ({
      ...prev,
      matchDays: prev.matchDays.includes(day)
        ? prev.matchDays.filter((d) => d !== day)
        : [...prev.matchDays, day],
    }));
  };

  const addKickoffTime = () => {
    if (!scheduling.defaultKickoffTimes.includes(newTime)) {
      setScheduling((prev) => ({
        ...prev,
        defaultKickoffTimes: [...prev.defaultKickoffTimes, newTime].sort(),
      }));
    }
  };

  const removeTime = (time: string) => {
    setScheduling((prev) => ({
      ...prev,
      defaultKickoffTimes: prev.defaultKickoffTimes.filter((t) => t !== time),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Match Days */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Match Days
        </h3>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                scheduling.matchDays.includes(day.value)
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-background text-muted-foreground hover:border-secondary/50"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </section>

      {/* Kick-off Times */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4" /> Default Kick-off Times
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {scheduling.defaultKickoffTimes.map((time) => (
            <span
              key={time}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/20 text-sm font-medium"
            >
              {time}
              <button type="button" onClick={() => removeTime(time)} className="text-muted-foreground hover:text-destructive">×</button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none focus:border-secondary"
          />
          <Button type="button" variant="outline" size="sm" onClick={addKickoffTime}>Add Time</Button>
        </div>
      </section>

      {/* Auto Generate */}
      <section className="space-y-3">
        <div className="flex items-center justify-between rounded-lg border bg-background px-4 py-3">
          <div>
            <p className="text-sm font-medium">Auto-generate Schedule</p>
            <p className="text-xs text-muted-foreground">Automatically create match fixtures based on format and teams</p>
          </div>
          <Switch
            checked={scheduling.autoGenerate}
            onCheckedChange={(v) => setScheduling((prev) => ({ ...prev, autoGenerate: v }))}
          />
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button
          type="button"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={() => onSubmit(scheduling)}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
