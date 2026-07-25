"use client";

import { usePreviewProperty } from "@/hooks/use-preview-property";
import { useLocale } from "@/context/locale-context";
import { useSaves } from "@/context/saves-context";
import { getPropertyName, getLocationDisplay } from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const capsuleSpring = { type: "spring" as const, stiffness: 280, damping: 32 };

const lensFade = {
  opacity: 0,
  scale: 0.9,
  filter: "blur(10px)",
};

const overlayStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.12 },
  },
};

const overlayItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
};

type CinematicPropertyCardProps = {
  property: Property;
  size?: "featured" | "standard";
};

export function CinematicPropertyCard({
  property,
  size = "featured",
}: CinematicPropertyCardProps) {
  const previewProperty = usePreviewProperty();
  const { isSaved, toggleSave } = useSaves();
  const { locale } = useLocale();
  const [hovered, setHovered] = useState(false);
  const liked = isSaved(property.id);
  const rate = getAnchorRate(property);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({
        title: getPropertyName(property, locale),
        text: property.localized[locale].tagline,
      });
    }
  };

  const isFeatured = size === "featured";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={lensFade}
      transition={{
        opacity: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
        filter: { duration: 0.38 },
        y: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
      }}
      className="w-full"
    >
      <motion.button
        type="button"
        onClick={() => previewProperty(property)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "group relative block w-full overflow-hidden rounded-[24px] bg-neutral-900 text-left sm:rounded-[28px] lg:rounded-[32px]",
          // Same portrait ratio on phone so the featured card matches the list; wide only from sm up.
          isFeatured
            ? "aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2.2/1]"
            : "aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]",
        )}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <Image
          src={property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes={isFeatured ? "(max-width: 1024px) 100vw, 80vw" : "(max-width: 1024px) 100vw, 33vw"}
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45 }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
        />

        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute inset-0 backdrop-blur-md bg-neutral-950/40"
        />

        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 sm:top-5 sm:right-5 sm:gap-2">
          <AnimatePresence>
            {hovered && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="mr-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-md"
              >
                ★ {property.rating.toFixed(2)}
                <span className="ml-1 text-white/60">({property.reviewCount})</span>
              </motion.span>
            )}
          </AnimatePresence>

          <span
            role="button"
            tabIndex={0}
            onClick={handleShare}
            onKeyDown={(e) => e.key === "Enter" && handleShare(e as unknown as React.MouseEvent)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white backdrop-blur-md transition hover:bg-white/25 sm:h-10 sm:w-10"
          >
            <Share2 className="h-4 w-4" />
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(property.id);
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition sm:h-10 sm:w-10",
              liked
                ? "bg-neutral-950 text-white"
                : "bg-white/15 text-white hover:bg-white/25",
            )}
          >
            <Heart className={cn("h-4 w-4", liked && "fill-current")} />
          </span>
        </div>

        <motion.div
          layout
          transition={capsuleSpring}
          className={cn(
            "absolute z-20 flex flex-col justify-end",
            hovered
              ? "inset-0 p-5 sm:p-8 md:p-10"
              : "bottom-4 left-4 w-[min(calc(100%-2rem),300px)] rounded-xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-xl sm:bottom-6 sm:left-6 sm:w-[min(calc(100%-3rem),340px)] sm:rounded-2xl sm:p-5",
          )}
        >
          <motion.p
            layout="position"
            className="text-[10px] font-light tracking-[0.2em] text-neutral-200 uppercase"
          >
            {getLocationDisplay(property, locale)}
          </motion.p>

          <motion.h3
            layout="position"
            className={cn(
              "font-serif text-white",
              hovered ? "mt-3 text-2xl sm:text-3xl md:text-4xl" : "mt-1.5 text-lg sm:mt-2 sm:text-xl md:text-2xl",
            )}
          >
            {getPropertyName(property, locale)}
          </motion.h3>

          <motion.p
            layout="position"
            className={cn(
              "text-neutral-300",
              hovered ? "mt-6 text-sm" : "mt-2 text-xs",
            )}
          >
            {hovered ? (
              <>
                Baseline Rent:{" "}
                <span className="font-medium text-white">{formatCurrency(rate)}</span>
                <span className="text-neutral-400"> / night</span>
              </>
            ) : (
              <>
                From{" "}
                <span className="font-medium text-white/90">{formatCurrency(rate)}</span>
                <span className="text-neutral-400"> / night</span>
              </>
            )}
          </motion.p>

          <AnimatePresence>
            {hovered && (
              <motion.div
                variants={overlayStagger}
                initial="hidden"
                animate="show"
                exit="hidden"
                className="overflow-hidden"
              >
                <motion.div
                  variants={overlayItem}
                  className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-200"
                >
                  <span>
                    {property.beds} Beds • {property.baths} Baths •{" "}
                    {property.sqft.toLocaleString()} Sq Ft
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    </motion.article>
  );
}
