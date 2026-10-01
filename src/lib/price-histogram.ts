import { getAllProperties } from "@/lib/property-registry";
import { getAnchorRate } from "@/lib/property-utils";
import type { Property } from "@/types/property";

const BUCKETS = 12;
/** Budget slider always spans €0–€1000; the top end means "€1000 and up". */
const FALLBACK_BOUNDS = { min: 0, max: 1000 } as const;

export type PriceBounds = { min: number; max: number };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCatalogPriceBounds(_catalog?: Property[]): PriceBounds {
  return { ...FALLBACK_BOUNDS };
}

/** True when the max handle is at the top, i.e. no upper price limit. */
export function isOpenEndedMax(max: number): boolean {
  return max >= FALLBACK_BOUNDS.max;
}

export function getPriceStep(min: number, max: number): number {
  const span = max - min;
  if (span <= 100) return 5;
  if (span <= 1000) return 10;
  if (span <= 2000) return 25;
  if (span <= 5000) return 50;
  return 100;
}

export function getPriceRangeMinGap(min: number, max: number): number {
  return getPriceStep(min, max);
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
