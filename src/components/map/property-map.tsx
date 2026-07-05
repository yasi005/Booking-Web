"use client";

import { MapPropertyPopupCard } from "@/components/map/map-property-popup-card";
import { useAppPhase } from "@/context/app-phase-context";
import { useMarketplace } from "@/context/marketplace-context";
import { usePropertyMap } from "@/context/map-context";
import { useVibe } from "@/context/vibe-context";
import { useLocale } from "@/context/locale-context";
import { getPropertyById } from "@/lib/property-registry";
import { getPropertyName } from "@/lib/localized-property";
import { getMapStyle } from "@/lib/map-styles";
import { getAnchorRate } from "@/lib/property-utils";
import { cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { useEffect, useMemo, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

/** Gap between price pill and popup card (px) */
const POPUP_GAP = 15;
/** Approximate rendered height of the price pill */
const PRICE_PILL_HEIGHT = 34;
const POPUP_OFFSET_Y = -(PRICE_PILL_HEIGHT + POPUP_GAP);

type GeoProperty = {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  anchorRate: number;
};

function toGeoProperty(property: Property, locale: "en" | "el"): GeoProperty {
  return {
    id: property.id,
    name: getPropertyName(property, locale),
    coordinates: property.coordinates,
    anchorRate: getAnchorRate(property),
  };
}

function PricePill({
  rate,
  isSelected,
  onClick,
}: {
  rate: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "cursor-pointer rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-lg transition-transform duration-300",
        isSelected
          ? "scale-110 bg-neutral-950 text-white"
          : "bg-neutral-950 text-white hover:scale-105",
      )}
    >
      {formatCurrency(rate)}
    </button>
  );
}

export function PropertyMap() {
  const { selectedProperty, selectProperty } = useAppPhase();
  const { allProperties } = useMarketplace();
  const { registerMap, flyToProperty } = usePropertyMap();
  const { vibe } = useVibe();
  const { locale } = useLocale();
  const geoProperties = useMemo(
    () => allProperties.map((property) => toGeoProperty(property, locale)),
    [allProperties, locale],
  );
  const [popupPropertyId, setPopupPropertyId] = useState<string | null>(
    selectedProperty.id,
  );

  const mapStyle = useMemo(() => getMapStyle(vibe), [vibe]);
  const popupProperty = popupPropertyId ? getPropertyById(popupPropertyId) : null;

  useEffect(() => {
    flyToProperty(selectedProperty);
    setPopupPropertyId(selectedProperty.id);
  }, [selectedProperty, flyToProperty]);

  const handleMarkerClick = (id: string) => {
    const property = getPropertyById(id);
    if (!property) return;

    setPopupPropertyId(id);
    selectProperty(property);
    flyToProperty(property);
  };

  return (
    <Map
      initialViewState={{
        longitude: 23.742,
        latitude: 37.978,
        zoom: 14.5,
        pitch: 0,
        bearing: 0,
      }}
      mapStyle={mapStyle}
      style={{ width: "100%", height: "100%" }}
      onLoad={(event) => registerMap(event.target)}
      onClick={() => setPopupPropertyId(null)}
      attributionControl={false}
      reuseMaps
    >
      {geoProperties.map((property) => (
        <Marker
          key={property.id}
          longitude={property.coordinates.lng}
          latitude={property.coordinates.lat}
          anchor="bottom"
        >
          <PricePill
            rate={property.anchorRate}
            isSelected={property.id === selectedProperty.id}
            onClick={() => handleMarkerClick(property.id)}
          />
        </Marker>
      ))}

      {popupProperty && (
        <Popup
          longitude={popupProperty.coordinates.lng}
          latitude={popupProperty.coordinates.lat}
          anchor="bottom"
          offset={[0, POPUP_OFFSET_Y] as [number, number]}
          closeButton={false}
          closeOnClick={false}
          className="map-property-popup"
          onClose={() => setPopupPropertyId(null)}
        >
          <MapPropertyPopupCard property={popupProperty} />
        </Popup>
      )}
    </Map>
  );
}
