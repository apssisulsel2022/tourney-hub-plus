import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TournamentRules, DEFAULT_RULES } from "../types/tournament";

interface RulesFormatStepProps {
  initialData?: Partial<TournamentRules>;
  onSubmit: (rules: TournamentRules) => void;
  onBack: () => void;
}

export function RulesFormatStep({ initialData, onSubmit, onBack }: RulesFormatStepProps) {
  const [rules, setRules] = useState<TournamentRules>({ ...DEFAULT_RULES, ...initialData });

  const update = <K extends keyof TournamentRules>(key: K, value: TournamentRules[K]) => {
    setRules((prev) => ({ ...prev, [key]: value }));
  };

  const tiebreakerOptions = [
    { value: "goal_difference", label: "Goal Difference" },
    { value: "head_to_head", label: "Head-to-Head" },
    { value: "goals_scored", label: "Goals Scored" },
    { value: "fair_play", label: "Fair Play Points" },
  ];

  const toggleTiebreaker = (val: string) => {
    setRules((prev) => ({
      ...prev,
      tiebreakers: prev.tiebreakers.includes(val)
        ? prev.tiebreakers.filter((t) => t !== val)
        : [...prev.tiebreakers, val],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Match Duration */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Match Duration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Minutes per Half</label>
            <input
              type="number"
              value={rules.halfDuration}
              onChange={(e) => update("halfDuration", Number(e.target.value))}
              className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background px-4 h-11">
            <span className="text-sm">Extra Time Allowed</span>
            <Switch checked={rules.extraTimeAllowed} onCheckedChange={(v) => update("extraTimeAllowed", v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-background px-4 h-11">
            <span className="text-sm">Penalty Shootout</span>
            <Switch checked={rules.penaltyShootout} onCheckedChange={(v) => update("penaltyShootout", v)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Max Substitutions</label>
            <input
              type="number"
              value={rules.maxSubstitutions}
              onChange={(e) => update("maxSubstitutions", Number(e.target.value))}
              className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
            />
          </div>
        </div>
      </section>

      {/* Points System */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Points System</h3>
        <div className="grid grid-cols-3 gap-4">
          {(["pointsWin", "pointsDraw", "pointsLoss"] as const).map((key) => (
            <div key={key}>
              <label className="text-sm font-medium mb-1.5 block capitalize">{key.replace("points", "")}</label>
              <input
                type="number"
                value={rules[key]}
                onChange={(e) => update(key, Number(e.target.value))}
                className="h-11 w-full rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tiebreaker Rules */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Tiebreaker Priority</h3>
        <div className="flex flex-wrap gap-2">
          {tiebreakerOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleTiebreaker(opt.value)}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                rules.tiebreakers.includes(opt.value)
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : "bg-background text-muted-foreground hover:border-secondary/50"
              }`}
            >
              {rules.tiebreakers.includes(opt.value) && (
                <span className="mr-1.5 text-xs font-bold">{rules.tiebreakers.indexOf(opt.value) + 1}.</span>
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Discipline */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Discipline</h3>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Yellow Card Suspension Threshold</label>
          <input
            type="number"
            value={rules.yellowCardThreshold}
            onChange={(e) => update("yellowCardThreshold", Number(e.target.value))}
            className="h-11 w-32 rounded-lg border bg-background px-4 text-sm outline-none focus:border-secondary"
          />
          <p className="text-xs text-muted-foreground mt-1">Player suspended after this many yellow cards</p>
        </div>
      </section>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="button" className="bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={() => onSubmit(rules)}>
          Continue →
        </Button>
      </div>
    </div>
  );
}
