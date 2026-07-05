import {
  mapHostawayListingToProperty,
  type CachedHostawayListing,
} from "@/lib/hostaway-mapper";
import type { Property } from "@/types/property";

const BACKEND_API = "/backend/api";

type ListingsPayload = {
  listings: CachedHostawayListing[];
};

export async function fetchAllListingsFromApi(): Promise<Property[]> {
  const response = await fetch(`${BACKEND_API}/listings`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Backend listings request failed (${response.status})`);
  }

  const payload = (await response.json()) as ListingsPayload;
  return payload.listings.map(mapHostawayListingToProperty);
}

export async function fetchAllListingsFromFile(): Promise<Property[]> {
  const response = await fetch("/all-hostaway-listings.json");
  if (!response.ok) {
    throw new Error("All listings file not found");
  }

  const payload = (await response.json()) as ListingsPayload;
  return payload.listings
    .filter((listing) => listing.published !== false)
    .map(mapHostawayListingToProperty);
}

export async function loadAllProperties(): Promise<Property[]> {
  try {
    return await fetchAllListingsFromApi();
  } catch {
    return fetchAllListingsFromFile();
  }
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

export async function fetchKolonakiListingsFromFile(): Promise<Property[]> {
  return fetchAllListingsFromFile();
}
