/**
 * Venues domain model + mock service layer.
 *
 * Responsibilities:
 * - Listing/filter/sort/pagination helpers for venues
 * - Booking model + conflict detection
 * - Demo dataset seed and in-memory storage
 *
 * UI entry points:
 * - VenuesPage, VenueProfilePage, VenueSchedulePage
 * - VenueMap component
 */
export type VenueType = "stadium" | "arena" | "training_ground" | "indoor" | "community_field";

export type BookingStatus = "available" | "pending" | "booked";

export interface VenueAmenity {
  id: string;
  label: string;
}

export interface VenueContact {
  name: string;
  email: string;
  phone: string;
  website?: string;
}

export interface VenuePricing {
  currency: string;
  hourly: number;
  daily: number;
  notes: string;
}

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  location: {
    city: string;
    country: string;
    address: string;
    lat: number;
    lng: number;
    timezone: string;
  };
  capacity: number;
  dimensionsMeters: { length: number; width: number };
  facilities: string[];
  amenities: VenueAmenity[];
  description: string;
  images: { url: string; alt: string }[];
  contact: VenueContact;
  pricing: VenuePricing;
}

export interface VenueBooking {
  id: string;
  venueId: string;
  status: BookingStatus;
  startISO: string;
  endISO: string;
  requesterName: string;
  notes: string;
  createdAt: string;
}

export type VenueSort = "alphabetical" | "capacity" | "distance";

export interface VenueListFilters {
  search: string;
  city: string | "all";
  type: VenueType | "all";
  amenities: string[];
  capacityMin?: number;
  capacityMax?: number;
  sort: VenueSort;
}

export const venueAmenities: VenueAmenity[] = [
  { id: "parking", label: "Parking" },
  { id: "locker_rooms", label: "Locker Rooms" },
  { id: "floodlights", label: "Floodlights" },
  { id: "wifi", label: "Wi‑Fi" },
  { id: "medical", label: "Medical Room" },
  { id: "vip", label: "VIP Lounge" },
  { id: "press", label: "Press Area" },
  { id: "canteen", label: "Canteen" },
];

const cities = [
  { city: "New York", country: "USA", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { city: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
  { city: "Houston", country: "USA", lat: 29.7604, lng: -95.3698, tz: "America/Chicago" },
  { city: "Miami", country: "USA", lat: 25.7617, lng: -80.1918, tz: "America/New_York" },
  { city: "Phoenix", country: "USA", lat: 33.4484, lng: -112.074, tz: "America/Phoenix" },
  { city: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, tz: "America/Chicago" },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const pad4 = (n: number) => String(n).padStart(4, "0");

const venueTypeLabel = (t: VenueType) => {
  if (t === "stadium") return "Stadium";
  if (t === "arena") return "Arena";
  if (t === "training_ground") return "Training Ground";
  if (t === "indoor") return "Indoor";
  return "Community Field";
};

export const formatVenueType = venueTypeLabel;

export const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
};

export const validateVenue = (v: Venue) => {
  if (!v || typeof v !== "object") return false;
  if (!v.id || !v.name) return false;
  if (!v.location?.city || !Number.isFinite(v.location.lat) || !Number.isFinite(v.location.lng)) return false;
  if (!Number.isFinite(v.capacity) || v.capacity < 0) return false;
  return true;
};

export const filterVenues = (venues: Venue[], filters: VenueListFilters) => {
  const search = filters.search.trim().toLowerCase();
  let result = venues.filter(validateVenue);

  if (search) {
    result = result.filter((v) => {
      const hay = `${v.name} ${v.location.city} ${v.location.country} ${v.location.address}`.toLowerCase();
      return hay.includes(search);
    });
  }

  if (filters.city !== "all") result = result.filter((v) => v.location.city === filters.city);
  if (filters.type !== "all") result = result.filter((v) => v.type === filters.type);

  if (typeof filters.capacityMin === "number") result = result.filter((v) => v.capacity >= filters.capacityMin!);
  if (typeof filters.capacityMax === "number") result = result.filter((v) => v.capacity <= filters.capacityMax!);

  if (filters.amenities.length > 0) {
    result = result.filter((v) => filters.amenities.every((a) => v.amenities.some((x) => x.id === a)));
  }

  return result;
};

export const sortVenues = (venues: Venue[], sort: VenueSort, userPos?: { lat: number; lng: number } | null) => {
  const list = [...venues];
  if (sort === "alphabetical") list.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "capacity") list.sort((a, b) => b.capacity - a.capacity);
  if (sort === "distance") {
    if (!userPos) return list;
    list.sort((a, b) => haversineKm(userPos, a.location) - haversineKm(userPos, b.location));
  }
  return list;
};

export const paginate = <T,>(items: T[], page: number, limit: number) => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const p = Math.max(1, Math.min(page, totalPages));
  const start = (p - 1) * limit;
  return { items: items.slice(start, start + limit), total, page: p, totalPages };
};

export const buildDemoVenues = (count = 120): Venue[] => {
  const types: VenueType[] = ["stadium", "arena", "training_ground", "indoor", "community_field"];
  const baseFacilities = ["Changing rooms", "Showers", "First aid", "Media area", "Security", "Scoreboard"];
  const descriptions = [
    "A modern football venue with excellent pitch quality and spectator facilities.",
    "A versatile multi-use venue suitable for league and tournament matches.",
    "A professional training and match facility with premium amenities.",
  ];

  return Array.from({ length: count }).map((_, i) => {
    const c = pick(cities);
    const type = pick(types);
    const capacity = Math.round(rand(2500, 52000));
    const amenityCount = 2 + (i % 5);
    const amenities = Array.from({ length: amenityCount }).map(() => pick(venueAmenities));
    const uniqueAmenities = Array.from(new Map(amenities.map((a) => [a.id, a])).values());
    const name = `${venueTypeLabel(type)} ${c.city} ${i % 12 === 0 ? "National" : i % 5 === 0 ? "Central" : "Park"}`;

    const lat = c.lat + rand(-0.22, 0.22);
    const lng = c.lng + rand(-0.22, 0.22);
    const id = `VEN-${new Date().getFullYear()}-${pad4(i + 1)}`;

    const images = [
      { url: `https://picsum.photos/seed/${encodeURIComponent(id)}-1/1200/800`, alt: `${name} main` },
      { url: `https://picsum.photos/seed/${encodeURIComponent(id)}-2/1200/800`, alt: `${name} pitch` },
      { url: `https://picsum.photos/seed/${encodeURIComponent(id)}-3/1200/800`, alt: `${name} stands` },
    ];

    return {
      id,
      name,
      type,
      location: {
        city: c.city,
        country: c.country,
        address: `${100 + (i % 600)} ${c.city} Sports Ave`,
        lat,
        lng,
        timezone: c.tz,
      },
      capacity,
      dimensionsMeters: { length: 105, width: 68 },
      facilities: baseFacilities.slice(0, 3 + (i % 3)),
      amenities: uniqueAmenities,
      description: pick(descriptions),
      images,
      contact: {
        name: "Venue Operations",
        email: `venues+${id.toLowerCase()}@example.com`,
        phone: "+1 555-0100",
        website: "https://example.com",
      },
      pricing: {
        currency: "USD",
        hourly: Math.round(rand(120, 850)),
        daily: Math.round(rand(1200, 9500)),
        notes: "Rates vary by season and event type. Discounts available for recurring bookings.",
      },
    };
  });
};

const venueStorage: Venue[] = buildDemoVenues(140);
const bookingStorage: VenueBooking[] = [];

const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) => Math.max(aStart, bStart) < Math.min(aEnd, bEnd);

export const detectBookingConflict = (existing: VenueBooking[], candidate: Pick<VenueBooking, "startISO" | "endISO">) => {
  const start = new Date(candidate.startISO).getTime();
  const end = new Date(candidate.endISO).getTime();
  return existing.some((b) => {
    if (b.status === "available") return false;
    const bs = new Date(b.startISO).getTime();
    const be = new Date(b.endISO).getTime();
    return overlaps(start, end, bs, be);
  });
};

export const venueService = {
  list: async (args: { page: number; limit: number; filters: VenueListFilters; userPos?: { lat: number; lng: number } | null }) => {
    await new Promise((r) => setTimeout(r, 250));
    const filtered = filterVenues(venueStorage, args.filters);
    const sorted = sortVenues(filtered, args.filters.sort, args.userPos);
    return paginate(sorted, args.page, args.limit);
  },

  getById: async (id: string) => {
    await new Promise((r) => setTimeout(r, 200));
    return venueStorage.find((v) => v.id === id);
  },

  listCities: () => Array.from(new Set(venueStorage.map((v) => v.location.city))).sort(),

  listVenueTypes: (): VenueType[] => ["stadium", "arena", "training_ground", "indoor", "community_field"],

  listAmenities: () => venueAmenities,

  listBookings: async (venueId: string) => {
    await new Promise((r) => setTimeout(r, 200));
    return bookingStorage.filter((b) => b.venueId === venueId).sort((a, b) => new Date(a.startISO).getTime() - new Date(b.startISO).getTime());
  },

  requestBooking: async (input: Omit<VenueBooking, "id" | "createdAt">) => {
    await new Promise((r) => setTimeout(r, 350));
    const existing = bookingStorage.filter((b) => b.venueId === input.venueId);
    if (detectBookingConflict(existing, input)) throw new Error("Time slot conflicts with an existing booking.");
    const booking: VenueBooking = {
      ...input,
      id: `BK-${new Date().getFullYear()}-${pad4(bookingStorage.length + 1)}`,
      createdAt: new Date().toISOString(),
    };
    bookingStorage.unshift(booking);
    return booking;
  },

  seedBookings: (venueId: string) => {
    const base = new Date();
    const day0 = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate(), 8, 0, 0));
    const mk = (d: Date, hours: number, durationHrs: number, status: BookingStatus, requesterName: string) => {
      const start = new Date(d.getTime() + hours * 60 * 60 * 1000);
      const end = new Date(start.getTime() + durationHrs * 60 * 60 * 1000);
      bookingStorage.push({
        id: `BK-${new Date().getFullYear()}-${pad4(bookingStorage.length + 1)}`,
        venueId,
        status,
        startISO: start.toISOString(),
        endISO: end.toISOString(),
        requesterName,
        notes: "",
        createdAt: new Date().toISOString(),
      });
    };
    mk(day0, 2, 2, "booked", "League Ops");
    mk(day0, 6, 1.5, "pending", "Coach Request");
    mk(day0, 10, 2, "booked", "Tournament Admin");
    mk(new Date(day0.getTime() + 24 * 60 * 60 * 1000), 4, 2, "booked", "Academy");
  },
};
