"use client";

import { loadAllProperties } from "@/lib/backend-api";
import { filterProperties, type MarketplaceFilters } from "@/lib/marketplace-filters";
import { sortProperties, type SortOption } from "@/lib/editorial-grid";
import { getCatalogPriceBounds } from "@/lib/price-histogram";
import { getAllProperties, setPropertyCatalog } from "@/lib/property-registry";
import type { Property } from "@/types/property";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const BASE_FILTERS: Omit<MarketplaceFilters, "priceRange"> = {
  searchQuery: "",
  season: null,
  propertyTypes: [],
  infinityPool: false,
  privateHelipad: false,
  automatedConcierge: false,
};

function createDefaultFilters(catalog: Property[]): MarketplaceFilters {
  const { min, max } = getCatalogPriceBounds(catalog);
  return { ...BASE_FILTERS, priceRange: [min, max] };
}

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
  defaultPriceRange: [number, number];
  filteredProperties: Property[];
  sortedProperties: Property[];
  allProperties: Property[];
  isLoading: boolean;
  loadError: string | null;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<MarketplaceFilters>(() =>
    createDefaultFilters([]),
  );
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [catalogTick, setCatalogTick] = useState(0);

  useEffect(() => {
    let cancelled = false;

    loadAllProperties()
      .then((properties) => {
        if (cancelled) return;
        setPropertyCatalog(properties);
        setCatalogTick((tick) => tick + 1);
        setLoadError(properties.length === 0 ? "No listings found." : null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPropertyCatalog([]);
        setLoadError(error instanceof Error ? error.message : "Failed to load listings.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const catalog = useMemo(() => getAllProperties(), [catalogTick, isLoading]);

  const defaultPriceRange = useMemo((): [number, number] => {
    const { min, max } = getCatalogPriceBounds(catalog);
    return [min, max];
  }, [catalog]);

  useEffect(() => {
    if (catalog.length === 0) return;
    const { min, max } = getCatalogPriceBounds(catalog);
    setFilters((current) => ({ ...current, priceRange: [min, max] }));
  }, [catalogTick, catalog.length]);

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

  const resetFilters = useCallback(() => {
    setFilters(createDefaultFilters(catalog));
  }, [catalog]);

  const filteredProperties = useMemo(
    () => filterProperties(catalog, filters),
    [catalog, filters],
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
      defaultPriceRange,
      filteredProperties,
      sortedProperties,
      allProperties: catalog,
      isLoading,
      loadError,
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
      defaultPriceRange,
      filteredProperties,
      sortedProperties,
      catalog,
      isLoading,
      loadError,
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
