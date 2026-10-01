import { isOpenEndedMax } from "@/lib/price-histogram";
import { getAnchorRate } from "@/lib/property-utils";
import type { Property, PropertyType, TravelSeason } from "@/types/property";

export type MarketplaceFilters = {
  searchQuery: string;
  priceRange: [number, number];
  season: TravelSeason | null;
  propertyTypes: PropertyType[];
  infinityPool: boolean;
  privateHelipad: boolean;
  automatedConcierge: boolean;
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  "open-concept-villa": "Open-Concept Villa",
  beachfront: "Beachfront",
  "boutique-estate": "Boutique Estates",
};

export const SEASON_LABELS: Record<TravelSeason, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export function filterProperties(
  items: Property[],
  filters: MarketplaceFilters,
): Property[] {
  return items.filter((property) => {
    const rate = getAnchorRate(property);
    const [minPrice, maxPrice] = filters.priceRange;

    if (rate < minPrice || (!isOpenEndedMax(maxPrice) && rate > maxPrice)) return false;

    if (filters.propertyTypes.length > 0 && !filters.propertyTypes.includes(property.propertyType)) {
      return false;
    }

    if (filters.infinityPool && !property.vipAmenities.infinityPool) return false;
    if (filters.privateHelipad && !property.vipAmenities.privateHelipad) return false;
    if (filters.automatedConcierge && !property.vipAmenities.automatedConcierge) return false;

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const haystack = `${property.name} ${property.location} ${property.locationDisplay}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}
