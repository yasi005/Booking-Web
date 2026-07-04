"use client";

import { MapPropertyPopupCard } from "@/components/map/map-property-popup-card";
import { useAppPhase } from "@/context/app-phase-context";
import { usePropertyMap } from "@/context/map-context";
import { useVibe } from "@/context/vibe-context";
import { properties } from "@/data/properties";
import { getPropertyById } from "@/data/properties";
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

function toGeoProperty(property: Property): GeoProperty {
  return {
    id: property.id,
    name: property.name,
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
  const { registerMap, flyToProperty } = usePropertyMap();
  const { vibe } = useVibe();
  const [geoProperties, setGeoProperties] = useState<GeoProperty[]>(() =>
    properties.map(toGeoProperty),
  );
  const [popupPropertyId, setPopupPropertyId] = useState<string | null>(
    selectedProperty.id,
  );

  const mapStyle = useMemo(() => getMapStyle(vibe), [vibe]);
  const popupProperty = popupPropertyId ? getPropertyById(popupPropertyId) : null;

  useEffect(() => {
    fetch("/properties.json")
      .then((response) => response.json())
      .then((data: { properties: GeoProperty[] }) => {
        if (data.properties?.length) {
          setGeoProperties(data.properties);
        }
      })
      .catch(() => {
        setGeoProperties(properties.map(toGeoProperty));
      });
  }, []);

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
        longitude: 23.7275,
        latitude: 37.9838,
        zoom: 11.2,
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
