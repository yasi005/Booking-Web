"use client";

import { useAppPhase } from "@/context/app-phase-context";
import { useLocale } from "@/context/locale-context";

export function SpecRow() {
  const { selectedProperty } = useAppPhase();
  const { t } = useLocale();

  const items = [
    `${selectedProperty.beds} ${t.editorial.specs.beds}`,
    `${selectedProperty.baths} ${t.editorial.specs.baths}`,
    `${selectedProperty.sqft.toLocaleString()} ${t.editorial.specs.sqft}`,
  ];

  return (
    <div className="flex divide-x divide-neutral-200 border-b border-neutral-100 py-7">
      {items.map((item) => (
        <div key={item} className="flex-1 px-4 text-center first:pl-0 last:pr-0">
          <p className="text-sm font-light tracking-wide text-neutral-700">{item}</p>
        </div>
      ))}
    </div>
  );
}
