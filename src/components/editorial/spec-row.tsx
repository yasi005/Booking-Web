"use client";

import { useAppPhase } from "@/context/app-phase-context";

export function SpecRow() {
  const { selectedProperty } = useAppPhase();

  const items = [
    `${selectedProperty.beds} Beds`,
    `${selectedProperty.baths} Baths`,
    `${selectedProperty.sqft.toLocaleString()} Sq Ft`,
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
