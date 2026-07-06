"use client";

import { vibeOverlays } from "@/context/vibe-context";
import { useAppPhase } from "@/context/app-phase-context";
import { useCanvasFocus } from "@/context/canvas-focus-context";
import { useLocale } from "@/context/locale-context";
import { getGalleryImageForRoom } from "@/lib/gallery-utils";
import {
  getLocationDisplay,
  getPropertyName,
  getRoomLabel,
} from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { cn, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80";

export function GalleryCanvas() {
  const { selectedProperty } = useAppPhase();
  const { focusedRoom } = useCanvasFocus();
  const { locale, t } = useLocale();
  const overlay = vibeOverlays.golden;
  const rate = getAnchorRate(selectedProperty);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);

  const images = selectedProperty.galleryImages;
  const hasGallery = images.length > 0;

  const displayImages = useMemo(() => {
    if (!hasGallery) {
      return [{ id: "fallback", url: selectedProperty.image, room: "other" as const }];
    }
    return images;
  }, [hasGallery, images, selectedProperty.image]);

  useEffect(() => {
    if (focusedRoom?.galleryRoom) {
      const roomImage = getGalleryImageForRoom(displayImages, focusedRoom.galleryRoom);
      const index = displayImages.findIndex((image) => image.id === roomImage?.id);
      if (index >= 0) setActiveIndex(index);
      return;
    }
    setActiveIndex(0);
  }, [focusedRoom, selectedProperty.id, displayImages]);

  const current = displayImages[activeIndex] ?? displayImages[0];
  const imageSrc = current && failedUrls.has(current.url) ? FALLBACK_IMAGE : current?.url ?? FALLBACK_IMAGE;

  const focus = focusedRoom?.imageFocus ?? { x: 50, y: 50, scale: 1 };
  const panX = (50 - focus.x) * 0.55;
  const panY = (50 - focus.y) * 0.55;

  const step = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + displayImages.length) % displayImages.length);
  };

  return (
    <div className="flex h-full w-full min-h-0 flex-col p-2 sm:p-4 md:p-6">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-zinc-900 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.45)] sm:rounded-[28px]">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="relative h-full w-full sm:h-[115%] sm:w-[115%] sm:-left-[7.5%] sm:-top-[7.5%]"
            animate={{
              x: `${panX}%`,
              y: `${panY}%`,
              scale: focus.scale,
            }}
            transition={{ type: "spring", stiffness: 180, damping: 24 }}
            style={{ transformOrigin: "center center" }}
          >
            <Image
              key={`${selectedProperty.id}-${imageSrc}-${activeIndex}`}
              src={imageSrc}
              alt={getPropertyName(selectedProperty, locale)}
              fill
              priority
              className="object-cover"
              style={{ objectPosition: `${focus.x}% ${focus.y}%` }}
              sizes="(max-width: 640px) 100vw, (max-width: 1200px) 60vw, 55vw"
              onError={() => {
                if (current?.url) {
                  setFailedUrls((prev) => new Set(prev).add(current.url));
                }
              }}
            />
          </motion.div>
        </div>

        <div
          className={cn(
            "pointer-events-none absolute inset-0 transition-colors duration-700",
            overlay.overlay,
          )}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {focusedRoom && (
          <motion.div
            key={focusedRoom.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          >
            <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[9px] tracking-[0.18em] text-white/90 uppercase backdrop-blur-md sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.2em]">
              {focusedRoom.galleryRoom
                ? getRoomLabel(locale, focusedRoom.galleryRoom)
                : focusedRoom.label}
            </span>
          </motion.div>
        )}

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute top-1/2 left-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-sm text-white backdrop-blur-md sm:left-5 sm:h-9 sm:w-9"
              aria-label={t.gallery.previous}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute top-1/2 right-2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-sm text-white backdrop-blur-md sm:right-5 sm:h-9 sm:w-9"
              aria-label={t.gallery.next}
            >
              ›
            </button>
          </>
        )}

        {displayImages.length > 1 && (
          <div className="absolute top-3 right-3 left-3 z-10 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:top-6 sm:right-6 sm:left-6 sm:gap-2">
            {displayImages.slice(0, 12).map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative h-10 w-14 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-12 sm:w-16 sm:rounded-lg",
                  index === activeIndex ? "border-white" : "border-white/20 opacity-70",
                )}
              >
                <Image src={image.url} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}

        <div className="absolute right-4 bottom-[4.5rem] left-4 z-10 sm:right-10 sm:bottom-10 sm:left-10">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 sm:mb-3 sm:text-xs sm:tracking-[0.28em]">
            {getLocationDisplay(selectedProperty, locale)}
          </p>
          <h1 className="max-w-xl font-serif text-2xl font-normal tracking-tight text-white sm:text-4xl md:text-5xl">
            {getPropertyName(selectedProperty, locale)}
          </h1>
          <p className="mt-2 text-lg font-light text-white sm:mt-6 sm:text-3xl md:text-4xl">
            {t.editorial.from}{" "}
            <span className="font-medium">{formatCurrency(rate)}</span>
            <span className="text-sm text-white/60 sm:text-lg"> {t.editorial.perNight}</span>
          </p>
          {current && (
            <p className="mt-1.5 text-[10px] tracking-[0.14em] text-white/55 uppercase sm:mt-2 sm:text-xs sm:tracking-[0.16em]">
              {getRoomLabel(locale, current.room)} · {t.gallery.photoOf(activeIndex + 1, displayImages.length)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
