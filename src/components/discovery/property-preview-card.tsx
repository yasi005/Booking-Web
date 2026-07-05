"use client";

import { useLocale } from "@/context/locale-context";
import { getPropertyName } from "@/lib/localized-property";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

type PropertyPreviewCardProps = {
  property: Property;
  onSelect: (property: Property) => void;
};

export function PropertyPreviewCard({ property, onSelect }: PropertyPreviewCardProps) {
  const { locale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={() => onSelect(property)}
      className="group flex flex-col gap-4 text-left"
      data-magnetic="EXPLORE"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-zinc-200">
        <Image
          src={property.previewImage ?? property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="flex items-start justify-between gap-3 px-1">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-black/35">
            {property.location}
          </p>
          <h4 className="mt-2 text-lg font-light tracking-tight text-black">
            {getPropertyName(property, locale)}
          </h4>
          <p className="mt-1 text-sm text-black/45">
            {formatCurrency(property.rent)}
            <span className="text-black/30"> /mo</span>
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-black/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black/60" />
      </div>
    </button>
  );
}
