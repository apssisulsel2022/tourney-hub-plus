import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, MapPin, Users, Ruler, Phone, Mail, Globe, CalendarDays, Share2, Navigation, Camera } from "lucide-react";
import { venueService, Venue, VenueBooking, formatVenueType } from "@/lib/venues";
import { VenueMap } from "@/components/venues/VenueMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DayPicker } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const bookingDayKey = (iso: string) => {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
};

export default function VenueProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<VenueBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const v = await venueService.getById(id);
        if (!v) {
          toast.error("Venue not found");
          navigate("/venues");
          return;
        }
        setVenue(v);
        venueService.seedBookings(v.id);
        const b = await venueService.listBookings(v.id);
        setBookings(b);
      } catch (e) {
        toast.error("Failed to load venue profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const bookedDays = useMemo(() => {
    const days = new Map<string, { booked: boolean; pending: boolean }>();
    for (const b of bookings) {
      const k = bookingDayKey(b.startISO);
      const cur = days.get(k) ?? { booked: false, pending: false };
      if (b.status === "booked") cur.booked = true;
      if (b.status === "pending") cur.pending = true;
      days.set(k, cur);
    }
    return days;
  }, [bookings]);

  const modifiers = useMemo(() => {
    const booked: Date[] = [];
    const pending: Date[] = [];
    for (const [k, v] of bookedDays.entries()) {
      const [y, m, d] = k.split("-").map(Number);
      const dt = new Date(Date.UTC(y, m, d));
      if (v.booked) booked.push(dt);
      else if (v.pending) pending.push(dt);
    }
    return { booked, pending };
  }, [bookedDays]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-52 rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Skeleton className="h-[520px] rounded-3xl" />
          <Skeleton className="h-[520px] rounded-3xl" />
          <Skeleton className="h-[520px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!venue) return null;

  const mainImage = venue.images[selectedImage] ?? venue.images[0];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-3">
          <Link to="/venues">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-3xl font-black tracking-tight">Venue Profile</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Link to="/venues" className="hover:text-secondary transition-colors">Venues</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{venue.name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-11 rounded-2xl font-bold gap-2"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }}
          >
            <Share2 className="h-4 w-4 text-secondary" /> Share
          </Button>
          <Button className="h-11 rounded-2xl font-black gap-2 bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/20" asChild>
            <Link to={`/venues/${venue.id}/schedule`}>
              <CalendarDays className="h-4 w-4" /> Book Now
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-4">
          <div className="bg-card rounded-3xl border overflow-hidden shadow-sm">
            <div className="relative h-[320px] bg-muted">
              {mainImage ? (
                <img src={mainImage.url} alt={mainImage.alt} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-muted-foreground font-black">
                  {venue.name}
                </div>
              )}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge className="font-black text-[10px] uppercase tracking-widest bg-background/80 text-foreground border border-muted-foreground/10">
                  {formatVenueType(venue.type)}
                </Badge>
                <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-background/80 border border-muted-foreground/10">
                  {venue.capacity.toLocaleString()} capacity
                </Badge>
              </div>
            </div>

            <div className="p-5 border-t">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-2xl font-black tracking-tight truncate" title={venue.name}>{venue.name}</h2>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 truncate" title={`${venue.location.address}`}>
                    <MapPin className="h-4 w-4 text-secondary" />
                    {venue.location.address}, {venue.location.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.location.lat},${venue.location.lng}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-xs font-black uppercase tracking-widest border bg-background hover:bg-muted transition-colors"
                  >
                    <Navigation className="h-4 w-4 text-secondary mr-2" /> Directions
                  </a>
                  <a
                    href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(`${venue.location.lat},${venue.location.lng}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center rounded-2xl px-4 text-xs font-black uppercase tracking-widest border bg-background hover:bg-muted transition-colors"
                  >
                    <Camera className="h-4 w-4 text-secondary mr-2" /> Street View
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-xl font-black flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" /> {venue.capacity.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 border border-muted/50">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Dimensions</p>
                  <p className="text-xl font-black flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-secondary" /> {venue.dimensionsMeters.length}×{venue.dimensionsMeters.width}m
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/10 border border-secondary/20">
                  <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Pricing</p>
                  <p className="text-xl font-black text-secondary">{venue.pricing.currency} {venue.pricing.hourly}/hr</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{venue.pricing.currency} {venue.pricing.daily}/day</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2 overflow-x-auto">
                {venue.images.map((img, idx) => (
                  <button
                    key={img.url}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "h-20 w-28 rounded-2xl overflow-hidden border shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      selectedImage === idx ? "border-secondary" : "border-muted-foreground/20"
                    )}
                    aria-label={`Select image ${idx + 1}`}
                  >
                    <img src={img.url} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl border p-6 shadow-sm">
            <Tabs defaultValue="about">
              <TabsList className="rounded-2xl h-12">
                <TabsTrigger value="about" className="rounded-xl font-black text-xs uppercase tracking-widest">About</TabsTrigger>
                <TabsTrigger value="specs" className="rounded-xl font-black text-xs uppercase tracking-widest">Specs</TabsTrigger>
                <TabsTrigger value="contact" className="rounded-xl font-black text-xs uppercase tracking-widest">Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <h3 className="text-xl font-black tracking-tight mb-3">Venue Description</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{venue.description}</p>
                <div className="mt-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {venue.amenities.map((a) => (
                      <Badge key={a.id} variant="outline" className="text-[10px] font-black uppercase tracking-widest border-muted-foreground/20">
                        {a.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/20 rounded-3xl border p-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Facilities</h4>
                    <div className="space-y-2">
                      {venue.facilities.map((f) => (
                        <div key={f} className="text-sm font-bold flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-secondary" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-3xl border p-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Pricing Notes</h4>
                    <p className="text-sm text-muted-foreground font-medium">{venue.pricing.notes}</p>
                    <div className="mt-4 text-sm font-black">
                      Hourly: <span className="text-secondary">{venue.pricing.currency} {venue.pricing.hourly}</span>
                    </div>
                    <div className="text-sm font-black">
                      Daily: <span className="text-secondary">{venue.pricing.currency} {venue.pricing.daily}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/20 rounded-3xl border p-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Contact</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 font-bold">
                        <Phone className="h-4 w-4 text-secondary" /> {venue.contact.phone}
                      </div>
                      <div className="flex items-center gap-2 font-bold">
                        <Mail className="h-4 w-4 text-secondary" /> {venue.contact.email}
                      </div>
                      {venue.contact.website && (
                        <div className="flex items-center gap-2 font-bold">
                          <Globe className="h-4 w-4 text-secondary" />
                          <a href={venue.contact.website} target="_blank" rel="noreferrer" className="hover:underline">
                            {venue.contact.website}
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <Button className="h-11 rounded-2xl font-black bg-secondary hover:bg-secondary/90 text-white" asChild>
                        <Link to={`/venues/${venue.id}/schedule`}>Book Now</Link>
                      </Button>
                      <Button variant="outline" className="h-11 rounded-2xl font-black">
                        Contact Venue
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/20 rounded-3xl border p-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Availability (Month)</h4>
                    <DayPicker
                      mode="single"
                      modifiers={modifiers}
                      modifiersClassNames={{
                        booked: "bg-destructive/10 text-destructive font-black",
                        pending: "bg-warning/10 text-warning font-black",
                      }}
                    />
                    <div className="mt-3 text-xs text-muted-foreground font-bold space-y-1">
                      <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-destructive/30" /> Booked</div>
                      <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm bg-warning/30" /> Pending</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <div className="bg-card rounded-3xl border p-5 shadow-sm">
            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Map</div>
            <div className="text-lg font-black tracking-tight">Location</div>
          </div>
          <VenueMap venues={[venue]} selectedVenueId={venue.id} center={{ lat: venue.location.lat, lng: venue.location.lng }} heightPx={540} />
        </div>
      </div>
    </div>
  );
}

