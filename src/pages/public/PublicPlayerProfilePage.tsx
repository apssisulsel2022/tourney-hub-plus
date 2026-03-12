import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart3, Mail, Phone, Shield, Trophy, User } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import { playerService } from "@/modules/players/services/playerService";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/public/ShareButton";

export default function PublicPlayerProfilePage() {
  const { id } = useParams();

  const playerQuery = useQuery({
    queryKey: ["public", "players", "profile", id],
    queryFn: async () => {
      if (!id) return undefined;
      return playerService.getPlayerById(id);
    },
    staleTime: 15000,
  });

  const player = playerQuery.data;

  const headline = useMemo(() => {
    if (!player) return "";
    const goals = player.stats?.goals ?? 0;
    const assists = player.stats?.assists ?? 0;
    return `${goals} goals · ${assists} assists`;
  }, [player]);

  if (!id) return null;

  if (playerQuery.isLoading) {
    return (
      <PublicLayout seo={{ title: "Player · Premier Cup 2026", description: "Player profile" }} tournamentName="Premier Cup 2026">
        <div className="space-y-6 max-w-5xl mx-auto">
          <Skeleton className="h-10 w-52 rounded-xl" />
          <Skeleton className="h-[240px] w-full rounded-3xl" />
          <Skeleton className="h-[520px] w-full rounded-3xl" />
        </div>
      </PublicLayout>
    );
  }

  if (!player) {
    return (
      <PublicLayout seo={{ title: "Player Not Found · Premier Cup 2026", description: "Player profile not found" }} tournamentName="Premier Cup 2026">
        <div className="max-w-3xl mx-auto bg-card rounded-3xl border p-8 text-center">
          <div className="text-xl font-black">Player not found</div>
          <div className="text-sm text-muted-foreground mt-2">The requested player does not exist.</div>
          <div className="mt-6">
            <Link to="/public/players" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-2xl px-5 font-black bg-secondary text-white">
              Browse players
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const shareUrl = `${window.location.origin}/public/players/${player.id}`;

  return (
    <PublicLayout
      seo={{
        title: `${player.name} · Players · Premier Cup 2026`,
        description: `Player profile and stats for ${player.name} (${player.clubName}).`,
        imageUrl: `${window.location.origin}/placeholder.svg`,
      }}
      tournamentName="Premier Cup 2026"
    >
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/public/players" className="h-11 w-11 rounded-2xl border bg-card flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Back to players</span>
            </Link>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Player</div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{player.name}</h1>
              <div className="text-sm text-muted-foreground font-medium">{player.clubName} · {headline}</div>
            </div>
          </div>
          <ShareButton title={`${player.name} · Premier Cup 2026`} text={`Player profile · ${player.clubName}`} url={shareUrl} />
        </div>

        <section className="bg-card rounded-3xl border p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{player.primaryPosition}</Badge>
                <Badge variant="secondary" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{player.ageCategory}</Badge>
                <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{player.nationality}</Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Matches", value: player.stats?.matchesPlayed ?? 0, icon: Trophy },
                  { label: "Goals", value: player.stats?.goals ?? 0, icon: Shield },
                  { label: "Assists", value: player.stats?.assists ?? 0, icon: BarChart3 },
                  { label: "Rating", value: (player.stats?.averageRating ?? 0).toFixed(1), icon: User },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-muted/20 p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</div>
                      <s.icon className="h-4 w-4 text-secondary" aria-hidden="true" />
                    </div>
                    <div className="text-lg font-black tabular-nums mt-1">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[360px] space-y-3">
              <div className="rounded-3xl border bg-background/60 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contact</div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Mail className="h-4 w-4 text-secondary" aria-hidden="true" />
                    <span className="break-all">{player.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold">
                    <Phone className="h-4 w-4 text-secondary" aria-hidden="true" />
                    <span>{player.phone}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border bg-background/60 p-6">
                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Highlights</div>
                <div className="mt-3 space-y-2">
                  {(player.stats?.careerHighlights ?? []).slice(0, 5).map((h, idx) => (
                    <div key={idx} className="text-sm font-bold">{h}</div>
                  ))}
                  {(player.stats?.careerHighlights ?? []).length === 0 ? <div className="text-sm text-muted-foreground">No highlights yet.</div> : null}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}

