"use client";

import { properties } from "@/data/properties";
import { filterProperties, type MarketplaceFilters } from "@/lib/marketplace-filters";
import { sortProperties, type SortOption } from "@/lib/editorial-grid";
import type { Property } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DEFAULT_FILTERS: MarketplaceFilters = {
  searchQuery: "",
  priceRange: [2400, 6800],
  season: null,
  propertyTypes: [],
  infinityPool: false,
  privateHelipad: false,
  automatedConcierge: false,
};

type MarketplaceContextValue = {
  filters: MarketplaceFilters;
  setSearchQuery: (q: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setSeason: (season: MarketplaceFilters["season"]) => void;
  togglePropertyType: (type: MarketplaceFilters["propertyTypes"][number]) => void;
  clearPropertyTypes: () => void;
  toggleVip: (key: "infinityPool" | "privateHelipad" | "automatedConcierge") => void;
  resetFilters: () => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filteredProperties: Property[];
  sortedProperties: Property[];
  allProperties: Property[];
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((f) => ({ ...f, searchQuery }));
  }, []);

  const setPriceRange = useCallback((priceRange: [number, number]) => {
    setFilters((f) => ({ ...f, priceRange }));
  }, []);

  const setSeason = useCallback((season: MarketplaceFilters["season"]) => {
    setFilters((f) => ({ ...f, season: f.season === season ? null : season }));
  }, []);

  const togglePropertyType = useCallback(
    (type: MarketplaceFilters["propertyTypes"][number]) => {
      setFilters((f) => ({
        ...f,
        propertyTypes: f.propertyTypes.includes(type)
          ? f.propertyTypes.filter((t) => t !== type)
          : [...f.propertyTypes, type],
      }));
    },
    [],
  );

  const clearPropertyTypes = useCallback(() => {
    setFilters((f) => ({ ...f, propertyTypes: [] }));
  }, []);

  const toggleVip = useCallback(
    (key: "infinityPool" | "privateHelipad" | "automatedConcierge") => {
      setFilters((f) => ({ ...f, [key]: !f[key] }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filteredProperties = useMemo(
    () => filterProperties(properties, filters),
    [filters],
  );

  const sortedProperties = useMemo(
    () => sortProperties(filteredProperties, sortBy),
    [filteredProperties, sortBy],
  );

  const value = useMemo(
    () => ({
      filters,
      setSearchQuery,
      setPriceRange,
      setSeason,
      togglePropertyType,
      clearPropertyTypes,
      toggleVip,
      resetFilters,
      sortBy,
      setSortBy,
      filteredProperties,
      sortedProperties,
      allProperties: properties,
    }),
    [
      filters,
      setSearchQuery,
      setPriceRange,
      setSeason,
      togglePropertyType,
      clearPropertyTypes,
      toggleVip,
      resetFilters,
      sortBy,
      filteredProperties,
      sortedProperties,
    ],
  );

  return (
    <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  return context;
}
