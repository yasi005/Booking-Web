"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useCryptoRate, usePreferences } from "@/context/preferences-context";
import { cn, formatPrice } from "@/lib/utils";

export function SeasonalPricingMatrix() {
  const { selectedProperty } = useAppPhase();
  const { cryptoMode, discretionMode } = usePreferences();
  const btcRate = useCryptoRate();

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        Seasonal Rates
      </p>

      <div className={cn("mt-5 space-y-0", discretionMode && "blur-md select-none")}>
        {selectedProperty.seasonalPricing.map((tier, index) => (
          <div
            key={tier.season}
            className={cn(
              "flex items-center justify-between gap-4 py-4",
              index < selectedProperty.seasonalPricing.length - 1 &&
                "border-b border-neutral-100",
            )}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-neutral-200 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-500">
                  {tier.badge}
                </span>
                <p className="truncate text-sm font-light text-neutral-800">{tier.season}</p>
              </div>
              <p className="mt-1.5 text-xs text-neutral-400">{tier.timeframe}</p>
            </div>
            <p className="shrink-0 text-sm font-medium text-neutral-900">
              {formatPrice(tier.rate, cryptoMode, btcRate)}
              <span className="font-light text-neutral-400"> / night</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
