"use client";

import {
  FilterPanelContent,
  SortOptions,
  type FilterPanel,
} from "@/components/marketplace/marketplace-filter-panels";
import { useMarketplace } from "@/context/marketplace-context";
import { useTranslation } from "@/context/locale-context";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const FILTER_SECTIONS: {
  id: FilterPanel;
  labelKey: "budget" | "season" | "architecture" | "amenities";
}[] = [
  { id: "budget", labelKey: "budget" },
  { id: "season", labelKey: "season" },
  { id: "architecture", labelKey: "architecture" },
  { id: "amenities", labelKey: "amenities" },
];

type MarketplaceMobileFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilterCount: number;
};

export function MarketplaceMobileFiltersTrigger({
  onClick,
  activeFilterCount,
}: {
  onClick: () => void;
  activeFilterCount: number;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full border border-neutral-200 bg-white px-5 text-[13px] font-medium tracking-[0.08em] text-neutral-800 shadow-sm transition active:scale-[0.99] hover:border-neutral-300"
    >
      <SlidersHorizontal className="h-4 w-4 text-neutral-500" aria-hidden />
      {t.marketplace.filters.open}
      {activeFilterCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[11px] font-semibold text-white">
          {activeFilterCount}
        </span>
      )}
    </button>
  );
}

function AccordionSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-neutral-100">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-14 w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[13px] font-medium tracking-[0.12em] text-neutral-900 uppercase">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-neutral-400 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MarketplaceMobileFiltersSheet({
  open,
  onOpenChange,
  activeFilterCount,
}: MarketplaceMobileFiltersSheetProps) {
  const { t } = useTranslation();
  const { filteredProperties, resetFilters } = useMarketplace();
  const [expandedSection, setExpandedSection] = useState<FilterPanel | "sort" | null>("budget");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setExpandedSection("budget");
      setSortOpen(false);
    }
  }, [open]);

  const toggleSection = (id: FilterPanel) => {
    setSortOpen(false);
    setExpandedSection((current) => (current === id ? null : id));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] md:hidden"
            aria-label={t.marketplace.filters.close}
            onClick={() => onOpenChange(false)}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 flex max-h-[min(92vh,760px)] flex-col rounded-t-[28px] bg-white shadow-[0_-24px_80px_-24px_rgba(0,0,0,0.28)] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t.marketplace.filters.title}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <div>
                <h2 className="font-serif text-xl tracking-tight text-neutral-900">
                  {t.marketplace.filters.title}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {activeFilterCount > 0
                    ? t.marketplace.filters.activeCount(activeFilterCount)
                    : t.marketplace.filters.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-600"
                aria-label={t.marketplace.filters.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setExpandedSection(null);
                    setSortOpen((value) => !value);
                  }}
                  className="flex min-h-14 w-full items-center justify-between px-5 py-4 text-left"
                  aria-expanded={sortOpen}
                >
                  <span className="text-[13px] font-medium tracking-[0.12em] text-neutral-900 uppercase">
                    {t.marketplace.filters.sort}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-neutral-400 transition-transform duration-200",
                      sortOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>

                <AnimatePresence initial={false}>
                  {sortOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1">
                        <SortOptions variant="mobile" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {FILTER_SECTIONS.map((section) => (
                <AccordionSection
                  key={section.id}
                  title={t.marketplace.filters[section.labelKey]}
                  open={expandedSection === section.id}
                  onToggle={() => toggleSection(section.id)}
                >
                  <FilterPanelContent panel={section.id} variant="mobile" />
                </AccordionSection>
              ))}
            </div>

            <div className="flex gap-3 border-t border-neutral-100 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={resetFilters}
                className="min-h-12 flex-1 rounded-full border border-neutral-200 text-sm font-medium text-neutral-700"
              >
                {t.marketplace.filters.reset}
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-12 flex-[1.4] rounded-full bg-neutral-900 text-sm font-medium text-white"
              >
                {t.marketplace.filters.showResults(filteredProperties.length)}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
