"use client";

import { getAllProperties } from "@/lib/property-registry";
import { getAnchorRate } from "@/lib/property-utils";

const MIN = 0;
const MAX = 6500;
const BUCKETS = 12;

export function buildPriceHistogram() {
  const rates = getAllProperties().map(getAnchorRate);
  const bucketSize = (MAX - MIN) / BUCKETS;
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

export { MIN as PRICE_MIN, MAX as PRICE_MAX };
