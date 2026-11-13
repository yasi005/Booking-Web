"use client";

import { MAP_STYLES } from "@/lib/map-styles";
import { useMemo } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/** Evangelistrias, Monastiraki — ZEUS office / meeting point */
export const FOOTER_LOCATION = {
  lat: 37.97645,
  lng: 23.72785,
  addressLine: "Evangelistrias",
  neighborhoodEn: "Monastiraki",
  neighborhoodEl: "Μοναστηράκι",
  floor: 4,
};

export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${FOOTER_LOCATION.lat},${FOOTER_LOCATION.lng}`;
export const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${FOOTER_LOCATION.lat},${FOOTER_LOCATION.lng}&q=${encodeURIComponent("Evangelistrias, Monastiraki")}`;

export function FooterLocationMap() {
  const initialViewState = useMemo(
    () => ({
      latitude: FOOTER_LOCATION.lat,
      longitude: FOOTER_LOCATION.lng,
      zoom: 15.2,
    }),
    [],
  );

  return (
    <div className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-white/15 sm:h-[260px]">
      <Map
        mapStyle={MAP_STYLES.default}
        initialViewState={initialViewState}
        attributionControl={false}
        dragRotate={false}
        pitchWithRotate={false}
        scrollZoom={false}
        doubleClickZoom={false}
        dragPan
        style={{ width: "100%", height: "100%" }}
      >
        <Marker
          latitude={FOOTER_LOCATION.lat}
          longitude={FOOTER_LOCATION.lng}
          anchor="center"
        >
          <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500/55" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]" />
          </span>
        </Marker>
      </Map>
    </div>
  );
}
