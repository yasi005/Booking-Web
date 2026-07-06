"use client";

import { useLocale } from "@/context/locale-context";
import { getPropertyName } from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import Image from "next/image";

type MapPropertyPopupCardProps = {
  property: Property;
};

export function MapPropertyPopupCard({ property }: MapPropertyPopupCardProps) {
  const { locale, t } = useLocale();
  const rate = getAnchorRate(property);

  return (
    <div className="flex w-[min(calc(100vw-2.5rem),260px)] gap-2.5 rounded-2xl bg-neutral-950 p-2.5 text-white shadow-2xl sm:w-auto sm:max-w-[340px] sm:gap-4 sm:rounded-[24px] sm:p-4">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28 sm:rounded-xl">
        <Image
          src={property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 56px, 112px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/50 sm:text-[10px] sm:tracking-[0.18em]">
          {formatCurrency(rate)}
          <span className="text-white/35"> {t.editorial.perNight}</span>
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-white sm:mt-1 sm:text-base">
          {getPropertyName(property, locale)}
        </h3>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 sm:mt-4 sm:gap-x-4 sm:gap-y-2">
          <div>
            <p className="text-[8px] font-semibold tracking-[0.14em] text-white/40 sm:text-[9px] sm:tracking-[0.16em]">
              {t.editorial.specs.sqft.toUpperCase()}
            </p>
            <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">
              {property.sqft.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[8px] font-semibold tracking-[0.14em] text-white/40 sm:text-[9px] sm:tracking-[0.16em]">
              {t.editorial.specs.beds.toUpperCase()}
            </p>
            <p className="mt-0.5 text-xs font-medium text-white sm:text-sm">{property.beds}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
