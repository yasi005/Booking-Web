"use client";

import { useMarketplace } from "@/context/marketplace-context";
import { PROPERTY_TYPE_LABELS, SEASON_LABELS } from "@/lib/marketplace-filters";
import { buildPriceHistogram, getPriceRangeMinGap, getPriceStep } from "@/lib/price-histogram";
import type { PropertyType, TravelSeason } from "@/types/property";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const SEASONS: TravelSeason[] = ["spring", "summer", "autumn", "winter"];
const TYPES: PropertyType[] = ["open-concept-villa", "beachfront", "boutique-estate"];

const AMENITIES = [
  ["infinityPool", "Infinity Pool"],
  ["privateHelipad", "Private Helipad"],
  ["automatedConcierge", "Automated Concierge"],
] as const;

type Panel = "budget" | "season" | "architecture" | "amenities";

const LINKS: { id: Panel; label: string }[] = [
  { id: "budget", label: "Budget" },
  { id: "season", label: "Season" },
  { id: "architecture", label: "Architecture" },
  { id: "amenities", label: "Amenities" },
];

const panelMotion = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

function BudgetPanel() {
  const { filters, setPriceRange, allProperties, defaultPriceRange } = useMarketplace();
  const [priceMin, priceMax] = defaultPriceRange;
  const step = getPriceStep(priceMin, priceMax);
  const minGap = getPriceRangeMinGap(priceMin, priceMax);
  const rangeSpan = Math.max(priceMax - priceMin, 1);
  const histogram = useMemo(() => buildPriceHistogram(allProperties), [allProperties]);
  const [min, max] = filters.priceRange;

  return (
    <div className="space-y-6">
      <p className="text-center text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        Nightly rate distribution
      </p>

      <div className="flex h-16 items-end gap-[3px] px-1">
        {histogram.map((bar, i) => {
          const inRange = bar.x >= min && bar.x <= max;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm transition-colors duration-300",
                inRange ? "bg-neutral-800" : "bg-neutral-200/80",
              )}
              style={{ height: `${Math.max(bar.height * 100, 10)}%` }}
            />
          );
        })}
      </div>

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
          onChange={(e) => {
            const next = Number(e.target.value);
            setPriceRange([Math.min(next, max - minGap), max]);
          }}
          className="luxury-range absolute inset-x-0 top-2 z-10 h-4 w-full cursor-pointer appearance-none bg-transparent"
          aria-label="Minimum budget"
        />
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          step={step}
          value={max}
          onChange={(e) => {
            const next = Number(e.target.value);
            setPriceRange([min, Math.max(next, min + minGap)]);
          }}
          className="luxury-range absolute inset-x-0 top-2 z-20 h-4 w-full cursor-pointer appearance-none bg-transparent"
          aria-label="Maximum budget"
        />
      </div>

      <p className="text-center font-serif text-lg tracking-tight text-neutral-800">
        ${min.toLocaleString()}
        <span className="mx-2 text-neutral-300">—</span>
        ${max.toLocaleString()}
        <span className="ml-1 text-sm text-neutral-400">/ night</span>
      </p>
    </div>
  );
}

function SeasonPanel() {
  const { filters, setSeason } = useMarketplace();

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setSeason(null)}
        className={cn(
          "rounded-lg px-4 py-3 text-left text-sm transition",
          !filters.season
            ? "bg-neutral-900 text-white"
            : "text-neutral-600 hover:bg-neutral-100/80",
        )}
      >
        All Seasons
      </button>
      {SEASONS.map((season) => (
        <button
          key={season}
          type="button"
          onClick={() => setSeason(season)}
          className={cn(
            "rounded-lg px-4 py-3 text-left text-sm transition",
            filters.season === season
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100/80",
          )}
        >
          {SEASON_LABELS[season]}
        </button>
      ))}
    </div>
  );
}

function ArchitecturePanel() {
  const { filters, togglePropertyType, clearPropertyTypes } = useMarketplace();
  const hasFilter = filters.propertyTypes.length > 0;

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={clearPropertyTypes}
        className={cn(
          "rounded-lg px-4 py-3 text-left text-sm transition",
          !hasFilter
            ? "bg-neutral-900 text-white"
            : "text-neutral-600 hover:bg-neutral-100/80",
        )}
      >
        All Architecture
      </button>
      {TYPES.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => togglePropertyType(type)}
          className={cn(
            "rounded-lg px-4 py-3 text-left text-sm transition",
            filters.propertyTypes.includes(type)
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100/80",
          )}
        >
          {PROPERTY_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}

function AmenitiesPanel() {
  const { filters, toggleVip } = useMarketplace();

  return (
    <div className="flex flex-col gap-2">
      {AMENITIES.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => toggleVip(key)}
          className={cn(
            "flex items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition",
            filters[key]
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100/80",
          )}
        >
          {label}
          <span
            className={cn(
              "h-2 w-2 rounded-full transition",
              filters[key] ? "bg-white" : "bg-neutral-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function PanelContent({ panel }: { panel: Panel }) {
  switch (panel) {
    case "budget":
      return <BudgetPanel />;
    case "season":
      return <SeasonPanel />;
    case "architecture":
      return <ArchitecturePanel />;
    case "amenities":
      return <AmenitiesPanel />;
  }
}

export function MarketplaceFilterBar() {
  const { filters, resetFilters, filteredProperties, allProperties, defaultPriceRange } =
    useMarketplace();
  const [openPanel, setOpenPanel] = useState<Panel | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const hasBudgetFilter =
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1];
  const hasSeasonFilter = filters.season !== null;
  const hasArchFilter = filters.propertyTypes.length > 0;
  const hasAmenityFilter =
    filters.infinityPool || filters.privateHelipad || filters.automatedConcierge;

  const isLinkActive = (id: Panel) => {
    if (openPanel === id) return true;
    if (id === "budget") return hasBudgetFilter;
    if (id === "season") return hasSeasonFilter;
    if (id === "architecture") return hasArchFilter;
    return hasAmenityFilter;
  };

  const togglePanel = (id: Panel) => {
    setOpenPanel((current) => (current === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasAnyFilter =
    hasBudgetFilter || hasSeasonFilter || hasArchFilter || hasAmenityFilter;

  return (
    <div ref={barRef} className="relative border-b border-neutral-100 bg-white">
      <div className="mx-8 border-b border-neutral-200 md:mx-16">
        <div className="flex items-center justify-center gap-4 py-7 md:gap-8">
          {LINKS.map((link, index) => (
            <div key={link.id} className="flex items-center gap-4 md:gap-8">
              {index > 0 && (
                <span className="select-none text-neutral-300" aria-hidden>
                  —
                </span>
              )}
              <button
                type="button"
                onClick={() => togglePanel(link.id)}
                className={cn(
                  "relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-200",
                  isLinkActive(link.id)
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-700",
                )}
              >
                {link.label}
                {isLinkActive(link.id) && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-neutral-900" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openPanel && (
          <motion.div
            key={openPanel}
            {...panelMotion}
            className="absolute top-full left-1/2 z-50 w-[min(calc(100vw-2.5rem),400px)] -translate-x-1/2 px-4"
          >
            <div className="rounded-2xl border border-white/50 bg-white/75 p-7 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <PanelContent panel={openPanel} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between px-8 py-3 md:px-16">
        <p className="text-xs text-neutral-500">
          {filteredProperties.length} of {allProperties.length} residences
        </p>
        {hasAnyFilter && (
          <button
            type="button"
            onClick={() => {
              resetFilters();
              setOpenPanel(null);
            }}
            className="text-xs tracking-[0.1em] text-neutral-400 uppercase transition hover:text-neutral-800"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
