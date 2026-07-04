"use client";

import { useMarketplace } from "@/context/marketplace-context";
import { PROPERTY_TYPE_LABELS, SEASON_LABELS } from "@/lib/marketplace-filters";
import { buildPriceHistogram, PRICE_MAX, PRICE_MIN } from "@/lib/price-histogram";
import type { SortOption } from "@/lib/editorial-grid";
import type { PropertyType, TravelSeason } from "@/types/property";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const SEASONS: TravelSeason[] = ["spring", "summer", "autumn", "winter"];
const TYPES: PropertyType[] = ["open-concept-villa", "beachfront", "boutique-estate"];
const AMENITIES = [
  ["infinityPool", "Infinity Pool"],
  ["privateHelipad", "Private Helipad"],
  ["automatedConcierge", "Automated Concierge"],
] as const;

type Panel = "budget" | "season" | "architecture" | "amenities";

const FILTER_LINKS: { id: Panel; label: string }[] = [
  { id: "budget", label: "Budget" },
  { id: "season", label: "Season" },
  { id: "architecture", label: "Architecture" },
  { id: "amenities", label: "Amenities" },
];

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Curated",
  "price-asc": "Price ↑",
  "price-desc": "Price ↓",
  rating: "Top Rated",
};

const panelMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

const dropdownShell =
  "absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/95 shadow-[0_16px_48px_-20px_rgba(0,0,0,0.18)] backdrop-blur-xl";

function LuxDropdown({
  label,
  active,
  open,
  onToggle,
  align = "left",
  children,
}: {
  label: string;
  active?: boolean;
  open: boolean;
  onToggle: () => void;
  align?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[10px] tracking-[0.12em] uppercase transition-all duration-200",
          open || active
            ? "border-neutral-900/15 bg-neutral-900/[0.05] text-neutral-900 shadow-sm"
            : "border-neutral-200/90 bg-white/70 text-neutral-500 hover:border-neutral-300 hover:text-neutral-800",
        )}
      >
        {label}
        {active && !open && (
          <span className="h-1 w-1 rounded-full bg-neutral-900" aria-hidden />
        )}
        <ChevronDown
          className={cn("h-3 w-3 opacity-60 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            {...panelMotion}
            className={cn(dropdownShell, align === "right" ? "right-0 min-w-[188px]" : "left-0 min-w-[200px]")}
          >
            <div className="p-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

function BudgetPanel() {
  const { filters, setPriceRange } = useMarketplace();
  const histogram = useMemo(() => buildPriceHistogram(), []);
  const [min, max] = filters.priceRange;

  return (
    <div className="space-y-3 px-1 py-1">
      <div className="flex h-8 items-end gap-[2px]">
        {histogram.map((bar, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-[2px]",
              bar.x >= min && bar.x <= max ? "bg-neutral-800" : "bg-neutral-200/80",
            )}
            style={{ height: `${Math.max(bar.height * 100, 12)}%` }}
          />
        ))}
      </div>
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        value={min}
        onChange={(e) =>
          setPriceRange([Math.min(Number(e.target.value), max - 200), max])
        }
        className="luxury-range w-full accent-neutral-900"
      />
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={100}
        value={max}
        onChange={(e) =>
          setPriceRange([min, Math.max(Number(e.target.value), min + 200)])
        }
        className="luxury-range w-full accent-neutral-900"
      />
      <p className="text-center text-[11px] tracking-wide text-neutral-500">
        ${min.toLocaleString()} — ${max.toLocaleString()} / night
      </p>
    </div>
  );
}

function PanelContent({ panel }: { panel: Panel }) {
  const { filters, setSeason, togglePropertyType, clearPropertyTypes, toggleVip } =
    useMarketplace();

  if (panel === "budget") {
    return (
      <div className="min-w-[240px]">
        <BudgetPanel />
      </div>
    );
  }

  if (panel === "season") {
    return (
      <>
        <DropdownOption active={!filters.season} onClick={() => setSeason(null)}>
          All Seasons
        </DropdownOption>
        {SEASONS.map((s) => (
          <DropdownOption key={s} active={filters.season === s} onClick={() => setSeason(s)}>
            {SEASON_LABELS[s]}
          </DropdownOption>
        ))}
      </>
    );
  }

  if (panel === "architecture") {
    return (
      <>
        <DropdownOption active={filters.propertyTypes.length === 0} onClick={clearPropertyTypes}>
          All Architecture
        </DropdownOption>
        {TYPES.map((type) => (
          <DropdownOption
            key={type}
            active={filters.propertyTypes.includes(type)}
            onClick={() => togglePropertyType(type)}
          >
            {PROPERTY_TYPE_LABELS[type]}
          </DropdownOption>
        ))}
      </>
    );
  }

  return (
    <>
      {AMENITIES.map(([key, label]) => (
        <DropdownOption key={key} active={filters[key]} onClick={() => toggleVip(key)}>
          {label}
        </DropdownOption>
      ))}
    </>
  );
}

export function MarketplaceStickyControls() {
  const { filters, resetFilters, filteredProperties, sortBy, setSortBy } =
    useMarketplace();

  const [openPanel, setOpenPanel] = useState<Panel | null>(null);
  const [sortOpen, setSortOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const hasBudgetFilter =
    filters.priceRange[0] !== 2400 || filters.priceRange[1] !== 6800;
  const hasSeasonFilter = filters.season !== null;
  const hasArchFilter = filters.propertyTypes.length > 0;
  const hasAmenityFilter =
    filters.infinityPool || filters.privateHelipad || filters.automatedConcierge;
  const hasAnyFilter =
    hasBudgetFilter || hasSeasonFilter || hasArchFilter || hasAmenityFilter;

  const isPanelActive = (id: Panel) => {
    if (id === "budget") return hasBudgetFilter;
    if (id === "season") return hasSeasonFilter;
    if (id === "architecture") return hasArchFilter;
    return hasAmenityFilter;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={barRef}
      className="sticky top-[72px] z-40 border-b border-neutral-100/80 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-[1600px] px-4 py-3 sm:px-6 md:px-12 lg:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="shrink-0 text-[10px] tracking-[0.14em] text-neutral-500 uppercase sm:text-[11px]">
            {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "Estate" : "Estates"}
          </p>

          <div className="flex min-w-0 items-center gap-2 sm:justify-end">
            <div className="-mx-1 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-1 pb-0.5 scrollbar-none sm:flex-none sm:overflow-visible">
              {FILTER_LINKS.map((link) => (
                <LuxDropdown
                  key={link.id}
                  label={link.label}
                  active={isPanelActive(link.id)}
                  open={openPanel === link.id}
                  onToggle={() => {
                    setSortOpen(false);
                    setOpenPanel((p) => (p === link.id ? null : link.id));
                  }}
                >
                  <PanelContent panel={link.id} />
                </LuxDropdown>
              ))}

              <LuxDropdown
                label={`Sort · ${SORT_LABELS[sortBy]}`}
                open={sortOpen}
                align="right"
                onToggle={() => {
                  setOpenPanel(null);
                  setSortOpen((o) => !o);
                }}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <DropdownOption
                    key={option}
                    active={sortBy === option}
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                  >
                    {SORT_LABELS[option]}
                  </DropdownOption>
                ))}
              </LuxDropdown>

              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="shrink-0 px-2 text-[10px] tracking-[0.12em] text-neutral-400 uppercase transition hover:text-neutral-800"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
