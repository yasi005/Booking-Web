"use client";

import { useLocale } from "@/context/locale-context";
import { usePreviewProperty } from "@/hooks/use-preview-property";
import { getPropertyName } from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import Image from "next/image";

type PropertyGridCardProps = {
  property: Property;
};

export function PropertyGridCard({ property }: PropertyGridCardProps) {
  const previewProperty = usePreviewProperty();
  const { locale, t } = useLocale();
  const anchorRate = getAnchorRate(property);

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={property.previewImage ?? property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <button
          type="button"
          onClick={() => previewProperty(property)}
          className="absolute right-3 bottom-3 rounded-full bg-white/95 px-4 py-2 text-xs font-medium tracking-wide text-neutral-900 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white"
        >
          Preview
        </button>
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
        {property.beds} {t.editorial.specs.beds} • {property.baths}{" "}
        {t.editorial.specs.baths} • {property.sqft.toLocaleString()}{" "}
        {t.editorial.specs.sqft}
      </p>

      <p className="mt-2 text-sm text-neutral-800">
        <span className="font-semibold">{formatCurrency(anchorRate)}</span>
        <span className="text-neutral-400"> {t.editorial.perNight}</span>
      </p>
    </article>
  );
}
