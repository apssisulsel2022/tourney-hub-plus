import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Venue, VenueListFilters, venueService } from "@/lib/venues";
import { VenueCard } from "@/components/venues/VenueCard";
import { VenueMap } from "@/components/venues/VenueMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const defaultFilters: VenueListFilters = {
  search: "",
  city: "all",
  type: "all",
  amenities: [],
  capacityMin: undefined,
  capacityMax: undefined,
  sort: "alphabetical",
};

export default function VenuesPage() {
  const geo = useGeolocation();
  const [filters, setFilters] = useState<VenueListFilters>(defaultFilters);
  const [page, setPage] = useState(1);
  const limit = 12;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ items: Venue[]; total: number; totalPages: number; page: number }>({
    items: [],
    total: 0,
    totalPages: 1,
    page: 1,
  });

  const cities = useMemo(() => venueService.listCities(), []);
  const types = useMemo(() => venueService.listVenueTypes(), []);
  const amenities = useMemo(() => venueService.listAmenities(), []);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await venueService.list({ page, limit, filters, userPos: geo.position });
      setData(res);
    } catch (e) {
      setError("Unable to load venues.");
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  }, [filters, geo.position, page]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const toggleAmenity = (id: string) => {
    setFilters((p) => {
      const has = p.amenities.includes(id);
      return { ...p, amenities: has ? p.amenities.filter((x) => x !== id) : [...p.amenities, id] };
    });
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.city !== "all" ? 1 : 0) +
    (filters.type !== "all" ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (typeof filters.capacityMin === "number" ? 1 : 0) +
    (typeof filters.capacityMax === "number" ? 1 : 0);

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-black tracking-tight">Venue Management</h1>
          <p className="text-muted-foreground">Search and manage venues, maps, and availability</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" onClick={fetchVenues} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Refresh
          </Button>
          {geo.error && (
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
              Location disabled
            </Badge>
          )}
        </div>
      </div>

      <div className="bg-card rounded-3xl border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <SlidersHorizontal className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Search & Filters</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{data.total} venues</p>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              className="h-10 rounded-2xl font-black text-xs uppercase tracking-widest text-destructive hover:bg-destructive/10"
              onClick={clearFilters}
            >
              Reset ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.search}
              onChange={(e) => {
                setFilters((p) => ({ ...p, search: e.target.value }));
                setPage(1);
              }}
              placeholder="Search by name, city, address…"
              aria-label="Search venues"
              className="h-12 w-full rounded-2xl border bg-background pl-11 pr-4 text-sm font-medium outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
            />
          </div>

          <div className="lg:col-span-2">
            <Select
              value={filters.city}
              onValueChange={(v) => {
                setFilters((p) => ({ ...p, city: v as VenueListFilters["city"] }));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-12 rounded-2xl font-bold">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <Select
              value={filters.type}
              onValueChange={(v) => {
                setFilters((p) => ({ ...p, type: v as VenueListFilters["type"] }));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-12 rounded-2xl font-bold">
                <SelectValue placeholder="Venue Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="lg:col-span-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-12 w-full rounded-2xl font-bold justify-between">
                  Amenities
                  <Badge variant="secondary" className="ml-2 text-[10px] font-black uppercase tracking-widest">
                    {filters.amenities.length}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[240px] rounded-2xl p-2">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">
                  Select amenities
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {amenities.map((a) => (
                  <DropdownMenuCheckboxItem
                    key={a.id}
                    checked={filters.amenities.includes(a.id)}
                    onCheckedChange={() => toggleAmenity(a.id)}
                    className="rounded-xl font-bold text-sm px-3 py-2.5"
                  >
                    {a.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="lg:col-span-2">
            <Select
              value={filters.sort}
              onValueChange={(v) => {
                setFilters((p) => ({ ...p, sort: v as VenueListFilters["sort"] }));
                setPage(1);
              }}
            >
              <SelectTrigger className="h-12 rounded-2xl font-bold">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="capacity">Capacity</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-muted/20 rounded-2xl border p-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Capacity Min</p>
            <input
              type="number"
              value={filters.capacityMin ?? ""}
              onChange={(e) => {
                const v = e.target.value === "" ? undefined : Number(e.target.value);
                setFilters((p) => ({ ...p, capacityMin: Number.isFinite(v as number) ? v : undefined }));
                setPage(1);
              }}
              className="h-11 w-full rounded-2xl border bg-background px-4 text-sm font-bold outline-none focus:border-secondary"
              placeholder="e.g. 10000"
              aria-label="Capacity minimum"
            />
          </div>
          <div className="bg-muted/20 rounded-2xl border p-4">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Capacity Max</p>
            <input
              type="number"
              value={filters.capacityMax ?? ""}
              onChange={(e) => {
                const v = e.target.value === "" ? undefined : Number(e.target.value);
                setFilters((p) => ({ ...p, capacityMax: Number.isFinite(v as number) ? v : undefined }));
                setPage(1);
              }}
              className="h-11 w-full rounded-2xl border bg-background px-4 text-sm font-bold outline-none focus:border-secondary"
              placeholder="e.g. 50000"
              aria-label="Capacity maximum"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[320px] rounded-3xl" />
            ))}
          </div>
          <div className="xl:col-span-5">
            <Skeleton className="h-[520px] rounded-3xl" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-10 text-center" role="alert">
          <div className="text-lg font-black text-destructive">Unable to load venues</div>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button className="mt-6 h-11 rounded-2xl font-black" onClick={fetchVenues}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 space-y-6">
            {data.items.length === 0 ? (
              <div className="bg-card rounded-3xl border border-dashed p-12 text-center">
                <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-7 w-7 text-muted-foreground/40" />
                </div>
                <div className="text-xl font-black">No venues found</div>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search, capacity range, or amenities.</p>
                <Button variant="outline" className="mt-6 h-11 rounded-2xl font-black" onClick={clearFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.items.map((v) => (
                  <VenueCard key={v.id} venue={v} userPosition={geo.position} />
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Page <span className="text-foreground">{data.page}</span> / <span className="text-foreground">{data.totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl font-bold gap-2"
                  disabled={data.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl font-bold gap-2"
                  disabled={data.page >= data.totalPages}
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="xl:col-span-5 space-y-3">
            <div className="bg-card rounded-3xl border p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Map</div>
                  <div className="text-lg font-black tracking-tight">Venue Locations</div>
                </div>
                {filters.sort === "distance" && !geo.position && (
                  <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">
                    Enable location
                  </Badge>
                )}
              </div>
            </div>
            <VenueMap venues={data.items} userPosition={geo.position} heightPx={520} />
          </div>
        </div>
      )}
    </div>
  );
}
