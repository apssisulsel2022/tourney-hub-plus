import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Building2, Trophy, Users, CreditCard } from "lucide-react";
import { organizationsService } from "@/lib/organizations";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const orgsQuery = useQuery({
    queryKey: ["organizations", "list"],
    queryFn: organizationsService.list,
    staleTime: 15000,
  });

  const orgs = useMemo(() => orgsQuery.data ?? [], [orgsQuery.data]);
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return orgs;
    return orgs.filter((o) => o.name.toLowerCase().includes(s) || o.location.country.toLowerCase().includes(s) || o.location.city.toLowerCase().includes(s));
  }, [orgs, search]);

  const totals = useMemo(() => {
    const totalOrgs = orgs.length;
    const activeTournaments = orgs.reduce((sum, o) => sum + o.metrics.activeTournaments, 0);
    const registeredPlayers = orgs.reduce((sum, o) => sum + o.metrics.totalPlayers, 0);
    const mrr = orgs.reduce((sum, o) => sum + o.metrics.monthlyRevenueUsd, 0);
    return { totalOrgs, activeTournaments, registeredPlayers, mrr };
  }, [orgs]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="page-header">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <p className="text-muted-foreground">Platform-wide organization management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Organizations" value={totals.totalOrgs} icon={Building2} />
        <StatCard title="Active Tournaments" value={totals.activeTournaments} icon={Trophy} />
        <StatCard title="Registered Players" value={totals.registeredPlayers.toLocaleString()} icon={Users} />
        <StatCard title="Revenue (MRR)" value={`$${totals.mrr.toLocaleString()}/mo`} icon={CreditCard} />
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm font-semibold">Directory</div>
            <div className="w-full sm:w-[380px]">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search organization, city, or country…"
                className="h-11 rounded-xl"
                aria-label="Search organizations"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="data-table-header px-4 py-3 text-left">Organization</th>
                <th className="data-table-header px-4 py-3 text-left hidden md:table-cell">Country</th>
                <th className="data-table-header px-4 py-3 text-center">Tournaments</th>
                <th className="data-table-header px-4 py-3 text-center hidden sm:table-cell">Users</th>
                <th className="data-table-header px-4 py-3 text-center hidden lg:table-cell">Plan</th>
                <th className="data-table-header px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orgsQuery.isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="px-4 py-3"><Skeleton className="h-6 w-[240px] rounded" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="h-6 w-24 rounded" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-16 rounded mx-auto" /></td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell"><Skeleton className="h-6 w-16 rounded mx-auto" /></td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell"><Skeleton className="h-6 w-20 rounded mx-auto" /></td>
                    <td className="px-4 py-3 text-center"><Skeleton className="h-6 w-16 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : orgsQuery.isError ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="text-sm text-muted-foreground">Failed to load organizations.</div>
                    <Button className="mt-4" onClick={() => orgsQuery.refetch()}>Try again</Button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">No organizations found.</td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer focus-within:bg-muted/30"
                    onClick={() => navigate(`/organizations/${o.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/organizations/${o.id}`);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open organization ${o.name}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-xs font-bold">
                          {o.shortName}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">{o.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{o.location.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{o.location.country}</td>
                    <td className="px-4 py-3 text-sm text-center">{o.metrics.activeTournaments}</td>
                    <td className="px-4 py-3 text-sm text-center hidden sm:table-cell">{o.metrics.users}</td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded", o.plan === "Enterprise" ? "bg-secondary/10 text-secondary" : "bg-accent/10 text-accent")}>
                        {o.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center"><StatusBadge status={o.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
