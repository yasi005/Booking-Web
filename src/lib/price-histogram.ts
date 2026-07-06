import { getAllProperties } from "@/lib/property-registry";
import { getAnchorRate } from "@/lib/property-utils";
import type { Property } from "@/types/property";

const BUCKETS = 12;
const FALLBACK_BOUNDS = { min: 0, max: 1000 } as const;

export type PriceBounds = { min: number; max: number };

function roundBounds(rawMin: number, rawMax: number): PriceBounds {
  const min = Math.max(0, Math.floor(rawMin / 10) * 10);
  let max = Math.ceil(rawMax / 10) * 10;
  if (max <= min) max = min + 10;
  return { min, max };
}

export function getCatalogPriceBounds(catalog?: Property[]): PriceBounds {
  const properties = catalog ?? getAllProperties();
  const rates = properties
    .map(getAnchorRate)
    .filter((rate) => Number.isFinite(rate) && rate > 0);

  if (rates.length === 0) {
    return { ...FALLBACK_BOUNDS };
  }

  return roundBounds(Math.min(...rates), Math.max(...rates));
}

export function getPriceStep(min: number, max: number): number {
  const span = max - min;
  if (span <= 100) return 5;
  if (span <= 500) return 10;
  if (span <= 2000) return 25;
  if (span <= 5000) return 50;
  return 100;
}

export function getPriceRangeMinGap(min: number, max: number): number {
  return Math.max(getPriceStep(min, max), Math.round((max - min) * 0.05));
}

export function buildPriceHistogram(catalog?: Property[]) {
  const { min: MIN, max: MAX } = getCatalogPriceBounds(catalog);
  const rates = (catalog ?? getAllProperties()).map(getAnchorRate);
  const bucketSize = (MAX - MIN) / BUCKETS || 1;
  const counts = Array.from({ length: BUCKETS }, () => 0);

  rates.forEach((rate) => {
    const index = Math.min(
      BUCKETS - 1,
      Math.max(0, Math.floor((rate - MIN) / bucketSize)),
    );
    counts[index]++;
  });

  const maxCount = Math.max(...counts, 1);

  return counts.map((count, i) => ({
    x: MIN + i * bucketSize,
    height: count / maxCount,
    count,
  }));
}

/** @deprecated Use getCatalogPriceBounds() for live Hostaway rates */
export const PRICE_MIN = FALLBACK_BOUNDS.min;
/** @deprecated Use getCatalogPriceBounds() for live Hostaway rates */
export const PRICE_MAX = FALLBACK_BOUNDS.max;
