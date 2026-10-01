import {
  mapHostawayListingToProperty,
  type CachedHostawayListing,
} from "@/lib/hostaway-mapper";
import type { Property } from "@/types/property";

const BACKEND_API = "/backend/api";

type ListingsPayload = {
  count?: number;
  lastSyncedAt?: string | null;
  listings: CachedHostawayListing[];
};

function hasListingImage(listing: CachedHostawayListing): boolean {
  return (listing.images ?? []).some((image) => Boolean(image.url));
}

/** Keep one property per Hostaway id; drop image-less listings (shared Unsplash fallback). */
function toUniqueCatalog(listings: CachedHostawayListing[]): Property[] {
  const seen = new Set<number>();
  const properties: Property[] = [];

  for (const listing of listings) {
    if (listing.published === false) continue;
    if (!hasListingImage(listing)) continue;
    if (seen.has(listing.id)) continue;
    seen.add(listing.id);
    properties.push(mapHostawayListingToProperty(listing));
  }

  return properties;
}

/** Homes and nightly prices straight from Hostaway (backend re-syncs every few minutes). */
export async function fetchAllListingsFromApi(): Promise<Property[]> {
  const response = await fetch(`${BACKEND_API}/listings`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load listings (${response.status})`);
  }
  const payload = (await response.json()) as ListingsPayload;
  return toUniqueCatalog(payload.listings ?? []);
}

export async function loadAllProperties(): Promise<Property[]> {
  return fetchAllListingsFromApi();
}

export type CalendarDay = {
  date: string;
  available: boolean;
  price: number;
};

export async function fetchListingCalendar(
  listingId: string,
  startDate: string,
  endDate: string,
): Promise<{ days: CalendarDay[]; currency: string }> {
  const response = await fetch(
    `/backend/api/availability/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error("Could not load calendar");
  }
  return response.json();
}

/** @deprecated Use loadAllProperties */
export async function loadKolonakiProperties(): Promise<Property[]> {
  return loadAllProperties();
}

export async function fetchKolonakiListingsFromApi(): Promise<Property[]> {
  return fetchAllListingsFromApi();
}
