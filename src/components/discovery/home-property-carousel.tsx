"use client";

import { useLocale } from "@/context/locale-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreviewProperty } from "@/hooks/use-preview-property";
import { getLocationDisplay, getPropertyName } from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/** One card holds the stage for this long before the deck rotates. */
const SLIDE_MS = 3000;
const SWIPE_THRESHOLD = 56;

/** The countdown ring drawn inside the 40x40 "next" button. */
const RING_RADIUS = 18;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** Card transforms per slot, as a share of the card's own width. */
const SLOT = {
  active: { x: "0%", scale: 1, opacity: 1 },
  side: { x: 72, scale: 0.74, opacity: 0.6 },
  offstage: { x: 104, scale: 0.52, opacity: 0 },
} as const;

const SPRING = { type: "spring", stiffness: 210, damping: 26, mass: 0.9 } as const;

type HomePropertyCarouselProps = {
  properties: Property[];
};

/** Signed distance from the active card, wrapping around the ends of the deck. */
function relativeSlot(index: number, active: number, total: number) {
  const forward = (index - active + total) % total;
  return forward > total / 2 ? forward - total : forward;
}

export function HomePropertyCarousel({ properties }: HomePropertyCarouselProps) {
  const previewProperty = usePreviewProperty();
  const { locale, t } = useLocale();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const total = properties.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const didDrag = useRef(false);

  const step = useCallback(
    (direction: 1 | -1) =>
      setActive((previous) => (previous + direction + total) % total),
    [total],
  );

  // A shorter catalog must not leave the stage parked on a dead index.
  const current = total > 0 ? active % total : 0;

  useEffect(() => {
    if (paused || reduceMotion || total < 2) return;
    const timer = window.setTimeout(() => step(1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [current, paused, reduceMotion, total, step]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setPaused(false);
    if (info.offset.x <= -SWIPE_THRESHOLD) step(1);
    else if (info.offset.x >= SWIPE_THRESHOLD) step(-1);
  };

  if (total === 0) return null;

  const ringIdle = paused || reduceMotion || total < 2;

  // Touch taps fire `pointerenter` without a matching `pointerleave`, which would
  // strand the deck paused — so only a real cursor hover holds it.
  return (
    <div
      className="select-none"
      role="group"
      aria-roledescription="carousel"
      aria-label={t.homeProperties.title}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setPaused(true);
      }}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative h-[210px] overflow-hidden sm:h-[280px] md:h-[340px] lg:h-[380px]">
        {properties.map((property, index) => {
          const slot = relativeSlot(index, current, total);
          const distance = Math.abs(slot);
          const isActive = distance === 0;
          const isSide = distance === 1;
          const direction = Math.sign(slot);

          const target = isActive
            ? SLOT.active
            : {
                x: `${(isSide ? SLOT.side.x : SLOT.offstage.x) * direction}%`,
                scale: isSide ? SLOT.side.scale : SLOT.offstage.scale,
                opacity: isSide ? SLOT.side.opacity : SLOT.offstage.opacity,
              };

          return (
            <div
              key={property.id}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ zIndex: isActive ? 30 : isSide ? 20 : 10 }}
            >
              <motion.button
                type="button"
                animate={target}
                transition={reduceMotion ? { duration: 0 } : SPRING}
                drag={isActive && total > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onPointerDown={() => {
                  didDrag.current = false;
                }}
                onDragStart={() => {
                  didDrag.current = true;
                  setPaused(true);
                }}
                onDragEnd={handleDragEnd}
                onClick={() => {
                  // A swipe ends with a click — swallow that one, keep real taps.
                  if (didDrag.current) return;
                  if (isActive) previewProperty(property);
                  else step(direction as 1 | -1);
                }}
                aria-hidden={!isActive && !isSide}
                tabIndex={isActive || isSide ? 0 : -1}
                aria-label={
                  isActive ? undefined : getPropertyName(property, locale)
                }
                className={cn(
                  "group relative aspect-[4/3] h-full overflow-hidden rounded-[26px] bg-neutral-100 text-left shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] outline-none sm:rounded-[32px]",
                  isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                  (isActive || isSide) && "pointer-events-auto",
                  "focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
                )}
              >
                <Image
                  src={property.previewImage ?? property.image}
                  alt={getPropertyName(property, locale)}
                  fill
                  draggable={false}
                  sizes="(max-width: 640px) 75vw, (max-width: 1024px) 55vw, 520px"
                  className="object-cover"
                />

                {/* Side cards sit back behind a soft veil so the centre reads first. */}
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-white/40 transition-opacity duration-500",
                    isActive ? "opacity-0" : "opacity-100",
                  )}
                />

                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-4 pt-14 pb-4 transition-opacity duration-500 sm:px-6 sm:pb-5",
                    isActive ? "opacity-100" : "opacity-0",
                  )}
                >
                  <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/70 sm:text-[10px]">
                    {getLocationDisplay(property, locale)}
                  </p>
                  <p className="mt-1 truncate font-serif text-lg text-white sm:text-2xl">
                    {getPropertyName(property, locale)}
                  </p>
                  <p className="mt-0.5 text-xs text-white/85 sm:text-sm">
                    {formatCurrency(getAnchorRate(property))}
                    {t.homeProperties.perNight}
                  </p>
                </div>
              </motion.button>
            </div>
          );
        })}

        {/* Fade the deck into the page instead of clipping it at the edges. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-40 w-6 bg-gradient-to-r from-white to-transparent sm:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-40 w-6 bg-gradient-to-l from-white to-transparent sm:w-16" />
      </div>

      {total > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label={t.gallery.previous}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {properties.map((property, index) => (
              <button
                key={property.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={getPropertyName(property, locale)}
                aria-current={index === current}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  index === current
                    ? "w-5 bg-neutral-900"
                    : "w-1.5 bg-neutral-300 hover:bg-neutral-400",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => step(1)}
            aria-label={t.gallery.next}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
          >
            {/* Countdown ring: one full sweep per slide. */}
            <svg
              viewBox="0 0 40 40"
              aria-hidden
              className="absolute inset-0 h-full w-full -rotate-90"
            >
              <motion.circle
                key={current}
                cx="20"
                cy="20"
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={RING_LENGTH}
                className="text-neutral-900"
                initial={{ strokeDashoffset: RING_LENGTH }}
                animate={{ strokeDashoffset: ringIdle ? RING_LENGTH : 0 }}
                transition={{
                  duration: ringIdle ? 0.25 : SLIDE_MS / 1000,
                  ease: "linear",
                }}
              />
            </svg>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
