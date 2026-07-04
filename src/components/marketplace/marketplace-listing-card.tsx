"use client";

import { usePreviewProperty } from "@/hooks/use-preview-property";
import { useSaves } from "@/context/saves-context";
import { getAnchorRate } from "@/lib/property-utils";
import { cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { motion } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import Image from "next/image";

type MarketplaceListingCardProps = {
  property: Property;
};

export function MarketplaceListingCard({ property }: MarketplaceListingCardProps) {
  const previewProperty = usePreviewProperty();
  const { isSaved, toggleSave } = useSaves();
  const liked = isSaved(property.id);
  const rate = getAnchorRate(property);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      await navigator.share({ title: property.name, text: property.tagline });
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col"
    >
      <button
        type="button"
        onClick={() => previewProperty(property)}
        className="text-left"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={property.previewImage ?? property.image}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 50vw, 30vw"
          />

          <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-neutral-800 backdrop-blur-sm">
              {property.locationDisplay}
            </span>
            <div className="flex gap-1.5">
              <span
                role="button"
                tabIndex={0}
                onClick={handleShare}
                onKeyDown={(e) => e.key === "Enter" && handleShare(e as unknown as React.MouseEvent)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 backdrop-blur-sm transition hover:bg-white"
              >
                <Share2 className="h-3.5 w-3.5" />
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSave(property.id);
                }}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition",
                  liked
                    ? "bg-neutral-900 text-white"
                    : "bg-white/90 text-neutral-700 hover:bg-white",
                )}
              >
                <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-neutral-800">
            {property.location}
          </p>
          <p className="shrink-0 text-sm text-neutral-700">
            ★ {property.rating.toFixed(2)}
          </p>
        </div>

        <p className="mt-1 text-sm text-neutral-500">
          {property.beds} Beds • {property.baths} Baths •{" "}
          {property.sqft.toLocaleString()} sqft
        </p>

        <p className="mt-2 text-sm text-neutral-800">
          <span className="font-semibold">{formatCurrency(rate)}</span>
          <span className="text-neutral-400"> / night</span>
        </p>
      </button>
    </motion.article>
  );
}
