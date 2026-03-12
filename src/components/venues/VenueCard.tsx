import React from "react";
import { MapPin, Users, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Venue, formatVenueType, haversineKm } from "@/lib/venues";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface VenueCardProps {
  venue: Venue;
  userPosition?: { lat: number; lng: number } | null;
}

export function VenueCard({ venue, userPosition }: VenueCardProps) {
  const thumb = venue.images[0];
  const distanceKm = userPosition ? haversineKm(userPosition, venue.location) : null;

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="bg-card rounded-3xl border overflow-hidden shadow-sm hover:shadow-md transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Open venue profile for ${venue.name}`}
    >
      <div className="relative h-44 bg-muted overflow-hidden">
        {thumb ? (
          <img
            src={thumb.url}
            alt={thumb.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground font-black">
            {venue.name}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest bg-background/80 text-foreground border border-muted-foreground/10">
            {formatVenueType(venue.type)}
          </Badge>
        </div>
        {distanceKm !== null && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest bg-background/80 border border-muted-foreground/10">
              {distanceKm.toFixed(1)} km
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="space-y-1">
          <h3 className="font-black text-lg tracking-tight truncate" title={venue.name}>
            {venue.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 truncate" title={`${venue.location.city}, ${venue.location.country}`}>
            <MapPin className="h-4 w-4 text-secondary" />
            {venue.location.city}, {venue.location.country}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-bold">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" /> {venue.capacity.toLocaleString()} capacity
          </span>
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4" /> {venue.dimensionsMeters.length}×{venue.dimensionsMeters.width}m
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {venue.amenities.slice(0, 3).map((a) => (
            <Badge key={a.id} variant="outline" className="text-[9px] font-black uppercase tracking-widest border-muted-foreground/20">
              {a.label}
            </Badge>
          ))}
          {venue.amenities.length > 3 && (
            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-muted-foreground/20">
              +{venue.amenities.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

