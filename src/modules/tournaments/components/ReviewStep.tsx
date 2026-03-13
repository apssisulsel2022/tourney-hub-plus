import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateTournamentInput, TournamentRules, TournamentScheduling, DEFAULT_RULES, DEFAULT_SCHEDULING } from "../types/tournament";
import { Check, AlertTriangle, Calendar, MapPin, Users, Trophy, Shield, Clock } from "lucide-react";

interface ReviewStepProps {
  formData: Partial<CreateTournamentInput>;
  onPublish: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function ReviewStep({ formData, onPublish, onSaveDraft, onBack, isSubmitting }: ReviewStepProps) {
  const rules: TournamentRules = formData.rules || DEFAULT_RULES;
  const scheduling: TournamentScheduling = formData.scheduling || DEFAULT_SCHEDULING;
  const teamCount = formData.selectedTeamIds?.length || 0;

  const warnings: string[] = [];
  if (!formData.name) warnings.push("Tournament name is missing");
  if (!formData.organizationId) warnings.push("Organization is not selected");
  if (!formData.startDate) warnings.push("Start date is missing");
  if (!formData.endDate) warnings.push("End date is missing");
  if (!formData.location) warnings.push("Location is missing");
  if (teamCount < 2) warnings.push("At least 2 teams must be registered");

  const Section = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border p-5 space-y-3">
      <h3 className="text-sm font-bold flex items-center gap-2">
        <Icon className="h-4 w-4 text-secondary" /> {title}
      </h3>
      <div className="text-sm space-y-1.5">{children}</div>
    </div>
  );

  const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
          <h3 className="text-sm font-bold flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-4 w-4" /> {warnings.length} Warning{warnings.length > 1 ? "s" : ""}
          </h3>
          <ul className="text-sm text-amber-600 space-y-1">
            {warnings.map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section icon={Trophy} title="Basic Info">
          <Row label="Name" value={formData.name} />
          <Row label="Format" value={formData.format} />
          <Row label="Age Category" value={formData.ageCategory} />
          <Row label="Max Teams" value={formData.maxTeams} />
        </Section>

        <Section icon={Calendar} title="Dates & Location">
          <Row label="Start" value={formData.startDate} />
          <Row label="End" value={formData.endDate} />
          <Row label="Deadline" value={formData.registrationDeadline} />
          <Row label="Location" value={formData.location} />
        </Section>

        <Section icon={Shield} title="Rules & Format">
          <Row label="Half Duration" value={`${rules.halfDuration} min`} />
          <Row label="Extra Time" value={rules.extraTimeAllowed ? "Yes" : "No"} />
          <Row label="Penalty Shootout" value={rules.penaltyShootout ? "Yes" : "No"} />
          <Row label="Points (W/D/L)" value={`${rules.pointsWin} / ${rules.pointsDraw} / ${rules.pointsLoss}`} />
          <Row label="Max Subs" value={rules.maxSubstitutions} />
          <Row label="Yellow Threshold" value={rules.yellowCardThreshold} />
        </Section>

        <Section icon={Users} title="Participants">
          <Row label="Registered Teams" value={`${teamCount} / ${formData.maxTeams || 16}`} />
          {teamCount > 0 && (
            <div className="pt-2">
              <Badge variant="secondary">{teamCount} team{teamCount > 1 ? "s" : ""} selected</Badge>
            </div>
          )}
        </Section>

        <Section icon={Clock} title="Schedule">
          <Row label="Match Days" value={scheduling.matchDays.join(", ") || "None"} />
          <Row label="Kick-off Times" value={scheduling.defaultKickoffTimes.join(", ") || "None"} />
          <Row label="Auto-generate" value={scheduling.autoGenerate ? "Yes" : "No"} />
        </Section>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button type="button" variant="ghost" onClick={onSaveDraft} disabled={isSubmitting}>Save as Draft</Button>
          <Button
            type="button"
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={onPublish}
            disabled={warnings.length > 0 || isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "🚀 Publish Tournament"}
          </Button>
        </div>
      </div>
    </div>
  );
}
