import type { Property } from "@/types/property";

export function getSeasonalChartData(property: Property) {
  const quiet =
    property.seasonalPricing.find((tier) => tier.badge === "Quiet")?.rate ?? 3800;
  const shoulder =
    property.seasonalPricing.find((tier) => tier.badge === "Shoulder")?.rate ?? 4500;
  const peak =
    property.seasonalPricing.find((tier) => tier.badge === "Peak")?.rate ?? 5200;

  return [
    { season: "Low (Spring)", rate: quiet },
    { season: "Peak (Summer)", rate: peak },
    { season: "Shoulder (Autumn)", rate: shoulder },
    { season: "Peak (Winter)", rate: peak },
  ];
}

export function getAnchorRate(property: Property) {
  return (
    property.seasonalPricing.find((tier) => tier.badge === "Shoulder")?.rate ??
    property.rent
  );
}
