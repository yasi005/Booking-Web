"use client";

import { MAP_STYLES } from "@/lib/map-styles";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/** Evangelistrias 3, Athens 105 62 (by Mitropoleos St) — ZEUS office / meeting point */
export const FOOTER_LOCATION = {
  lat: 37.97563,
  lng: 23.72985,
  addressLine: "Athens, Evangelistrias 3",
  neighborhoodEn: "Monastiraki",
  neighborhoodEl: "Μοναστηράκι",
  floor: 3,
};

export const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${FOOTER_LOCATION.lat},${FOOTER_LOCATION.lng}`;
export const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${FOOTER_LOCATION.lat},${FOOTER_LOCATION.lng}&q=${encodeURIComponent("Evangelistrias 3, Athens")}`;

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
    <div className="relative h-[180px] w-full overflow-hidden rounded-xl border border-[#c9a961] shadow-[0_0_0_1px_rgba(201,169,97,0.25),0_10px_30px_-14px_rgba(201,169,97,0.45)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(201,169,97,0.5),0_14px_36px_-12px_rgba(201,169,97,0.6)] sm:h-[200px]">
      <Map
        mapStyle={MAP_STYLES.default}
        initialViewState={initialViewState}
        attributionControl={false}
        interactive={false}
        style={{ width: "100%", height: "100%" }}
      >
        <Marker
          latitude={FOOTER_LOCATION.lat}
          longitude={FOOTER_LOCATION.lng}
          anchor="bottom"
        >
          <MapPin
            aria-hidden
            strokeWidth={1.75}
            className="h-9 w-9 fill-[#0B1D36] text-white drop-shadow-[0_4px_6px_rgba(11,29,54,0.45)]"
          />
        </Marker>
      </Map>
    </div>
  );
}
