import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Users, Search } from "lucide-react";

interface ParticipantStepProps {
  organizationId?: string;
  maxTeams: number;
  initialSelectedIds?: string[];
  onSubmit: (teamIds: string[]) => void;
  onBack: () => void;
}

interface TeamOption {
  id: string;
  name: string;
  city: string | null;
  logo_url: string | null;
}

export function ParticipantStep({ organizationId, maxTeams, initialSelectedIds = [], onSubmit, onBack }: ParticipantStepProps) {
  const [teams, setTeams] = useState<TeamOption[]>([]);
  const [selected, setSelected] = useState<string[]>(initialSelectedIds);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      let query = supabase.from("teams").select("id, name, city, logo_url").eq("status", "active").order("name");
      if (organizationId) query = query.eq("organization_id", organizationId);
      const { data } = await query;
      setTeams(data || []);
      setLoading(false);
    };
    fetchTeams();
  }, [organizationId]);

  const toggleTeam = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= maxTeams) return prev;
      return [...prev, id];
    });
  };

  const filtered = teams.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-secondary" />
          <span className="text-sm font-bold">
            {selected.length} / {maxTeams} teams selected
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-lg border bg-background text-sm outline-none focus:border-secondary w-64"
          />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-secondary rounded-full transition-all"
          style={{ width: `${(selected.length / maxTeams) * 100}%` }}
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading teams...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">No teams found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((team) => {
            const isSelected = selected.includes(team.id);
            return (
              <div
                key={team.id}
                onClick={() => toggleTeam(team.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-secondary bg-secondary/5 shadow-sm"
                    : "border-border hover:border-secondary/40"
                } ${!isSelected && selected.length >= maxTeams ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Checkbox checked={isSelected} className="pointer-events-none" />
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">{team.name.charAt(0)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{team.name}</p>
                  {team.city && <p className="text-xs text-muted-foreground">{team.city}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button
          type="button"
          className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          onClick={() => onSubmit(selected)}
          disabled={selected.length < 2}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
