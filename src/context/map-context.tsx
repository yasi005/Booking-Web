"use client";

import type { Property } from "@/types/property";
import type { Map as MapLibreMap } from "maplibre-gl";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

type MapContextValue = {
  registerMap: (map: MapLibreMap) => void;
  flyToProperty: (property: Property) => void;
};

const MapContext = createContext<MapContextValue | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<MapLibreMap | null>(null);
  const pendingProperty = useRef<Property | null>(null);

  const flyToProperty = useCallback((property: Property) => {
    const map = mapRef.current;
    if (!map) {
      pendingProperty.current = property;
      return;
    }

    map.flyTo({
      center: [property.coordinates.lng, property.coordinates.lat],
      zoom: 13.2,
      pitch: 48,
      bearing: -12,
      duration: 2400,
      essential: true,
    });
    pendingProperty.current = null;
  }, []);

  const registerMap = useCallback(
    (map: MapLibreMap) => {
      mapRef.current = map;
      if (pendingProperty.current) {
        flyToProperty(pendingProperty.current);
      }
    },
    [flyToProperty],
  );

  const value = useMemo(
    () => ({ registerMap, flyToProperty }),
    [registerMap, flyToProperty],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function usePropertyMap() {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("usePropertyMap must be used within MapProvider");
  }
  return context;
}
