"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useMarketplace } from "@/context/marketplace-context";
import { useEffect } from "react";

export function CatalogBootstrap() {
  const { allProperties, isLoading } = useMarketplace();
  const { selectedProperty, selectProperty } = useAppPhase();

  useEffect(() => {
    if (isLoading || allProperties.length === 0) return;

    const selectedStillExists = allProperties.some(
      (property) => property.id === selectedProperty.id,
    );

    if (!selectedStillExists || selectedProperty.id === "loading") {
      selectProperty(allProperties[0]);
    }
  }, [allProperties, isLoading, selectProperty, selectedProperty.id]);

  return null;
}
