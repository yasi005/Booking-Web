"use client";

import { useMarketplace } from "@/context/marketplace-context";
import { useTranslation } from "@/context/locale-context";
import { PROPERTY_TYPE_LABELS, SEASON_LABELS } from "@/lib/marketplace-filters";
import {
  buildPriceHistogram,
  getPriceRangeMinGap,
  getPriceStep,
  isOpenEndedMax,
} from "@/lib/price-histogram";
import type { SortOption } from "@/lib/editorial-grid";
import type { PropertyType, TravelSeason } from "@/types/property";
import { cn } from "@/lib/utils";
import { useMemo, type ReactNode } from "react";

export const SEASONS: TravelSeason[] = ["spring", "summer", "autumn", "winter"];
export const TYPES: PropertyType[] = ["open-concept-villa", "beachfront", "boutique-estate"];
export const AMENITIES = [
  ["infinityPool", "Infinity Pool"],
  ["privateHelipad", "Private Helipad"],
  ["automatedConcierge", "Automated Concierge"],
] as const;

export type FilterPanel = "budget" | "season" | "architecture" | "amenities";
export type FilterPanelVariant = "compact" | "bar" | "mobile";

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Curated",
  "price-asc": "Price ↑",
  "price-desc": "Price ↓",
  rating: "Top Rated",
};

function DropdownOption({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-xl px-3 py-2 text-left text-[13px] transition",
        active
          ? "bg-neutral-900/[0.06] font-medium text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
      )}
    >
      {children}
    </button>
  );
}

function BarOption({
  active,
  onClick,
  children,
  trailing,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm transition",
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-100/80",
      )}
    >
      <span>{children}</span>
      {trailing}
    </button>
  );
}

function MobileOption({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-2xl border px-4 py-3 text-left text-[15px] transition active:scale-[0.98]",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300",
      )}
    >
      {children}
    </button>
  );
}

export function BudgetPanel({ variant = "compact" }: { variant?: FilterPanelVariant }) {
  const { filters, setPriceRange, allProperties, defaultPriceRange } = useMarketplace();
  const { t } = useTranslation();
  const [priceMin, priceMax] = defaultPriceRange;
  const step = getPriceStep(priceMin, priceMax);
  const minGap = getPriceRangeMinGap(priceMin, priceMax);
  const histogram = useMemo(() => buildPriceHistogram(allProperties), [allProperties]);
  const [min, max] = filters.priceRange;
  const isBar = variant === "bar";
  const isMobile = variant === "mobile";
  const rangeSpan = Math.max(priceMax - priceMin, 1);

  return (
    <div className={cn("space-y-3", (isBar || isMobile) && "space-y-5 px-1 py-1")}>
      {isBar && (
        <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
          {t.marketplace.filters.budgetDistribution}
        </p>
      )}

      <div
        className={cn(
          "flex items-end gap-[2px]",
          isBar || isMobile ? "h-16 gap-[3px] px-1" : "h-8",
        )}
      >
        {histogram.map((bar, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-[2px] transition-colors duration-300",
              bar.x >= min && bar.x <= max ? "bg-neutral-800" : "bg-neutral-200/80",
              (isBar || isMobile) && "rounded-sm",
            )}
            style={{ height: `${Math.max(bar.height * 100, isBar ? 10 : 12)}%` }}
          />
        ))}
      </div>

      {isBar ? (
        <div className="relative px-1 pt-2">
          <div className="relative h-1 rounded-full bg-neutral-200/80">
            <div
              className="absolute inset-y-0 rounded-full bg-neutral-900 transition-all duration-150"
              style={{
                left: `${((min - priceMin) / rangeSpan) * 100}%`,
                right: `${100 - ((max - priceMin) / rangeSpan) * 100}%`,
              }}
            />
          </div>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={min}
            onChange={(e) =>
              setPriceRange([Math.min(Number(e.target.value), max - minGap), max])
            }
            className="luxury-range absolute inset-x-0 top-2 z-10 h-4 w-full cursor-pointer appearance-none bg-transparent"
            aria-label={t.marketplace.filters.budgetMin}
          />
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={max}
            onChange={(e) =>
              setPriceRange([min, Math.max(Number(e.target.value), min + minGap)])
            }
            className="luxury-range absolute inset-x-0 top-2 z-20 h-4 w-full cursor-pointer appearance-none bg-transparent"
            aria-label={t.marketplace.filters.budgetMax}
          />
        </div>
      ) : (
        <>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={min}
            onChange={(e) =>
              setPriceRange([Math.min(Number(e.target.value), max - minGap), max])
            }
            className={cn("luxury-range w-full accent-neutral-900", isMobile && "h-8")}
            aria-label={t.marketplace.filters.budgetMin}
          />
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            step={step}
            value={max}
            onChange={(e) =>
              setPriceRange([min, Math.max(Number(e.target.value), min + minGap)])
            }
            className={cn("luxury-range w-full accent-neutral-900", isMobile && "h-8")}
            aria-label={t.marketplace.filters.budgetMax}
          />
        </>
      )}

      <p
        className={cn(
          "text-center tracking-wide text-neutral-500",
          isBar || isMobile
            ? "font-serif text-lg tracking-tight text-neutral-800"
            : "text-[11px]",
        )}
      >
        €{min.toLocaleString()}
        <span className={cn(isBar || isMobile ? "mx-2 text-neutral-300" : "")}>
          {isBar || isMobile ? "—" : " — "}
        </span>
        €{max.toLocaleString()}{isOpenEndedMax(max) && "+"}
        <span className={cn(isBar || isMobile ? "ml-1 text-sm text-neutral-400" : "")}>
          {" "}
          {t.marketplace.filters.perNight}
        </span>
      </p>
    </div>
  );
}

export function FilterPanelContent({
  panel,
  variant = "compact",
}: {
  panel: FilterPanel;
  variant?: FilterPanelVariant;
}) {
  const { filters, setSeason, togglePropertyType, clearPropertyTypes, toggleVip } =
    useMarketplace();
  const { t } = useTranslation();
  const Option =
    variant === "bar" ? BarOption : variant === "mobile" ? MobileOption : DropdownOption;
  const listClass =
    variant === "bar" || variant === "mobile"
      ? "flex flex-col gap-1"
      : undefined;

  if (panel === "budget") {
    return (
      <div className={variant === "compact" ? "min-w-[240px]" : "w-full"}>
        <BudgetPanel variant={variant} />
      </div>
    );
  }

  if (panel === "season") {
    const options = (
      <>
        <Option active={!filters.season} onClick={() => setSeason(null)}>
          {t.marketplace.filters.allSeasons}
        </Option>
        {SEASONS.map((season) => (
          <Option
            key={season}
            active={filters.season === season}
            onClick={() => setSeason(season)}
          >
            {SEASON_LABELS[season]}
          </Option>
        ))}
      </>
    );

    return variant === "mobile" ? (
      <div className="grid grid-cols-2 gap-2">{options}</div>
    ) : (
      <div className={listClass}>{options}</div>
    );
  }

  if (panel === "architecture") {
    const options = (
      <>
        <Option
          active={filters.propertyTypes.length === 0}
          onClick={clearPropertyTypes}
        >
          {t.marketplace.filters.allArchitecture}
        </Option>
        {TYPES.map((type) => (
          <Option
            key={type}
            active={filters.propertyTypes.includes(type)}
            onClick={() => togglePropertyType(type)}
          >
            {PROPERTY_TYPE_LABELS[type]}
          </Option>
        ))}
      </>
    );

    return <div className={listClass}>{options}</div>;
  }

  const amenityOptions = AMENITIES.map(([key, label]) => (
    <Option
      key={key}
      active={filters[key]}
      onClick={() => toggleVip(key)}
      trailing={
        variant === "bar" ? (
          <span
            className={cn(
              "h-2 w-2 rounded-full transition",
              filters[key] ? "bg-white" : "bg-neutral-300",
            )}
          />
        ) : undefined
      }
    >
      {label}
    </Option>
  ));

  return <div className={listClass}>{amenityOptions}</div>;
}

export function SortOptions({
  variant = "compact",
  onSelect,
}: {
  variant?: FilterPanelVariant;
  onSelect?: () => void;
}) {
  const { sortBy, setSortBy } = useMarketplace();
  const Option =
    variant === "bar" ? BarOption : variant === "mobile" ? MobileOption : DropdownOption;

  return (
    <div className={variant === "bar" || variant === "mobile" ? "flex flex-col gap-1" : undefined}>
      {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
        <Option
          key={option}
          active={sortBy === option}
          onClick={() => {
            setSortBy(option);
            onSelect?.();
          }}
        >
          {SORT_LABELS[option]}
        </Option>
      ))}
    </div>
  );
}
