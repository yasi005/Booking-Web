"use client";

import { useTranslation } from "@/context/locale-context";
import { MAP_STYLES } from "@/lib/map-styles";
import { useMemo } from "react";
import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/** Evangelistrias, Monastiraki — ZEUS office / meeting point */
const LOCATION = {
  lat: 37.97645,
  lng: 23.72785,
  addressLine: "Evangelistrias",
  neighborhoodEn: "Monastiraki",
  neighborhoodEl: "Μοναστηράκι",
  floor: 4,
};

const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${LOCATION.lat},${LOCATION.lng}`;
const APPLE_MAPS_URL = `https://maps.apple.com/?ll=${LOCATION.lat},${LOCATION.lng}&q=${encodeURIComponent("Evangelistrias, Monastiraki")}`;

export function FooterLocationMap() {
  const { t, locale } = useTranslation();
  const neighborhood =
    locale === "el" ? LOCATION.neighborhoodEl : LOCATION.neighborhoodEn;

  const initialViewState = useMemo(
    () => ({
      latitude: LOCATION.lat,
      longitude: LOCATION.lng,
      zoom: 15.2,
    }),
    [],
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)]">
      <div className="relative h-[160px] w-full sm:h-[180px]">
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
            latitude={LOCATION.lat}
            longitude={LOCATION.lng}
            anchor="bottom"
          >
            <span className="relative flex h-9 w-7 items-center justify-center">
              <span className="absolute bottom-0 h-2 w-2 rounded-full bg-white/90 shadow" />
              <span className="mb-1.5 h-7 w-5 rounded-full rounded-b-[40%] bg-[#E8A87C]/90 shadow-[0_4px_12px_rgba(232,168,124,0.45)]" />
            </span>
          </Marker>
        </Map>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/40" />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-4 py-3.5 sm:px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.22em] text-[#d4af37] uppercase">
            {t.footer.thePoint}
          </p>
          <p className="mt-1 font-serif text-[15px] leading-snug text-white sm:text-base">
            {LOCATION.addressLine},
          </p>
          <p className="font-serif text-[15px] italic leading-snug text-white/90 sm:text-base">
            {neighborhood}
          </p>
          <p className="mt-1 text-[11px] tracking-wide text-zinc-400">
            {t.footer.floor(LOCATION.floor)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[12px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            aria-label={t.footer.openGoogleMaps}
          >
            G
          </a>
          <a
            href={APPLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[12px] font-semibold text-white transition hover:border-white/50 hover:bg-white/10"
            aria-label={t.footer.openAppleMaps}
          >
            A
          </a>
        </div>
      </div>
    </div>
  );
}
