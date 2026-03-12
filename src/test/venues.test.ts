import { describe, it, expect } from "vitest";
import { buildDemoVenues, detectBookingConflict, filterVenues, paginate, sortVenues, VenueBooking, VenueListFilters } from "../lib/venues";

describe("venues utilities", () => {
  it("filters by search, city, type, capacity, and amenities", () => {
    const venues = buildDemoVenues(20);
    const city = venues[0].location.city;
    const type = venues[0].type;
    const amenity = venues[0].amenities[0]?.id;
    const base: VenueListFilters = {
      search: venues[0].name.slice(0, 5),
      city,
      type,
      amenities: amenity ? [amenity] : [],
      capacityMin: venues[0].capacity - 1,
      capacityMax: venues[0].capacity + 1,
      sort: "alphabetical",
    };
    const out = filterVenues(venues, base);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((v) => v.location.city === city)).toBe(true);
    expect(out.every((v) => v.type === type)).toBe(true);
    if (amenity) expect(out.every((v) => v.amenities.some((a) => a.id === amenity))).toBe(true);
  });

  it("sorts by alphabetical and capacity", () => {
    const venues = buildDemoVenues(10);
    const a = sortVenues(venues, "alphabetical", null);
    expect(a[0].name.localeCompare(a[1].name) <= 0).toBe(true);
    const c = sortVenues(venues, "capacity", null);
    expect(c[0].capacity >= c[1].capacity).toBe(true);
  });

  it("sorts by distance when user position is available", () => {
    const venues = buildDemoVenues(5);
    const userPos = { lat: venues[0].location.lat, lng: venues[0].location.lng };
    const d = sortVenues(venues, "distance", userPos);
    expect(d[0].id).toBe(venues[0].id);
  });

  it("paginates correctly", () => {
    const venues = buildDemoVenues(30);
    const page1 = paginate(venues, 1, 10);
    const page3 = paginate(venues, 3, 10);
    expect(page1.items).toHaveLength(10);
    expect(page3.items).toHaveLength(10);
    expect(page3.totalPages).toBe(3);
  });

  it("detects booking conflicts", () => {
    const existing: VenueBooking[] = [
      {
        id: "BK-1",
        venueId: "V1",
        status: "booked",
        startISO: "2026-03-12T10:00:00.000Z",
        endISO: "2026-03-12T12:00:00.000Z",
        requesterName: "A",
        notes: "",
        createdAt: "2026-03-12T00:00:00.000Z",
      },
      {
        id: "BK-2",
        venueId: "V1",
        status: "pending",
        startISO: "2026-03-12T13:00:00.000Z",
        endISO: "2026-03-12T14:00:00.000Z",
        requesterName: "B",
        notes: "",
        createdAt: "2026-03-12T00:00:00.000Z",
      },
    ];
    expect(detectBookingConflict(existing, { startISO: "2026-03-12T11:00:00.000Z", endISO: "2026-03-12T11:30:00.000Z" })).toBe(true);
    expect(detectBookingConflict(existing, { startISO: "2026-03-12T12:00:00.000Z", endISO: "2026-03-12T13:00:00.000Z" })).toBe(false);
    expect(detectBookingConflict(existing, { startISO: "2026-03-12T13:30:00.000Z", endISO: "2026-03-12T13:45:00.000Z" })).toBe(true);
  });
});

