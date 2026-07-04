"use client";

import { properties } from "@/data/properties";
import { getAnchorRate } from "@/lib/property-utils";

const MIN = 2400;
const MAX = 7000;
const BUCKETS = 12;

export function buildPriceHistogram() {
  const rates = properties.map(getAnchorRate);
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
