import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
  Mail,
  MapPin,
  MoreVertical,
  Search,
  Settings,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { organizationsService, Organization, OrganizationMember, MemberStatus } from "@/lib/organizations";

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const memberStatusBadge = (status: MemberStatus) => {
  if (status === "active") return <Badge className="rounded-2xl font-black text-[10px] uppercase tracking-widest bg-success/15 text-success border border-success/20">Active</Badge>;
  if (status === "invited") return <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">Invited</Badge>;
  return <Badge className="rounded-2xl font-black text-[10px] uppercase tracking-widest bg-destructive/10 text-destructive border border-destructive/20">Suspended</Badge>;
};

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const initialTab = useMemo(() => {
    const tab = params.get("tab");
    if (tab === "members" || tab === "metadata" || tab === "overview") return tab;
    return "overview";
  }, [params]);

  const [activeTab, setActiveTab] = useState<"overview" | "members" | "metadata">(initialTab);
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<OrganizationMember["role"] | "all">("all");

  const orgQuery = useQuery({
    queryKey: ["organizations", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      return organizationsService.getById(id);
    },
    enabled: !!id,
    retry: false,
    staleTime: 15000,
  });

  const org = orgQuery.data;

  const filteredMembers = useMemo(() => {
    if (!org) return [];
    const s = memberSearch.trim().toLowerCase();
    return org.members.filter((m) => {
      const matchSearch = !s || m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s) || m.role.toLowerCase().includes(s);
      const matchRole = roleFilter === "all" || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [memberSearch, org, roleFilter]);

  if (!id) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        <div className="bg-card rounded-3xl border p-8 text-center">
          <div className="text-xl font-black">Organization ID is missing</div>
          <div className="text-sm text-muted-foreground mt-2">Please open the detail page from the Organizations list.</div>
          <div className="mt-6">
            <Link to="/organizations" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-2xl px-5 font-black bg-secondary text-white">
              Back to organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orgQuery.isLoading) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64 rounded" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
        </div>
        <Skeleton className="h-[220px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[520px] w-full rounded-3xl" />
      </div>
    );
  }

  if (orgQuery.isError) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-8 text-center" role="alert" aria-label="Failed to load organization">
          <div className="text-xl font-black text-destructive">Failed to load organization</div>
          <div className="text-sm text-muted-foreground mt-2">Please try again.</div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button className="h-11 rounded-2xl font-black bg-secondary hover:bg-secondary/90 text-white" onClick={() => orgQuery.refetch()}>
              Retry
            </Button>
            <Button variant="outline" className="h-11 rounded-2xl font-bold" asChild>
              <Link to="/organizations">Back</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
        <div className="bg-card rounded-3xl border p-8 text-center" role="alert" aria-label="Organization not found">
          <div className="text-xl font-black">Organization not found</div>
          <div className="text-sm text-muted-foreground mt-2">The organization ID is invalid or the record no longer exists.</div>
          <div className="mt-6">
            <Link to="/organizations" className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-2xl px-5 font-black bg-secondary text-white">
              Back to organizations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/organizations">
            <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl hover:bg-muted transition-colors" aria-label="Back to organizations">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Organization Detail</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/organizations" className="hover:text-secondary transition-colors">Organizations</Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-foreground">{org.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2 hidden sm:inline-flex" asChild>
            <a href={org.metadata.website} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 text-secondary" aria-hidden="true" /> Website
            </a>
          </Button>
          <Button className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20">
            <Settings className="h-4 w-4" aria-hidden="true" /> Manage
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-11 w-11 rounded-2xl" aria-label="Organization actions">
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[210px]">
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">Invite member</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Edit profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Manage subscription</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">Deactivate organization</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/60 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative bg-gradient-primary rounded-3xl p-6 sm:p-8 text-primary-foreground overflow-hidden border border-sidebar-border">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 className="h-64 w-64 -rotate-12" aria-hidden="true" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-3xl bg-primary-foreground/10 border border-white/10 flex items-center justify-center text-lg sm:text-2xl font-black">
                {org.shortName}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-2xl sm:text-3xl font-black tracking-tight">{org.name}</div>
                  <StatusBadge status={org.status} />
                  <Badge variant="outline" className="border-white/20 text-white/80 font-black text-[10px] uppercase tracking-widest">
                    {org.plan} Plan
                  </Badge>
                </div>
                <p className="text-sm text-white/75 max-w-3xl leading-relaxed">{org.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/70">
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4" aria-hidden="true" /> {org.location.city}, {org.location.country}</span>
                  <span className="flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" /> Since {org.foundedYear}</span>
                  <span className="flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" /> {org.metrics.users} members</span>
                  <span className="flex items-center gap-2"><Mail className="h-4 w-4" aria-hidden="true" /> {org.metadata.contactEmail}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-[520px]">
              {[
                { label: "Tournaments", value: org.metrics.activeTournaments, icon: Trophy },
                { label: "Teams", value: org.metrics.totalTeams, icon: Shield },
                { label: "Players", value: org.metrics.totalPlayers, icon: Users },
                { label: "MRR", value: `$${org.metrics.monthlyRevenueUsd}/mo`, icon: Settings },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/70">{s.label}</div>
                    <s.icon className="h-4 w-4 text-white/70" aria-hidden="true" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black tabular-nums mt-1">{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tournaments" value={org.metrics.activeTournaments} icon={Trophy} />
        <StatCard title="Total Teams" value={org.metrics.totalTeams} icon={Users} />
        <StatCard title="Total Players" value={org.metrics.totalPlayers} icon={Users} />
        <StatCard title="Subscription" value={`${org.plan}`} icon={Settings} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="rounded-2xl h-12 w-full md:w-auto overflow-x-auto justify-start [-webkit-overflow-scrolling:touch]">
            <TabsTrigger value="overview" className="rounded-xl font-black text-xs uppercase tracking-widest min-w-[140px] h-11">Overview</TabsTrigger>
            <TabsTrigger value="members" className="rounded-xl font-black text-xs uppercase tracking-widest min-w-[140px] h-11">Members</TabsTrigger>
            <TabsTrigger value="metadata" className="rounded-xl font-black text-xs uppercase tracking-widest min-w-[140px] h-11">Metadata</TabsTrigger>
          </TabsList>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <TabsContent key="overview" value="overview" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-3xl border overflow-hidden">
                    <div className="px-6 py-4 border-b bg-muted/30">
                      <h2 className="text-lg font-black tracking-tight">Active Tournaments</h2>
                      <p className="text-sm text-muted-foreground">Current competitions managed by this organization.</p>
                    </div>
                    <div className="divide-y">
                      {org.tournaments.map((t) => (
                        <div key={t.id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors">
                          <div className="min-w-0">
                            <div className="text-sm font-black truncate">{t.name}</div>
                            <div className="text-xs text-muted-foreground font-bold">{t.teams} teams</div>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-3xl border overflow-hidden">
                    <div className="px-6 py-4 border-b bg-muted/30">
                      <h2 className="text-lg font-black tracking-tight">Highlights</h2>
                      <p className="text-sm text-muted-foreground">Key organization metadata at a glance.</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: "Region", value: org.metadata.region },
                        { label: "Timezone", value: org.metadata.timezone },
                        { label: "Created", value: fmtDate(org.metadata.createdISO) },
                        { label: "Last Billing", value: fmtDate(org.metadata.lastBillingISO) },
                      ].map((item) => (
                        <div key={item.label} className="rounded-2xl border bg-muted/20 p-4">
                          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</div>
                          <div className="text-sm font-black mt-1">{item.value}</div>
                        </div>
                      ))}
                      <div className="rounded-2xl border bg-muted/20 p-4 sm:col-span-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Website</div>
                        <a className="text-sm font-black mt-1 inline-flex items-center gap-2 text-secondary hover:underline break-all" href={org.metadata.website} target="_blank" rel="noreferrer">
                          {org.metadata.website} <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ) : null}

          {activeTab === "members" ? (
            <TabsContent key="members" value="members" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <div className="bg-card rounded-3xl border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-black tracking-tight">Members</h2>
                        <p className="text-sm text-muted-foreground">Search, filter, and review organization access.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button className="h-11 rounded-2xl font-black bg-secondary hover:bg-secondary/90 text-white">Invite</Button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="relative md:col-span-2">
                        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <label htmlFor="org-member-search" className="sr-only">
                          Search members
                        </label>
                        <Input
                          id="org-member-search"
                          value={memberSearch}
                          onChange={(e) => setMemberSearch(e.target.value)}
                          placeholder="Search members by name, email, role…"
                          className="h-12 rounded-2xl pl-11 font-medium"
                          aria-label="Search members"
                        />
                      </div>
                      <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as OrganizationMember["role"] | "all")}>
                        <SelectTrigger className="h-12 rounded-2xl font-bold" aria-label="Filter by role">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                          <SelectItem value="Coordinator">Coordinator</SelectItem>
                          <SelectItem value="Referee Manager">Referee Manager</SelectItem>
                          <SelectItem value="Analyst">Analyst</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 sm:hidden space-y-3" aria-label="Members list">
                    {filteredMembers.map((m) => (
                      <div key={m.id} className="rounded-2xl border bg-background/60 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-xs font-black shrink-0">
                              {initials(m.name)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-black truncate">{m.name}</div>
                              <div className="text-xs text-muted-foreground font-bold truncate">{m.email}</div>
                              <div className="mt-2 flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{m.role}</Badge>
                                {memberStatusBadge(m.status)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right text-xs font-bold text-muted-foreground shrink-0">
                            <div>Last active</div>
                            <div className="text-foreground">{fmtDate(m.lastActiveISO)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredMembers.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-8">No members match the current filters.</div>
                    ) : null}
                  </div>

                  <div className="hidden sm:block">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[920px]" aria-label="Organization members table">
                        <thead className="border-b bg-muted/40">
                          <tr>
                            <th className="px-6 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Member</th>
                            <th className="px-6 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Role</th>
                            <th className="px-6 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                            <th className="px-6 py-3 text-left text-[11px] font-black uppercase tracking-widest text-muted-foreground">Last Active</th>
                            <th className="px-6 py-3 text-right text-[11px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.map((m) => (
                            <tr key={m.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-xs font-black shrink-0">
                                    {initials(m.name)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-black truncate">{m.name}</div>
                                    <div className="text-xs text-muted-foreground font-bold truncate">{m.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Badge variant="outline" className="rounded-2xl font-black text-[10px] uppercase tracking-widest">{m.role}</Badge>
                              </td>
                              <td className="px-6 py-4">{memberStatusBadge(m.status)}</td>
                              <td className="px-6 py-4 text-sm font-bold text-muted-foreground">{fmtDate(m.lastActiveISO)}</td>
                              <td className="px-6 py-4 text-right">
                                <Button variant="outline" className="h-10 rounded-2xl font-bold">Manage</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredMembers.length === 0 ? (
                      <div className="text-center text-sm text-muted-foreground py-10">No members match the current filters.</div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ) : null}

          {activeTab === "metadata" ? (
            <TabsContent key="metadata" value="metadata" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
                <div className="bg-card rounded-3xl border overflow-hidden">
                  <div className="px-6 py-4 border-b bg-muted/30">
                    <h2 className="text-lg font-black tracking-tight">Organization Metadata</h2>
                    <p className="text-sm text-muted-foreground">Operational and billing context for admins.</p>
                  </div>
                  <div className="p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" aria-label="Organization metadata">
                      {[
                        { k: "Organization ID", v: org.id },
                        { k: "Plan", v: org.plan },
                        { k: "Status", v: org.status },
                        { k: "Region", v: org.metadata.region },
                        { k: "Timezone", v: org.metadata.timezone },
                        { k: "Created", v: fmtDate(org.metadata.createdISO) },
                        { k: "Last billing", v: fmtDate(org.metadata.lastBillingISO) },
                        { k: "Website", v: org.metadata.website },
                        { k: "Contact email", v: org.metadata.contactEmail },
                      ].map((item) => (
                        <div key={item.k} className="rounded-2xl border bg-muted/20 p-4">
                          <dt className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.k}</dt>
                          <dd className={cn("text-sm font-black mt-1 break-words", item.k === "Website" && "text-secondary")}>{item.v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ) : null}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
