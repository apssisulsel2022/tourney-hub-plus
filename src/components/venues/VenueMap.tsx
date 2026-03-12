import React, { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Supercluster from "supercluster";
import { Link } from "react-router-dom";
import { Venue } from "@/lib/venues";
import { cn } from "@/lib/utils";

type MapMarker = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  venueId?: string;
};

type ClusterPointProps = {
  cluster: boolean;
  venueId?: string;
  title: string;
};

type ClusterPoint = GeoJSON.Feature<
  GeoJSON.Point,
  ClusterPointProps & { point_count?: number; point_count_abbreviated?: number }
>;

const markerIcon = (label: string, className: string) =>
  L.divIcon({
    className: "",
    html: `<div class="${className}" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:14px;font-weight:900;font-size:10px;letter-spacing:0.08em;">${label}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -14],
  });

const venueIcon = (label: string) =>
  markerIcon(label, "bg-secondary text-white shadow-lg shadow-secondary/20 border border-white/20");

const userIcon = markerIcon("YOU", "bg-info text-white shadow-lg shadow-info/20 border border-white/20");

const clusterIcon = (count: number) =>
  markerIcon(
    String(count),
    "bg-background text-foreground shadow-lg border border-muted-foreground/20"
  );

const initials = (name: string) => name.split(" ").map((p) => p[0]).join("").slice(0, 3).toUpperCase();

function MapStateBridge({ onChange }: { onChange: (v: { zoom: number; bbox: [number, number, number, number] }) => void }) {
  useMapEvents({
    zoomend: (e) => {
      const map = e.target;
      const b = map.getBounds();
      onChange({ zoom: map.getZoom(), bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] });
    },
    moveend: (e) => {
      const map = e.target;
      const b = map.getBounds();
      onChange({ zoom: map.getZoom(), bbox: [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()] });
    },
  });
  return null;
}

export interface VenueMapProps {
  venues: Venue[];
  center?: { lat: number; lng: number };
  userPosition?: { lat: number; lng: number } | null;
  selectedVenueId?: string;
  className?: string;
  heightPx?: number;
}

export function VenueMap({ venues, center, userPosition, selectedVenueId, className, heightPx = 460 }: VenueMapProps) {
  const markers: MapMarker[] = useMemo(
    () =>
      venues.map((v) => ({
        id: v.id,
        lat: v.location.lat,
        lng: v.location.lng,
        title: v.name,
        venueId: v.id,
      })),
    [venues]
  );

  const points: ClusterPoint[] = useMemo(
    () =>
      markers.map((m) => ({
        type: "Feature",
        properties: { cluster: false, venueId: m.venueId, title: m.title },
        geometry: { type: "Point", coordinates: [m.lng, m.lat] },
      })),
    [markers]
  );

  const clusterIndex = useMemo(() => {
    const idx = new Supercluster<ClusterPointProps>({
      radius: 70,
      maxZoom: 18,
    });
    idx.load(points);
    return idx;
  }, [points]);

  const [mapState, setMapState] = useState<{ zoom: number; bbox: [number, number, number, number] }>(() => {
    const c = center ?? { lat: venues[0]?.location.lat ?? 0, lng: venues[0]?.location.lng ?? 0 };
    const bbox: [number, number, number, number] = [c.lng - 0.8, c.lat - 0.8, c.lng + 0.8, c.lat + 0.8];
    return { zoom: 5, bbox };
  });

  const clusters = useMemo(() => {
    return clusterIndex.getClusters(mapState.bbox, mapState.zoom) as ClusterPoint[];
  }, [clusterIndex, mapState.bbox, mapState.zoom]);

  const mapCenter = useMemo(() => {
    if (center) return [center.lat, center.lng] as [number, number];
    if (selectedVenueId) {
      const v = venues.find((x) => x.id === selectedVenueId);
      if (v) return [v.location.lat, v.location.lng] as [number, number];
    }
    if (userPosition) return [userPosition.lat, userPosition.lng] as [number, number];
    const v0 = venues[0];
    return v0 ? ([v0.location.lat, v0.location.lng] as [number, number]) : ([0, 0] as [number, number]);
  }, [center, selectedVenueId, venues, userPosition]);

  const selected = useMemo(() => venues.find((v) => v.id === selectedVenueId) ?? null, [selectedVenueId, venues]);

  return (
    <div className={cn("rounded-3xl border overflow-hidden bg-card shadow-sm", className)} style={{ height: heightPx }}>
      <MapContainer center={mapCenter} zoom={mapState.zoom} className="h-full w-full" scrollWheelZoom>
        <MapStateBridge onChange={setMapState} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && (
          <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon}>
            <Popup>
              <div className="font-bold">Your location</div>
            </Popup>
          </Marker>
        )}

        {clusters.map((c) => {
          const [lng, lat] = c.geometry.coordinates as [number, number];
          const isCluster = Boolean(c.properties.cluster);
          if (isCluster) {
            const count = c.properties.point_count ?? 0;
            return (
              <Marker key={`cluster-${lng}-${lat}-${count}`} position={[lat, lng]} icon={clusterIcon(count)}>
                <Popup>
                  <div className="space-y-2">
                    <div className="font-black">{count} venues</div>
                    <div className="text-sm text-muted-foreground">Zoom in to see individual venues.</div>
                  </div>
                </Popup>
              </Marker>
            );
          }
          const venueId = c.properties.venueId!;
          const v = venues.find((x) => x.id === venueId);
          if (!v) return null;
          const icon = venueIcon(initials(v.name));
          const isSelected = selected?.id === v.id;
          return (
            <Marker key={venueId} position={[v.location.lat, v.location.lng]} icon={icon}>
              <Popup>
                <div className="space-y-2 min-w-[220px]">
                  <div className="font-black text-base">{v.name}</div>
                  <div className="text-sm text-muted-foreground">{v.location.city}, {v.location.country}</div>
                  <div className="text-xs text-muted-foreground">
                    Capacity {v.capacity.toLocaleString()} · {v.type.replace(/_/g, " ")}
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Link
                      to={`/venues/${v.id}`}
                      className={cn(
                        "inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-black uppercase tracking-widest border transition-colors",
                        isSelected ? "bg-secondary text-white border-secondary" : "bg-background hover:bg-muted"
                      )}
                    >
                      View Profile
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${v.location.lat},${v.location.lng}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-black uppercase tracking-widest border bg-background hover:bg-muted transition-colors"
                    >
                      Directions
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

