export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number, currency = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCryptoBtc(usdValue: number, btcRate: number) {
  const btc = usdValue * btcRate;
  return `₿ ${btc.toFixed(4)}`;
}

export function formatPrice(usdValue: number, cryptoMode: boolean, btcRate: number) {
  return cryptoMode ? formatCryptoBtc(usdValue, btcRate) : formatCurrency(usdValue);
}

export function getNightlyRateForMonth(
  month: number,
  seasonalPricing: Array<{ badge: string; rate: number }>,
) {
  const peak = seasonalPricing.find((s) => s.badge === "Peak")?.rate ?? 0;
  const shoulder = seasonalPricing.find((s) => s.badge === "Shoulder")?.rate ?? 0;
  const quiet = seasonalPricing.find((s) => s.badge === "Quiet")?.rate ?? 0;

  if ([5, 9, 10].includes(month)) return quiet;
  if ([6, 7, 8, 11, 0].includes(month)) return peak;
  return shoulder;
}
