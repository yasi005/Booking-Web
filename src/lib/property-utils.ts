import type { Property } from "@/types/property";

export function getSeasonalChartData(property: Property) {
  const base = getAnchorRate(property);
  const quiet =
    property.seasonalPricing.find((tier) => tier.badge === "Quiet")?.rate ??
    Math.round(base * 0.85);
  const shoulder =
    property.seasonalPricing.find((tier) => tier.badge === "Shoulder")?.rate ?? base;
  const peak =
    property.seasonalPricing.find((tier) => tier.badge === "Peak")?.rate ??
    Math.round(base * 1.25);

  return [
    { season: "Low (Spring)", rate: quiet },
    { season: "Peak (Summer)", rate: peak },
    { season: "Shoulder (Autumn)", rate: shoulder },
    { season: "Peak (Winter)", rate: peak },
  ];
}

export function getSeasonalChartYDomain(rates: number[]): [number, number] {
  if (rates.length === 0) return [0, 100];

  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const span = Math.max(max - min, max * 0.1, 5);
  const padding = span * 0.12;

  let yMin = Math.max(0, min - padding);
  let yMax = max + padding;

  if (yMax < 150) {
    yMin = Math.floor(yMin / 5) * 5;
    yMax = Math.ceil(yMax / 5) * 5;
  } else if (yMax < 1000) {
    yMin = Math.floor(yMin / 10) * 10;
    yMax = Math.ceil(yMax / 10) * 10;
  } else {
    yMin = Math.floor(yMin / 50) * 50;
    yMax = Math.ceil(yMax / 50) * 50;
  }

  if (yMax <= yMin) yMax = yMin + 10;
  return [yMin, yMax];
}

export function formatSeasonalAxisTick(value: number, chartMax: number): string {
  if (chartMax < 200) return `$${Math.round(value)}`;
  if (value >= 1000) {
    const thousands = value / 1000;
    return `$${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return `$${Math.round(value)}`;
}

export function getAnchorRate(property: Property) {
  return (
    property.seasonalPricing.find((tier) => tier.badge === "Shoulder")?.rate ??
    property.rent
  );
}
