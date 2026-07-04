import type { Property } from "@/types/property";
import { properties as catalogOrder } from "@/data/properties";

export type EditorialLayout = {
  featured: Property | null;
  rows: Property[][];
};

export function buildEditorialLayout(properties: Property[]): EditorialLayout {
  if (properties.length === 0) {
    return { featured: null, rows: [] };
  }

  const [featured, ...rest] = properties;
  const rows: Property[][] = [];

  for (let i = 0; i < rest.length; i += 3) {
    rows.push(rest.slice(i, i + 3));
  }

  return { featured, rows };
}

export const COLLECTION_BATCH_SIZE = 12;

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating";

export function sortProperties(items: Property[], sortBy: SortOption): Property[] {
  const copy = [...items];
  switch (sortBy) {
    case "price-asc":
      return copy.sort((a, b) => a.rent - b.rent);
    case "price-desc":
      return copy.sort((a, b) => b.rent - a.rent);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy.sort(
        (a, b) =>
          catalogOrder.findIndex((p) => p.id === a.id) -
          catalogOrder.findIndex((p) => p.id === b.id),
      );
  }
}
