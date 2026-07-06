"use client";

import {
  FilterPanelContent,
  SortOptions,
  type FilterPanel,
} from "@/components/marketplace/marketplace-filter-panels";
import {
  MarketplaceMobileFiltersSheet,
  MarketplaceMobileFiltersTrigger,
} from "@/components/marketplace/marketplace-mobile-filters-sheet";
import { useTranslation } from "@/context/locale-context";
import { useMarketplace } from "@/context/marketplace-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FILTER_LINKS: {
  id: FilterPanel;
  labelKey: "budget" | "season" | "architecture" | "amenities";
}[] = [
  { id: "budget", labelKey: "budget" },
  { id: "season", labelKey: "season" },
  { id: "architecture", labelKey: "architecture" },
  { id: "amenities", labelKey: "amenities" },
];

const panelMotion = {
  initial: { opacity: 0, y: -10, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.98 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

type OpenPanel = FilterPanel | "sort" | null;

function countActiveFilters(
  filters: ReturnType<typeof useMarketplace>["filters"],
  defaultPriceRange: [number, number],
) {
  let count = 0;
  if (
    filters.priceRange[0] !== defaultPriceRange[0] ||
    filters.priceRange[1] !== defaultPriceRange[1]
  ) {
    count += 1;
  }
  if (filters.season !== null) count += 1;
  if (filters.propertyTypes.length > 0) count += 1;
  if (filters.infinityPool || filters.privateHelipad || filters.automatedConcierge) count += 1;
  return count;
}

export function MarketplaceStickyControls() {
  const { t } = useTranslation();
  const { filters, resetFilters, filteredProperties, defaultPriceRange } =
    useMarketplace();

  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const activeFilterCount = countActiveFilters(filters, defaultPriceRange);
  const hasAnyFilter = activeFilterCount > 0;

  const isLinkActive = (id: FilterPanel) => {
    if (openPanel === id) return true;
    if (id === "budget") {
      return (
        filters.priceRange[0] !== defaultPriceRange[0] ||
        filters.priceRange[1] !== defaultPriceRange[1]
      );
    }
    if (id === "season") return filters.season !== null;
    if (id === "architecture") return filters.propertyTypes.length > 0;
    return filters.infinityPool || filters.privateHelipad || filters.automatedConcierge;
  };

  const togglePanel = (id: OpenPanel) => {
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

  return (
    <>
      <div
        ref={barRef}
        className="sticky top-[calc(3.5rem+env(safe-area-inset-top))] z-40 border-b border-neutral-100/80 bg-white/90 backdrop-blur-xl sm:top-[72px]"
      >
        <div className="mx-auto max-w-[1600px]">
          <div className="px-4 py-3 md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.14em] text-neutral-500 uppercase">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1
                  ? t.marketplace.estate
                  : t.marketplace.estates}
              </p>
              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[10px] tracking-[0.12em] text-neutral-400 uppercase transition hover:text-neutral-800"
                >
                  {t.marketplace.filters.reset}
                </button>
              )}
            </div>
            <MarketplaceMobileFiltersTrigger
              onClick={() => setMobileFiltersOpen(true)}
              activeFilterCount={activeFilterCount}
            />
          </div>

          <div className="relative hidden md:block">
            <div className="border-b border-neutral-200 px-8 lg:px-16">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-6 lg:gap-x-8">
                {FILTER_LINKS.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-6 lg:gap-8">
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
                      {t.marketplace.filters[link.labelKey]}
                      {isLinkActive(link.id) && (
                        <span className="absolute -bottom-1.5 left-0 h-px w-full bg-neutral-900" />
                      )}
                    </button>
                  </div>
                ))}

                <span className="select-none text-neutral-300" aria-hidden>
                  —
                </span>

                <button
                  type="button"
                  onClick={() => togglePanel("sort")}
                  className={cn(
                    "relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-200",
                    openPanel === "sort"
                      ? "text-neutral-900"
                      : "text-neutral-400 hover:text-neutral-700",
                  )}
                >
                  {t.marketplace.filters.sort}
                  {openPanel === "sort" && (
                    <span className="absolute -bottom-1.5 left-0 h-px w-full bg-neutral-900" />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {openPanel && (
                <motion.div
                  key={openPanel}
                  {...panelMotion}
                  className="absolute top-full left-1/2 z-50 w-[min(calc(100vw-2.5rem),420px)] -translate-x-1/2 px-4 pt-1"
                >
                  <div className="rounded-2xl border border-neutral-200/60 bg-white/95 p-7 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                    {openPanel === "sort" ? (
                      <SortOptions variant="bar" onSelect={() => setOpenPanel(null)} />
                    ) : (
                      <FilterPanelContent panel={openPanel} variant="bar" />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* <div className="flex items-center justify-between px-8 py-3 lg:px-16">
              <p className="text-xs text-neutral-500">
                {filteredProperties.length}{" "}
                {filteredProperties.length === 1
                  ? t.marketplace.estate
                  : t.marketplace.estates}
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
                  {t.marketplace.filters.reset}
                </button>
              )}
            </div> */}
          </div>
        </div>
      </div>

      <MarketplaceMobileFiltersSheet
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        activeFilterCount={activeFilterCount}
      />
    </>
  );
}
