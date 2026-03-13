import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ChevronRight, Clock, MapPin, RefreshCw } from "lucide-react";
import { addDays, addMinutes, format, startOfDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import { toast } from "sonner";
import { VenueMap } from "@/components/venues/VenueMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { BookingStatus, Venue, VenueBooking, detectBookingConflict, venueService } from "@/lib/venues";

const statusColor: Record<BookingStatus, string> = {
  available: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  booked: "bg-destructive/10 text-destructive border-destructive/20",
};

const toTimeLabel = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone }).format(d);

const dayKey = (d: Date) => `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;

const bookingsForDay = (bookings: VenueBooking[], day: Date) => {
  const start = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 0, 0, 0)).getTime();
  const end = start + 24 * 60 * 60 * 1000;
  return bookings.filter((b) => {
    const s = new Date(b.startISO).getTime();
    return s >= start && s < end;
  });
};

const buildSlots = (day: Date, startHour = 8, endHour = 22, stepMin = 30) => {
  const base = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), startHour, 0, 0));
  const slots: { start: Date; end: Date }[] = [];
  const totalMinutes = (endHour - startHour) * 60;
  for (let m = 0; m < totalMinutes; m += stepMin) {
    const start = addMinutes(base, m);
    const end = addMinutes(start, stepMin);
    slots.push({ start, end });
  }
  return slots;
};

export default function VenueSchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const [timeZone, setTimeZone] = useState<string>(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [selectedSlot, setSelectedSlot] = useState<{ startISO: string; endISO: string } | null>(null);
  const [requester, setRequester] = useState("Scheduler User");
  const [requestNotes, setRequestNotes] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const v = await venueService.getById(id);
      if (!v) {
        toast.error("Venue not found");
        navigate("/venues");
        return;
      }
      setVenue(v);
      setTimeZone(v.location.timezone || timeZone);
      venueService.seedBookings(v.id);
      const b = await venueService.listBookings(v.id);
      setBookings(b);
    } catch (e) {
      setError("Unable to load venue schedule.");
      toast.error("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, [id, navigate, timeZone]);

  useEffect(() => {
    load();
  }, [load]);

  const dayBookings = useMemo(() => bookingsForDay(bookings, selectedDay), [bookings, selectedDay]);

  const modifiers = useMemo(() => {
    const booked: Date[] = [];
    const pending: Date[] = [];
    const byDay = new Map<string, { booked: boolean; pending: boolean }>();
    for (const b of bookings) {
      const k = dayKey(new Date(b.startISO));
      const cur = byDay.get(k) ?? { booked: false, pending: false };
      if (b.status === "booked") cur.booked = true;
      if (b.status === "pending") cur.pending = true;
      byDay.set(k, cur);
    }
    for (const [k, v] of byDay.entries()) {
      const [y, m, d] = k.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m, d));
      if (v.booked) booked.push(dt);
      else if (v.pending) pending.push(dt);
    }
    return { booked, pending };
  }, [bookings]);

  const slots = useMemo(() => buildSlots(selectedDay), [selectedDay]);

  const slotStatus = useCallback(
    (slot: { start: Date; end: Date }) => {
      const candidate = { startISO: slot.start.toISOString(), endISO: slot.end.toISOString() };
      const conflict = detectBookingConflict(dayBookings, candidate);
      if (!conflict) return "available" as const;
      const overlapped = dayBookings.find((b) => {
        const bs = new Date(b.startISO).getTime();
        const be = new Date(b.endISO).getTime();
        const cs = new Date(candidate.startISO).getTime();
        const ce = new Date(candidate.endISO).getTime();
        return Math.max(bs, cs) < Math.min(be, ce);
      });
      return overlapped?.status ?? "booked";
    },
    [dayBookings]
  );

  const requestBooking = async () => {
    if (!venue || !selectedSlot) return;
    try {
      await venueService.requestBooking({
        venueId: venue.id,
        status: "pending",
        startISO: selectedSlot.startISO,
        endISO: selectedSlot.endISO,
        requesterName: requester,
        notes: requestNotes,
      });
      toast.success("Booking request submitted", { description: "Status: Pending" });
      setSelectedSlot(null);
      setRequestNotes("");
      const b = await venueService.listBookings(venue.id);
      setBookings(b);
    } catch (e) {
      toast.error("Unable to request booking", { description: (e as Error).message });
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-56 rounded-xl" />
        <Skeleton className="h-[220px] w-full rounded-3xl" />
        <Skeleton className="h-[640px] w-full rounded-3xl" />
      </div>
    );
  }

  if (!venue) return null;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-3">
          <Link to={`/venues/${venue.id}`}>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight">Venue Schedule</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/venues" className="hover:text-secondary transition-colors">Venues</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/venues/${venue.id}`} className="hover:text-secondary transition-colors">{venue.name}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">Schedule</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 rounded-2xl font-bold gap-2" onClick={load}>
            <RefreshCw className="h-4 w-4 text-secondary" /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/5 border border-destructive/10 rounded-3xl p-10 text-center" role="alert">
          <div className="text-lg font-black text-destructive">Unable to load schedule</div>
          <div className="text-sm text-muted-foreground mt-2">{error}</div>
          <Button className="mt-6 h-11 rounded-2xl font-black" onClick={load}>
            Try again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Venue</div>
                <div className="text-xl font-black tracking-tight">{venue.name}</div>
                <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary" /> {venue.location.city} · {venue.location.timezone}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="font-black text-[10px] uppercase tracking-widest bg-success/10 text-success border border-success/20">Available</Badge>
                <Badge className="font-black text-[10px] uppercase tracking-widest bg-warning/10 text-warning border border-warning/20">Pending</Badge>
                <Badge className="font-black text-[10px] uppercase tracking-widest bg-destructive/10 text-destructive border border-destructive/20">Booked</Badge>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight">Availability</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {format(selectedDay, "PPP")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeZone} onValueChange={setTimeZone}>
                  <SelectTrigger className="h-11 rounded-2xl font-bold">
                    <SelectValue placeholder="Time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={venue.location.timezone}>Venue ({venue.location.timezone})</SelectItem>
                    <SelectItem value={Intl.DateTimeFormat().resolvedOptions().timeZone}>Local ({Intl.DateTimeFormat().resolvedOptions().timeZone})</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="day">
              <TabsList className="rounded-2xl h-12">
                <TabsTrigger value="day" className="rounded-xl font-black text-xs uppercase tracking-widest">Day</TabsTrigger>
                <TabsTrigger value="week" className="rounded-xl font-black text-xs uppercase tracking-widest">Week</TabsTrigger>
                <TabsTrigger value="month" className="rounded-xl font-black text-xs uppercase tracking-widest">Month</TabsTrigger>
              </TabsList>

              <TabsContent value="day" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5">
                    <DayPicker
                      mode="single"
                      selected={selectedDay}
                      onSelect={(d) => d && setSelectedDay(d)}
                      modifiers={modifiers}
                      modifiersClassNames={{
                        booked: "bg-destructive/10 text-destructive font-black",
                        pending: "bg-warning/10 text-warning font-black",
                      }}
                    />
                  </div>
                  <div className="lg:col-span-7">
                    <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                      {slots.map((s) => {
                        const status = slotStatus(s);
                        const selected = selectedSlot?.startISO === s.start.toISOString();
                        return (
                          <button
                            key={s.start.toISOString()}
                            onClick={() => {
                              if (status !== "available") return;
                              setSelectedSlot({ startISO: s.start.toISOString(), endISO: s.end.toISOString() });
                            }}
                            className={cn(
                              "w-full text-left p-4 rounded-2xl border transition-colors",
                              statusColor[status],
                              status !== "available" && "opacity-70 cursor-not-allowed",
                              selected && "ring-2 ring-ring"
                            )}
                            aria-label={`Time slot ${toTimeLabel(s.start, timeZone)} to ${toTimeLabel(s.end, timeZone)} is ${status}`}
                            disabled={status !== "available"}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 font-black">
                                <Clock className="h-4 w-4" />
                                {toTimeLabel(s.start, timeZone)} – {toTimeLabel(s.end, timeZone)}
                              </div>
                              <Badge className={cn("text-[10px] font-black uppercase tracking-widest border", statusColor[status])}>
                                {status}
                              </Badge>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="week" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const d = addDays(startOfDay(selectedDay), i);
                    const dayB = bookingsForDay(bookings, d);
                    const booked = dayB.some((b) => b.status === "booked");
                    const pending = dayB.some((b) => b.status === "pending");
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedDay(d)}
                        className={cn(
                          "p-4 rounded-3xl border text-left transition-colors",
                          booked ? "bg-destructive/5 border-destructive/10" : pending ? "bg-warning/5 border-warning/10" : "bg-muted/20 border-muted",
                          dayKey(d) === dayKey(selectedDay) && "ring-2 ring-ring"
                        )}
                        aria-label={`Select ${format(d, "EEEE, MMM d")}`}
                      >
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{format(d, "EEE")}</div>
                        <div className="text-xl font-black mt-1">{format(d, "d")}</div>
                        <div className="text-xs font-bold text-muted-foreground mt-2">{dayB.length} bookings</div>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="month" className="mt-6">
                <DayPicker
                  mode="single"
                  selected={selectedDay}
                  onSelect={(d) => d && setSelectedDay(d)}
                  modifiers={modifiers}
                  modifiersClassNames={{
                    booked: "bg-destructive/10 text-destructive font-black",
                    pending: "bg-warning/10 text-warning font-black",
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-card rounded-3xl border p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <div className="text-xl font-black tracking-tight">Request Booking</div>
                <div className="text-sm text-muted-foreground font-medium">Select an available time slot to submit a request.</div>
              </div>
              {selectedSlot && (
                <Badge variant="secondary" className="font-black text-[10px] uppercase tracking-widest">
                  {toTimeLabel(new Date(selectedSlot.startISO), timeZone)} – {toTimeLabel(new Date(selectedSlot.endISO), timeZone)}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={requester}
                onChange={(e) => setRequester(e.target.value)}
                className="h-12 rounded-2xl border bg-background px-4 text-sm font-bold outline-none focus:border-secondary"
                aria-label="Requester name"
                placeholder="Requester name"
              />
              <input
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                className="h-12 rounded-2xl border bg-background px-4 text-sm font-bold outline-none focus:border-secondary md:col-span-2"
                aria-label="Booking notes"
                placeholder="Notes (optional)"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                className="h-11 rounded-2xl font-black"
                onClick={() => setSelectedSlot(null)}
                disabled={!selectedSlot}
              >
                Clear
              </Button>
              <Button
                className="h-11 rounded-2xl font-black bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20"
                onClick={requestBooking}
                disabled={!selectedSlot}
              >
                Submit Request
              </Button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className="bg-card rounded-3xl border p-5 shadow-sm">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Map</div>
            <div className="text-lg font-black tracking-tight">Directions & Nearby</div>
          </div>
          <VenueMap venues={[venue]} selectedVenueId={venue.id} center={{ lat: venue.location.lat, lng: venue.location.lng }} heightPx={520} />
          <div className="bg-card rounded-3xl border p-6 shadow-sm">
            <div className="text-sm font-black">Today</div>
            <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
              {dayBookings.length} bookings on {format(selectedDay, "PPP")}
            </div>
            <div className="mt-4 space-y-2">
              {dayBookings.length === 0 ? (
                <div className="text-sm text-muted-foreground font-medium">No bookings on this day.</div>
              ) : (
                dayBookings.map((b) => (
                  <div key={b.id} className={cn("p-4 rounded-2xl border", statusColor[b.status])}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-black">
                        {toTimeLabel(new Date(b.startISO), timeZone)} – {toTimeLabel(new Date(b.endISO), timeZone)}
                      </div>
                      <Badge className={cn("text-[10px] font-black uppercase tracking-widest border", statusColor[b.status])}>{b.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">{b.requesterName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

