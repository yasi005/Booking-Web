import type { Property } from "@/types/property";

let catalog: Property[] = [];
let catalogVersion = 0;

export function setPropertyCatalog(items: Property[]) {
  catalog = items;
  catalogVersion += 1;
}

export function getCatalogVersion() {
  return catalogVersion;
}

export function getAllProperties(): Property[] {
  return catalog;
}

export function getFeaturedProperty(): Property | null {
  return catalog[0] ?? null;
}

export function getPropertyById(id: string): Property | undefined {
  return catalog.find((property) => property.id === id);
}

export function isCatalogReady(): boolean {
  return catalog.length > 0;
}
