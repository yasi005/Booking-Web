"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useCryptoRate, usePreferences } from "@/context/preferences-context";
import { cn, formatPrice, getNightlyRateForMonth } from "@/lib/utils";
import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function BookingTimeline() {
  const { selectedProperty } = useAppPhase();
  const { cryptoMode, discretionMode } = usePreferences();
  const btcRate = useCryptoRate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [range, setRange] = useState<{ start: number; end: number } | null>(null);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const year = 2026;

  const totalDays = MONTHS.reduce((acc, _, mi) => acc + daysInMonth(year, mi), 0);
  const dayWidth = 28;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const unsubscribe = x.on("change", (latest) => {
      el.scrollLeft = -latest;
    });
    return unsubscribe;
  }, [x]);

  const handlePointerDown = (dayIndex: number) => {
    setIsDragging(true);
    setDragStart(dayIndex);
    setRange({ start: dayIndex, end: dayIndex });
  };

  const handlePointerEnter = (dayIndex: number) => {
    if (!isDragging || dragStart === null) return;
    setRange({
      start: Math.min(dragStart, dayIndex),
      end: Math.max(dragStart, dayIndex),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  useEffect(() => {
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  let dayCounter = 0;
  const totalCost =
    range === null
      ? 0
      : Array.from({ length: range.end - range.start + 1 }, (_, i) => {
          const dayIndex = range.start + i;
          let d = dayIndex;
          for (let m = 0; m < 12; m++) {
            const dim = daysInMonth(year, m);
            if (d < dim) return getNightlyRateForMonth(m, selectedProperty.seasonalPricing);
            d -= dim;
          }
          return selectedProperty.seasonalPricing[1]?.rate ?? 0;
        }).reduce((a, b) => a + b, 0);

  const nights = range ? range.end - range.start + 1 : 0;

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        Reserve Your Stay
      </p>
      <p className="mt-2 text-xs text-neutral-400">
        Drag horizontally to browse · Click and drag to select dates
      </p>

      <div
        ref={scrollRef}
        className="mt-5 overflow-x-auto overflow-y-hidden scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: -(totalDays * dayWidth - 280), right: 0 }}
          style={{ x }}
          onDragStart={() => setIsDragging(false)}
          className="flex min-w-max cursor-grab active:cursor-grabbing"
        >
          {MONTHS.map((month, monthIndex) => {
            const dim = daysInMonth(year, monthIndex);
            return (
              <div key={month} className="shrink-0 border-r border-neutral-100 pr-1">
                <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {month}
                </p>
                <div className="flex">
                  {Array.from({ length: dim }, (_, day) => {
                    const globalDay = dayCounter++;
                    const inRange =
                      range !== null &&
                      globalDay >= range.start &&
                      globalDay <= range.end;
                    const rate = getNightlyRateForMonth(
                      monthIndex,
                      selectedProperty.seasonalPricing,
                    );

                    return (
                      <button
                        key={day}
                        type="button"
                        onPointerDown={() => handlePointerDown(globalDay)}
                        onPointerEnter={() => handlePointerEnter(globalDay)}
                        style={{ width: dayWidth }}
                        className={cn(
                          "relative h-10 shrink-0 border border-transparent text-[10px] text-neutral-400 transition-colors",
                          inRange && "border-neutral-300 bg-neutral-900 text-white",
                          !inRange && "hover:bg-neutral-50",
                        )}
                        title={`${formatPrice(rate, cryptoMode, btcRate)} / night`}
                      >
                        {day + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        layout
        className={cn(
          "mt-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3",
          discretionMode && "blur-md select-none",
        )}
      >
        {nights > 0 ? (
          <p className="text-sm text-neutral-700">
            <span className="font-medium">{nights} nights</span>
            <span className="text-neutral-400"> · estimated </span>
            <span className="font-medium text-neutral-900">
              {formatPrice(totalCost, cryptoMode, btcRate)}
            </span>
          </p>
        ) : (
          <p className="text-sm text-neutral-400">Select dates to calculate seasonal total</p>
        )}
      </motion.div>
    </section>
  );
}
