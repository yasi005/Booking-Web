"use client";

import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { motion } from "framer-motion";
import Image from "next/image";

type FeaturedPropertyCardProps = {
  property: Property;
  onSelect: (property: Property) => void;
  layoutId?: string;
};

export function FeaturedPropertyCard({
  property,
  onSelect,
  layoutId,
}: FeaturedPropertyCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(property)}
      data-magnetic="EXPLORE"
      className="group col-span-2 text-left"
    >
      <motion.div
        layoutId={layoutId}
        className="relative aspect-[3/4] overflow-hidden rounded-[32px] bg-zinc-900 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.35)]"
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      >
        <Image
          src={property.image}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/65">
            {property.location}
          </p>
          <h3 className="mt-3 text-2xl font-light tracking-tight text-white md:text-3xl">
            {property.name}
          </h3>
          <p className="mt-4 text-lg text-white/80">
            From{" "}
            <span className="font-medium text-white">
              {formatCurrency(property.rent)}
            </span>
            <span className="text-white/50"> /mo</span>
          </p>
        </div>
      </motion.div>
    </button>
  );
}
