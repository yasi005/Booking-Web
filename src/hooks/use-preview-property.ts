"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { usePropertyMap } from "@/context/map-context";
import { useViewMode } from "@/context/view-mode-context";
import type { Property } from "@/types/property";

export function usePreviewProperty() {
  const { enterWorkspace } = useAppPhase();
  const { setMode } = useViewMode();
  const { flyToProperty } = usePropertyMap();

  return (property: Property) => {
    enterWorkspace(property);
    setMode("gallery");
    window.setTimeout(() => flyToProperty(property), 480);
  };
}
