"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { EditorialPropertyGrid } from "@/components/marketplace/editorial-property-grid";
import { MarketplaceStickyControls } from "@/components/marketplace/marketplace-sticky-controls";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { useMarketplace } from "@/context/marketplace-context";
import { COLLECTION_BATCH_SIZE } from "@/lib/editorial-grid";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MarketplacePage() {
  const { homeSearchQuery } = useAppPhase();
  const { t } = useTranslation();
  const {
    sortedProperties,
    filteredProperties,
    setSearchQuery,
    filters,
    sortBy,
    isLoading,
    loadError,
  } = useMarketplace();
  const [visibleCount, setVisibleCount] = useState(COLLECTION_BATCH_SIZE);
  const [previousVisibleCount, setPreviousVisibleCount] = useState(0);

  useEffect(() => {
    if (homeSearchQuery) setSearchQuery(homeSearchQuery);
  }, [homeSearchQuery, setSearchQuery]);

  useEffect(() => {
    setPreviousVisibleCount(0);
    setVisibleCount(COLLECTION_BATCH_SIZE);
  }, [filters, sortBy]);

  const visibleProperties = sortedProperties.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProperties.length;
  const total = filteredProperties.length;

  return (
    <div className="min-h-screen bg-white">
      <GlassHeader variant="solid" />

      <div className="pt-[calc(3.5rem+env(safe-area-inset-top))] sm:pt-[72px]">
        <div className="px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-10 lg:px-16">
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400 sm:text-[11px] sm:tracking-[0.28em]">
            {t.marketplace.eyebrow}
          </p>
          <h1 className="mt-2 max-w-2xl font-serif text-2xl tracking-tight text-neutral-900 sm:mt-3 sm:text-3xl md:text-4xl">
            {t.marketplace.title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 sm:mt-4">
            {isLoading
              ? t.marketplace.loading
              : t.marketplace.loaded(filteredProperties.length)}
          </p>
        </div>

        <MarketplaceStickyControls />

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center px-8">
            <p className="font-serif text-lg tracking-tight text-neutral-400">
              {t.marketplace.loadingGrid}
            </p>
          </div>
        ) : loadError ? (
          <div className="flex min-h-[40vh] items-center justify-center px-8">
            <p className="max-w-md text-center font-serif text-lg tracking-tight text-neutral-500">
              {loadError}
            </p>
          </div>
        ) : sortedProperties.length > 0 ? (
          <>
            <div className="py-10 md:py-14 lg:py-16">
              <EditorialPropertyGrid
                properties={visibleProperties}
                revealFromIndex={previousVisibleCount}
              />
            </div>

            <div className="border-t border-neutral-100 px-4 py-12 text-center sm:px-8 md:px-12 md:py-16 lg:px-16">
              <p className="text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                {t.marketplace.showing(Math.min(visibleCount, total), total)}
              </p>

              {hasMore ? (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setPreviousVisibleCount(visibleCount);
                    setVisibleCount((count) =>
                      Math.min(count + COLLECTION_BATCH_SIZE, sortedProperties.length),
                    );
                  }}
                  className="mt-8 font-serif text-xl tracking-tight text-neutral-900 transition hover:text-neutral-600"
                >
                  {t.marketplace.viewNext}
                  <span className="mt-2 block text-[11px] font-sans tracking-[0.18em] text-neutral-400 uppercase">
                    Chapter {Math.ceil(visibleCount / COLLECTION_BATCH_SIZE) + 1}
                  </span>
                </motion.button>
              ) : (
                <p className="mt-8 font-serif text-lg text-neutral-400">
                  {t.marketplace.endOfCollection}
                </p>
              )}
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[40vh] items-center justify-center px-8"
          >
            <p className="max-w-sm text-center font-serif text-lg tracking-tight text-neutral-400">
              {t.marketplace.empty}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
