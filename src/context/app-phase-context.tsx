"use client";

import { featuredProperty } from "@/data/properties";
import type { Property } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppPhase = "discovery" | "marketplace" | "workspace";
export type CurrentPage = "home" | "explore";
export type ActiveView = "grid" | "focused";

type AppPhaseContextValue = {
  phase: AppPhase;
  currentPage: CurrentPage;
  activeView: ActiveView | null;
  selectedProperty: Property;
  selectedHouseId: string | null;
  homeSearchQuery: string;
  morphingPropertyId: string | null;
  setHomeSearchQuery: (q: string) => void;
  enterMarketplace: (query?: string) => void;
  enterWorkspace: (property: Property) => void;
  selectProperty: (property: Property) => void;
  exitToDiscovery: () => void;
  exitToMarketplace: () => void;
  isDiscovery: boolean;
  isMarketplace: boolean;
  isWorkspace: boolean;
};

const AppPhaseContext = createContext<AppPhaseContextValue | null>(null);

export function AppPhaseProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AppPhase>("discovery");
  const [selectedProperty, setSelectedProperty] = useState<Property>(featuredProperty);
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [morphingPropertyId, setMorphingPropertyId] = useState<string | null>(null);

  const enterMarketplace = useCallback((query?: string) => {
    if (query !== undefined) setHomeSearchQuery(query);
    setMorphingPropertyId(null);
    setPhase("marketplace");
  }, []);

  const enterWorkspace = useCallback((property: Property) => {
    setMorphingPropertyId(property.id);
    setSelectedProperty(property);
    setPhase("workspace");
  }, []);

  const selectProperty = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const exitToDiscovery = useCallback(() => {
    setMorphingPropertyId(null);
    setPhase("discovery");
  }, []);

  const exitToMarketplace = useCallback(() => {
    setMorphingPropertyId(null);
    setPhase("marketplace");
  }, []);

  const currentPage: CurrentPage = phase === "discovery" ? "home" : "explore";
  const activeView: ActiveView | null =
    phase === "marketplace" ? "grid" : phase === "workspace" ? "focused" : null;

  const value = useMemo(
    () => ({
      phase,
      currentPage,
      activeView,
      selectedProperty,
      selectedHouseId: phase === "workspace" ? selectedProperty.id : null,
      homeSearchQuery,
      morphingPropertyId,
      setHomeSearchQuery,
      enterMarketplace,
      enterWorkspace,
      selectProperty,
      exitToDiscovery,
      exitToMarketplace,
      isDiscovery: phase === "discovery",
      isMarketplace: phase === "marketplace",
      isWorkspace: phase === "workspace",
    }),
    [
      phase,
      currentPage,
      activeView,
      selectedProperty,
      homeSearchQuery,
      morphingPropertyId,
      enterMarketplace,
      enterWorkspace,
      selectProperty,
      exitToDiscovery,
      exitToMarketplace,
    ],
  );

  return <AppPhaseContext.Provider value={value}>{children}</AppPhaseContext.Provider>;
}

export function useAppPhase() {
  const context = useContext(AppPhaseContext);
  if (!context) {
    throw new Error("useAppPhase must be used within an AppPhaseProvider");
  }
  return context;
}
