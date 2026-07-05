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
    <div className="flex max-w-[340px] gap-4 rounded-[24px] bg-neutral-950 p-4 text-white shadow-2xl">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
        <Image
          src={property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
          {formatCurrency(rate)}
          <span className="text-white/35"> {t.editorial.perNight}</span>
        </p>
        <h3 className="mt-1 text-base font-medium leading-snug text-white">
          {getPropertyName(property, locale)}
        </h3>
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.16em] text-white/40">
              {t.editorial.specs.sqft.toUpperCase()}
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">
              {property.sqft.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-semibold tracking-[0.16em] text-white/40">
              {t.editorial.specs.beds.toUpperCase()}
            </p>
            <p className="mt-0.5 text-sm font-medium text-white">{property.beds}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
