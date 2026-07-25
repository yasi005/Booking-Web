"use client";

import { usePreviewProperty } from "@/hooks/use-preview-property";
import { useLocale } from "@/context/locale-context";
import { getPropertyName } from "@/lib/localized-property";
import { getAnchorRate } from "@/lib/property-utils";
import { formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/property";
import Image from "next/image";

type HomePropertyCardProps = {
  property: Property;
};

export function HomePropertyCard({ property }: HomePropertyCardProps) {
  const previewProperty = usePreviewProperty();
  const { locale, t } = useLocale();
  const rate = getAnchorRate(property);

  return (
    <button
      type="button"
      onClick={() => previewProperty(property)}
      className="w-full text-left"
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-neutral-100">
        <Image
          src={property.image}
          alt={getPropertyName(property, locale)}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 45vw, 25vw"
        />
      </div>

      <p className="mt-2 truncate text-sm text-neutral-900">
        {getPropertyName(property, locale)}
      </p>
      <p className="mt-0.5 text-sm text-neutral-500">
        {formatCurrency(rate)}
        {t.homeProperties.perNight}
      </p>
    </button>
  );
}
