"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useLocale } from "@/context/locale-context";
import { groupGalleryByRoom } from "@/lib/gallery-utils";
import {
  getLocationDisplay,
  getPropertyDescription,
  getPropertyName,
  getRoomLabel,
} from "@/lib/localized-property";
import { cn } from "@/lib/utils";
import type { PropertyGalleryImage, RoomCategory } from "@/types/property";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type PropertyImageGalleryProps = {
  onSelectImage?: (image: PropertyGalleryImage) => void;
  activeRoom?: RoomCategory | null;
};

export function PropertyImageGallery({
  onSelectImage,
  activeRoom,
}: PropertyImageGalleryProps) {
  const { selectedProperty } = useAppPhase();
  const { locale, t } = useLocale();
  const [activeFilter, setActiveFilter] = useState<RoomCategory | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const groups = useMemo(
    () => groupGalleryByRoom(selectedProperty.galleryImages),
    [selectedProperty.galleryImages],
  );

  const filteredImages = useMemo(() => {
    if (activeFilter === "all") return selectedProperty.galleryImages;
    return selectedProperty.galleryImages.filter((image) => image.room === activeFilter);
  }, [activeFilter, selectedProperty.galleryImages]);

  useEffect(() => {
    if (activeRoom) {
      setActiveFilter(activeRoom);
    }
  }, [activeRoom, selectedProperty.id]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const stepLightbox = (direction: -1 | 1) => {
    if (lightboxIndex === null) return;
    const next =
      (lightboxIndex + direction + filteredImages.length) % filteredImages.length;
    setLightboxIndex(next);
  };

  if (selectedProperty.galleryImages.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-neutral-100 py-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-400">
        {t.editorial.gallery}
      </p>
      <p className="mt-2 text-sm text-neutral-500">{t.editorial.galleryHint}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <FilterChip
          active={activeFilter === "all"}
          label={t.editorial.allPhotos}
          count={selectedProperty.galleryImages.length}
          onClick={() => setActiveFilter("all")}
        />
        {groups.map(({ room, images }) => (
          <FilterChip
            key={room}
            active={activeFilter === room}
            label={getRoomLabel(locale, room)}
            count={images.length}
            onClick={() => setActiveFilter(room)}
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {filteredImages.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => {
              onSelectImage?.(image);
              openLightbox(index);
            }}
            className={cn(
              "group relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100",
              index === 0 && "col-span-2 row-span-1 aspect-[16/10] sm:col-span-2",
            )}
          >
            <Image
              src={image.url}
              alt={image.caption ?? getPropertyName(selectedProperty, locale)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-left text-[10px] tracking-[0.14em] text-white/80 uppercase">
                {getRoomLabel(locale, image.room)}
              </p>
            </div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              aria-label={t.gallery.close}
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(-1);
              }}
              className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:left-6"
              aria-label={t.gallery.previous}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                stepLightbox(1);
              }}
              className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:right-6"
              aria-label={t.gallery.next}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              className="relative h-[min(80vh,900px)] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[lightboxIndex].url}
                alt={
                  filteredImages[lightboxIndex].caption ??
                  getPropertyName(selectedProperty, locale)
                }
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="absolute bottom-6 left-1/2 z-10 max-w-xl -translate-x-1/2 px-4 text-center text-white">
              <p className="text-xs tracking-[0.18em] text-white/60 uppercase">
                {t.gallery.photoOf(lightboxIndex + 1, filteredImages.length)} ·{" "}
                {getRoomLabel(locale, filteredImages[lightboxIndex].room)}
              </p>
              <p className="mt-2 font-serif text-lg">{getPropertyName(selectedProperty, locale)}</p>
              <p className="mt-1 text-sm text-white/70">
                {getLocationDisplay(selectedProperty, locale)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition",
        active
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300",
      )}
    >
      {label}
      <span className="ml-1 text-[10px] opacity-70">({count})</span>
    </button>
  );
}
