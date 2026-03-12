import { useEffect, useState } from "react";

export interface GeolocationState {
  supported: boolean;
  loading: boolean;
  position: { lat: number; lng: number } | null;
  error: string | null;
}

export function useGeolocation(options?: PositionOptions) {
  const [state, setState] = useState<GeolocationState>({
    supported: typeof navigator !== "undefined" && "geolocation" in navigator,
    loading: false,
    position: null,
    error: null,
  });

  useEffect(() => {
    if (!state.supported) return;
    setState((s) => ({ ...s, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          supported: true,
          loading: false,
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
        });
      },
      (err) => {
        setState({
          supported: true,
          loading: false,
          position: null,
          error: err.message || "Unable to retrieve your location.",
        });
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000, ...options }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}

