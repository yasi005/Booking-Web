"use client";

import { MapPropertyPopupCard } from "@/components/map/map-property-popup-card";
import { useMarketplace } from "@/context/marketplace-context";
import { useVibe } from "@/context/vibe-context";
import { getAnchorRate } from "@/lib/property-utils";
import { getMapStyle } from "@/lib/map-styles";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Property } from "@/types/property";

function PricePill({
  rate,
  visible,
  onClick,
}: {
  rate: number;
  visible: boolean;
  onClick: () => void;
}) {
  if (!visible) return null;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-full bg-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-white shadow-lg"
    >
      {formatCurrency(rate)}
    </motion.button>
  );
}

type MarketplaceMapProps = {
  onSelectProperty: (property: Property) => void;
  popupProperty: Property | null;
  onPopupProperty: (property: Property | null) => void;
};

export function MarketplaceMap({
  onSelectProperty,
  popupProperty,
  onPopupProperty,
}: MarketplaceMapProps) {
  const { filteredProperties, allProperties } = useMarketplace();
  const { vibe } = useVibe();
  const mapStyle = useMemo(() => getMapStyle(vibe), [vibe]);

  const filteredIds = useMemo(
    () => new Set(filteredProperties.map((p) => p.id)),
    [filteredProperties],
  );

  return (
    <div className="relative h-full min-h-[480px] w-full overflow-hidden rounded-2xl border border-neutral-100">
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
        attributionControl={false}
        reuseMaps
        onClick={() => onPopupProperty(null)}
      >
        {allProperties.map((property) => (
          <Marker
            key={property.id}
            longitude={property.coordinates.lng}
            latitude={property.coordinates.lat}
            anchor="bottom"
          >
            <PricePill
              rate={getAnchorRate(property)}
              visible={filteredIds.has(property.id)}
              onClick={() => {
                onPopupProperty(property);
                onSelectProperty(property);
              }}
            />
          </Marker>
        ))}

        {popupProperty && filteredIds.has(popupProperty.id) && (
          <Popup
            longitude={popupProperty.coordinates.lng}
            latitude={popupProperty.coordinates.lat}
            anchor="bottom"
            offset={[0, -49] as [number, number]}
            closeButton={false}
            closeOnClick={false}
            className="map-property-popup"
          >
            <MapPropertyPopupCard property={popupProperty} />
          </Popup>
        )}
      </Map>
    </div>
  );
}
