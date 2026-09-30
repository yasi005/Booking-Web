"use client";

import { GlassHeader } from "@/components/discovery/glass-header";
import { EditorialPropertyGrid } from "@/components/marketplace/editorial-property-grid";
import { MarketplaceStickyControls } from "@/components/marketplace/marketplace-sticky-controls";
import { PropertyPagination } from "@/components/marketplace/property-pagination";
import { SiteFooter } from "@/components/layout/site-footer";
import { useAppPhase } from "@/context/app-phase-context";
import { useTranslation } from "@/context/locale-context";
import { useMarketplace } from "@/context/marketplace-context";
import { COLLECTION_BATCH_SIZE } from "@/lib/editorial-grid";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (homeSearchQuery) setSearchQuery(homeSearchQuery);
  }, [homeSearchQuery, setSearchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProperties.length / COLLECTION_BATCH_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * COLLECTION_BATCH_SIZE;
  const pageProperties = sortedProperties.slice(pageStart, pageStart + COLLECTION_BATCH_SIZE);
  const total = filteredProperties.length;
  const visibleStart = total === 0 ? 0 : pageStart + 1;
  const visibleEnd = Math.min(pageStart + pageProperties.length, total);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            <div ref={gridRef} className="scroll-mt-[calc(5.5rem+env(safe-area-inset-top))] py-10 md:py-14 lg:py-16">
              <EditorialPropertyGrid properties={pageProperties} revealFromIndex={0} />
            </div>

            <div className="border-t border-neutral-100 px-4 py-10 text-center sm:px-8 md:px-12 md:py-14 lg:px-16">
              <p className="text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                {visibleStart === visibleEnd
                  ? t.marketplace.showing(visibleEnd, total)
                  : t.marketplace.showingRange(visibleStart, visibleEnd, total)}
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                {t.marketplace.pageOf(safePage, totalPages)}
              </p>

              <PropertyPagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
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

      <SiteFooter />
    </div>
  );
}
