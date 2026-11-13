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
    <div className="relative h-[200px] w-full overflow-hidden rounded-2xl border border-[#c9a961]/30">
      <Map
        mapStyle={MAP_STYLES.midnight}
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
          anchor="bottom"
        >
          <span className="relative flex h-9 w-7 items-center justify-center">
            <span className="absolute bottom-0 h-2 w-2 rounded-full bg-white/90 shadow" />
            <span className="mb-1.5 h-7 w-5 rounded-full rounded-b-[40%] bg-[#c9a961] shadow-[0_4px_12px_rgba(201,169,97,0.5)]" />
          </span>
        </Marker>
      </Map>
    </div>
  );
}
